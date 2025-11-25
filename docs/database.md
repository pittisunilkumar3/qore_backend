# Database Documentation

## Overview
The Qore Backend API uses MySQL database managed through Prisma ORM with XAMPP as the database server.

---

## Database Configuration

### Connection Details
- **Host:** `localhost`
- **Port:** `3306`
- **Database:** `qore_backend`
- **User:** `root`
- **Password:** `` (empty for XAMPP default)

### Environment Configuration
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=qore_backend
NODE_ENV=development
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(191) PRIMARY KEY,
  email VARCHAR(191) UNIQUE NOT NULL,
  name VARCHAR(191),
  password VARCHAR(191) NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL,
  INDEX users_email_key (email)
);
```

**Fields:**
- `id` (String, Primary Key) - Unique identifier using cuid()
- `email` (String, Unique) - User's email address
- `name` (String, Nullable) - User's full name
- `password` (String) - Hashed password using bcrypt
- `createdAt` (DateTime) - Account creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Constraints:**
- Primary key on `id`
- Unique constraint on `email`
- Automatic timestamps with millisecond precision

---

### Posts Table
```sql
CREATE TABLE posts (
  id VARCHAR(191) PRIMARY KEY,
  title VARCHAR(191) NOT NULL,
  content TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  authorId VARCHAR(191),
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL,
  INDEX posts_authorId_key (authorId),
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);
```

**Fields:**
- `id` (String, Primary Key) - Unique identifier using cuid()
- `title` (String) - Post title (required)
- `content` (Text, Nullable) - Post content
- `published` (Boolean) - Publication status (default: false)
- `authorId` (String, Foreign Key) - Reference to users.id
- `createdAt` (DateTime) - Post creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Constraints:**
- Primary key on `id`
- Foreign key constraint on `authorId` referencing `users(id)`
- ON DELETE SET NULL (author can be deleted without deleting posts)
- ON UPDATE CASCADE (user ID changes cascade to posts)

---

## Entity Relationship Diagram

```
users (1) ----< posts (∞)
    |              |
    id             id
    email          title
    name           content
    password       published
    createdAt      authorId (FK)
    updatedAt      createdAt
                   updatedAt
```

**Relationship:**
- **One-to-Many:** One User can have Many Posts
- **Optional:** A Post can exist without an Author (authorId can be null)

---

## Prisma Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
  
  @@map("users")
}
```

### Post Model
```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String?
  author    User?    @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("posts")
}
```

---

## Database Operations

### User Operations
- **Create:** Register new user with email validation
- **Read:** Get all users or specific user by ID
- **Update:** Update user details (name, email, password)
- **Delete:** Remove user (cascades to posts if needed)

### Post Operations
- **Create:** Create new post with title and optional content
- **Read:** Get all posts or specific post by ID
- **Update:** Update post details
- **Delete:** Remove post
- **Filter:** Get published posts only

---

## Connection Pool Configuration

### Pool Settings
```javascript
{
  waitForConnections: true,
  connectionLimit: 10,     // Development
  queueLimit: 0,
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'qore_backend'
}
```

### Production Settings
```javascript
{
  connectionLimit: 20,     // Production
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
}
```

---

## Migration Commands

### Generate Prisma Client
```bash
npx prisma generate
```

### Push Schema Changes
```bash
npx prisma db push
```

### Create Migration
```bash
npx prisma migrate dev --name your_migration_name
```

### Deploy Migrations (Production)
```bash
npx prisma migrate deploy
```

### Open Prisma Studio
```bash
npx prisma studio
```

---

## Database Health Check

### Connection Test Query
```sql
SELECT 1 as test;
```

### Server Status Query
```sql
SELECT 
  NOW() as current_time,
  VERSION() as mysql_version,
  DATABASE() as current_database,
  USER() as current_user;
```

---

## Backup and Recovery

### Database Backup
```bash
# Using mysqldump
mysqldump -u root -p qore_backend > backup_$(date +%Y%m%d).sql

# Using Prisma
npx prisma db pull
```

### Database Restore
```bash
# Using mysql
mysql -u root -p qore_backend < backup_20251123.sql
```

---

## Performance Optimization

### Indexes
- **Email Index:** Unique constraint on users.email
- **Author Index:** Index on posts.authorId for efficient joins

### Query Optimization
- Use SELECT with specific fields only
- Implement pagination for large result sets
- Use proper JOINs with indexes
- Consider caching frequently accessed data

---

## Security Considerations

### Password Security
- Passwords hashed with bcrypt (12 rounds)
- Never store plain text passwords
- Implement password strength validation

### Database Security
- Use parameterized queries (Prisma ORM provides this)
- Implement proper user permissions
- Enable SSL for production connections
- Regular security updates

### Data Validation
- Email format validation
- Required field enforcement
- Content sanitization
- SQL injection prevention (handled by Prisma)

---

## Environment-Specific Configurations

### Development
```env
NODE_ENV=development
DB_HOST=localhost
DB_NAME=qore_backend
DB_CONNECTION_LIMIT=10
```

### Testing
```env
NODE_ENV=test
TEST_DB_NAME=qore_backend_test
DB_CONNECTION_LIMIT=5
```

### Production
```env
NODE_ENV=production
PROD_DB_HOST=your-production-host
PROD_DB_NAME=qore_backend_prod
PROD_DB_CONNECTION_LIMIT=20
```

---

## Monitoring and Maintenance

### Connection Monitoring
- Monitor connection pool usage
- Track query performance
- Log slow queries

### Database Maintenance
- Regular backups
- Index optimization
- Storage monitoring
- Query performance analysis

---

## Troubleshooting

### Common Issues

**Connection Refused**
- Check if XAMPP MySQL service is running
- Verify port 3306 is not blocked
- Check firewall settings

**Access Denied**
- Verify username and password
- Check user permissions
- Ensure database exists

**Connection Pool Exhausted**
- Increase connection limit
- Check for connection leaks
- Optimize long-running queries

**Migration Errors**
- Ensure no schema conflicts
- Check for circular dependencies
- Verify Prisma client is generated

---

**Last Updated:** November 23, 2025  
**Database Version:** MySQL 8.0+ / MariaDB 10.4+  
**Prisma Version:** 5.22.0