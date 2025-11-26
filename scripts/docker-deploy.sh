#!/bin/bash

# Docker Deployment Script for Qore Backend API
# This script helps with building and deploying the application using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p uploads/photos
    mkdir -p uploads/documents
    mkdir -p nginx/ssl
    print_success "Directories created successfully"
}

# Function to generate environment file
generate_env_file() {
    ENV_FILE=".env.docker"
    
    if [ ! -f "$ENV_FILE" ]; then
        print_status "Generating Docker environment file..."
        
        cat > "$ENV_FILE" << EOF
# Docker Environment Configuration
NODE_ENV=production
PORT=3000

# Database Configuration
DATABASE_URL=mysql://root:password@mysql:3306/qore_backend
DB_HOST=mysql
DB_PORT=3306
DB_NAME=qore_backend
DB_USER=root
DB_PASSWORD=password

# Redis Configuration
REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-$(date +%s)
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-$(date +%s)
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Security Configuration
BCRYPT_ROUNDS=12

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

# CORS Configuration
CORS_ORIGIN=http://localhost:3001,http://localhost:3000

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_LOGIN_ATTEMPTS=5
RATE_LIMIT_LOCKOUT_DURATION=15
EOF
        
        print_success "Docker environment file generated: $ENV_FILE"
        print_warning "Please review and update the configuration in $ENV_FILE before deploying to production"
    else
        print_status "Docker environment file already exists: $ENV_FILE"
    fi
}

# Function to build Docker image
build_image() {
    print_status "Building Docker image..."
    docker build -t qore-backend:latest .
    print_success "Docker image built successfully"
}

# Function to start development environment
start_dev() {
    print_status "Starting development environment..."
    docker-compose --profile development up -d
    print_success "Development environment started"
    print_status "Application is available at: http://localhost:3000"
    print_status "PhpMyAdmin is available at: http://localhost:8080"
    print_status "Redis Commander is available at: http://localhost:8081"
}

# Function to start production environment
start_prod() {
    print_status "Starting production environment..."
    docker-compose --profile production up -d
    print_success "Production environment started"
    print_status "Application is available at: http://localhost"
}

# Function to stop containers
stop_containers() {
    print_status "Stopping containers..."
    docker-compose down
    print_success "Containers stopped"
}

# Function to stop and remove containers
remove_containers() {
    print_status "Stopping and removing containers..."
    docker-compose down -v --remove-orphans
    print_success "Containers removed"
}

# Function to view logs
view_logs() {
    docker-compose logs -f
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."
    docker-compose exec app npm run migrate
    print_success "Database migrations completed"
}

# Function to optimize database
optimize_database() {
    print_status "Optimizing database..."
    docker-compose exec app npm run db:optimize
    print_success "Database optimization completed"
}

# Function to backup database
backup_database() {
    print_status "Creating database backup..."
    docker-compose exec mysql mysqldump -u root -ppassword qore_backend > backup_$(date +%Y%m%d_%H%M%S).sql
    print_success "Database backup completed"
}

# Function to show help
show_help() {
    echo "Qore Backend Docker Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development environment"
    echo "  prod        Start production environment"
    echo "  build       Build Docker image"
    echo "  stop        Stop containers"
    echo "  remove      Stop and remove containers"
    echo "  logs        View container logs"
    echo "  migrate     Run database migrations"
    echo "  optimize    Optimize database"
    echo "  backup      Backup database"
    echo "  setup       Initial setup (create directories and env file)"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup     # Initial setup"
    echo "  $0 dev       # Start development environment"
    echo "  $0 prod      # Start production environment"
    echo "  $0 logs      # View logs"
}

# Main script logic
main() {
    # Check prerequisites
    check_docker
    check_docker_compose
    
    # Parse command
    case "${1:-help}" in
        "setup")
            create_directories
            generate_env_file
            ;;
        "build")
            build_image
            ;;
        "dev")
            create_directories
            generate_env_file
            start_dev
            ;;
        "prod")
            create_directories
            generate_env_file
            build_image
            start_prod
            ;;
        "stop")
            stop_containers
            ;;
        "remove")
            remove_containers
            ;;
        "logs")
            view_logs
            ;;
        "migrate")
            run_migrations
            ;;
        "optimize")
            optimize_database
            ;;
        "backup")
            backup_database
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"