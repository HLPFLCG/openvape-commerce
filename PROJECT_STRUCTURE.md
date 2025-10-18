# OpenVape Commerce - Project Structure

## Directory Layout

```
openvape-commerce/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # Database models (Prisma)
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   ├── validators/        # Request validation schemas
│   │   └── index.js           # Application entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── tests/                 # Backend tests
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── Dockerfile
│
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/               # Next.js 14 app directory
│   │   │   ├── (shop)/        # Shop routes
│   │   │   ├── (admin)/       # Admin panel routes
│   │   │   ├── api/           # API routes (if needed)
│   │   │   └── layout.js      # Root layout
│   │   ├── components/        # React components
│   │   │   ├── common/        # Shared components
│   │   │   ├── shop/          # Shop-specific components
│   │   │   └── admin/         # Admin-specific components
│   │   ├── lib/               # Utility libraries
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # State management (Zustand)
│   │   ├── styles/            # Global styles
│   │   └── types/             # TypeScript types
│   ├── public/                # Static assets
│   ├── tests/                 # Frontend tests
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── Dockerfile
│
├── shared/                     # Shared code between frontend/backend
│   ├── types/                 # Shared TypeScript types
│   └── constants/             # Shared constants
│
├── docs/                       # Documentation
│   ├── installation.md
│   ├── configuration.md
│   ├── api.md
│   ├── themes.md
│   ├── plugins.md
│   ├── payment-gateways.md
│   └── deployment.md
│
├── docker-compose.yml          # Docker composition
├── .gitignore
├── LICENSE
└── README.md
```

## Backend Architecture

### Controllers
Handle HTTP requests and responses, delegating business logic to services.

### Services
Contain business logic, interact with models, and handle complex operations.

### Models
Prisma schema definitions for database entities.

### Middleware
- Authentication (JWT verification)
- Authorization (role-based access control)
- Error handling
- Request validation
- Rate limiting
- CORS configuration

### Routes
API endpoint definitions organized by resource:
- `/api/auth` - Authentication endpoints
- `/api/products` - Product management
- `/api/orders` - Order management
- `/api/customers` - Customer management
- `/api/payments` - Payment processing
- `/api/admin` - Admin-specific endpoints

## Frontend Architecture

### App Directory Structure (Next.js 14)
```
app/
├── (shop)/                    # Customer-facing routes
│   ├── page.js               # Homepage
│   ├── products/
│   │   ├── page.js           # Product listing
│   │   └── [slug]/
│   │       └── page.js       # Product detail
│   ├── cart/
│   │   └── page.js           # Shopping cart
│   ├── checkout/
│   │   └── page.js           # Checkout process
│   ├── account/
│   │   ├── page.js           # Account dashboard
│   │   ├── orders/           # Order history
│   │   └── settings/         # Account settings
│   └── layout.js             # Shop layout
│
└── (admin)/                   # Admin panel routes
    ├── dashboard/
    │   └── page.js           # Admin dashboard
    ├── products/
    │   ├── page.js           # Product management
    │   ├── new/              # Add product
    │   └── [id]/edit/        # Edit product
    ├── orders/
    │   └── page.js           # Order management
    ├── customers/
    │   └── page.js           # Customer management
    ├── settings/
    │   └── page.js           # Store settings
    └── layout.js             # Admin layout
```

### Component Organization
```
components/
├── common/                    # Reusable components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Modal.jsx
│   ├── Card.jsx
│   └── ...
├── shop/                      # Shop-specific components
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── CartItem.jsx
│   ├── CheckoutForm.jsx
│   └── ...
└── admin/                     # Admin-specific components
    ├── DataTable.jsx
    ├── StatsCard.jsx
    ├── OrderStatus.jsx
    └── ...
```

## Database Schema Overview

### Core Entities
- **Users**: Customer and admin accounts
- **Products**: Product catalog with variants
- **Categories**: Product categorization
- **Orders**: Customer orders
- **OrderItems**: Individual items in orders
- **Payments**: Payment transactions
- **Addresses**: Shipping and billing addresses
- **Inventory**: Stock management
- **Coupons**: Discount codes
- **Reviews**: Product reviews

## API Design Principles

### RESTful Endpoints
- Use proper HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Consistent URL structure
- Proper status codes
- Pagination for list endpoints
- Filtering and sorting capabilities

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## Security Considerations

### Authentication
- JWT-based authentication
- Refresh token rotation
- Secure password hashing (bcrypt)
- Rate limiting on auth endpoints

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- Admin vs. customer separation

### Data Protection
- Input validation and sanitization
- SQL injection prevention (Prisma)
- XSS protection
- CSRF protection
- Secure headers (Helmet.js)

## Payment Processing Architecture

### Payment Gateway Interface
Abstract interface for payment processors:
```javascript
interface PaymentGateway {
  createPaymentIntent(amount, currency, metadata)
  capturePayment(paymentId)
  refundPayment(paymentId, amount)
  getPaymentStatus(paymentId)
}
```

### Supported Gateways
- Authorize.net
- PayPal
- Square
- Cryptocurrency (BTCPay Server)
- Custom implementations

## Deployment Architecture

### Production Setup
```
Internet
    ↓
Nginx (Reverse Proxy + SSL)
    ↓
    ├── Frontend (Next.js) :3000
    └── Backend (Express) :4000
            ↓
        PostgreSQL :5432
            ↓
        Redis :6379 (optional)
```

### Scaling Considerations
- Horizontal scaling with load balancer
- Database replication
- CDN for static assets
- Redis for session storage and caching
- Background job processing (Bull/BullMQ)

## Development Workflow

### Local Development
1. Start PostgreSQL and Redis
2. Run backend: `cd backend && npm run dev`
3. Run frontend: `cd frontend && npm run dev`
4. Access at `http://localhost:3000`

### Testing
- Unit tests: Jest
- Integration tests: Supertest
- E2E tests: Playwright
- API testing: Postman/Insomnia

### CI/CD Pipeline
1. Code push to GitHub
2. Automated tests run
3. Build Docker images
4. Deploy to staging
5. Manual approval
6. Deploy to production

## Customization Points

### Theme System
- Custom React components
- Tailwind CSS configuration
- Custom layouts
- Component overrides

### Plugin System
- Hooks for extending functionality
- Event system for custom logic
- API extensions
- Custom payment gateways

### Webhooks
- Order events
- Payment events
- Customer events
- Product events
- Custom events