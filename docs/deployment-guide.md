# Deployment Guide

This guide covers various deployment strategies for the Qore Backend API.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Monitoring](#monitoring)
- [Security](#security)
- [Scaling](#scaling)

## Prerequisites

### System Requirements

- **Node.js**: 18.x or higher
- **MySQL**: 8.0 or higher
- **Redis**: 6.0 or higher (optional but recommended)
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 10GB free space
- **OS**: Linux (Ubuntu 20.04+), macOS, Windows 10+

### Software Dependencies

```bash
# Node.js and npm
node --version  # Should be 18.x+
npm --version   # Should be 8.x+

# Database
mysql --version  # Should be 8.0+

# Optional: Redis
redis-server --version  # Should be 6.0+

# Optional: Docker
docker --version     # Should be 20.x+
docker-compose --version
```

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/qore-backend.git
cd qore-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

#### Required Environment Variables

```bash
# Database Configuration
DATABASE_URL=mysql://user:password@localhost:3306/qore_backend
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=qore_backend

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Application Configuration
NODE_ENV=production
PORT=3000
```

#### Optional Environment Variables

```bash
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourcompany.com

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://yourdomain.com
```

## Local Development

### Database Setup

```bash
# Create MySQL database
mysql -u root -p

mysql> CREATE DATABASE qore_backend;
mysql> CREATE USER 'qore_user'@'localhost' IDENTIFIED BY 'secure_password';
mysql> GRANT ALL PRIVILEGES ON qore_backend.* TO 'qore_user'@'localhost';
mysql> FLUSH PRIVILEGES;
mysql> EXIT;

# Import schema
mysql -u qore_user -p qore_backend < talenspark.sql
```

### Redis Setup (Optional)

```bash
# Install Redis
sudo apt-get install redis-server  # Ubuntu
brew install redis                 # macOS

# Start Redis
sudo systemctl start redis
sudo systemctl enable redis

# Test Redis
redis-cli ping
```

### Run Application

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

The API will be available at `http://localhost:3000`

## Docker Deployment

### Development Environment

```bash
# Setup Docker environment
npm run docker:setup

# Start development containers
npm run docker:dev
```

This starts:
- Application at `http://localhost:3000`
- Database at `localhost:3306`
- Redis at `localhost:6379`
- PhpMyAdmin at `http://localhost:8080`
- Redis Commander at `http://localhost:8081`

### Production Environment

```bash
# Build and start production containers
npm run docker:prod
```

### Docker Commands Reference

```bash
# Build image
docker build -t qore-backend:latest .

# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Execute commands in container
docker-compose exec app npm run migrate
docker-compose exec app npm run db:optimize
```

## Production Deployment

### 1. Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y

# Install MySQL 8.0
sudo apt install mysql-server -y

# Install Redis
sudo apt install redis-server -y
```

### 2. Database Setup

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
mysql -u root -p

mysql> CREATE DATABASE qore_backend;
mysql> CREATE USER 'qore_prod'@'localhost' IDENTIFIED BY 'strong_password';
mysql> GRANT ALL PRIVILEGES ON qore_backend.* TO 'qore_prod'@'localhost';
mysql> FLUSH PRIVILEGES;
mysql> EXIT;

# Optimize MySQL for production
sudo nano /etc/mysql/mysql.conf
```

Add these configurations:
```ini
[mysqld]
innodb_buffer_pool_size = 256M
innodb_log_file_size = 256M
max_connections = 200
query_cache_size = 64M
```

### 3. Redis Configuration

```bash
# Configure Redis for production
sudo nano /etc/redis/redis.conf
```

Add these configurations:
```ini
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### 4. Application Deployment

```bash
# Clone repository
git clone https://github.com/your-org/qore-backend.git
cd qore-backend

# Install dependencies
npm ci --production

# Set production environment
export NODE_ENV=production
cp .env.example .env
# Edit .env with production values

# Generate Prisma client
npx prisma generate

# Run database migrations
npm run migrate

# Optimize database
npm run db:optimize

# Start with PM2
pm2 start ecosystem.config.js
```

### 5. PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'qore-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### 6. Nginx Configuration

Create `/etc/nginx/sites-available/qore-backend`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # Proxy to Node.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # File upload size
        client_max_body_size 10M;
    }

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript;

    # Static files
    location /uploads/ {
        alias /path/to/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/qore-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Cloud Deployment

### AWS EC2

```bash
# Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-901234567890123 \
  --user-data file://user-data.sh
```

User data script (`user-data.sh`):
```bash
#!/bin/bash
yum update -y
yum install -y nodejs npm git
cd /home/ec2-user
git clone https://github.com/your-org/qore-backend.git
cd qore-backend
npm install
npm run build
pm2 start ecosystem.config.js
```

### DigitalOcean

```bash
# Create Droplet
doctl compute droplet create \
  --image ubuntu-22-04 \
  --size s-2vcpu-4gb \
  --region nyc1 \
  --ssh-keys your-ssh-key \
  --user-data-file user-data.sh
```

### Google Cloud Platform

```bash
# Create Compute Engine instance
gcloud compute instances create qore-backend \
  --image-family ubuntu-2204-lts \
  --machine-type e2-medium \
  --zone us-central1-a \
  --metadata-from-file user-data=user-data.sh
```

## Monitoring

### Application Monitoring

```bash
# PM2 Monitoring
pm2 monit

# PM2 Logs
pm2 logs qore-backend

# PM2 Restart
pm2 restart qore-backend
```

### Database Monitoring

```bash
# MySQL Status
sudo systemctl status mysql

# MySQL Performance
mysql -u root -p -e "SHOW PROCESSLIST;"
mysql -u root -p -e "SHOW ENGINE INNODB STATUS;"

# MySQL Logs
sudo tail -f /var/log/mysql/error.log
```

### Redis Monitoring

```bash
# Redis Status
redis-cli info

# Redis Memory Usage
redis-cli info memory

# Redis Logs
sudo tail -f /var/log/redis/redis-server.log
```

### Log Management

```bash
# Configure log rotation
sudo nano /etc/logrotate.d/qore-backend
```

Log rotation configuration:
```
/path/to/qore-backend/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 qore-user qore-user
    postrotate
        systemctl reload qore-backend
    endscript
}
```

## Security

### SSL/TLS Setup

```bash
# Generate self-signed certificate (for testing)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/qore-backend.key \
  -out /etc/ssl/certs/qore-backend.crt

# Or use Let's Encrypt (for production)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3306  # MySQL (if needed)
sudo ufw allow 6379  # Redis (if needed)
sudo ufw enable

# iptables
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

### Security Hardening

```bash
# Disable root SSH login
sudo nano /etc/ssh/sshd_config
# Add: PermitRootLogin no

# Configure fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban

# Set up automatic updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Scaling

### Horizontal Scaling

```bash
# Multiple instances behind load balancer
# Use shared database or read replicas
# Configure Redis cluster
# Implement session affinity
```

### Database Scaling

```bash
# Read Replicas
# Configure MySQL master-slave
# Use connection pooling
# Implement query caching
```

### Caching Strategy

```bash
# Redis Cluster
# CDN for static files
# Application-level caching
# Database query caching
```

## Backup Strategy

### Database Backup

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u qore_prod -p qore_backend > backup_$DATE.sql
gzip backup_$DATE.sql

# Schedule with cron
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

### Application Backup

```bash
# Backup application files
tar -czf qore-backend_$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=logs \
  --exclude=uploads \
  /path/to/qore-backend/
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check MySQL service status
   - Verify connection string
   - Check firewall rules
   - Review MySQL logs

2. **High Memory Usage**
   - Monitor Node.js process memory
   - Check for memory leaks
   - Optimize database queries
   - Increase available RAM

3. **Slow Performance**
   - Profile database queries
   - Check network latency
   - Monitor CPU usage
   - Review application logs

4. **SSL Certificate Issues**
   - Verify certificate validity
   - Check certificate chain
   - Validate configuration
   - Test with SSL tools

### Debug Commands

```bash
# Check application logs
pm2 logs qore-backend --lines 100

# Monitor system resources
htop
iostat -x 1
free -h
df -h

# Database connections
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"

# Redis memory
redis-cli info memory | grep used_memory_human
```

This deployment guide covers various scenarios from local development to production cloud deployment. Adjust configurations based on your specific requirements and infrastructure.