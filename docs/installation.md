# Installation Guide

This guide will help you set up OpenVape Commerce on your local machine or server.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **PostgreSQL** 14.x or higher
- **Git**
- **Docker** (optional, for containerized deployment)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/openvape-commerce.git
cd openvape-commerce
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/openvape_commerce
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### Set Up Database

```bash
# Run migrations
npm run migrate

# (Optional) Seed database with sample data
npm run db:seed
```

#### Start Backend Server

```bash
npm run dev
```

The backend API will be available at `http://localhost:4000`

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
```

#### Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit the `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_NAME=Your Store Name
```

#### Start Frontend Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Docker Setup

For a containerized setup using Docker:

### 1. Install Docker and Docker Compose

Follow the official Docker installation guide for your operating system.

### 2. Configure Environment Variables

Create `.env` files in both `backend` and `frontend` directories as described above.

### 3. Start All Services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache
- Backend API
- Frontend application

### 4. Run Database Migrations

```bash
docker-compose exec backend npm run migrate
```

### 5. Access the Application

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`
- Database: `localhost:5432`

## Production Deployment

### Using Docker Compose

1. Update environment variables for production
2. Set `NODE_ENV=production`
3. Configure SSL certificates
4. Start with production profile:

```bash
docker-compose --profile production up -d
```

### Manual Deployment

#### Backend

1. Build the application:
```bash
cd backend
npm ci --only=production
npm run migrate:deploy
```

2. Start with PM2 or similar process manager:
```bash
pm2 start src/index.js --name openvape-backend
```

#### Frontend

1. Build the application:
```bash
cd frontend
npm ci
npm run build
```

2. Start the production server:
```bash
npm start
```

Or use PM2:
```bash
pm2 start npm --name openvape-frontend -- start
```

### Nginx Configuration

Create an Nginx configuration file:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Configuration

Use Let's Encrypt for free SSL certificates:

```bash
sudo certbot --nginx -d yourdomain.com
```

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

### Port Already in Use

Change the port in your `.env` file:
```env
PORT=4001  # Backend
```

For frontend, modify `package.json`:
```json
"dev": "next dev -p 3001"
```

### Migration Errors

Reset the database:
```bash
npm run migrate:reset
```

### Module Not Found Errors

Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- [Configuration Guide](configuration.md)
- [API Documentation](api.md)
- [Theme Development](themes.md)
- [Payment Gateway Setup](payment-gateways.md)

## Support

If you encounter any issues:
- Check the [FAQ](faq.md)
- Search [GitHub Issues](https://github.com/yourusername/openvape-commerce/issues)
- Join our [Discord community](https://discord.gg/openvape)