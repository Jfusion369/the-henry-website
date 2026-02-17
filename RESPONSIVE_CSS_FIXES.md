# Responsive CSS Fixes - Implementation Guide

**Created:** February 17, 2026

This document provides the specific CSS changes needed to achieve full responsiveness.

---

## 🎯 Part 1: Standardize Breakpoints & Variables

### Current State Issues:
```css
/* Inconsistent across the codebase */
@media (max-width: 720px) { ... }    /* Most breakpoints */
@media (max-width: 768px) { ... }    /* Contact form */
@media (min-width: 721px) { ... }    /* Desktop nav */
```

### Recommended Changes:

Add this at the top of `styles.css` (after `:root` variables):

```css
/* ===== RESPONSIVE BREAKPOINT SYSTEM ===== */

:root {
  /* Spacing System */
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 20px;
  --spacing-xl: 30px;
  --spacing-2xl: 40px;
  --spacing-3xl: 60px;
  
  /* Container Widths */
  --container-mobile: calc(100% - var(--spacing-lg));
  --container-tablet: calc(100% - var(--spacing-xl));
  --container-desktop: 85%;
  
  /* Max Content Width */
  --max-content-width: 1200px;
}

/* Breakpoint Naming Convention:
 * Mobile:     0px - 639px
 * Tablet:     640px - 1023px
 * Desktop:    1024px+
 * Large:      1440px+
 */

/* Mobile-first utility classes */
@media (min-width: 640px) {
  /* Tablet optimizations */
}

@media (min-width: 1024px) {
  /* Desktop optimizations */
}

@media (min-width: 1440px) {
  /* Large screen optimizations */
}
```

---

## 🎯 Part 2: Fix Container Width

### Current Problem:
```css
.container {
    width: 80%;
    margin: auto;
    overflow: hidden;
}
```

### Recommended Fix:
```css
.container {
    width: var(--container-mobile);
    max-width: var(--max-content-width);
    margin: 0 auto;
    padding: 0 var(--spacing-md);
    box-sizing: border-box;
}

@media (min-width: 640px) {
    .container {
        width: var(--container-tablet);
        padding: 0 var(--spacing-lg);
    }
}

@media (min-width: 1024px) {
    .container {
        width: var(--container-desktop);
        padding: 0;
    }
}
```

---

## 🎯 Part 3: Fix Body Padding for Navigation

### Current Problem:
```css
body {
  padding-top: 52px;
}
```

This adds unwanted space on mobile where hamburger menu is used.

### Recommended Fix:
```css
/* Mobile: No extra padding needed (hamburger is fixed) */
body {
  padding-top: 0;
}

/* Desktop: Add padding only when desktop nav is visible */
@media (min-width: 1024px) {
    body {
        padding-top: 52px;
    }
}

.nav-desktop {
    display: none;
    background: linear-gradient(to right, rgba(51, 51, 51, 0) 0%, rgba(68, 68, 68, 0) 100%);
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

@media (min-width: 1024px) {
    .nav-desktop {
        display: flex;
    }
}

@media (max-width: 1023px) {
    .nav-desktop {
        display: none !important;
    }
}
```

---

## 🎯 Part 4: Fix Contact Form Spacing

### Current Problem:
```css
@media (max-width: 768px) {
    .contact-grid {
        grid-template-columns: 1fr !important;
    }
}
```

Inconsistent breakpoint + missing padding adjustments

### Recommended Fix:
```css
.contact-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
    margin: var(--spacing-lg) 0;
}

@media (min-width: 640px) {
    .contact-grid {
        gap: var(--spacing-xl);
        margin: var(--spacing-xl) 0;
    }
}

@media (min-width: 1024px) {
    .contact-grid {
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-2xl);
    }
}

.contact-heading {
    margin-bottom: var(--spacing-md);
}

@media (min-width: 1024px) {
    .contact-heading {
        margin-bottom: var(--spacing-lg);
    }
}
```

