# 🚀 PLATFORM-SPECIFIC DEPLOYMENT GUIDES

## Quick Platform Selector

**Choose your deployment platform:**

1. [Heroku](#heroku-deployment) - Easiest, perfect for small projects
2. [AWS EC2](#aws-ec2-deployment) - Most control, scalable
3. [Azure](#azure-deployment) - Enterprise solutions
4. [VPS (Linode, Vultr)](#vps-deployment) - Full control, affordable

---

## HEROKU DEPLOYMENT

**Best for:** Getting started quickly, small-medium traffic

### Prerequisites
```bash
# Install Heroku CLI
# From: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login
```

### Step-by-Step

```bash
# 1. Create Heroku app
heroku create your-app-name
# Example: heroku create the-henry-api

# 2. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
heroku config:set JWT_SECRET=your-random-secret-here
heroku config:set ADMIN_USERNAME=admin
heroku config:set HASHED_ADMIN_PASSWORD=your-bcrypt-hash
heroku config:set EMAIL_SERVICE=gmail
heroku config:set EMAIL_USER=your@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password

# 3. Add Redis (Heroku Redis)
heroku addons:create heroku-redis:premium-0
# Or free tier: premium-0 (limited)

# 4. Deploy
git push heroku main

# 5. View logs
heroku logs --tail

# 6. Monitor
heroku ps
heroku metrics
```

### Procfile (Required)
Create `Procfile` in project root:
```
web: cd server && npm start
```

### buildpacks (If needed)
```bash
heroku buildpacks:set heroku/nodejs
```

### Costs
- Dyno: $7-50/month (free tier discontinued)
- Redis: $15+/month
- **Total: $25+/month**

### Pros
- ✅ Automatic SSL
- ✅ Easy deployments (git push)
- ✅ Built-in monitoring
- ✅ Managed Redis

### Cons
- ❌ More expensive than competitors
- ❌ Limited customization
- ❌ Dyno sleeps after 30min (paid only)

---

## AWS EC2 DEPLOYMENT

**Best for:** Full control, enterprise-grade, complex setups

### Prerequisites
- AWS account
- EC2 instance (Ubuntu 20.04 LTS recommended)
- Domain name pointing to instance IP

### Step-by-Step

```bash
# 1. SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 2. Update system
sudo apt update && sudo apt upgrade -y

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install Redis
sudo apt-get install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# 5. Install Nginx
sudo apt-get install -y nginx

# 6. Clone repository
cd /home/ubuntu
git clone https://github.com/your-repo.git
cd the-henry-website

# 7. Install dependencies
cd server
npm install --production

# 8. Create .env file
nano .env
# Paste your environment variables

# 9. Install PM2
sudo npm install -g pm2

# 10. Start application
pm2 start server.js --name "the-henry"
pm2 startup
pm2 save

# 11. Configure Nginx as reverse proxy
sudo nano /etc/nginx/sites-available/default
# Add this content:
```

### Nginx Configuration
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 12. Enable Nginx
sudo systemctl restart nginx

# 13. Install SSL with Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 14. Enable auto-renewal
sudo systemctl enable certbot.timer

# 15. Monitor
pm2 monit
pm2 logs
```

### Security Groups (AWS Console)
Allow inbound traffic:
- Port 22 (SSH) - from your IP only
- Port 80 (HTTP) - from anywhere
- Port 443 (HTTPS) - from anywhere
- Port 3000 - from localhost only (Nginx will proxy)

### Costs
- EC2: $5-20/month (t3.micro free for 12 months)
- EBS Storage: $1-5/month
- **Total: $5-25/month**

### Pros
- ✅ Full control
- ✅ Scalable
- ✅ Affordable
- ✅ Industry standard

### Cons
- ❌ More setup required
- ❌ Manual SSL/security
- ❌ Manual updates & maintenance

---

## AZURE DEPLOYMENT

**Best for:** Enterprise, Microsoft stack integration

### Prerequisites
- Azure account
- Azure CLI installed

### Step-by-Step

```bash
# 1. Login to Azure
az login

# 2. Create resource group
az group create --name the-henry-rg --location eastus

# 3. Create App Service Plan
az appservice plan create \
  --name the-henry-plan \
  --resource-group the-henry-rg \
  --sku B1 \
  --is-linux

# 4. Create Web App
az webapp create \
  --resource-group the-henry-rg \
  --plan the-henry-plan \
  --name the-henry-api \
  --runtime "NODE|18"

# 5. Configure Git deployment
az webapp deployment user set \
  --user-name your-git-username \
  --password your-git-password

# 6. Add .env variables
az webapp config appsettings set \
  --resource-group the-henry-rg \
  --name the-henry-api \
  --settings NODE_ENV=production JWT_SECRET=your-secret

# 7. Add Redis
az redis create \
  --resource-group the-henry-rg \
  --name the-henry-redis \
  --location eastus

# 8. Deploy from Git
# - In App Service: Deployment Center
# - Choose GitHub
# - Connect repository
# - Deploy

# 9. View logs
az webapp log tail \
  --resource-group the-henry-rg \
  --name the-henry-api
```

### Costs
- App Service: $13/month (B1)
- Azure Cache for Redis: $15+/month
- **Total: $30+/month**

---

## VPS DEPLOYMENT (Linode, Vultr, etc.)

**Best for:** Full control at lowest cost

### Prerequisites
- VPS account
- SSH key setup

### Step-by-Step

```bash
# 1. SSH into VPS
ssh root@your-vps-ip

# 2. Create non-root user
adduser deploy
usermod -aG sudo deploy
su - deploy

# 3. Install Node.js (as deploy user)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install Redis
sudo apt-get install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# 5. Install Nginx
sudo apt-get install -y nginx

# 6. Clone repository
cd /home/deploy
git clone https://github.com/your-repo.git
cd the-henry-website

# 7. Install dependencies
cd server
npm install --production

# 8. Create .env file
nano .env
# Paste your environment variables

# 9. Install PM2
sudo npm install -g pm2

# 10. Start with PM2
pm2 start server.js --name "the-henry"
sudo pm2 startup
pm2 save

# 11. Configure Nginx
sudo nano /etc/nginx/sites-available/default
# Add the proxy configuration from AWS section

sudo systemctl restart nginx

# 12. Install SSL
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# 13. Auto-renewal
sudo systemctl enable certbot.timer
```

### Costs
- VPS: $3-10/month (Vultr, Linode, Hetzner)
- Domain: $12/year
- **Total: $5-15/month**

### Pros
- ✅ Cheapest option
- ✅ Full control
- ✅ No restrictions

### Cons
- ❌ Most setup required
- ❌ You manage everything
- ❌ No managed services

---

## COMPARISON MATRIX

| Feature | Heroku | AWS | Azure | VPS |
|---------|--------|-----|-------|-----|
| Ease | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Cost | $25+ | $5-20 | $30+ | $5-15 |
| Scalability | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Control | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Support | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Setup Time | 15 min | 1-2 hrs | 1 hr | 1-2 hrs |

---

## RECOMMENDATION

**For This Project:**

1. **Just Starting?** → **Heroku** (easiest, all-in-one)
2. **Need Maximum Scale?** → **AWS** (most enterprise-ready)
3. **On Ultra-Budget?** → **Vultr/Linode VPS** (cheapest option)

---

## POST-DEPLOYMENT TESTING

Regardless of platform:

```bash
# 1. Test health endpoint
curl https://your-domain.com/api/health

# 2. Test login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_PASSWORD"}'

# 3. Check SSL
curl -v https://your-domain.com/api/health 2>&1 | grep SSL

# 4. Check response headers
curl -i https://your-domain.com/api/health | grep -i "x-content"

# 5. Test CAPTCHA
curl -X POST https://your-domain.com/api/captcha/generate
```

---

**Status**: Ready for production deployment
