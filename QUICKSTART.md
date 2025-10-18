# Quick Start Guide

Get OpenVape Commerce running in 5 minutes!

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## Installation

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/openvape-commerce.git
cd openvape-commerce

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your database credentials:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/openvape_commerce
JWT_SECRET=change-this-to-a-random-secret
JWT_REFRESH_SECRET=change-this-to-another-random-secret
```

**Frontend (.env.local):**
```bash
cd ../frontend
cp .env.example .env.local
```

The defaults should work for local development.

### 3. Set Up Database

```bash
cd backend
npm run migrate
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **API Health Check:** http://localhost:4000/api/health

## Docker Quick Start

Prefer Docker? Even easier:

```bash
# Clone the repository
git clone https://github.com/yourusername/openvape-commerce.git
cd openvape-commerce

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npm run migrate

# Access at http://localhost:3000
```

## What's Next?

1. **Create an Admin Account:**
   - Register at http://localhost:3000/register
   - Manually update the user role in the database to 'ADMIN'

2. **Configure Payment Gateways:**
   - See [Payment Gateway Guide](docs/payment-gateways.md)
   - Add your API keys to `.env`

3. **Customize Your Store:**
   - Edit frontend components in `frontend/src/components`
   - Modify styles in `frontend/src/app/globals.css`
   - Update branding in `frontend/.env.local`

4. **Add Products:**
   - Use the admin panel (coming soon)
   - Or use the API directly

## Common Issues

**Port already in use?**
```bash
# Change ports in .env files
# Backend: PORT=4001
# Frontend: modify package.json dev script
```

**Database connection failed?**
```bash
# Make sure PostgreSQL is running
# Check credentials in backend/.env
```

**Module not found?**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Need Help?

- [Full Installation Guide](docs/installation.md)
- [Documentation](docs/)
- [GitHub Issues](https://github.com/yourusername/openvape-commerce/issues)
- [Discord Community](https://discord.gg/openvape)

## Features Included

✅ User authentication with JWT  
✅ Product catalog (schema ready)  
✅ Shopping cart (store ready)  
✅ Order management (schema ready)  
✅ Multiple payment gateways  
✅ Email notifications  
✅ Age verification  
✅ Responsive design  
✅ Docker support  
✅ API documentation  

## What You Can Build

- Vape shop (like yours!)
- CBD/Hemp products store
- Adult products store
- Any e-commerce store without restrictions

## License

MIT - Use it however you want!

---

**Ready to build your store?** Start customizing! 🚀