---

## 🎯 Part 5: Fix Newsletter Form Mobile

### Current Problem:
```css
.newsletter-form input {
    flex: 1;
    min-width: 200px;  /* Creates overflow on small phones */
}

@media (max-width: 720px) {
    .newsletter-form {
        flex-direction: column;
    }
    
    .newsletter-form input,
    .newsletter-form button {
        width: 100%;
    }
}
```

### Recommended Fix:
```css
.newsletter-form {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    flex-wrap: wrap;
    max-width: var(--max-content-width);
    margin: 0 auto var(--spacing-lg);
}

.newsletter-form input {
    flex: 1;
    min-width: 150px;  /* Reduced from 200px for mobile */
    padding: var(--spacing-md);
    border: none;
    border-radius: var(--radius-md);
    font-size: 14px;
    font-family: inherit;
}

.newsletter-form button {
    padding: var(--spacing-md) var(--spacing-lg);
    background: white;
    color: #9E1B32;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

@media (max-width: 639px) {
    .newsletter-form {
        flex-direction: column;
        gap: var(--spacing-sm);
    }
    
    .newsletter-form input,
    .newsletter-form button {
        width: 100%;
        min-width: unset;
    }
}

@media (min-width: 640px) {
    .newsletter-form input {
        min-width: 200px;
    }
}
```

---

## 🎯 Part 6: Fix Table Responsiveness

### Current Problem:
```css
table {
    min-width: 700px;  /* Forces horizontal scroll */
}
```

### Recommended Fix:

**Option A: Horizontal Scroll (Keep current approach but optimize)**
```css
.table-wrap {
    overflow-x: auto;
    border-radius: 8px;
    -webkit-overflow-scrolling: touch;  /* Smooth scroll on iOS */
}

table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;  /* Reduced from 700px */
}

@media (min-width: 640px) {
    table {
        min-width: 100%;
    }
}
```

**Option B: Card Layout for Mobile (Better UX)**
```css
/* Default table styles (desktop) */
.table-wrap {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

/* Mobile: Convert to card layout */
@media (max-width: 639px) {
    table,
    thead,
    tbody,
    th,
    td,
    tr {
        display: block;
        width: 100%;
    }
    
    thead {
        display: none;
    }
    
    tr {
        border: 1px solid #ddd;
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-md);
        overflow: hidden;
    }
    
    td {
        display: block;
        padding: var(--spacing-sm);
        text-align: right;
        padding-left: 50%;
        position: relative;
    }
    
    td::before {
        content: attr(data-label);
        position: absolute;
        left: var(--spacing-sm);
        font-weight: 600;
        color: #9E1B32;
    }
}
```

---

## 🎯 Part 7: Fix Button & CTA Padding

### Current Problem:
```css
.btn {
    padding: 12px 24px;  /* Doesn't adjust for mobile */
}
```

### Recommended Fix:
```css
.btn {
    display: inline-block;
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    text-decoration: none;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;
    border: 2px solid transparent;
}

@media (max-width: 639px) {
    .btn {
        padding: var(--spacing-md) var(--spacing-md);
        font-size: 14px;
    }
}

.cta-buttons {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
    justify-content: center;
    margin-top: var(--spacing-xl);
}

@media (max-width: 639px) {
    .cta-buttons {
        flex-direction: column;
        gap: var(--spacing-sm);
    }
    
    .btn {
        width: 100%;
        text-align: center;
    }
}
```

---

## 🎯 Part 8: Standardize Section Padding

### Current Problem:
```css
/* Inconsistent padding across sections */
.featured-card { padding: 30px; }
.newsletter { padding: 40px 20px; }
```

