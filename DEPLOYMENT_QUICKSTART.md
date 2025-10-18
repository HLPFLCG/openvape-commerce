# 🚀 Quick Deployment Guide

Deploy OpenVape Commerce to your domain in under 10 minutes!

## Prerequisites

- A VPS (DigitalOcean, Linode, Vultr, etc.) with Ubuntu 22.04
- A domain name pointed to your VPS IP address
- SSH access to your server

## One-Command Deployment

SSH into your server and run:

```bash
curl -fsSL https://raw.githubusercontent.com/HLPFLCG/openvape-commerce/main/deploy.sh | sudo bash
```

The script will prompt you for:
- Your domain name
- API subdomain (e.g., api.yourdomain.com)
- Email configuration (SMTP settings)
- Other configuration options

That's it! The script will:
- ✅ Install all dependencies (Node.js, PostgreSQL, Nginx, etc.)
- ✅ Set up the database
- ✅ Clone and configure the application
- ✅ Install SSL certificates (Let's Encrypt)
- ✅ Configure firewall
- ✅ Set up automatic backups
- ✅ Start the application

## Manual Deployment

If you prefer manual control, follow these steps:

### 1. Prepare Your Server

```bash
# SSH into your server
ssh root@your-server-ip

# Download the deployment script
git clone https://github.com/HLPFLCG/openvape-commerce.git
cd openvape-commerce

# Make the script executable
chmod +x deploy.sh

# Run the deployment script
sudo ./deploy.sh
```

### 2. DNS Configuration

Before running the deployment script, make sure your DNS is configured:

**Option A: Direct DNS (Traditional)**

**A Records:**
- `yourdomain.com` → Your VPS IP
- `www.yourdomain.com` → Your VPS IP
- `api.yourdomain.com` → Your VPS IP

Wait for DNS propagation (can take up to 24 hours, usually much faster).

**Option B: Cloudflare (Recommended)**

Use Cloudflare for free DDoS protection, CDN, and SSL:

1. Sign up at [Cloudflare.com](https://cloudflare.com) (Free plan)
2. Add your domain
3. Update nameservers at your registrar
4. Add DNS records (proxied through Cloudflare):
   - `yourdomain.com` → Your VPS IP (Proxied)
   - `www.yourdomain.com` → Your VPS IP (Proxied)
   - `api.yourdomain.com` → Your VPS IP (Proxied)

See [docs/cloudflare-setup.md](docs/cloudflare-setup.md) for detailed Cloudflare setup.

### 3. Run Deployment

```bash
sudo ./deploy.sh
```

Follow the prompts to configure your store.

### 4. Create Admin Account

After deployment:

```bash
# Visit your site and register an account
# Then make yourself an admin:

sudo -u postgres psql openvape_commerce
UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'your-email@example.com';
\q
```

### 5. Configure Payment Gateways

Edit the backend environment file:

```bash
nano /var/www/openvape-commerce/backend/.env
```

Add your payment gateway credentials:

```env
# Authorize.net
AUTHORIZENET_API_LOGIN_ID=your-api-login-id
AUTHORIZENET_TRANSACTION_KEY=your-transaction-key
AUTHORIZENET_ENVIRONMENT=production

# PayPal
PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=your-client-secret
PAYPAL_MODE=live

# Square
SQUARE_ACCESS_TOKEN=your-access-token
SQUARE_LOCATION_ID=your-location-id
SQUARE_ENVIRONMENT=production

# Cryptocurrency (BTCPay Server)
BTCPAY_URL=https://your-btcpay-server.com
BTCPAY_API_KEY=your-api-key
BTCPAY_STORE_ID=your-store-id
```

Restart the backend:

```bash
pm2 restart openvape-backend
```

## Post-Deployment

### Verify Everything Works

1. **Frontend**: Visit `https://yourdomain.com`
2. **API**: Visit `https://api.yourdomain.com/api/health`
3. **SSL**: Check that HTTPS is working (green padlock)

### Useful Commands

```bash
# View application logs
pm2 logs

# Restart services
pm2 restart all

# Check service status
pm2 status

# View Nginx logs
tail -f /var/log/nginx/error.log

# Check database
sudo -u postgres psql openvape_commerce

# Update application
cd /var/www/openvape-commerce
git pull origin main
cd backend && npm ci --only=production && npx prisma migrate deploy
cd ../frontend && npm ci && npm run build
pm2 restart all
```

### Monitoring

```bash
# Monitor processes
pm2 monit

# View system resources
htop

# Check disk space
df -h
```

## Deployment Providers

### Recommended VPS Providers

1. **DigitalOcean** - $6/month
   - Easy to use
   - Good documentation
   - 1-click apps available

2. **Linode** - $5/month
   - Excellent performance
   - Great support
   - Simple pricing

3. **Vultr** - $6/month
   - Fast deployment
   - Multiple locations
   - Good value

4. **Hetzner** - €4.51/month
   - Best price/performance
   - European data centers
   - Excellent hardware

### Minimum Requirements

- **RAM**: 2GB (4GB recommended)
- **CPU**: 1 core (2 cores recommended)
- **Storage**: 25GB SSD
- **Bandwidth**: 1TB/month

## Alternative Deployment Methods

### Docker Deployment

```bash
# Clone repository
git clone https://github.com/HLPFLCG/openvape-commerce.git
cd openvape-commerce

# Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Edit the .env files

# Start with Docker Compose
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy
```

### Managed Platforms

#### Railway
1. Import GitHub repository
2. Add PostgreSQL database
3. Deploy backend and frontend separately
4. Configure environment variables
5. Add custom domain

#### Render
1. Create Web Service for backend
2. Create Web Service for frontend
3. Add PostgreSQL database
4. Configure environment variables
5. Add custom domain

## Troubleshooting

### Site Not Loading

```bash
# Check if services are running
pm2 status

# Check Nginx
systemctl status nginx

# View logs
pm2 logs
tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues

```bash
# Renew certificates
certbot renew

# Check certificate status
certbot certificates
```

### Database Connection Issues

```bash
# Check PostgreSQL
systemctl status postgresql

# Test connection
sudo -u postgres psql openvape_commerce
```

### Port Already in Use

```bash
# Check what's using the port
lsof -i :4000
lsof -i :3000

# Kill the process if needed
kill -9 <PID>
```

## Security Checklist

- [ ] SSL certificates installed and auto-renewing
- [ ] Firewall configured (UFW)
- [ ] Strong database password
- [ ] SSH key authentication enabled
- [ ] Regular backups configured
- [ ] Fail2ban installed (optional)
- [ ] Server updates automated

## Backup and Recovery

### Manual Backup

```bash
# Backup database
pg_dump -U openvape openvape_commerce > backup.sql

# Backup files
tar -czf openvape-backup.tar.gz /var/www/openvape-commerce
```

### Restore from Backup

```bash
# Restore database
psql -U openvape openvape_commerce < backup.sql

# Restore files
tar -xzf openvape-backup.tar.gz -C /
```

## Cost Breakdown

### Monthly Costs

- **VPS Hosting**: $5-10/month
- **Domain Name**: $10-15/year
- **SSL Certificate**: Free (Let's Encrypt)
- **Payment Processing**: Varies by gateway
  - Authorize.net: $25/month + 2.9% + $0.30 per transaction
  - PayPal: 2.9% + $0.30 per transaction
  - Cryptocurrency: ~1% or less

**Total**: ~$6-12/month (vs Shopify's $29-299/month)

## Support

Need help with deployment?

- 📖 [Full Deployment Guide](docs/deployment.md)
- 💬 [GitHub Issues](https://github.com/HLPFLCG/openvape-commerce/issues)
- 🎮 [Discord Community](https://discord.gg/openvape)
- 📧 Email: support@openvape-commerce.com

## Next Steps

After deployment:

1. ✅ Create admin account
2. ✅ Configure payment gateways
3. ✅ Customize branding and colors
4. ✅ Add your products
5. ✅ Set up shipping rates
6. ✅ Configure tax settings
7. ✅ Test checkout process
8. ✅ Launch your store!

---

**Ready to deploy?** Run the one-command deployment and you'll be live in minutes! 🚀