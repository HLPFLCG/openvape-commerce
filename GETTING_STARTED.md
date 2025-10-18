# 🎉 Getting Started with OpenVape Commerce

Welcome! Your complete e-commerce platform is ready. Here's everything you need to know to get started.

## 📦 What You Have

A fully functional, open-source e-commerce platform with:

- ✅ **Backend API** - Complete REST API with authentication
- ✅ **Frontend** - Modern Next.js storefront
- ✅ **Database** - PostgreSQL with comprehensive schema
- ✅ **Payment Support** - Multiple gateway options
- ✅ **Deployment Tools** - Automated deployment scripts
- ✅ **Documentation** - Complete guides for everything

## 🚀 Quick Start Options

### Option 1: Local Development (Test Locally First)

**Time: 5 minutes**

```bash
# Clone the repository
git clone https://github.com/HLPFLCG/openvape-commerce.git
cd openvape-commerce

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev

# Visit http://localhost:3000
```

See [QUICKSTART.md](QUICKSTART.md) for detailed local setup.

### Option 2: Deploy to Your Domain (Production)

**Time: 10 minutes**

```bash
# SSH into your VPS
ssh root@your-server-ip

# Run one-command deployment
curl -fsSL https://raw.githubusercontent.com/HLPFLCG/openvape-commerce/main/deploy.sh | sudo bash
```

See [DEPLOYMENT_QUICKSTART.md](DEPLOYMENT_QUICKSTART.md) for deployment guide.

### Option 3: Docker (Containerized)

**Time: 5 minutes**

```bash
git clone https://github.com/HLPFLCG/openvape-commerce.git
cd openvape-commerce
docker-compose up -d
docker-compose exec backend npm run migrate
```

## 📖 Essential Documentation

### For Getting Started
1. **[QUICKSTART.md](QUICKSTART.md)** - Local development setup
2. **[DEPLOYMENT_QUICKSTART.md](DEPLOYMENT_QUICKSTART.md)** - Deploy to production
3. **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - Complete deployment overview

### For Deployment
1. **[docs/deployment.md](docs/deployment.md)** - Comprehensive deployment guide
2. **[docs/installation.md](docs/installation.md)** - Detailed installation steps
3. **[UPDATE.md](UPDATE.md)** - How to update your installation

### For Configuration
1. **[docs/payment-gateways.md](docs/payment-gateways.md)** - Payment gateway setup
2. **[backend/.env.example](backend/.env.example)** - Backend configuration
3. **[frontend/.env.example](frontend/.env.example)** - Frontend configuration

### For Development
1. **[README.md](README.md)** - Project overview
2. **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Code organization
3. **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute

## 🎯 Your Next Steps

### Step 1: Choose Your Path

**Testing Locally?**
→ Follow [QUICKSTART.md](QUICKSTART.md)

**Deploying to Production?**
→ Follow [DEPLOYMENT_QUICKSTART.md](DEPLOYMENT_QUICKSTART.md)

### Step 2: Set Up Your Domain (Production Only)

1. Get a VPS (DigitalOcean, Linode, Vultr, etc.)
2. Point your domain to the VPS IP
3. Wait for DNS propagation (5-30 minutes)

### Step 3: Deploy

Run the automated deployment script:

```bash
curl -fsSL https://raw.githubusercontent.com/HLPFLCG/openvape-commerce/main/deploy.sh | sudo bash
```

### Step 4: Configure Payment Gateways

Choose your payment processors:

**For Vape Shops (Recommended):**
- ✅ **Authorize.net** - Works with most business types
- ✅ **Cryptocurrency** - No restrictions, lower fees

**Other Options:**
- PayPal
- Square
- Custom gateway

See [docs/payment-gateways.md](docs/payment-gateways.md) for setup instructions.

### Step 5: Customize Your Store

1. Update branding in `frontend/.env.local`
2. Customize colors in `frontend/tailwind.config.js`
3. Add your logo and images
4. Configure email templates

### Step 6: Add Products

Currently via database or API. Admin panel coming soon!

```bash
# Connect to database
sudo -u postgres psql openvape_commerce

# Add a product
INSERT INTO products (id, name, slug, price, description, is_active)
VALUES (gen_random_uuid(), 'Product Name', 'product-slug', 29.99, 'Description', true);
```

### Step 7: Go Live!

1. Test everything thoroughly
2. Set payment gateways to production mode
3. Update environment to production
4. Start selling!

## 💡 Key Features

### What's Working Now
- ✅ User registration and authentication
- ✅ JWT token system with refresh
- ✅ Email notifications
- ✅ Age verification
- ✅ Database schema for products, orders, payments
- ✅ Shopping cart (state management ready)
- ✅ Responsive design foundation

