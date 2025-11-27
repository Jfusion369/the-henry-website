# ROOTED Salon Backend - Requirements Questions

**Date Created:** November 27, 2025  
**Source Analysis:** GlossGenius.com feature set  
**Purpose:** Clarify specifications before backend development for Rooted salon booking system

---

## SECTION 1: BUSINESS MODEL & STRUCTURE

### 1.1 Salon Configuration
- [ ] Will Rooted operate as a **single salon with multiple stylists** or **multiple salon locations**?
- [ ] How many stylists/staff members are expected to use this system?
- [ ] Will there be **booth renters** (independent contractors with separate accounts/payouts)?
- [ ] Do you need **manager-level access** (multiple staff with different permissions)?

### 1.2 Service Types
- [ ] What specific services will Rooted offer? (e.g., haircuts, color, treatments, extensions, nails, etc.)
- [ ] Will services have **variable duration**? (e.g., haircut = 30min, color = 60min, full service = 90min)
- [ ] Will services have **fixed pricing** or **stylist-specific pricing** variations?
- [ ] Will you offer **service packages/bundles**? (e.g., "Cut + Color = $X")
- [ ] Do you need **service add-ons**? (e.g., deep conditioning treatment for +$15)
- [ ] Will there be **deposit/retainer requirements** for certain services?

### 1.3 Staff/Stylist Management
- [ ] How many stylists initially? Projected growth?
- [ ] Will each stylist have their own **booking page** or just show all stylists together?
- [ ] Can clients **request a specific stylist**?
- [ ] Do stylists have **availability constraints**? (e.g., Mon-Fri only, specific hours)
- [ ] Will you track **stylist specialties**? (e.g., "Sarah specializes in color")
- [ ] Do you need **stylist performance metrics/commission tracking**?
- [ ] Will you need **payroll integration** or just track earnings/payouts?

---

## SECTION 2: BOOKING & APPOINTMENT SYSTEM

