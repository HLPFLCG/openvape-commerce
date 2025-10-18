#!/bin/bash

# OpenVape Commerce Deployment Script
# This script automates the deployment process

set -e

echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║   OpenVape Commerce Deployment Script                ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Function to generate random secret (alphanumeric only, no special chars)
generate_secret() {
    openssl rand -hex 16
}

echo "=== Server Setup ==="
echo ""

# Get domain information
read -p "Enter your domain (e.g., example.com): " DOMAIN
read -p "Enter your API subdomain (e.g., api.example.com): " API_DOMAIN

# Get database password
read -p "Enter PostgreSQL password (or press Enter to generate): " DB_PASSWORD
if [ -z "$DB_PASSWORD" ]; then
    DB_PASSWORD=$(openssl rand -hex 16)
    echo "Generated database password: $DB_PASSWORD"
fi

# Get email configuration
read -p "Enter SMTP host (e.g., smtp.gmail.com): " SMTP_HOST
read -p "Enter SMTP port (default: 587): " SMTP_PORT
SMTP_PORT=${SMTP_PORT:-587}
read -p "Enter SMTP username/email: " SMTP_USER
read -sp "Enter SMTP password: " SMTP_PASS
echo ""
read -p "Enter 'From' email address: " EMAIL_FROM

echo ""
echo "=== Installing Dependencies ==="
echo ""

# Update system
apt update && apt upgrade -y

# Install Node.js
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi

# Install PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL..."
    apt install -y postgresql postgresql-contrib
fi

# Install Nginx
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt install -y nginx
fi

# Install Certbot
if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    apt install -y certbot python3-certbot-nginx
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Install Git
if ! command -v git &> /dev/null; then
    echo "Installing Git..."
    apt install -y git
fi

echo ""
echo "=== Setting Up Database ==="
echo ""

# Set up PostgreSQL
sudo -u postgres psql << EOF
CREATE DATABASE openvape_commerce;
CREATE USER openvape WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE openvape_commerce TO openvape;
EOF

echo "Database created successfully!"

echo ""
echo "=== Cloning Repository ==="
echo ""

# Create application directory
APP_DIR="/var/www/openvape-commerce"
mkdir -p $APP_DIR
cd $APP_DIR

# Clone repository
if [ ! -d ".git" ]; then
    git clone https://github.com/HLPFLCG/openvape-commerce.git .
else
    git pull origin main
fi

echo ""
echo "=== Configuring Backend ==="
echo ""

cd backend

# Install dependencies
npm ci --only=production

# Generate secrets (alphanumeric only)
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)

# Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=4000
API_URL=https://$API_DOMAIN
FRONTEND_URL=https://$DOMAIN

DATABASE_URL=postgresql://openvape:$DB_PASSWORD@localhost:5432/openvape_commerce

JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

SMTP_HOST=$SMTP_HOST
SMTP_PORT=$SMTP_PORT
SMTP_SECURE=false
SMTP_USER=$SMTP_USER
SMTP_PASS=$SMTP_PASS
EMAIL_FROM=$EMAIL_FROM

AGE_VERIFICATION_ENABLED=true
MINIMUM_AGE=21

BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# Run migrations
npx prisma generate
npx prisma migrate deploy

echo "Backend configured successfully!"

echo ""
echo "=== Configuring Frontend ==="
echo ""

cd ../frontend

# Install dependencies
npm ci

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://$API_DOMAIN/api
NEXT_PUBLIC_SITE_NAME=OpenVape Commerce
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
NEXT_PUBLIC_AGE_VERIFICATION_ENABLED=true
NEXT_PUBLIC_MINIMUM_AGE=21
EOF

# Build frontend
npm run build

echo "Frontend configured successfully!"

echo ""
echo "=== Setting Up PM2 ==="
echo ""

cd $APP_DIR

# Stop existing processes if any
pm2 delete openvape-backend 2>/dev/null || true
pm2 delete openvape-frontend 2>/dev/null || true

# Start backend
cd backend
pm2 start src/index.js --name openvape-backend

# Start frontend
cd ../frontend
pm2 start npm --name openvape-frontend -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup systemd -u root --hp /root

echo "PM2 configured successfully!"

echo ""
echo "=== Configuring Nginx ==="
echo ""

# Create Nginx configuration
cat > /etc/nginx/sites-available/openvape-commerce << EOF
# Backend API
server {
    listen 80;
    server_name $API_DOMAIN;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/openvape-commerce /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx

echo "Nginx configured successfully!"

echo ""
echo "=== Setting Up SSL ==="
echo ""

# Obtain SSL certificates
certbot --nginx -d $DOMAIN -d www.$DOMAIN -d $API_DOMAIN --non-interactive --agree-tos --email $EMAIL_FROM

echo "SSL certificates installed successfully!"

echo ""
echo "=== Setting Up Firewall ==="
echo ""

# Configure UFW
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'

echo "Firewall configured successfully!"

echo ""
echo "=== Creating Backup Script ==="
echo ""

# Create backup directory
mkdir -p /var/backups/postgresql

# Create backup script
cat > /usr/local/bin/backup-openvape.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U openvape openvape_commerce > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-openvape.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null | grep -v backup-openvape; echo "0 2 * * * /usr/local/bin/backup-openvape.sh") | crontab -

echo "Backup script configured successfully!"

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║   Deployment Complete! ✓                              ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "Your OpenVape Commerce store is now live at:"
echo "  Frontend: https://$DOMAIN"
echo "  API: https://$API_DOMAIN"
echo ""
echo "Important Information:"
echo "  Database Password: $DB_PASSWORD"
echo "  JWT Secret: $JWT_SECRET"
echo ""
echo "Next Steps:"
echo "  1. Visit https://$DOMAIN and create an account"
echo "  2. Make yourself an admin:"
echo "     sudo -u postgres psql openvape_commerce"
echo "     UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'your-email@example.com';"
echo "  3. Configure payment gateways in backend/.env"
echo "  4. Customize your store branding"
echo ""
echo "Useful Commands:"
echo "  View logs: pm2 logs"
echo "  Restart services: pm2 restart all"
echo "  Update app: cd $APP_DIR && git pull && ./deploy.sh"
echo ""
echo "Documentation: https://github.com/HLPFLCG/openvape-commerce/docs"
echo ""