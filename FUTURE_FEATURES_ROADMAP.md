# The Henry LLC - Future Features Roadmap

**Date Saved:** November 27, 2025  
**Status:** Bookmarked for Future Development  
**Priority:** Phase 2 - E-Commerce & Multi-Tenant Architecture

---

## Vision Statement

The website is for a **Building that will house multiple businesses**. Goal is to eventually build the backend with stronger capabilities and database structures to enable **online ordering and purchases** across multiple tenants:

- **Fill My Cup** - Beverage/Coffee Shop
- **Rooted** - Salon Services  
- **Market** - Retail/Shopping

**Deployment Targets:** Desktop and Mobile platforms

---

## Current Backend Status ✅

- ✅ Express.js server running on localhost:3000
- ✅ SQLite database with contact form functionality
- ✅ Email notifications via Nodemailer (admin@thehenryllc.com)
- ✅ Contact form fully tested and working end-to-end
- ✅ Form validation (client & server-side)
- ✅ Success/error notifications with animations
- ✅ Security headers and CORS configured
- ✅ Git repository with 30+ commits

---

## Phase 2: Multi-Tenant E-Commerce Architecture

### 1. Multi-Tenant Infrastructure
```
Goal: Separate databases/schemas for each business while sharing user auth
- Separate database instances or schema per business
- Shared user authentication system
- Business routing middleware
- Unified admin dashboard
```

### 2. E-Commerce Core Features
```
Required:
- Product/Service catalog management
- Shopping cart system
- Order management & tracking
- Payment processing (Stripe/Square integration)
- Inventory tracking & management
- Customer accounts (registration, login, profiles)
- Business admin dashboards
- Role-based access control (RBAC)
```

### 3. Business-Specific Implementations

#### Fill My Cup (Beverage Shop)
- Product catalog (drinks, sizes, customizations)
- Customization options (size, sweetness, modifications)
- Delivery/Pickup ordering
- Order tracking
- Loyalty/Rewards system (optional)

