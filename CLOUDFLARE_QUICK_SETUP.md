# ☁️ Cloudflare Quick Setup (5 Minutes)

Use Cloudflare for free DDoS protection, CDN, and SSL with your OpenVape Commerce store.

## Why Cloudflare?

- ✅ **Free DDoS Protection** - Automatic protection against attacks
- ✅ **Global CDN** - Faster loading worldwide
- ✅ **Free SSL** - Alternative to Let's Encrypt
- ✅ **Caching** - Reduced server load
- ✅ **Analytics** - Traffic insights
- ✅ **Firewall** - Block malicious traffic

**Cost**: $0/month (Free plan is perfect for most stores)

## Quick Setup (5 Steps)

### Step 1: Sign Up (1 minute)

1. Go to [Cloudflare.com](https://cloudflare.com)
2. Create a free account
3. Verify your email

### Step 2: Add Your Domain (1 minute)

1. Click "Add a Site"
2. Enter your domain: `yourdomain.com`
3. Select **Free** plan
4. Click "Continue"

### Step 3: Configure DNS (2 minutes)

Add these DNS records:

```
Type    Name    Content         Proxy Status
A       @       YOUR_VPS_IP     Proxied (🟠 Orange Cloud)
A       www     YOUR_VPS_IP     Proxied (🟠 Orange Cloud)
A       api     YOUR_VPS_IP     Proxied (🟠 Orange Cloud)
```

**Important**: Click the orange cloud to enable proxy!

### Step 4: Update Nameservers (1 minute)

1. Cloudflare shows you 2 nameservers:
   ```
   nameserver1.cloudflare.com
   nameserver2.cloudflare.com
   ```

2. Go to your domain registrar (where you bought the domain)
3. Update nameservers to Cloudflare's nameservers
4. Save changes

### Step 5: Configure SSL (30 seconds)

1. In Cloudflare: **SSL/TLS** → **Overview**
2. Select **"Full (strict)"**
3. Done!

## Deploy Your Store

Now deploy as normal:

```bash
# SSH into your VPS
ssh root@your-server-ip

# Run deployment script
curl -fsSL https://raw.githubusercontent.com/HLPFLCG/openvape-commerce/main/deploy.sh | sudo bash
```

The deployment script will:
- Install SSL certificate on your VPS
- Configure Nginx
- Start your store

Cloudflare will automatically:
- Protect against DDoS
- Cache static content
- Provide SSL encryption
- Speed up your site globally

## Recommended Settings

### Enable These Features:

1. **SSL/TLS** → **Edge Certificates**
   - Always Use HTTPS: **On**
   - Automatic HTTPS Rewrites: **On**

2. **Speed** → **Optimization**
   - Auto Minify: Enable **JavaScript, CSS, HTML**
   - Brotli: **On**

3. **Security** → **Settings**
   - Security Level: **Medium**

## Verify It's Working

1. Visit your site: `https://yourdomain.com`
2. Check for:
   - ✅ Green padlock (SSL working)
   - ✅ Fast loading
   - ✅ No errors

3. Check Cloudflare dashboard:
   - ✅ Status shows "Active"
   - ✅ Traffic appears in analytics

## Troubleshooting

### Site Not Loading?

**Check DNS Propagation:**
```bash
dig yourdomain.com
```

**Wait**: DNS can take 5-30 minutes (sometimes up to 24 hours)

### Redirect Loop?

**Fix**: Set SSL/TLS mode to **"Full (strict)"** in Cloudflare

### API Not Working?

**Check**: Make sure API subdomain is proxied (orange cloud)

## Cost Comparison

### With Cloudflare (Recommended)
- **VPS**: $6-12/month
- **Cloudflare**: $0/month (Free plan)
- **Total**: $6-12/month

### Without Cloudflare
- **VPS**: $6-12/month
- **CDN**: $20-50/month (if you want one)
- **DDoS Protection**: $100+/month
- **Total**: $126-162/month

**Savings with Cloudflare**: $120-150/month!

## Advanced Features (Optional)

### Page Rules (Free: 3 rules)

Cache static assets:
```
URL: *yourdomain.com/*.{jpg,jpeg,png,gif,css,js}
Settings: Cache Everything, Edge Cache TTL: 1 month
```

### Firewall Rules

Block bad bots:
```
Expression: (cf.client.bot) and not (cf.verified_bot_category in {"Search Engine Crawler"})
Action: Block
```

### Rate Limiting

Protect API:
```
If: Hostname equals api.yourdomain.com
When rate exceeds: 100 requests per 1 minute
Then: Block for 1 hour
```

## Full Documentation

For detailed setup and advanced features:
- [docs/cloudflare-setup.md](docs/cloudflare-setup.md) - Complete guide

## Support

- **Cloudflare**: [community.cloudflare.com](https://community.cloudflare.com/)
- **OpenVape Commerce**: [GitHub Issues](https://github.com/HLPFLCG/openvape-commerce/issues)

---

**Ready to deploy with Cloudflare?** Follow the 5 steps above and you're protected! 🛡️