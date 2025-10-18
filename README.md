# OpenVape Commerce - Open Source E-commerce Platform

## Overview

OpenVape Commerce is a fully open-source, highly customizable e-commerce platform designed for businesses that need complete control over their online store without the restrictions imposed by traditional platforms like Shopify or WooCommerce.

## Why OpenVape Commerce?

- **No Business Restrictions**: Sell any legal product without platform limitations
- **Fully Customizable**: Complete control over design, functionality, and integrations
- **Cost-Effective**: No monthly fees, no transaction fees (only payment processor fees)
- **Payment Flexibility**: Support for multiple payment processors including crypto
- **No Vendor Lock-in**: Your data, your code, your platform
- **Unlimited Integrations**: Build any integration you need without restrictions
- **Open Source**: MIT licensed, community-driven development

## Key Features

### Core E-commerce
- Product catalog management with unlimited variants
- Inventory tracking and management
- Shopping cart and checkout system
- Order management and fulfillment
- Customer accounts and profiles
- Multi-currency support

### Payment Processing
- Modular payment gateway system
- Support for traditional processors (Authorize.net, PayPal, Square)
- Cryptocurrency payment support (Bitcoin, Ethereum, etc.)
- Custom payment method integration
- Secure payment handling with PCI compliance guidance

### Customization
- Fully customizable themes with React/Next.js
- Component-based design system
- CSS-in-JS or Tailwind CSS support
- No template restrictions
- Complete HTML/CSS/JavaScript control

### Business Features
- Age verification system
- Tax calculation and management
- Shipping rate calculation
- Discount and coupon system
- Email notifications
- Analytics and reporting
- SEO optimization

### Developer Features
- RESTful API
- Webhook system
- Plugin/extension architecture
- Comprehensive documentation
- Docker support
- Easy deployment options

## Technology Stack

### Backend
- **Framework**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **File Storage**: Local or S3-compatible storage
- **Email**: Nodemailer with multiple provider support

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **API Client**: Axios with React Query

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt
- **Caching**: Redis

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Redis (optional, for caching)
- Docker (optional, for containerized deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/openvape-commerce.git
cd openvape-commerce

# Install backend dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Start the backend
npm run dev

# In a new terminal, install frontend dependencies
cd ../frontend
npm install

# Set up frontend environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start the frontend
npm run dev
```

Visit `http://localhost:3000` to see your store!

## Configuration

### Environment Variables

#### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/openvape
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_NAME=Your Store Name
```

## Payment Gateway Setup

OpenVape Commerce supports multiple payment gateways. See our [Payment Gateway Guide](docs/payment-gateways.md) for detailed setup instructions for:

- Authorize.net
- PayPal
- Square
- Cryptocurrency (Bitcoin, Ethereum)
- Custom payment methods

## Deployment

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npm run migrate

# Create admin user
docker-compose exec backend npm run create-admin
```

### Manual Deployment

See our [Deployment Guide](docs/deployment.md) for instructions on deploying to:
- VPS (DigitalOcean, Linode, Vultr)
- AWS
- Google Cloud
- Azure
- Self-hosted servers

## Documentation

- [Installation Guide](docs/installation.md)
- [Configuration Guide](docs/configuration.md)
- [API Documentation](docs/api.md)
- [Theme Development](docs/themes.md)
- [Plugin Development](docs/plugins.md)
- [Payment Gateway Integration](docs/payment-gateways.md)
- [Deployment Guide](docs/deployment.md)

## Compliance & Legal

### Age Verification
Built-in age verification system for age-restricted products with customizable verification methods.

### Data Privacy
GDPR-compliant data handling with customer data export and deletion capabilities.

### PCI Compliance
Guidance and best practices for PCI DSS compliance when handling payment information.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- Documentation: [docs.openvape-commerce.com](https://docs.openvape-commerce.com)
- Community Forum: [forum.openvape-commerce.com](https://forum.openvape-commerce.com)
- Discord: [Join our Discord](https://discord.gg/openvape)
- Issues: [GitHub Issues](https://github.com/yourusername/openvape-commerce/issues)

## Roadmap

- [ ] v1.0 - Core e-commerce functionality
- [ ] v1.1 - Advanced payment options (crypto)
- [ ] v1.2 - Multi-vendor marketplace support
- [ ] v1.3 - Mobile app (React Native)
- [ ] v2.0 - AI-powered recommendations and analytics

## Acknowledgments

Built with ❤️ for businesses that deserve freedom and control over their online presence.

---

**Note**: This platform is designed for legal businesses. Users are responsible for ensuring compliance with all applicable laws and regulations in their jurisdiction.