### 2.1 Calendar & Scheduling
- [ ] What are Rooted's **business hours**? (Open/close times daily)
- [ ] How far in advance can clients **book appointments**? (e.g., 1 week, 30 days, unlimited)
- [ ] What is the **minimum booking notice**? (e.g., can't book same-day)
- [ ] Do you offer **recurring/subscription appointments**? (e.g., monthly color, weekly maintenance)
- [ ] Should the system show **real-time availability** or book at specific time slots?
- [ ] What are your **time slot intervals**? (15-min, 30-min slots?)
- [ ] Do you need **buffer time between appointments**? (e.g., 15-min break for stylist)

### 2.2 Stylist Specialization & Preferences
- [ ] Can stylists set their own **availability/days off**?
- [ ] Do certain stylists handle certain service types only?
- [ ] Will clients be able to **request specific combinations** (e.g., "I want Sarah for color only")?
- [ ] Do stylists have **booking preferences**? (e.g., max clients per day)

### 2.3 Waitlist & Cancellation
- [ ] Do you need a **waitlist system** for fully booked slots?
- [ ] What's the **cancellation policy**? (48-hour notice required? Fees?)
- [ ] Can clients **reschedule** appointments easily?
- [ ] Do you track **cancellation reasons**?

### 2.4 Forms & Client Information
- [ ] Will clients fill out **intake forms** before appointments?
- [ ] What information must be collected before booking? (phone, email, preferences, etc.)
- [ ] Do you need **consent forms** (e.g., for chemical treatments)?
- [ ] Will there be **service questionnaires**? (e.g., "What's your hair type?" for color service)
- [ ] Do you need **file uploads**? (e.g., client provides reference photos)

---

## SECTION 3: PAYMENT & PRICING

### 3.1 Payment Processing
- [ ] Will clients pay **online at booking** or **in-person at appointment**?
- [ ] Do you accept **online payments** (credit card, Apple Pay, Google Pay)?
- [ ] What payment processor do you want? (Stripe recommended)
- [ ] Do you need **deposit system**? (e.g., collect 50% upfront)
- [ ] Will you support **multiple payment methods** (card, cash, check)?
- [ ] Do you want **automatic payment confirmations** via email/SMS?

### 3.2 Pricing & Discounts
- [ ] Will services have **fixed pricing** or **price ranges**?
- [ ] Do you offer **first-time client discounts**?
- [ ] Will there be **seasonal promotions** or **loyalty discounts**?
- [ ] Do you need **gift cards** or **prepaid packages**?
- [ ] Will pricing be **public** on booking page or **hidden until checkout**?
- [ ] Do you need **service customization pricing**? (e.g., short hair vs long hair variations)
- [ ] Will **gratuity/tip** be calculated at payment, or option to add later?

### 3.3 Refunds & Adjustments
- [ ] What's your **refund policy** for cancellations?
- [ ] Can staff **manually adjust pricing** (e.g., stylist discount)?
- [ ] Do you need **refund request workflow** (automatic or approval-based)?

---

## SECTION 4: CLIENT MANAGEMENT

### 4.1 Client Profiles
- [ ] What client information must be stored? (name, email, phone, address, etc.)
- [ ] Do you need **client notes/history**? (past services, preferences, allergies)
- [ ] Will clients have **login accounts** or book as guests?
- [ ] Do you want **client dashboards** to view their appointment history?
- [ ] Should the system auto-populate from **previous appointments**?
- [ ] Do you need **client segmentation** (e.g., VIP, regular, inactive)?

### 4.2 Communication
- [ ] Do you need **appointment reminders**? (email, SMS, or both)
- [ ] When should reminders send? (24 hours before? 2 hours before?)
- [ ] Will you send **post-appointment follow-ups**? (thank you, feedback request)
- [ ] Do you need **SMS notifications** or just email?
- [ ] Will clients receive **confirmation** when booking online?
- [ ] Do you need **cancellation notifications** if stylist cancels?

### 4.3 Reviews & Feedback
- [ ] Will you collect **post-appointment reviews/ratings**?
- [ ] Should feedback be **public** (on website) or **internal only**?
- [ ] Do you want **automatic Google review requests**?
- [ ] Will you track **Net Promoter Score (NPS)**?

---

## SECTION 5: INVENTORY & PRODUCTS

### 5.1 Product Tracking
- [ ] Will Rooted sell **retail products** (e.g., hair care products, styling tools)?
- [ ] Do you need **inventory management** (track stock levels)?
- [ ] Will products be **in-stock only** or allow backorders?
- [ ] Do you need **reorder alerts** when stock runs low?
- [ ] Will stylists use products during appointments (cost tracking)?

### 5.2 Product Pricing
- [ ] Will retail products have **fixed prices** or **variable** by quantity?
- [ ] Do you need **bundle pricing** (e.g., 3 bottles = discount)?
- [ ] Will products be available for **online purchase**, **in-salon only**, or both?

---

## SECTION 6: REPORTING & ANALYTICS

### 6.1 Business Metrics
- [ ] Do you need **revenue reports** (total, by stylist, by service)?
- [ ] Will you track **appointment metrics**? (booked vs. canceled, no-shows)
- [ ] Do you need **client analytics**? (new vs. returning, repeat rate)
- [ ] Will you track **stylist performance**? (appointments booked, revenue, ratings)
- [ ] Do you need **daily/weekly/monthly summaries**?
- [ ] Will you track **marketing source** (how client found you)?

### 6.2 Financial Reporting
- [ ] Do you need **income statements** for accounting?
- [ ] Will you track **expenses** (products, rent, utilities)?
- [ ] Do you need **tax reporting** features (1099s for contractors)?
- [ ] Will stylists see **their earnings/commission** breakdown?

---

## SECTION 7: MARKETING & GROWTH

### 7.1 Email & SMS Marketing
- [ ] Will you send **promotional campaigns**? (if so, frequency?)
- [ ] Do you need **email list management** and segmentation?
- [ ] Will you send **re-engagement campaigns** to inactive clients?
- [ ] Do you need **SMS marketing** capability?

### 7.2 Loyalty & Retention
- [ ] Do you want a **loyalty/rewards program**?
- [ ] Will clients earn **points** per appointment or purchase?
- [ ] Can points be **redeemed for discounts** or **free services**?
- [ ] Will there be **membership tiers** (bronze, silver, gold)?
- [ ] Do you need **birthday/anniversary specials** automation?

### 7.3 Referral System
- [ ] Will you track **referrals** (client brings friend)?
- [ ] Do you offer **referral incentives**?

---

## SECTION 8: MOBILE & WEB EXPERIENCE

### 8.1 Client-Facing Features
- [ ] Will clients access booking via **web browser, mobile app, or both**?
- [ ] Should the booking site be **branded** (Rooted custom domain/theme)?
- [ ] Do you need a **mobile app** or is responsive web sufficient?
- [ ] Will clients have **account login** to manage their bookings?
- [ ] Can clients **change/cancel appointments** online?

### 8.2 Admin/Staff Dashboard
- [ ] Will staff use **web or mobile** to manage calendar?
- [ ] Do you need a **kiosk-style check-in** at the salon?
- [ ] Will stylists get **push notifications** of new bookings?
- [ ] Can staff access system from **anywhere** (remote access)?

---

## SECTION 9: SECURITY & COMPLIANCE

### 9.1 Data Protection
- [ ] Do you need **PCI compliance** for card storage (recommended: use Stripe, not your servers)?
- [ ] Will you collect **health/allergy information**? (HIPAA considerations?)
- [ ] Do you need **data encryption** for sensitive client info?
- [ ] What's your **data retention policy**? (how long keep old appointments?)
- [ ] Do you need **client data export** capability (GDPR)?

### 9.2 Access Control
- [ ] Will you have **role-based permissions**? (admin, stylist, client)
- [ ] Can stylists see only **their appointments** or all appointments?
- [ ] Do clients see **other clients' information**? (should not!)
- [ ] Will there be **password requirements**? (complexity, reset policies)

---

## SECTION 10: INTEGRATIONS & THIRD-PARTY

### 10.1 External Services
- [ ] Do you want **Google Calendar sync** (pull business hours)?
- [ ] Do you need **calendar export** (ICS files)?
- [ ] Should you integrate with **Google Business Profile** for reviews?
- [ ] Do you want **social media posting** (auto-post to Instagram/Facebook)?
- [ ] Will you need **email service provider** integration (Mailchimp, etc.)?

### 10.2 Future Expansions
- [ ] Do you want **appointment waitlist API** for other businesses?
- [ ] Will you offer **white-label solution** for other salons?
- [ ] Do you need **API for custom integrations**?

---

## SECTION 11: SPECIAL FEATURES

### 11.1 Appointment-Specific
- [ ] Will you support **group appointments** (e.g., bridal party)?
- [ ] Do you need **appointment notes** (stylist to stylist communication)?
- [ ] Will you track **service duration accuracy** (was appointment on time)?
- [ ] Do you need **pre-appointment questionnaires** to stylist?

### 11.2 Business-Specific
- [ ] Will you offer **gift certificates**?
- [ ] Do you need **class/workshop scheduling**? (e.g., "Hair Care 101")
- [ ] Will you support **consultation appointments** (free, unpaid)?
- [ ] Do you need **waitlist notification** when opening appears?

---

## SECTION 12: DEPLOYMENT & HOSTING

### 12.1 Infrastructure
- [ ] Should this be **Rooted-only** or **multi-tenant** (serve other salons)?
- [ ] Do you need **separate database** for Rooted or shared with building?
- [ ] Where should backend be hosted? (Render.com recommended)
- [ ] Do you need **backup/disaster recovery**?
- [ ] What's your **uptime requirement**? (99% sufficient?)

### 12.2 Maintenance
- [ ] Will **Rooted staff** manage updates or you (developer)?
- [ ] Do you need **automatic backups**?
- [ ] Will you need **support for troubleshooting** after launch?

---

## PRIORITY RANKING

**Phase 1 (MVP - Must Have):**
- [ ] Basic appointment booking with stylist assignment
- [ ] Client intake forms & notes
- [ ] Payment processing (online payment at booking)
- [ ] Appointment reminders (email)
- [ ] Basic calendar view for staff
- [ ] Client history/past appointments

**Phase 2 (High Priority):**
- [ ] Loyalty/rewards system
- [ ] Stylist specialization & preferences
- [ ] Recurring appointments
- [ ] Cancellation policy enforcement
- [ ] SMS notifications
- [ ] Revenue reports

**Phase 3 (Nice to Have):**
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Waitlist system
- [ ] Product inventory
- [ ] Multi-location support
- [ ] Staff payroll integration

---

## NEXT STEPS

1. **Answer all questions** above - prioritize Sections 1-6 and Priority Phase 1
2. **Share answers** with development team
3. **Clarify any ambiguous items**
4. **Confirm Phase 1 scope** before starting backend
5. **Begin database design** based on requirements

---

**Questions for Josh:**
- Are you building this for Rooted specifically, or planning to white-label for multiple salons?
- What's your timeline for Phase 1 launch?
- Do you have existing client data to migrate?
- Will Rooted staff need training on the system?
- What's your budget for Stripe payment processing fees?

