# Deployment Checklist

## Pre-Launch Verification

### ✅ Local Testing (Before Going Live)

#### Setup
- [ ] Backend installed: `cd server && npm install`
- [ ] `.env` file created from `.env.example`
- [ ] Email credentials configured and tested
- [ ] Server starts without errors: `npm run dev`

#### Forms Testing
- [ ] Contact form validates required fields
- [ ] Contact form rejects invalid emails
- [ ] Contact form saves to database
- [ ] Contact form sends admin notification email
- [ ] Contact form sends user confirmation email
- [ ] Newsletter form subscribes email
- [ ] Newsletter form sends confirmation email
- [ ] Newsletter unsubscribe endpoint works

#### Database
- [ ] Database file created at `server/data/contacts.db`
- [ ] Database contains tables: contacts, newsletter_subscriptions
- [ ] Sample contact saved and retrievable
- [ ] Sample newsletter subscriber saved

#### Frontend
- [ ] Contact form visible on website
- [ ] Newsletter form visible on website
- [ ] Forms show success notifications
- [ ] Forms show error notifications when needed
- [ ] Form validation works on client side

#### API
- [ ] `/api/health` returns 200 status
- [ ] `/api/contact` accepts POST requests
- [ ] `/api/newsletter/subscribe` accepts POST requests
- [ ] Error responses are properly formatted

---

## Deployment to Production

### Choose Platform

Select one of these options:

- [ ] **Render.com** (Recommended for beginners)
  - See: BACKEND_SETUP.md → Production Deployment → Render

- [ ] **Railway.app** (Modern alternative)
  - See: https://railway.app/docs

- [ ] **Heroku** (Classic choice, credit card required)
  - See: https://devcenter.heroku.com/

- [ ] **AWS/DigitalOcean** (More control, more setup)
  - See: Their respective documentation

- [ ] **Self-hosted VPS** (Full control)
  - See: Your server provider's documentation

### Pre-Deployment Steps

- [ ] Update contact information in admin-login.html
- [ ] Replace all placeholder phone numbers
- [ ] Replace all placeholder email addresses
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Generate new secure admin password
- [ ] Set strong email credentials
- [ ] Review all email templates
- [ ] Test forms one more time locally
- [ ] Backup database before deployment
- [ ] Create `.gitignore` entry for `.env` (data security!)

### Render Deployment (Step-by-Step)

1. **Create Render Account**
   - [ ] Go to render.com
   - [ ] Sign up with GitHub

2. **Connect Repository**
   - [ ] Click "New +"
   - [ ] Select "Web Service"
   - [ ] Connect GitHub repository
   - [ ] Select your repository

3. **Configure Service**
   - [ ] Name: "the-henry-llc-backend" (or similar)
   - [ ] Environment: "Node"
   - [ ] Build Command: `cd server && npm install`
   - [ ] Start Command: `cd server && npm start`
   - [ ] Instance Type: Free tier (or Starter)

4. **Set Environment Variables**
   - [ ] Click "Environment"
   - [ ] Add all from `.env`:
     - PORT=3000
     - NODE_ENV=production
     - EMAIL_SERVICE=gmail
     - EMAIL_USER=(your email)
     - EMAIL_PASSWORD=(your app password)
     - EMAIL_FROM=noreply@thehenryllc.com
     - ADMIN_EMAIL=(your email)
     - DATABASE_URL=/var/data/contacts.db

5. **Deploy**
   - [ ] Click "Create Web Service"
   - [ ] Wait for build to complete (5-10 minutes)
   - [ ] Verify "Live" status