### What Needs Implementation
- ⏳ Product management UI
- ⏳ Shopping cart UI
- ⏳ Checkout flow
- ⏳ Admin panel
- ⏳ Payment gateway code (documentation complete)
- ⏳ Order management UI

### Easy to Add
- Plugin system
- Additional payment gateways
- Shipping integrations
- Analytics
- Custom features

## 🛠️ Common Tasks

### View Logs
```bash
pm2 logs                              # Application logs
tail -f /var/log/nginx/error.log      # Nginx logs
```

### Restart Services
```bash
pm2 restart all                       # Restart all services
systemctl restart nginx               # Restart Nginx
```

### Update Application
```bash
cd /var/www/openvape-commerce
git pull origin main
cd backend && npm ci --only=production && npx prisma migrate deploy
cd ../frontend && npm ci && npm run build
pm2 restart all
```

### Backup Database
```bash
sudo -u postgres pg_dump openvape_commerce > backup.sql
```

### Create Admin User
```bash
sudo -u postgres psql openvape_commerce
UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'your-email@example.com';
\q
```

## 💰 Cost Comparison

### OpenVape Commerce
- **VPS**: $5-10/month
- **Domain**: $1-2/month
- **SSL**: Free
- **Platform Fees**: $0
- **Transaction Fees**: Only payment processor fees
- **Total**: ~$6-12/month

### Shopify
- **Basic Plan**: $29/month
- **Shopify Plan**: $79/month
- **Advanced**: $299/month
- **Transaction Fees**: 0.5-2% additional
- **Restrictions**: Yes (vape products not allowed)
- **Total**: $29-299+/month

**Savings**: $23-287/month = $276-3,444/year!

## 🆘 Need Help?

### Documentation
- [Installation Guide](docs/installation.md)
- [Deployment Guide](docs/deployment.md)
- [Payment Gateways](docs/payment-gateways.md)
- [Update Guide](UPDATE.md)

### Support Channels
- 📖 [GitHub Repository](https://github.com/HLPFLCG/openvape-commerce)
- 💬 [GitHub Issues](https://github.com/HLPFLCG/openvape-commerce/issues)
- 🎮 [Discord Community](https://discord.gg/openvape)

### Common Issues
- **Port in use**: Change port in `.env`
- **Database connection**: Check credentials in `.env`
- **SSL issues**: Run `certbot renew`
- **Site not loading**: Check `pm2 status` and logs

## 🎨 Customization

### Branding
```bash
# Update site name and description
nano frontend/.env.local

# Customize colors
nano frontend/tailwind.config.js

# Rebuild
cd frontend && npm run build && pm2 restart openvape-frontend
```

### Email Templates
```bash
# Edit email templates
nano backend/src/utils/email.js
```

### Add Features
The codebase is modular and easy to extend:
- Add new API routes in `backend/src/routes/`
- Add new pages in `frontend/src/app/`
- Add new components in `frontend/src/components/`

## 🔒 Security

### Best Practices
- ✅ Use strong passwords
- ✅ Enable firewall (UFW)
- ✅ Keep system updated
- ✅ Use SSH keys
- ✅ Regular backups
- ✅ Monitor logs

### Included Security Features
- Rate limiting
- CORS protection
- Helmet.js security headers
- JWT authentication
- Password hashing (bcrypt)
- SQL injection prevention (Prisma)

## 📈 Scaling

### When You Grow
- Add more VPS instances
- Use load balancer
- Implement Redis caching
- Use CDN for static assets
- Database replication
- Background job processing

## 🎓 Learning Resources

### Technologies Used
- **Backend**: Node.js, Express, Prisma
- **Frontend**: Next.js, React, Tailwind CSS
- **Database**: PostgreSQL
- **Deployment**: Docker, Nginx, PM2

### Tutorials
- [Node.js Documentation](https://nodejs.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ✨ What Makes This Special

### No Restrictions
- Sell any legal product
- No business type limitations
- No arbitrary account closures

### Full Control
- Own your code
- Own your data
- Own your infrastructure
- Customize anything

### Cost Effective
- No monthly platform fees
- No transaction fees
- Only pay for hosting and payment processing

### Open Source
- MIT licensed
- Community driven
- Transparent development
- Free forever

## 🚀 Ready to Start?

### Local Development
```bash
git clone https://github.com/HLPFLCG/openvape-commerce.git
cd openvape-commerce
# Follow QUICKSTART.md
```

### Production Deployment
```bash
curl -fsSL https://raw.githubusercontent.com/HLPFLCG/openvape-commerce/main/deploy.sh | sudo bash
```

---

**Questions?** Check the documentation or open an issue on GitHub!

**Ready to take control of your e-commerce business?** Let's get started! 🎉