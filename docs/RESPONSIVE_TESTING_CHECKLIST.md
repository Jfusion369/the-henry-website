# Responsive Design - Testing Checklist

**Purpose:** Validate all 6 responsiveness fixes across device sizes and browsers  
**Estimated Time:** 30 minutes  
**Test Environment:** Browser DevTools or physical devices

---

## QUICK START

### Setup
1. Open The Henry Website in browser (localhost or production)
2. Open DevTools: Right-click → Inspect (or F12)
3. Toggle Device Toolbar: Ctrl+Shift+M (Windows) or Cmd+Shift+M (Mac)
4. Use preset device sizes OR custom viewport dimensions

### Testing Order
1. Mobile (375px width) - iPhone 12
2. Tablet (768px width) - iPad Air
3. Desktop (1440px width) - Large monitor
4. Test all sections on each breakpoint

---

## MOBILE TESTING (375px - iPhone 12)

### Header & Navigation  
- [ ] Site title image: 300px max-height (compressed)
- [ ] Hamburger menu: **VISIBLE** (three horizontal lines)
- [ ] Desktop navigation: **HIDDEN** (no horizontal menu)
- [ ] Hamburger position: top-right corner (var(--spacing-lg) = 20px)
- [ ] Header padding: visible bottom spacing

### Containers & Layout
- [ ] Container width: ~90% - 16px padding = ~343px content
- [ ] Body padding: 0 (no top wasted space)
- [ ] All content readable, no horizontal scroll
- [ ] Containers centered on screen

### Forms & Inputs
- [ ] Newsletter form: Input vertically stacked
- [ ] Newsletter input: min-width 150px (fits on screen)
- [ ] Contact form fields: stacked vertically (1 column)
- [ ] Buttons: square padding (var(--spacing-md)) - compact
- [ ] Form labels: full width alignment

### Buttons & CTAs
- [ ] CTA buttons: padding var(--spacing-md) - compact size
- [ ] Button gap: var(--spacing-md) = 16px between buttons
- [ ] Button text: fully readable, no wrapping issues

### Images & Media
- [ ] All images: max-width 100%, responsive scaling
- [ ] No image overflow
- [ ] Proper aspect ratios maintained
- [ ] Gallery items: single column stack

### Custom Sections (Fill My Cup, Rooted, Market, Court Yard)
- [ ] Section padding: var(--spacing-2xl) = 32px vertical, var(--spacing-lg) = 20px horizontal
- [ ] Hero images: scale properly
- [ ] Text content: readable font size
- [ ] Section title images: display appropriately

### Notifications & Floating Elements
- [ ] Notifications: positioned at `var(--spacing-md)` = 12px from edges on mobile
- [ ] No overflow out of viewport
- [ ] Readable and accessible

### Footer
- [ ] Footer padding: var(--spacing-2xl) = 32px vertical, var(--spacing-lg) = 20px horizontal
- [ ] Footer grid: single column layout
- [ ] All footer text readable

### Bottom Line
```
✅ All mobile content should fit 375px width with 16px padding = 343px content area
✅ No horizontal scrolling
✅ Hamburger menu visible, desktop nav hidden
✅ Forms fully stacked vertically
```

---

## TABLET TESTING (768px - iPad Air)

### Header & Navigation
- [ ] Hamburger menu: **STILL VISIBLE** (768px < 1024px threshold)
- [ ] Desktop nav: **STILL HIDDEN**
- [ ] Site title image: 250px max-height (optimized for tablet)
- [ ] Header styling: consistent with mobile

### Containers & Layout
- [ ] Container width: 90% = ~691px at 768px viewport
- [ ] Container padding: var(--spacing-lg) = 20px sides
- [ ] Content area: ~651px usable with padding
- [ ] Body padding: 0 (no top padding until 1024px)
- [ ] Layout more spacious than mobile, not cramped

### Forms & Inputs
- [ ] Newsletter form: Input min-width upgraded to 200px
- [ ] Contact form: **STILL 1 COLUMN** (below 1024px breakpoint)
- [ ] Button padding: var(--spacing-lg) = 20px - larger than mobile
- [ ] Input fields: more comfortable to use

### Buttons & CTAs
- [ ] CTA buttons: padding expanded (var(--spacing-lg))
- [ ] Button gap: var(--spacing-md) = 16px
- [ ] Buttons more tappable (larger touch targets)

### Images & Media
- [ ] Images properly scaled to tablet width
- [ ] Hero sections: scaled appropriately
- [ ] Gallery: might show 2 items per row OR still single column (check design)