### Recommended Fix:
```css
/* Create consistent section padding classes */
.section {
    padding: var(--spacing-xl);
}

.section-large {
    padding: var(--spacing-2xl);
}

@media (max-width: 639px) {
    .section {
        padding: var(--spacing-lg);
    }
    
    .section-large {
        padding: var(--spacing-xl);
    }
}

/* Apply to components */
.featured-card {
    background: white;
    border: 3px solid #9E1B32;
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    max-width: 500px;
    margin: 0 auto;
    box-shadow: 0 4px 15px rgba(158, 27, 50, 0.1);
}

@media (max-width: 639px) {
    .featured-card {
        padding: var(--spacing-lg);
        margin: 0 var(--spacing-lg);
    }
}

.newsletter {
    background: linear-gradient(135deg, #9E1B32 0%, #2f8f55 100%);
    color: white;
    padding: var(--spacing-2xl) var(--spacing-lg);
    border-radius: var(--radius-lg);
    margin: var(--spacing-xl) auto;
    text-align: center;
}

@media (max-width: 639px) {
    .newsletter {
        margin: var(--spacing-lg);
        padding: var(--spacing-xl) var(--spacing-md);
    }
}
```

---

## 🎯 Part 9: Fix Image Responsiveness

### Add to all images:
```css
/* Generic image responsive rule */
img {
    max-width: 100%;
    height: auto;
    display: block;
}

/* Header image */
.site-title-image {
    max-width: 100%;
    height: auto;
    max-height: 300px;
}

@media (max-width: 639px) {
    .site-title-image {
        max-height: 200px;
    }
}

@media (min-width: 640px) {
    .site-title-image {
        max-height: 250px;
    }
}
```

---

## 🎯 Part 10: Add Tablet Optimizations

### New media query block for tablets (640px - 1023px):

```css
/* ===== TABLET OPTIMIZATIONS (640px - 1023px) ===== */

@media (min-width: 640px) and (max-width: 1023px) {
    
    /* Tablet-specific spacing */
    .container {
        width: var(--container-tablet);
        padding: 0 var(--spacing-lg);
    }
    
    /* Event cards - better use of tablet space */
    .event-card {
        gap: var(--spacing-lg);
    }
    
    /* Featured cards */
    .featured-card {
        max-width: 100%;
        padding: var(--spacing-lg);
    }
    
    /* Adjust header */
    header {
        margin: var(--spacing-lg) auto;
    }
    
    /* Notification positioning */
    .notification {
        right: var(--spacing-lg) !important;
        max-width: calc(100% - calc(2 * var(--spacing-lg))) !important;
    }
}
```

---

## ✅ Implementation Checklist

- [ ] Add standardized breakpoint system to `:root`
- [ ] Update `.container` width logic
- [ ] Fix `body` padding for desktop-only
- [ ] Standardize form spacing (contact & newsletter)
- [ ] Fix table mobile responsiveness
- [ ] Update button padding consistency
- [ ] Standardize section padding
- [ ] Add responsive image rules
- [ ] Test on mobile (320px, 375px, 414px)
- [ ] Test on tablet (640px, 768px, 800px)
- [ ] Test on desktop (1024px, 1440px)
- [ ] Verify touch interactions on mobile
- [ ] Check hamburger menu visibility
- [ ] Verify notification positioning

---

## 📱 Testing Breakpoints

### Mobile (320px - 639px)
- iPhone SE: 375px
- iPhone 12/13: 390px
- Samsung Galaxy: 412px

### Tablet (640px - 1023px)
- iPad: 768px
- iPad Pro 10.5": 834px

### Desktop (1024px+)
- Standard: 1024px
- Laptop: 1440px
- Large: 1920px+

---

## 🚀 Quick Implementation Order

1. **Step 1:** Add breakpoint system to `:root` (5 min)
2. **Step 2:** Fix container widths (10 min)
3. **Step 3:** Fix form spacing (15 min)
4. **Step 4:** Standardize padding (15 min)
5. **Step 5:** Fix table responsiveness (20 min)
6. **Step 6:** Test all breakpoints (30 min)

**Total Time:** ~1.5 hours

