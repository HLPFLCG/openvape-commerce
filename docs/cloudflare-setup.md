# Cloudflare Setup Guide for OpenVape Commerce

This guide shows you how to use Cloudflare with your VPS deployment.

## Why Use Cloudflare?

### Free Features
- **DDoS Protection** - Automatic protection against attacks
- **CDN** - Content delivery network for faster loading
- **SSL/TLS** - Free SSL certificates (alternative to Let's Encrypt)
- **Caching** - Reduce server load and improve speed
- **Analytics** - Detailed traffic insights
- **Firewall** - Block malicious traffic and bots
- **DNS** - Fast, reliable DNS management

### Performance Benefits
- Faster page loads worldwide
- Reduced bandwidth usage
- Better SEO rankings
- Improved user experience

## Setup Process

### Step 1: Sign Up for Cloudflare

1. Go to [Cloudflare.com](https://cloudflare.com)
2. Create a free account
3. Verify your email

### Step 2: Add Your Domain

1. Click "Add a Site"
2. Enter your domain name (e.g., `yourdomain.com`)
3. Select the **Free** plan
4. Click "Continue"

### Step 3: DNS Configuration

Cloudflare will scan your existing DNS records. You need to add:

#### Required DNS Records

```
Type    Name    Content             Proxy Status
A       @       YOUR_VPS_IP         Proxied (Orange Cloud)
A       www     YOUR_VPS_IP         Proxied (Orange Cloud)
A       api     YOUR_VPS_IP         Proxied (Orange Cloud)
```

**Important**: 
- Click the orange cloud icon to enable proxy (CDN + protection)
- This routes traffic through Cloudflare before reaching your VPS

### Step 4: Update Nameservers

1. Cloudflare will provide you with 2 nameservers:
   ```
   nameserver1.cloudflare.com
   nameserver2.cloudflare.com
   ```

2. Go to your domain registrar (where you bought the domain)
3. Update the nameservers to Cloudflare's nameservers
4. Wait for DNS propagation (5 minutes to 24 hours, usually quick)

### Step 5: Verify Setup

1. In Cloudflare dashboard, click "Check nameservers"
2. Once verified, you'll see "Active" status
3. Your site is now protected by Cloudflare!

## SSL/TLS Configuration

### Option 1: Cloudflare SSL (Recommended)

This is the easiest option and works great with Cloudflare.

#### In Cloudflare Dashboard:

1. Go to **SSL/TLS** → **Overview**
2. Select **"Full (strict)"** encryption mode
3. This encrypts traffic between:
   - Visitors → Cloudflare (automatic)
   - Cloudflare → Your VPS (needs setup)

#### On Your VPS:

You still need SSL on your VPS. Use Let's Encrypt:

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificates
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Certbot will automatically configure Nginx
```

### Option 2: Cloudflare Origin Certificate

Use Cloudflare's free origin certificate (valid for 15 years):

#### Generate Origin Certificate:

1. In Cloudflare: **SSL/TLS** → **Origin Server**
2. Click "Create Certificate"
3. Select:
   - Private key type: RSA (2048)
   - Hostnames: `yourdomain.com`, `*.yourdomain.com`
   - Certificate validity: 15 years
4. Click "Create"
5. Copy both the certificate and private key

#### Install on Your VPS:

```bash
# Create directory for certificates
mkdir -p /etc/ssl/cloudflare

# Save certificate
nano /etc/ssl/cloudflare/cert.pem
# Paste the certificate, save and exit

# Save private key
nano /etc/ssl/cloudflare/key.pem
# Paste the private key, save and exit

# Set permissions
chmod 600 /etc/ssl/cloudflare/key.pem
chmod 644 /etc/ssl/cloudflare/cert.pem
```

#### Update Nginx Configuration:

```bash
nano /etc/nginx/sites-available/openvape-commerce
```

Update SSL certificate paths:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # Use Cloudflare Origin Certificate
    ssl_certificate /etc/ssl/cloudflare/cert.pem;
    ssl_certificate_key /etc/ssl/cloudflare/key.pem;

    # Rest of configuration...
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # Use Cloudflare Origin Certificate
    ssl_certificate /etc/ssl/cloudflare/cert.pem;
    ssl_certificate_key /etc/ssl/cloudflare/key.pem;

    # Rest of configuration...
}
```

Restart Nginx:

```bash
nginx -t
systemctl restart nginx
```

## Cloudflare Settings Optimization

### SSL/TLS Settings

1. **SSL/TLS** → **Overview**
   - Encryption mode: **Full (strict)**

2. **SSL/TLS** → **Edge Certificates**
   - Always Use HTTPS: **On**
   - Minimum TLS Version: **TLS 1.2**
   - Opportunistic Encryption: **On**
   - TLS 1.3: **On**
   - Automatic HTTPS Rewrites: **On**

### Speed Settings

1. **Speed** → **Optimization**
   - Auto Minify: Enable **JavaScript, CSS, HTML**
   - Brotli: **On**
   - Early Hints: **On**

2. **Caching** → **Configuration**
   - Caching Level: **Standard**
   - Browser Cache TTL: **4 hours** (or longer)

### Security Settings

1. **Security** → **Settings**
   - Security Level: **Medium** (adjust if needed)
   - Challenge Passage: **30 minutes**
   - Browser Integrity Check: **On**

2. **Firewall** → **Settings**
   - Security Level: **Medium**

### Page Rules (Optional but Recommended)

Create page rules for better caching:

1. Go to **Rules** → **Page Rules**
2. Create rules:

#### Rule 1: Cache Static Assets
```
URL: *yourdomain.com/*.{jpg,jpeg,png,gif,css,js,woff,woff2,ttf,svg,ico}
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Browser Cache TTL: 1 month
```

#### Rule 2: Cache API Health Check
```
URL: api.yourdomain.com/api/health
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 5 minutes
```

#### Rule 3: Bypass Cache for API
```
URL: api.yourdomain.com/api/*
Settings:
- Cache Level: Bypass
```

## Firewall Rules

Protect your site with custom firewall rules:

### Block Bad Bots

1. Go to **Security** → **WAF** → **Custom rules**
2. Create rule:

```
Rule name: Block Bad Bots
Expression: (cf.client.bot) and not (cf.verified_bot_category in {"Search Engine Crawler"})
Action: Block
```

### Rate Limiting

1. Go to **Security** → **WAF** → **Rate limiting rules**
2. Create rule:

```
Rule name: API Rate Limit
If incoming requests match:
  - Hostname equals api.yourdomain.com
  - URI Path starts with /api/
When rate exceeds:
  - 100 requests per 1 minute
Then:
  - Block for 1 hour
```

## DNS Configuration for Email

If you're using email with your domain:

```
Type    Name    Content                         Proxy Status
MX      @       mail.yourdomain.com             DNS only (Gray)
A       mail    YOUR_MAIL_SERVER_IP             DNS only (Gray)
TXT     @       "v=spf1 include:_spf.google.com ~all"  DNS only
```

**Note**: Email records should NOT be proxied (gray cloud).

## Monitoring and Analytics

### View Analytics

1. Go to **Analytics & Logs** → **Traffic**
2. Monitor:
   - Requests
   - Bandwidth
   - Threats blocked
   - Status codes

### Set Up Alerts

1. Go to **Notifications**
2. Enable alerts for:
   - DDoS attacks
   - SSL certificate expiration
   - High error rates

## Troubleshooting

### Site Not Loading After Cloudflare Setup

1. **Check DNS Propagation**
   ```bash
   dig yourdomain.com
   nslookup yourdomain.com
   ```

2. **Verify Nameservers**
   - Make sure nameservers are updated at your registrar
   - Wait for propagation (can take up to 24 hours)

3. **Check SSL Mode**
   - Ensure SSL/TLS mode is set to "Full (strict)"
   - Verify SSL certificate is installed on your VPS

### Redirect Loop (Too Many Redirects)

This happens when SSL/TLS mode is incorrect:

**Solution**:
1. In Cloudflare: Set SSL/TLS mode to **"Full (strict)"**
2. Ensure your VPS has a valid SSL certificate
3. Clear browser cache

### API Not Working

If your API returns errors:

1. **Check Proxy Status**
   - API subdomain should be proxied (orange cloud)

2. **Verify Nginx Configuration**
   ```bash
   nginx -t
   systemctl status nginx
   ```

3. **Check Firewall Rules**
   - Make sure you're not blocking legitimate API requests

### Slow Performance

1. **Enable Caching**
   - Set up page rules for static assets
   - Use "Cache Everything" for appropriate content

2. **Enable Argo Smart Routing** (Paid)
   - Speeds up dynamic content
   - $5/month + $0.10/GB

3. **Check Origin Server**
   - Verify your VPS isn't overloaded
   - Check `htop` and `pm2 status`

## Advanced Features (Optional)

### Cloudflare Workers

Use Workers for edge computing:

```javascript
// Example: Add security headers
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const newHeaders = new Headers(response.headers)
  
  newHeaders.set('X-Frame-Options', 'SAMEORIGIN')
  newHeaders.set('X-Content-Type-Options', 'nosniff')
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}
```

### Cloudflare Access (Zero Trust)

Protect your admin panel:

1. Go to **Zero Trust** → **Access** → **Applications**
2. Create application for admin routes
3. Set authentication rules

### Load Balancing (Paid)

For high availability:

1. Set up multiple VPS instances
2. Configure Cloudflare Load Balancer
3. Automatic failover if one server goes down

## Cost Breakdown

### Free Plan (Recommended for Starting)
- **Cost**: $0/month
- **Includes**:
  - Unlimited DDoS protection
  - Global CDN
  - Free SSL certificates
  - Basic analytics
  - Firewall rules
  - Page rules (3 rules)

### Pro Plan (Optional)
- **Cost**: $20/month
- **Additional Features**:
  - Advanced DDoS protection
  - Image optimization
  - Mobile optimization
  - 20 page rules
  - Priority support

### Business Plan (For High Traffic)
- **Cost**: $200/month
- **Additional Features**:
  - Advanced security
  - Custom SSL certificates
  - 50 page rules
  - 24/7 support

**Recommendation**: Start with the **Free plan**. It's more than enough for most stores.

## Deployment with Cloudflare

### Modified Deployment Process

When deploying with Cloudflare:

1. **Set up VPS and domain** (point to Cloudflare nameservers)
2. **Wait for DNS propagation**
3. **Run deployment script**:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/HLPFLCG/openvape-commerce/main/deploy.sh | sudo bash
   ```
4. **Configure Cloudflare settings** (as described above)
5. **Test your site**

### SSL Certificate Options

**Option A: Let's Encrypt (Easier)**
- Run deployment script as normal
- Certbot will handle SSL
- Set Cloudflare to "Full (strict)"

**Option B: Cloudflare Origin Certificate (Longer validity)**
- Generate origin certificate in Cloudflare
- Install on VPS (see instructions above)
- Set Cloudflare to "Full (strict)"

## Best Practices

1. **Always Use "Full (strict)" SSL Mode**
   - Never use "Flexible" mode
   - Ensures end-to-end encryption

2. **Enable HTTPS Everywhere**
   - Force all traffic to HTTPS
   - Better security and SEO

3. **Use Page Rules Wisely**
   - Cache static assets aggressively
   - Bypass cache for dynamic content

4. **Monitor Analytics**
   - Check for unusual traffic patterns
   - Review blocked threats

5. **Keep VPS Secure**
   - Cloudflare protects the edge
   - Still need to secure your VPS

6. **Regular Updates**
   - Keep Cloudflare settings optimized
   - Update VPS software regularly

## Conclusion

Cloudflare is an excellent choice for OpenVape Commerce:

- ✅ Free DDoS protection
- ✅ Global CDN for faster loading
- ✅ Free SSL certificates
- ✅ Easy to set up
- ✅ Reduces server load
- ✅ Improves security

Combined with your VPS, you get enterprise-level protection and performance at minimal cost!

## Support

For Cloudflare-specific issues:
- [Cloudflare Community](https://community.cloudflare.com/)
- [Cloudflare Documentation](https://developers.cloudflare.com/)
- [Cloudflare Support](https://support.cloudflare.com/)

For OpenVape Commerce issues:
- [GitHub Issues](https://github.com/HLPFLCG/openvape-commerce/issues)
- [Documentation](https://github.com/HLPFLCG/openvape-commerce/docs)