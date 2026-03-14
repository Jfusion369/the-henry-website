# 🚀 DEPLOYMENT GUIDE

## Quick Deployment Checklist

- [ ] Review environment variables
- [ ] Test all endpoints locally
- [ ] Backup database
- [ ] Set NODE_ENV=production
- [ ] Update credentials
- [ ] Deploy to server
- [ ] Test in production
- [ ] Monitor for errors

---

## Pre-Deployment Testing

### 1. Start server locally
```bash
cd c:\projects\the-henry-website\server
node server.js
```

### 2. Run verification
```bash
node verify-server.js
```

### 3. Test each endpoint
```bash
# Health
curl http://localhost:3000/api/health

# CAPTCHA
curl -X POST http://localhost:3000/api/captcha/generate

# Contact
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"test","captchaId":"x","captchaAnswer":"1"}'

# Newsletter
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","captchaId":"x","captchaAnswer":"1"}'
```

---

## Environment Variables for Production

Create `.env` file with these values:

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Admin Credentials (UPDATE THESE)
ADMIN_USERNAME=your_admin_username
HASHED_ADMIN_PASSWORD=your_bcrypt_hash
JWT_SECRET=your_random_secret_key_32_chars_min

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_google_app_password
GMAIL_SENDER_NAME=The Henry

# Database Location
DATABASE_URL=./data/contacts.db

# CAPTCHA Settings
CAPTCHA_EXPIRY=600
MAX_CAPTCHA_REQUESTS_PER_IP=10
MAX_NEWSLETTER_REQUESTS_PER_IP=5
MAX_SUBMISSIONS_PER_IP=5
RATE_LIMIT_WINDOW=3600

# Redis (if available)
REDIS_HOST=your.redis.host
REDIS_PORT=6379
```

### Important: Email Setup

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Copy the 16-character password
4. Paste into `EMAIL_PASSWORD` in `.env`
5. **Do NOT use your regular Gmail password**

### Important: Generate Admin Password

```bash
cd c:\projects\the-henry-website\server
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password-here', 10));"
```

Copy the output hash and paste into `HASHED_ADMIN_PASSWORD`.

### Important: Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
```

Copy the output and paste into `JWT_SECRET`.

---

## Deployment Options

### Option 1: Heroku Deployment

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set ADMIN_USERNAME=your_username
heroku config:set HASHED_ADMIN_PASSWORD=your_hash
heroku config:set JWT_SECRET=your_secret
heroku config:set EMAIL_USER=your_email@gmail.com
heroku config:set EMAIL_PASSWORD=your_app_password

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option 2: AWS EC2 Deployment

1. Launch Ubuntu EC2 instance
2. SSH into instance
3. Install Node.js and npm
4. Clone repository
5. Install dependencies: `npm install`
6. Create `.env` file with environment variables
7. Start server: `npm start`
8. Use PM2 for process management
9. Configure security groups for port 3000
10. Set up SSL certificate with Let's Encrypt

### Option 3: Traditional Server (VPS)

```bash
# SSH into server
ssh user@your-server.com

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/your/repo.git
cd your-repo

# Install dependencies
cd server
npm install

# Create .env file
nano .env
# Paste environment variables

# Install PM2 for process management
npm install -g pm2

# Start server
pm2 start server.js --name "the-henry-api"
pm2 startup
pm2 save

# Install Nginx for reverse proxy
sudo apt-get install -y nginx

# Configure Nginx (reverse proxy to port 3000)
# Then enable SSL with Let's Encrypt
```

---

## Post-Deployment Verification

After deployment:

1. **Test all endpoints**
```bash
curl https://your-domain.com/api/health
```

2. **Verify email is sending**
   - Submit test contact form
   - Check inbox for notification

3. **Check database**
   - Verify data is persisting
   - Check for errors in logs

4. **Monitor server**
   - Check uptime
   - Monitor response times
   - Watch for errors

---

## Security Best Practices