#### Rooted (Salon Services)
- Service catalog (haircuts, color, treatments)
- Stylist/Staff management
- Appointment scheduling & availability
- Service pricing & duration
- Booking confirmation & reminders
- Stylist performance tracking
- **Reference:** [GlossGenius](https://glossgenius.com/) - Existing platform with all required salon booking features
#### Market (Retail/Shopping)
- Product inventory with images
- Vendor management (if multi-vendor)
- Shopping cart
- Order fulfillment
- Reviews & ratings

---

## Recommended Technology Stack

**Backend:**
- Express.js (current - keep it)
- **PostgreSQL** (upgrade from SQLite - better for complex multi-tenant data)
- JWT Authentication or OAuth
- Stripe API for payments

**Frontend:**
- Vanilla JavaScript (current) or React for complex UIs
- Responsive design for Desktop & Mobile
- Progressive Web App (PWA) capabilities

**Hosting & Deployment:**
- **Render.com** (recommended - supports PostgreSQL, free tier available)
- Auto-deployment from GitHub
- Environment variables for multi-environment setup

---

## Database Schema Expansion Required

### New Tables Needed:
```
- businesses (Fill My Cup, Rooted, Market metadata)
- users (customers, staff, admins)
- products/services (catalog per business)
- orders/transactions
- order_items (line items)
- cart (user shopping carts)
- payments (payment records)
- inventory (stock levels)
- schedules/availability (for Rooted salon)
- reviews/ratings (customer feedback)
- customers (extended profiles)
```

---

## Implementation Phases

### Phase 2.1: Foundation (Weeks 1-2)
- [ ] Migrate from SQLite to PostgreSQL
- [ ] Set up multi-tenant routing architecture
- [ ] Implement user authentication (JWT)
- [ ] Create business models & schemas
- [ ] Deploy to Render.com

### Phase 2.2: E-Commerce Core (Weeks 3-4)
- [ ] Product/Service catalog system
- [ ] Shopping cart implementation
- [ ] Order creation & management
- [ ] Inventory tracking

### Phase 2.3: Payments (Weeks 5-6)
- [ ] Stripe integration
- [ ] Payment processing
- [ ] Order confirmation & receipts
- [ ] Refund handling

### Phase 2.4: Business-Specific (Weeks 7-10)
- [ ] Fill My Cup: Customization system, delivery/pickup
- [ ] Rooted: Appointment scheduling, stylist management
- [ ] Market: Vendor features, product reviews

### Phase 2.5: Admin Dashboards (Weeks 11-12)
- [ ] Business owner dashboards
- [ ] Order management
- [ ] Sales analytics
- [ ] Inventory management

---

## Hosting & Deployment Plan

**Current Setup:**
- Frontend: GitHub Pages (static)
- Backend: Local development on localhost:3000

**Future Production Setup:**
- Frontend: GitHub Pages (keep static)
- Backend: Render.com (PostgreSQL + Node.js)
- Database: Render.com PostgreSQL instance
- Payment Processing: Stripe
- Email: Nodemailer (keep current Outlook SMTP)

**Deployment Steps:**
1. Create Render.com account
2. Push code to GitHub
3. Connect repository to Render
4. Set environment variables (.env)
5. Deploy with PostgreSQL database
6. Update API_URL in main.js to point to Render backend

---

## API Endpoints Structure (Planned)

```
Authentication:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh

Multi-Tenant Routing:
- /api/fill-my-cup/*
- /api/rooted/*
- /api/market/*

E-Commerce:
- GET /api/{business}/products
- POST /api/{business}/cart
- POST /api/{business}/orders
- GET /api/{business}/orders/:id

Admin:
- GET /api/{business}/admin/dashboard
- POST /api/{business}/admin/products
- GET /api/{business}/admin/orders
```

---

## Key Considerations

✅ **Security:**
- HTTPS required for production
- PCI compliance for payment processing
- Rate limiting on endpoints
- Input validation & sanitization
- CORS properly configured per business

✅ **Scalability:**
- Database indexes for performance
- Caching layer (Redis optional)
- CDN for static assets
- Load balancing (future)

✅ **User Experience:**
- Mobile-first responsive design
- Fast checkout process
- Order status tracking
- Push notifications for order updates
- Wishlist/Favorites (optional)

✅ **Admin Experience:**
- Easy product/service management
- Order fulfillment workflow
- Staff scheduling tools
- Sales reporting & analytics
- Inventory alerts

---

## Development Resources

**Documentation to Create:**
- [ ] Multi-tenant architecture guide
- [ ] Database schema documentation
- [ ] API endpoint reference
- [ ] Deployment procedures
- [ ] Admin user manual

**External Services:**
- Stripe.com - Payment processing
- Render.com - Hosting
- GitHub - Version control (already using)

---

## Estimated Timeline & Cost

**Development:** 3-4 months (part-time)  
**Hosting Costs (Production):**
- Render.com backend: ~$7-12/month
- PostgreSQL database: ~$15/month
- Stripe: 2.9% + $0.30 per transaction
- Email: Free (Outlook/GoDaddy SMTP)

---

## Notes

- This roadmap can be executed incrementally
- Start with one business (recommend Fill My Cup as pilot)
- Get MVP (Minimum Viable Product) live, then enhance
- All code will be versioned in GitHub for easy rollback
- Can pause development at any point and resume later
- Current contact form backend provides solid foundation to build upon

---

**Next Steps When Ready:**
1. Contact GitHub Copilot with "Let's start Phase 2 development"
2. Choose starting business (Fill My Cup recommended)
3. Begin database migration planning
4. Set up Render.com account
5. Start implementation

**Questions to clarify later:**
- Do you want instant checkout or save cart for later?
- Delivery radius for Fill My Cup?
- Online booking/payment for Rooted or call-only?
- Vendor vs. Market-owned inventory?
- Loyalty programs needed?
- Mobile app (iOS/Android) or web-only?

---

**Saved by:** GitHub Copilot  
**Repository:** https://github.com/Jfusion369/the-henry-website  
**Last Updated:** November 27, 2025
