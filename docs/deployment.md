# Deployment Guide

This guide covers deploying OpenVape Commerce to production on your own domain.

## Deployment Options

1. **VPS (Recommended)** - DigitalOcean, Linode, Vultr, Hetzner
2. **Cloud Platforms** - AWS, Google Cloud, Azure
3. **Managed Hosting** - Heroku, Railway, Render

## VPS Deployment (Recommended for Full Control)

### Prerequisites

- A VPS with at least 2GB RAM
- Ubuntu 22.04 LTS (recommended)
- A domain name pointed to your VPS IP
- SSH access to your server

### Step 1: Initial Server Setup

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y curl git nginx certbot python3-certbot-nginx

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Docker (optional, for containerized deployment)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install -y docker-compose
```

### Step 2: Set Up PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE openvape_commerce;
CREATE USER openvape WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE openvape_commerce TO openvape;
\q
```

### Step 3: Clone and Configure Application

```bash
# Create application directory
mkdir -p /var/www/openvape-commerce
cd /var/www/openvape-commerce

# Clone repository
git clone https://github.com/HLPFLCG/openvape-commerce.git .

# Set up backend
cd backend
npm ci --only=production

# Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=4000
API_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

DATABASE_URL=postgresql://openvape:your-secure-password@localhost:5432/openvape_commerce

JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Add your payment gateway credentials
AUTHORIZENET_API_LOGIN_ID=
AUTHORIZENET_TRANSACTION_KEY=
AUTHORIZENET_ENVIRONMENT=production

PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=live

AGE_VERIFICATION_ENABLED=true
MINIMUM_AGE=21
EOF

# Run database migrations
npx prisma migrate deploy

# Set up frontend
cd ../frontend
npm ci

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_SITE_NAME=Your Store Name
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_AGE_VERIFICATION_ENABLED=true
NEXT_PUBLIC_MINIMUM_AGE=21
EOF

# Build frontend
npm run build
```

### Step 4: Set Up PM2 Process Manager

```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd /var/www/openvape-commerce/backend
pm2 start src/index.js --name openvape-backend

# Start frontend
cd /var/www/openvape-commerce/frontend
pm2 start npm --name openvape-frontend -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above
```

### Step 5: Configure Nginx

```bash
# Create Nginx configuration
cat > /etc/nginx/sites-available/openvape-commerce << 'EOF'
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
ln -s /etc/nginx/sites-available/openvape-commerce /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 6: Set Up SSL with Let's Encrypt

```bash
# Obtain SSL certificates
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Follow the prompts to complete SSL setup
# Certbot will automatically configure Nginx for HTTPS

# Test auto-renewal
certbot renew --dry-run
```

### Step 7: Set Up Firewall

```bash
# Install UFW
apt install -y ufw

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'

# Enable firewall
ufw enable
```

### Step 8: Create Admin User

```bash
# Connect to PostgreSQL
sudo -u postgres psql openvape_commerce

# Update a user to admin (replace with actual user email)
UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'your-email@example.com';
\q
```

## Docker Deployment

For a simpler containerized deployment:

### Step 1: Set Up Server

```bash
# Install Docker and Docker Compose (as shown above)

# Clone repository
git clone https://github.com/HLPFLCG/openvape-commerce.git
cd openvape-commerce
```

### Step 2: Configure Environment

```bash
# Create backend .env
cp backend/.env.example backend/.env
# Edit backend/.env with your production settings

# Create frontend .env.local
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your production settings
```

### Step 3: Deploy with Docker Compose

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# View logs
docker-compose logs -f
```

### Step 4: Set Up Nginx and SSL

Follow steps 5 and 6 from the VPS deployment above.

## Cloud Platform Deployment

### AWS Deployment

1. **EC2 Instance**: Follow VPS deployment steps
2. **RDS**: Use managed PostgreSQL database
3. **S3**: Store uploaded files in S3
4. **CloudFront**: CDN for static assets
5. **Route 53**: DNS management