### Spacing & Padding
- [ ] Section margins: var(--spacing-xl) = 24px visible
- [ ] Card padding: var(--spacing-xl) = 24px noticeable
- [ ] More breathing room than mobile

### Custom Sections
- [ ] Hero images: scaled up from mobile
- [ ] Section content: more spacious layout
- [ ] Tablet optimization: improved readability

### Bottom Line
```
✅ Layout more spacious than mobile
✅ Hamburger menu STILL visible (not at 1024px yet)
✅ Contact form STILL single column
✅ Viewport ~691px after padding = comfortable tablet experience
```

---

## DESKTOP TESTING (1440px - Large Monitor)

### Header & Navigation
- [ ] Hamburger menu: **HIDDEN** (1440px ≥ 1024px)
- [ ] Desktop navigation: **VISIBLE** (horizontal menu)
- [ ] Body padding: **TOP 52px VISIBLE** (for fixed nav)
- [ ] Site title image: 350px max-height (full expansion)
- [ ] Navigation spacing: consistent with system

### Containers & Layout
- [ ] Container width: 85% of viewport = ~1224px
- [ ] Container has max-width: 1200px (CAPPED - prevents super wide text)
- [ ] Actual content: 1200px (not 1224px) - cap applies
- [ ] Containers centered on screen
- [ ] Body has 52px padding-top visible
- [ ] Large empty margins on sides (designed for large screens)

### Forms & Inputs
- [ ] Contact form: **2 columns** (grid-template-columns: 1fr 1fr)
- [ ] Contact form fields: side-by-side layout
- [ ] Newsletter: horizontal layout optimized for desktop
- [ ] Button padding: var(--spacing-lg) = 20px (desktop comfortable)

### Buttons & CTAs
- [ ] CTA buttons: full padding, large touch targets
- [ ] Button layout: side-by-side if space allows
- [ ] Hover effects working smoothly

### Content Layout
- [ ] Text never exceeds 1200px width (readability maintained)
- [ ] Large screens don't result in excessive line lengths
- [ ] Content properly centered with breathing room

### Custom Sections
- [ ] Fill My Cup Cafe: full desktop layout
- [ ] Rooted Salon: full desktop layout
- [ ] Market: full desktop layout
- [ ] Court Yard: full desktop layout
- [ ] All sections: optimal spacing and sizing

### Responsive Features
- [ ] Gallery: likely 3+ columns (if implemented)
- [ ] Tables: full horizontal display (not scrolling)
- [ ] Sidebar: if present, proper desktop positioning

### Performance
- [ ] Page loads quickly
- [ ] No jank or stuttering
- [ ] Smooth scrolling and transitions

### Bottom Line
```
✅ Desktop nav visible, hamburger GONE
✅ Body top padding: 52px (for fixed nav)
✅ Container width: 85% with 1200px max-width cap
✅ Contact form: 2-column layout (side-by-side)
✅ Content readable without excessive line length
```

---

## BROWSER COMPATIBILITY CHECKLIST

### Chrome Desktop (Latest)
- [ ] All styles rendering correctly
- [ ] Responsive behavior as expected
- [ ] DevTools showing correct computed values

### Firefox Desktop (Latest)
- [ ] All styles rendering correctly
- [ ] CSS variables working
- [ ] Layout matches Chrome

### Safari Desktop (Latest, Mac)
- [ ] All styles rendering correctly
- [ ] No rendering quirks
- [ ] Smooth animations

### Edge Desktop (Latest)
- [ ] All styles rendering correctly
- [ ] Responsive behavior identical to Chrome
- [ ] CSS variables supported

### Safari iOS (iPad)
- [ ] Hamburger menu visible on iPad
- [ ] Touch events responsive
- [ ] Smooth scrolling (-webkit-overflow-scrolling: touch)

### Chrome Mobile (Android)
- [ ] Mobile layout looks correct
- [ ] Forms responsive and touchable
- [ ] Notifications positioned correctly

---

## CRITICAL BREAKPOINT VERIFICATION

### At 1024px Exactly
This is the **critical point** where major layout changes occur:

**Just Below 1024px (1023px):**
- [ ] Hamburger menu: visible
- [ ] Desktop nav: hidden
- [ ] Contact form: 1 column

**Exactly At 1024px (1024px):**
- [ ] Hamburger menu: should toggle to HIDDEN
- [ ] Desktop nav: should toggle to VISIBLE
- [ ] Contact form: should change to 2 columns
- [ ] Body should have 52px top padding

**Resize browser window and slowly drag from 1023px to 1024px:**
- [ ] Observe smooth transition at exactly 1024px
- [ ] No jumping or layout shift
- [ ] Navigation cleanly switches between hamburger and desktop nav

