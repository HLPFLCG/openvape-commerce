# Payment Gateway Integration Guide

OpenVape Commerce supports multiple payment gateways, giving you the flexibility to choose the best option for your business.

## Supported Payment Gateways

1. **Authorize.net** - Traditional credit card processing
2. **PayPal** - PayPal and credit card payments
3. **Square** - In-person and online payments
4. **Cryptocurrency** - Bitcoin, Ethereum, and more via BTCPay Server
5. **Custom Gateways** - Build your own integration

## Why Multiple Payment Options?

Traditional platforms like Shopify and Stripe often restrict certain business types. OpenVape Commerce gives you alternatives:

- **No Business Restrictions**: Accept payments for any legal product
- **Lower Fees**: Shop around for the best rates
- **Redundancy**: If one processor goes down, use another
- **Customer Choice**: Let customers pay their preferred way

## Authorize.net Setup

Authorize.net is a reliable payment processor that works with many business types.

### 1. Create an Account

1. Visit [Authorize.net](https://www.authorize.net/)
2. Sign up for a merchant account
3. Complete the verification process

### 2. Get API Credentials

1. Log in to your Authorize.net account
2. Go to Account → Settings → API Credentials & Keys
3. Generate a new Transaction Key
4. Note your API Login ID

### 3. Configure in OpenVape Commerce

Add to your backend `.env` file:

```env
AUTHORIZENET_API_LOGIN_ID=your-api-login-id
AUTHORIZENET_TRANSACTION_KEY=your-transaction-key
AUTHORIZENET_ENVIRONMENT=sandbox  # or 'production'
```

### 4. Test the Integration

Use Authorize.net test card numbers:
- Visa: 4007000000027
- Mastercard: 5424000000000015
- Amex: 370000000000002

## PayPal Setup

PayPal is widely recognized and trusted by customers worldwide.

### 1. Create a Business Account

1. Visit [PayPal Developer](https://developer.paypal.com/)
2. Create a business account
3. Complete verification

### 2. Create an App

1. Go to Dashboard → My Apps & Credentials
2. Create a new app
3. Copy your Client ID and Secret

### 3. Configure in OpenVape Commerce

Add to your backend `.env` file:

```env
PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=your-client-secret
PAYPAL_MODE=sandbox  # or 'live'
```

### 4. Enable PayPal Checkout

PayPal provides a JavaScript SDK for seamless checkout:

```javascript
// Frontend integration
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
```

## Square Setup

Square is great for businesses with both online and physical locations.

### 1. Create a Square Account

1. Visit [Square](https://squareup.com/)
2. Sign up for an account
3. Complete business verification

### 2. Get API Credentials

1. Go to Developer Dashboard
2. Create a new application
3. Copy your Access Token and Location ID

### 3. Configure in OpenVape Commerce

Add to your backend `.env` file:

```env
SQUARE_ACCESS_TOKEN=your-access-token
SQUARE_LOCATION_ID=your-location-id
SQUARE_ENVIRONMENT=sandbox  # or 'production'
```

## Cryptocurrency Setup (BTCPay Server)

Accept Bitcoin, Ethereum, and other cryptocurrencies without intermediaries.

### Why Cryptocurrency?

- **No Chargebacks**: Transactions are final
- **Lower Fees**: Typically 1% or less
- **No Restrictions**: No business type limitations
- **Privacy**: Less personal information required
- **Global**: Accept payments from anywhere

### 1. Set Up BTCPay Server

#### Option A: Self-Hosted

1. Get a VPS (DigitalOcean, Linode, etc.)
2. Install BTCPay Server:
```bash
git clone https://github.com/btcpayserver/btcpayserver-docker
cd btcpayserver-docker
export BTCPAY_HOST="btcpay.yourdomain.com"
export NBITCOIN_NETWORK="mainnet"
export BTCPAYGEN_CRYPTO1="btc"
export BTCPAYGEN_REVERSEPROXY="nginx"
export BTCPAYGEN_LIGHTNING="lnd"
./btcpay-setup.sh -i
```

#### Option B: Third-Party Hosting

Use a hosted BTCPay Server provider:
- [LunaNode](https://launchbtcpay.lunanode.com/)
- [Voltage](https://voltage.cloud/)

### 2. Create a Store

1. Log in to your BTCPay Server
2. Create a new store
3. Configure your preferred cryptocurrencies
4. Generate an API key

### 3. Configure in OpenVape Commerce

Add to your backend `.env` file:

```env
BTCPAY_URL=https://btcpay.yourdomain.com
BTCPAY_API_KEY=your-api-key
BTCPAY_STORE_ID=your-store-id
```

### 4. Accept Payments

BTCPay Server provides:
- Payment buttons
- Invoice generation
- Webhook notifications
- Lightning Network support

## Custom Payment Gateway

Build your own payment integration for any processor.

### 1. Create Gateway Service

Create a new file: `backend/src/services/payments/customGateway.service.js`

```javascript
class CustomGatewayService {
  async createPayment(amount, currency, metadata) {
    // Implement payment creation
    return {
      paymentId: 'unique-id',
      status: 'pending',
      redirectUrl: 'https://payment-page.com',
    };
  }

  async capturePayment(paymentId) {
    // Implement payment capture
    return {
      status: 'completed',
      transactionId: 'txn-id',
    };
  }

  async refundPayment(paymentId, amount) {
    // Implement refund
    return {
      status: 'refunded',
      refundId: 'refund-id',
    };
  }

  async getPaymentStatus(paymentId) {
    // Check payment status
    return {
      status: 'completed',
      amount: 100.00,
    };
  }
}

export default new CustomGatewayService();
```

### 2. Register Gateway

Add to `backend/src/services/payment.service.js`:

```javascript
import customGateway from './payments/customGateway.service.js';

const gateways = {
  authorizenet: authorizenetGateway,
  paypal: paypalGateway,
  square: squareGateway,
  btcpay: btcpayGateway,
  custom: customGateway,  // Add your gateway
};
```

## Payment Flow

### 1. Customer Initiates Checkout

```javascript
// Frontend
const response = await api.post('/orders', {
  items: cartItems,
  shippingAddress: address,
  paymentMethod: 'authorizenet',
});
```

### 2. Backend Creates Payment

```javascript
// Backend
const payment = await paymentService.createPayment({
  orderId: order.id,
  amount: order.total,
  currency: 'USD',
  method: 'authorizenet',
});
```

### 3. Customer Completes Payment

Redirect to payment gateway or process inline.

### 4. Webhook Confirmation

```javascript
// Backend webhook handler
app.post('/webhooks/payment', async (req, res) => {
  const { paymentId, status } = req.body;
  
  await paymentService.updatePaymentStatus(paymentId, status);
  
  if (status === 'completed') {
    await orderService.markAsPaid(orderId);
    await emailService.sendOrderConfirmation(order);
  }
  
  res.json({ received: true });
});
```

## Security Best Practices

### PCI Compliance

- **Never store credit card numbers**
- Use tokenization
- Implement SSL/TLS
- Regular security audits
- Follow PCI DSS guidelines

### API Security

- Store API keys in environment variables
- Use HTTPS for all API calls
- Implement rate limiting
- Validate webhook signatures
- Log all transactions

### Fraud Prevention

- Implement address verification (AVS)
- Use CVV verification
- Set transaction limits
- Monitor for suspicious activity
- Implement 3D Secure

## Testing

### Test Mode

Always test in sandbox/test mode first:

```env
AUTHORIZENET_ENVIRONMENT=sandbox
PAYPAL_MODE=sandbox
SQUARE_ENVIRONMENT=sandbox
```

### Test Cards

Each gateway provides test card numbers:

**Authorize.net:**
- Success: 4007000000027
- Decline: 4000300011112220

**PayPal:**
- Use PayPal sandbox accounts

**Square:**
- Success: 4111 1111 1111 1111
- Decline: 4000 0000 0000 0002

## Troubleshooting

### Payment Declined

- Check card details
- Verify sufficient funds
- Check AVS/CVV settings
- Review fraud filters

### API Errors

- Verify API credentials
- Check environment (sandbox vs production)
- Review API logs
- Test with curl/Postman

### Webhook Issues

- Verify webhook URL is accessible
- Check webhook signature validation
- Review webhook logs
- Test with webhook testing tools

## Going Live

### Checklist

- [ ] Complete merchant verification
- [ ] Switch to production credentials
- [ ] Update environment variables
- [ ] Test with real transactions
- [ ] Set up monitoring and alerts
- [ ] Configure fraud prevention
- [ ] Document payment procedures
- [ ] Train staff on payment handling

### Production Configuration

```env
NODE_ENV=production
AUTHORIZENET_ENVIRONMENT=production
PAYPAL_MODE=live
SQUARE_ENVIRONMENT=production
```

## Support

For payment gateway specific issues:
- **Authorize.net**: [Support](https://support.authorize.net/)
- **PayPal**: [Developer Support](https://developer.paypal.com/support/)
- **Square**: [Developer Support](https://developer.squareup.com/support)
- **BTCPay**: [Documentation](https://docs.btcpayserver.org/)

For OpenVape Commerce integration issues:
- [GitHub Issues](https://github.com/yourusername/openvape-commerce/issues)
- [Discord Community](https://discord.gg/openvape)