### Google Cloud Deployment

1. **Compute Engine**: Follow VPS deployment steps
2. **Cloud SQL**: Managed PostgreSQL
3. **Cloud Storage**: File storage
4. **Cloud CDN**: Content delivery
5. **Cloud DNS**: DNS management

### Azure Deployment

1. **Virtual Machine**: Follow VPS deployment steps
2. **Azure Database**: Managed PostgreSQL
3. **Blob Storage**: File storage
4. **Azure CDN**: Content delivery
5. **Azure DNS**: DNS management

## Managed Platform Deployment

### Railway

1. Create new project on Railway
2. Add PostgreSQL database
3. Deploy backend:
   - Connect GitHub repository
   - Set root directory to `backend`
   - Add environment variables
   - Deploy
4. Deploy frontend:
   - Connect GitHub repository
   - Set root directory to `frontend`
   - Add environment variables
   - Deploy
5. Configure custom domain

### Render

1. Create new Web Service for backend
2. Create new Web Service for frontend
3. Create PostgreSQL database
4. Configure environment variables
5. Deploy and configure custom domain

### Heroku

1. Create two apps (backend and frontend)
2. Add Heroku Postgres addon to backend
3. Configure environment variables
4. Deploy using Git:
```bash
# Backend
git subtree push --prefix backend heroku-backend main

# Frontend
git subtree push --prefix frontend heroku-frontend main
```

## Post-Deployment Checklist

- [ ] SSL certificates installed and working
- [ ] Database backups configured
- [ ] Environment variables set correctly
- [ ] Payment gateways tested in production
- [ ] Email notifications working
- [ ] Admin account created
- [ ] Firewall configured
- [ ] Monitoring set up (optional)
- [ ] Domain DNS configured
- [ ] Age verification tested
- [ ] All pages loading correctly
- [ ] Mobile responsiveness verified

## Monitoring and Maintenance

### Set Up Monitoring

```bash
# Install monitoring tools
npm install -g pm2-logrotate
pm2 install pm2-logrotate

# View logs
pm2 logs

# Monitor processes
pm2 monit
```

### Database Backups

```bash
# Create backup script
cat > /usr/local/bin/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U openvape openvape_commerce > $BACKUP_DIR/backup_$DATE.sql
# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-db.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-db.sh") | crontab -
```

### Updates and Maintenance

```bash
# Update application
cd /var/www/openvape-commerce
git pull origin main

# Update backend
cd backend
npm ci --only=production
npx prisma migrate deploy
pm2 restart openvape-backend

# Update frontend
cd ../frontend
npm ci
npm run build
pm2 restart openvape-frontend
```

## Troubleshooting

### Application Not Starting

```bash
# Check PM2 logs
pm2 logs

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Check system resources
htop
df -h
```

### Database Connection Issues

```bash
# Check PostgreSQL status
systemctl status postgresql

# Check database connection
sudo -u postgres psql openvape_commerce
```

### SSL Certificate Issues

```bash
# Renew certificates manually
certbot renew

# Check certificate status
certbot certificates
```

## Security Best Practices

1. **Keep System Updated**
```bash
apt update && apt upgrade -y
```

2. **Use Strong Passwords**
- Database passwords
- Admin accounts
- SSH keys (disable password auth)

3. **Configure Fail2Ban**
```bash
apt install -y fail2ban
systemctl enable fail2ban
```

4. **Regular Backups**
- Database backups daily
- File backups weekly
- Store backups off-site

5. **Monitor Logs**
- Check logs regularly
- Set up alerts for errors
- Monitor for suspicious activity

## Support

For deployment issues:
- [GitHub Issues](https://github.com/HLPFLCG/openvape-commerce/issues)
- [Documentation](https://github.com/HLPFLCG/openvape-commerce/docs)
- [Discord Community](https://discord.gg/openvape)