### CSS Variables Verification
Check DevTools Computed Styles (right-click element → Inspect):

```
--spacing-xs should equal: 8px
--spacing-sm should equal: 12px
--spacing-md should equal: 16px
--spacing-lg should equal: 20px
--spacing-xl should equal: 24px
--spacing-2xl should equal: 32px
--spacing-3xl should equal: 40px

--bp-tablet should equal: 640px
--bp-desktop should equal: 1024px
--max-content-width should equal: 1200px
```

- [ ] All variables resolve to correct pixel values
- [ ] No "undefined" or error states

---

## SPECIFIC COMPONENT TESTING

### Navigation Component
Check DevTools Inspector on `.hamburger` class:
```css
@media (max-width: 1023px) {
    display: flex;  ← Should apply on mobile/tablet
    top: var(--spacing-lg) → 20px
    right: var(--spacing-lg) → 20px
}

@media (min-width: 1024px) {
    display: none;  ← Should hide on desktop
}
```

- [ ] Hamburger visible on 640px breakpoint
- [ ] Hamburger visible on 1023px (just before desktop)
- [ ] Hamburger hidden on 1024px+ (desktop)

### Container Component
Check `.container` padding and width:

**Mobile (375px):**
```
width: calc(100% - 20px)  → ~355px
padding: 0 16px  → var(--spacing-md)
max-width: 1200px  → not needed (content smaller)
```

**Tablet (768px):**
```
width: 90%  → ~691px
padding: 0 20px  → var(--spacing-lg)
max-width: 1200px  → not needed yet
```

**Desktop (1440px):**
```
width: 85%  → ~1224px
padding: 0  → no side padding
max-width: 1200px  → **APPLIES - content capped at 1200px**
margin: 0 auto  → centers 1200px content with 20px sides each
```

- [ ] Container width changes at 640px and 1024px breakpoints
- [ ] Padding changes at mobile/tablet/desktop breakpoints
- [ ] Max-width constraint active on desktop (prevents over-wide text)

### Form Components
Check `.contact-grid`:

**Mobile/Tablet (below 1024px):**
```css
grid-template-columns: 1fr;  ← 1 column layout
gap: var(--spacing-lg);  ← Fields stacked vertically
```

- [ ] Contact form fields stack vertically
- [ ] Each field full width
- [ ] Spacing between fields: 20px (var(--spacing-lg))

**Desktop (1024px+):**
```css
grid-template-columns: 1fr 1fr;  ← 2 columns
gap: var(--spacing-lg);
```

- [ ] Contact form fields side-by-side
- [ ] Two fields per row
- [ ] Proper gap between columns: 20px

- [ ] Form transitions cleanly from 1-col to 2-col at 1024px

### Button Styling
Check `.btn` class:

**Mobile (375px):**
```css
padding: var(--spacing-md)  → 16px all sides (square button)
font-size: matches mobile design
```

**Tablet/Desktop (640px+):**
```css
padding: var(--spacing-md) var(--spacing-lg)  → 16px 20px (horizontal padding)
```

- [ ] Buttons appear square on mobile (compact)
- [ ] Buttons appear rectangular on tablet/desktop (spacious)
- [ ] Button text properly padded at all sizes

### Newsletter Form
Check input sizing:

**Mobile (375px):**
```css
min-width: 150px;  → Input smaller on mobile
```

**Tablet/Desktop (640px+):**
```css
min-width: 200px;  → Input expands on tablet+
```

- [ ] Input field fits in 375px without wrapping
- [ ] Input field comfortable size on tablet (200px minimum)
- [ ] No overflow at any breakpoint

---

## IMAGE RESPONSIVENESS TESTING

### Responsive Images
Generic rule applied to all `img` elements:
```css
img {
    max-width: 100%;
    height: auto;
    display: block;
}
```

Check various images at different viewport sizes:
- [ ] Hero images: scale with viewport width
- [ ] Gallery images: scale responsively
- [ ] Logo/icons: proper sizing at all breakpoints
- [ ] Image aspect ratios: maintained (no distortion)
- [ ] Images never overflow container width

### Site Title Image
Check `.site-title-image` sizing:

**Mobile:**
- [ ] Max-height: 300px
- [ ] Displays within mobile header properly

**Tablet:**
- [ ] Max-height: 250px
- [ ] Optimized for tablet viewport

**Desktop:**
- [ ] Max-height: 350px
- [ ] Full-size desktop display

---

## NOTIFICATION POSITIONING TEST

Check `.notification` class positioning:

**Default Position:**
```css
top: var(--spacing-lg);  → 20px from top
right: var(--spacing-lg);  → 20px from right edge
```