- ✅ Use HTTPS only (no plain HTTP)
- ✅ Set strong passwords
- ✅ Keep dependencies updated
- ✅ Enable rate limiting
- ✅ Monitor logs for attacks
- ✅ Regular backups
- ✅ Firewall configured
- ✅ Keep Node.js updated

---

## Monitoring in Production

### Check Server Status
```bash
curl https://your-domain.com/api/health
```

### View Logs
```bash
# If using PM2
pm2 logs "the-henry-api"

# If using systemd
journalctl -u the-henry -f
```

### Monitor Database
```bash
sqlite3 data/contacts.db "SELECT COUNT(*) FROM Contacts;"
```

### Response Time Monitoring
```bash
time curl https://your-domain.com/api/health
```

---

## Troubleshooting Deployment

### Server won't start
- Check `.env` file exists
- Verify environment variables
- Check logs for errors
- Ensure dependencies installed

### Port already in use
- Change PORT in `.env`
- Or kill process using port 3000

### Database errors
- Check database file permissions
- Verify database path correct
- Check disk space

### Email not working
- Verify credentials in `.env`
- Check email logs
- Test with manual SMTP connection

### High response times
- Check server resources
- Enable Redis for caching
- Optimize database queries
- Use CDN for static files

---

## Backup Strategy

### Database Backups
```bash
# Backup database
cp data/contacts.db data/contacts.db.backup

# Automated daily backup
0 2 * * * cp /app/data/contacts.db /app/backups/contacts.db.$(date +\%Y\%m\%d)
```

### Environment Backup
```bash
# Keep secure copy of .env
cp server/.env server/.env.backup
# Store in secure location (not git)
```

---

## Updating in Production

1. Test changes locally
2. Commit to git
3. Pull on production server
4. Run: `npm install` (if dependencies changed)
5. Restart server: `pm2 restart the-henry-api`
6. Verify endpoints working

---

## Performance Optimization

1. **Enable Redis** - For rate limiting and caching
2. **Use CDN** - For static files (images, CSS, JS)
3. **Compress responses** - Already enabled with gzip
4. **Cache headers** - Set on static assets
5. **Database indexing** - Add indexes for frequently queried fields
6. **Monitor performance** - Set up APM tools

---

## Scaling for Growth

As traffic increases:

1. **Horizontal Scaling**
   - Deploy multiple server instances
   - Load balance with Nginx/HAProxy
   - Use managed database

2. **Caching Layer**
   - Redis for session storage
   - Redis for rate limiting
   - Browser caching for static files

3. **Database Optimization**
   - Add indexes
   - Archive old data
   - Consider database replication

4. **Infrastructure**
   - CDN for global distribution
   - Load balancer
   - Separate API and database servers

---

## Disaster Recovery

### If database is lost
1. Restore from backup: `cp backup/contacts.db data/contacts.db`
2. Restart server
3. Verify data integrity

### If server crashes
1. PM2 auto-restart (if configured)
2. Or manual restart: `pm2 restart the-henry-api`
3. Check logs for error cause

### If compromised
1. Update all credentials
2. Review logs for suspicious activity
3. Rotate JWT secret
4. Change admin password
5. Update email credentials
6. Review code changes

---

## Support & Monitoring Services

Consider using these free/low-cost services:

- **Monitoring**: Uptime Robot, Pingdom
- **Error Tracking**: Sentry, Rollbar
- **Performance**: New Relic (free tier), Datadog
- **Logging**: ELK Stack, Splunk (free tier)
- **Backup**: AWS S3, Google Cloud Storage

---

## Final Checklist

- [ ] All environment variables set
- [ ] Credentials updated and secure
- [ ] Database initialized
- [ ] Email service tested
- [ ] HTTPS configured
- [ ] Domain configured
- [ ] SSL certificate valid
- [ ] Firewall rules configured
- [ ] Backups automated
- [ ] Monitoring enabled
- [ ] Error tracking set up
- [ ] Documentation accessible
- [ ] Team trained on deployment
- [ ] Rollback plan documented

---

**Status**: Ready to deploy! 🚀