6. **Update Frontend**
   - [ ] Get your deployed URL (e.g., https://the-henry-backend.render.com)
   - [ ] Update `scripts/main.js` API_URL for production
   - [ ] Test forms with production server

### Post-Deployment

- [ ] Verify backend is running: `https://your-backend.com/api/health`
- [ ] Test contact form end-to-end
- [ ] Test newsletter form end-to-end
- [ ] Check admin email for test submissions
- [ ] Check user email for confirmations
- [ ] Monitor first 24 hours for errors
- [ ] Set up error monitoring (optional)
- [ ] Set up automated backups (if available)

---

## Post-Launch Monitoring

### Daily
- [ ] Check for error notifications
- [ ] Review new contact submissions
- [ ] Verify emails are being sent/received
- [ ] Monitor server uptime

### Weekly
- [ ] Review analytics (if set up)
- [ ] Check database size
- [ ] Review subscriber list growth
- [ ] Test forms manually

### Monthly
- [ ] Backup database
- [ ] Review email delivery stats
- [ ] Check for spam submissions
- [ ] Update security headers if needed

---

## Maintenance Tasks

### Regular Maintenance
- [ ] Update npm dependencies: `npm update`
- [ ] Review security advisories: `npm audit`
- [ ] Clean up old database entries (quarterly)
- [ ] Monitor storage usage

### Backup Strategy
- [ ] Database backups daily
- [ ] Configuration backups monthly
- [ ] Test restore procedures quarterly
- [ ] Store backups securely

### Monitoring & Logging
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Enable server monitoring (if available)
- [ ] Create email alerts for failures
- [ ] Monitor response times

---

## Performance Optimization

### Before Production
- [ ] Test load performance
- [ ] Optimize database queries
- [ ] Enable caching if needed
- [ ] Minimize response times

### Scaling Considerations
- [ ] Plan for growth in database size
- [ ] Consider database migration path
- [ ] Plan for increased email volume
- [ ] Monitor resource usage

---

## Security Checklist

### Application Security
- [ ] Never commit `.env` file to git
- [ ] Use environment variables for secrets
- [ ] Input validation on all forms
- [ ] Output encoding to prevent XSS
- [ ] CORS properly configured
- [ ] Helmet.js enabled

### Data Security
- [ ] Database encryption at rest (if available)
- [ ] HTTPS/SSL enforced
- [ ] Regular backups
- [ ] Access controls implemented
- [ ] Password hashing for admin accounts
- [ ] SQL injection prevention (using parameterized queries)

### Email Security
- [ ] Use app-specific passwords (not regular password)
- [ ] Enable 2FA on email account
- [ ] Monitor for unauthorized access
- [ ] Regular password rotation
- [ ] Review email forwarding rules

### Server Security
- [ ] Keep Node.js updated
- [ ] Keep npm packages updated
- [ ] Run security audits: `npm audit`
- [ ] Monitor for vulnerabilities
- [ ] Use strong hosting provider

---

## Troubleshooting Production Issues

### Backend Not Starting
- [ ] Check environment variables
- [ ] Verify Node.js version
- [ ] Check database path
- [ ] Review build logs
- [ ] Check memory/storage limits

### Emails Not Sending
- [ ] Verify email credentials
- [ ] Check email service status
- [ ] Review email logs
- [ ] Test with different provider
- [ ] Check firewall/port settings

### Forms Not Working
- [ ] Check CORS settings
- [ ] Verify API endpoint URLs
- [ ] Test API health check
- [ ] Review browser console errors
- [ ] Check server logs

### Database Issues
- [ ] Verify database path
- [ ] Check storage space
- [ ] Review database backups
- [ ] Test database connections
- [ ] Restore from backup if needed

### Performance Issues
- [ ] Check response times
- [ ] Review database queries
- [ ] Monitor server resources
- [ ] Check for database bloat
- [ ] Optimize slow endpoints

---

## Rollback Procedure

If something goes wrong in production:

1. [ ] Stop accepting new requests (if possible)
2. [ ] Identify the issue
3. [ ] Roll back to previous version (git revert)
4. [ ] Test in staging environment
5. [ ] Redeploy to production
6. [ ] Verify functionality
7. [ ] Notify users if needed

---

## Documentation

### Maintain Updated Documentation
- [ ] Update API documentation
- [ ] Document any custom changes
- [ ] Create troubleshooting guide
- [ ] Document deployment process
- [ ] Keep credentials secure
- [ ] Create runbooks for common tasks

---

## Timeline

**Week 1: Setup & Testing**
- [ ] Backend development complete
- [ ] Local testing passes
- [ ] Documentation complete
- [ ] Email configured

**Week 2: Preparation**
- [ ] Production environment selected
- [ ] Staging deployment tested
- [ ] Final security review
- [ ] Team training

**Week 3: Deployment**
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] User communication
- [ ] Performance verification

**Week 4: Monitoring**
- [ ] Daily monitoring
- [ ] Issue tracking
- [ ] User feedback collection
- [ ] Optimization

---

## Contact & Support

### For Issues
1. Check server logs
2. Review error messages
3. Check documentation
4. Test with simple endpoint
5. Contact hosting provider if needed

### Resources
- Backend Documentation: `server/README.md`
- Email Setup Guide: `EMAIL_SETUP.md`
- Architecture Overview: `ARCHITECTURE.md`
- Deployment Guide: `BACKEND_SETUP.md`
- Quick Start: `QUICK_START.md`

---

## Sign-Off

- [ ] **Developer**: _________________ Date: _______
- [ ] **QA**: _________________ Date: _______
- [ ] **Project Manager**: _________________ Date: _______

---

**Deployment Date**: _________________
**Production URL**: _________________
**Emergency Contact**: _________________
