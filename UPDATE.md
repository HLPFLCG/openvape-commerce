# Update Guide

How to update your OpenVape Commerce installation to the latest version.

## Before Updating

### 1. Backup Your Data

**Always backup before updating!**

```bash
# Backup database
sudo -u postgres pg_dump openvape_commerce > backup_$(date +%Y%m%d).sql

# Backup application files
cd /var/www
tar -czf openvape-backup-$(date +%Y%m%d).tar.gz openvape-commerce/

# Backup environment files
cp openvape-commerce/backend/.env openvape-commerce/backend/.env.backup
cp openvape-commerce/frontend/.env.local openvape-commerce/frontend/.env.local.backup
```

### 2. Check for Breaking Changes

Review the [CHANGELOG](CHANGELOG.md) for any breaking changes or migration notes.

## Update Process

### Automatic Update (Recommended)

```bash
cd /var/www/openvape-commerce

# Pull latest changes
git pull origin main

# Update backend
cd backend
npm ci --only=production
npx prisma generate
npx prisma migrate deploy
pm2 restart openvape-backend

# Update frontend
cd ../frontend
npm ci
npm run build
pm2 restart openvape-frontend

# Verify everything is working
pm2 logs
```

### Manual Update

If you've made custom changes to the code:

```bash
cd /var/www/openvape-commerce

# Stash your changes
git stash

# Pull latest changes
git pull origin main

# Reapply your changes
git stash pop

# Resolve any conflicts
# Then follow the automatic update steps above
```

## Update Specific Components

### Backend Only

```bash
cd /var/www/openvape-commerce/backend
git pull origin main
npm ci --only=production
npx prisma migrate deploy
pm2 restart openvape-backend
```

### Frontend Only

```bash
cd /var/www/openvape-commerce/frontend
git pull origin main
npm ci
npm run build
pm2 restart openvape-frontend
```

### Database Schema Only

```bash
cd /var/www/openvape-commerce/backend
npx prisma migrate deploy
pm2 restart openvape-backend
```

## Rollback

If something goes wrong, you can rollback:

### Rollback Application

```bash
cd /var/www/openvape-commerce

# Find the commit you want to rollback to
git log --oneline

# Rollback to specific commit
git reset --hard <commit-hash>

# Rebuild and restart
cd backend && npm ci --only=production && pm2 restart openvape-backend
cd ../frontend && npm ci && npm run build && pm2 restart openvape-frontend
```

### Rollback Database

```bash
# Restore from backup
sudo -u postgres psql openvape_commerce < backup_YYYYMMDD.sql

# Restart backend
pm2 restart openvape-backend
```

## Post-Update Checklist

- [ ] Application is running (check `pm2 status`)
- [ ] No errors in logs (check `pm2 logs`)
- [ ] Frontend loads correctly
- [ ] API health check passes
- [ ] Login/authentication works
- [ ] Payment processing works (test mode)
- [ ] Email notifications work
- [ ] All critical features tested

## Troubleshooting

### Dependencies Issues

```bash
# Clear node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### Database Migration Issues

```bash
# Check migration status
cd backend
npx prisma migrate status

# Reset database (WARNING: This will delete all data!)
npx prisma migrate reset

# Or manually fix migrations
npx prisma migrate resolve --applied <migration-name>
```

### PM2 Issues

```bash
# Restart all processes
pm2 restart all

# Delete and recreate processes
pm2 delete all
cd /var/www/openvape-commerce/backend
pm2 start src/index.js --name openvape-backend
cd ../frontend
pm2 start npm --name openvape-frontend -- start
pm2 save
```

## Keeping Up to Date

### Watch for Updates

- Star the repository on GitHub
- Watch for releases
- Join the Discord community
- Subscribe to the mailing list

### Automated Updates (Optional)

Create a cron job for automatic updates:

```bash
# Create update script
cat > /usr/local/bin/update-openvape.sh << 'EOF'
#!/bin/bash
cd /var/www/openvape-commerce
git pull origin main
cd backend && npm ci --only=production && npx prisma migrate deploy
cd ../frontend && npm ci && npm run build
pm2 restart all
EOF

chmod +x /usr/local/bin/update-openvape.sh

# Add to crontab (weekly on Sunday at 3 AM)
(crontab -l 2>/dev/null; echo "0 3 * * 0 /usr/local/bin/update-openvape.sh") | crontab -
```

**Note**: Automatic updates are not recommended for production without testing first.

## Version Management

### Check Current Version

```bash
cd /var/www/openvape-commerce
git describe --tags
# or
git log -1 --oneline
```

### Update to Specific Version

```bash
cd /var/www/openvape-commerce

# List available versions
git tag

# Checkout specific version
git checkout v1.2.0

# Follow update process
cd backend && npm ci --only=production && npx prisma migrate deploy
cd ../frontend && npm ci && npm run build
pm2 restart all
```

## Support

Need help with updates?

- [GitHub Issues](https://github.com/HLPFLCG/openvape-commerce/issues)
- [Discord Community](https://discord.gg/openvape)
- [Documentation](https://github.com/HLPFLCG/openvape-commerce/docs)