**Mobile Override (max-width: 639px):**
```css
right: var(--spacing-md) !important;  → 16px from right edge on mobile
left: var(--spacing-md) !important;  → Also position from left edge
```

- [ ] Notifications positioned correctly on mobile (not cut off)
- [ ] Notifications positioned correctly on tablet (20px from right)
- [ ] Notifications positioned correctly on desktop (20px from right)
- [ ] No notified content overlapping viewport edges

---

## SPECIAL DEVICE TESTING (Optional)

### iPhone 12 (375px)
- [ ] All mobile tests pass
- [ ] Touch targets adequate size (min 44x44px)
- [ ] Hamburger menu accessible
- [ ] Forms easy to fill on phone

### iPad Mini (544px)
- [ ] Hamburger menu visible (below 1024px)
- [ ] Layout more spacious than mobile
- [ ] Forms organized clearly

### iPad Air (768px)
- [ ] Still in mobile/tablet mode (below 1024px)
- [ ] Contact form: 1 column
- [ ] Proper tablet optimization

### iPad Pro 11" (834px)
- [ ] Still below 1024px (hamburger visible)
- [ ] Can toggle to landscape (1024px) → desktop mode engages
- [ ] Layout expands appropriately in landscape

### iPad Pro 12.9" (1024px in landscape)
- [ ] Desktop nav becomes visible
- [ ] Contact form: 2 columns
- [ ] Body padding: 52px top visible
- [ ] Optimal iPad Pro landscape experience

---

## COMMON GOTCHAS TO CHECK

### 1. Hamburger Menu Not Switching
**Problem:** Hamburger stays visible on desktop or hidden on mobile  
**Check:**
- [ ] Verify @media (max-width: 1023px) for hamburger display: flex
- [ ] Verify @media (min-width: 1024px) for hamburger display: none
- [ ] Resize to exactly 1024px - menu should switch

### 2. Contact Form Not Changing to 2 Columns
**Problem:** Contact form stays 1-column on desktop  
**Check:**
- [ ] Verify `.contact-grid` has `@media (min-width: 1024px)`
- [ ] Verify rule contains `grid-template-columns: 1fr 1fr;`
- [ ] Inspect element in DevTools to see computed grid

### 3. Content Too Wide on Large Screens
**Problem:** Text extends too far on large monitors (>1440px)  
**Check:**
- [ ] Verify `.container` has `max-width: var(--max-content-width)`
- [ ] Verify max-width resolves to 1200px in DevTools
- [ ] Content should be capped at 1200px + margins

### 4. Newsletter Input Overflowing
**Problem:** Input field breaks layout on mobile  
**Check:**
- [ ] Verify min-width is 150px (not 200px) on mobile < 640px
- [ ] Verify @media (min-width: 640px) changes to 200px
- [ ] Test on 375px device - should fit

### 5. Notification Cut Off on Mobile
**Problem:** Notification appears partially off-screen  
**Check:**
- [ ] Verify @media (max-width: 639px) rule exists
- [ ] Verify right: var(--spacing-md) and left: var(--spacing-md) applied
- [ ] Should have 16px padding from edges on mobile

---

## FINAL VALIDATION CHECKLIST

### Before Declaring Complete
- [ ] Mobile (375px): All tests pass
- [ ] Tablet (768px): All tests pass
- [ ] Desktop (1440px): All tests pass
- [ ] Breakpoint transition at 1024px: Smooth
- [ ] All browsers tested: Pass
- [ ] CSS variables resolving correctly: Yes
- [ ] No horizontal scrolling: Verified
- [ ] No broken layouts: Confirmed
- [ ] Contact form 2-column on desktop: Yes
- [ ] Hamburger/desktop nav switching: Working
- [ ] Content readable everywhere: Confirmed
- [ ] Images responsive: Verified
- [ ] Form inputs responsive: Verified

### Success Criteria
✅ All responsive fixes implemented and tested  
✅ Mobile-first approach working correctly  
✅ Breakpoint standardization (640px, 1024px) verified  
✅ CSS variable system functioning properly  
✅ 95%+ responsive design score achieved  

---

## SIGN-OFF

**Testing Date:** _____________  
**Tester Name:** _____________  
**Browser(s) Tested:** _____________  
**Devices Tested:** _____________  

**Testing Result:** ☐ PASS ☐ FAIL

**If FAIL, Issues Found:** _____________  
_________________________________________________________________  
_________________________________________________________________  

**Notes:** _________________________________________________________________  
_________________________________________________________________  

---

*Use this checklist to validate all responsive design improvements*  
*Expected completion time: 30 minutes for full verification*  
*Document Version: 1.0*
