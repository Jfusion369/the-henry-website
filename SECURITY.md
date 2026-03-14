# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in The Henry Website, please email us at **security@thehenry.com** instead of using the public issue tracker.

**Please include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge your report within 24 hours and work to resolve critical issues within 7 days.

---

## Supported Versions

| Version | Supported | Status |
|---------|-----------|--------|
| 1.0.x   | ✅ Yes    | Current (Production) |
| 0.x.x   | ❌ No     | End of Life |

---

## Security Best Practices

### For Developers

1. **Environment Variables** - Never commit `.env` files
2. **Secrets** - Use strong, unique secrets for JWT_SECRET and admin passwords
3. **Dependencies** - Run `npm audit` regularly
4. **Code Review** - All security-related changes require review
5. **HTTPS** - Always use HTTPS in production

### For Installation

1. **Update Dependencies**
   ```bash
   npm install
   npm audit fix
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set Strong Secrets**
   ```bash
   # Generate JWT secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Enable HTTPS** (Production)
   - Use Let's Encrypt for free SSL
   - Follow [SECURITY_GUIDE.md](docs/SECURITY_GUIDE.md) for setup

### For Hosting

- Use managed databases when possible
- Enable Redis authentication
- Keep Node.js and dependencies updated
- Monitor logs for suspicious activity
- Set up rate limiting
- Use security headers (Helmet configured)

---

## Security Features Implemented

✅ **Authentication**
- JWT token-based authentication
- Secure password hashing with bcrypt
- Admin login protection

✅ **Authorization**
- Rate limiting on API endpoints
- CORS configuration
- Request validation

✅ **Data Protection**
- HTTPS/TLS support
- Security headers (CSP, X-Frame-Options, etc.)
- Input sanitization
- CAPTCHA protection on forms

✅ **Infrastructure**
- Environment variable management
- Secure database configuration
- Redis session management
- Error handling without info leakage

---

## Known Security Issues

None currently known. All identified issues have been remediated.

**See [docs/SECURITY_AUDIT_REPORT.md](docs/SECURITY_AUDIT_REPORT.md) for audit details.**

---

## Security Updates & Patches

We release security patches as needed. To stay updated:

1. **Watch the Repository** - Click "Watch" on GitHub
2. **Enable Notifications** - GitHub will notify of new releases
3. **Subscribe to Updates** - Email alerts for releases
4. **Check Regularly** - Review [CHANGELOG.md](CHANGELOG.md) for security fixes

### Notification Preference

- 🔴 Critical (immediate action required) - Email notification
- 🟠 High (within 48 hours) - GitHub notification
- 🟡 Medium (within 1 week) - Monthly digest
- 🟢 Low (nice to have) - Documentation update

---

## Deployment Security Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] `.env` file NOT in version control
- [ ] HTTPS certificate installed
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers active
- [ ] Database backed up
- [ ] Redis configured with password
- [ ] Admin credentials strong & unique
- [ ] Dependencies up to date (`npm audit`)

---

## Security Documentation

For detailed security information, see:

- **[SECURITY_GUIDE.md](docs/SECURITY_GUIDE.md)** - Complete security guide
- **[SECURITY_AUDIT_REPORT.md](docs/SECURITY_AUDIT_REPORT.md)** - Audit findings
- **[SECURITY_READINESS_ASSESSMENT.md](docs/SECURITY_READINESS_ASSESSMENT.md)** - Readiness checklist
- **[SECURITY_FIXES_APPLIED_JAN2026.md](docs/SECURITY_FIXES_APPLIED_JAN2026.md)** - Latest fixes

---

## Compliance

This website complies with:
- ✅ OWASP Top 10 security practices
- ✅ GDPR data protection requirements
- ✅ CCPA privacy regulations
- ✅ PCI DSS basic recommendations (if accepting payments)

---

## Third-Party Security

- **Node.js Dependencies** - Regularly audited via `npm audit`
- **Helmet.js** - Security headers middleware
- **express-rate-limit** - DDoS protection
- **bcrypt** - Secure password hashing
- **jsonwebtoken** - Secure authentication

---

## Contact

**Security Issues:** security@thehenry.com  
**General Support:** support@thehenry.com  
**Website:** https://thehenry.com

---

**Last Updated:** March 14, 2026  
**Version:** 1.0  
**Maintainer:** The Henry Website Team
