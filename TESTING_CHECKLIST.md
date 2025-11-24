# Testing Checklist
## Codigo Soleil Shopify Theme - Comprehensive Testing Guide

**Version:** 2.0.0  
**Last Updated:** November 24, 2025  
**Testing Level:** Production-Ready

---

## Table of Contents

1. [Functional Testing](#functional-testing)
2. [Accessibility Testing](#accessibility-testing)
3. [Performance Testing](#performance-testing)
4. [SEO Testing](#seo-testing)
5. [Cross-Browser Testing](#cross-browser-testing)
6. [Mobile Testing](#mobile-testing)
7. [Security Testing](#security-testing)
8. [User Acceptance Testing](#user-acceptance-testing)

---

## Functional Testing

### Homepage

- [ ] **Hero Section**
  - [ ] Hero image loads correctly
  - [ ] Mobile hero image displays on small screens
  - [ ] Hero text is readable
  - [ ] CTA buttons work
  - [ ] Scroll indicator animates (if present)

- [ ] **Featured Products**
  - [ ] Products display in grid
  - [ ] Product images load
  - [ ] Product titles and prices visible
  - [ ] Quick view button works
  - [ ] Add to cart button works
  - [ ] Wishlist button works (if enabled)

- [ ] **Promotions Banner**
  - [ ] Banner displays correctly
  - [ ] Banner links work
  - [ ] Banner dismisses (if closeable)

- [ ] **Newsletter Signup**
  - [ ] Form accepts email input
  - [ ] Validation works (invalid email shows error)
  - [ ] Success message displays
  - [ ] Email added to mailing list

### Navigation

- [ ] **Header**
  - [ ] Logo displays and links to homepage
  - [ ] Main navigation menu visible
  - [ ] Dropdown menus work (hover and click)
  - [ ] Search icon opens search overlay
  - [ ] Cart icon shows item count
  - [ ] Cart icon opens cart drawer/page
  - [ ] Mobile menu toggle works
  - [ ] Mobile menu displays correctly
  - [ ] Mobile menu closes on link click

- [ ] **Footer**
  - [ ] All footer links work
  - [ ] Social media icons link correctly
  - [ ] Newsletter signup works
  - [ ] Payment icons display
  - [ ] Copyright year is current

### Product Pages

- [ ] **Product Information**
  - [ ] Product title displays
  - [ ] Product price displays correctly
  - [ ] Compare at price shows (if on sale)
  - [ ] Sale badge displays (if on sale)
  - [ ] Product description renders
  - [ ] Vendor/brand displays

- [ ] **Product Images**
  - [ ] Main image displays
  - [ ] Thumbnail images display
  - [ ] Clicking thumbnail changes main image
  - [ ] Image zoom works (if enabled)
  - [ ] Image gallery navigation works

- [ ] **Product Variants**
  - [ ] Variant selectors display
  - [ ] Selecting variant updates:
    - [ ] Price
    - [ ] Image
    - [ ] Availability
    - [ ] SKU
  - [ ] Unavailable variants are disabled
  - [ ] Sold out message displays

- [ ] **Quantity Selector**
  - [ ] Plus button increases quantity
  - [ ] Minus button decreases quantity
  - [ ] Manual input works
  - [ ] Minimum quantity enforced
  - [ ] Maximum quantity enforced (if set)

- [ ] **Add to Cart**
  - [ ] Button adds item to cart
  - [ ] Loading state displays
  - [ ] Success message/animation shows
  - [ ] Cart count updates
  - [ ] Cart drawer opens (if drawer cart)
  - [ ] Error message shows if out of stock

- [ ] **Product Recommendations**
  - [ ] Related products display
  - [ ] Recommendations are relevant
  - [ ] Recommendation cards work

- [ ] **Breadcrumbs**
  - [ ] Breadcrumb trail displays
  - [ ] All breadcrumb links work
  - [ ] Current page is not linked

### Collection Pages

- [ ] **Collection Header**
  - [ ] Collection title displays
  - [ ] Collection description displays
  - [ ] Collection image displays (if set)

- [ ] **Product Grid**
  - [ ] Products display in grid
  - [ ] Grid is responsive (adjusts columns)
  - [ ] Product cards display correctly
  - [ ] Hover effects work

- [ ] **Filtering**
  - [ ] Filter sidebar/dropdown displays
  - [ ] Filters can be selected
  - [ ] Products update when filter applied
  - [ ] Multiple filters work together
  - [ ] Active filters display
  - [ ] Filters can be cleared
  - [ ] Filter count updates

- [ ] **Sorting**
  - [ ] Sort dropdown displays
  - [ ] Sort options work:
    - [ ] Featured
    - [ ] Best selling
    - [ ] Alphabetically A-Z
    - [ ] Alphabetically Z-A
    - [ ] Price low to high
    - [ ] Price high to low
    - [ ] Date old to new
    - [ ] Date new to old

- [ ] **Pagination/Infinite Scroll**
  - [ ] Pagination controls display
  - [ ] Next/previous buttons work
  - [ ] Page numbers work
  - [ ] Infinite scroll loads more products
  - [ ] Loading indicator displays

- [ ] **View Toggle**
  - [ ] Grid view button works
  - [ ] List view button works (if enabled)
  - [ ] View preference persists

### Cart

- [ ] **Cart Display**
  - [ ] Cart items display
  - [ ] Product images show
  - [ ] Product titles and variants show
  - [ ] Prices display correctly
  - [ ] Quantity displays

- [ ] **Cart Actions**
  - [ ] Quantity can be updated
  - [ ] Remove button works
  - [ ] Cart totals update
  - [ ] Discount code field works
  - [ ] Discount applies correctly
  - [ ] Shipping calculator works (if enabled)
  - [ ] Cart note field works (if enabled)

- [ ] **Cart Drawer** (if drawer cart)
  - [ ] Drawer opens from cart icon
  - [ ] Drawer closes on overlay click
  - [ ] Drawer closes on close button
  - [ ] Drawer closes on Escape key
  - [ ] Continue shopping button works
  - [ ] Checkout button works

- [ ] **Empty Cart**
  - [ ] Empty cart message displays
  - [ ] Continue shopping link works

### Search

- [ ] **Search Overlay**
  - [ ] Search icon opens overlay
  - [ ] Search input is focused
  - [ ] Typing shows results (if live search)
  - [ ] Submit button works
  - [ ] Close button works
  - [ ] Escape key closes overlay

- [ ] **Search Results**
  - [ ] Results display correctly
  - [ ] Product results show
  - [ ] Collection results show (if enabled)
  - [ ] Page results show (if enabled)
  - [ ] No results message displays
  - [ ] Search term is highlighted

### Quick View

- [ ] **Modal**
  - [ ] Quick view button opens modal
  - [ ] Modal displays product info
  - [ ] Modal is centered
  - [ ] Close button works
  - [ ] Overlay click closes modal
  - [ ] Escape key closes modal

- [ ] **Functionality**
  - [ ] Product images display
  - [ ] Variant selection works
  - [ ] Add to cart works
  - [ ] View full details link works

### Account Pages

- [ ] **Login**
  - [ ] Login form displays
  - [ ] Email validation works
  - [ ] Password validation works
  - [ ] Login button works
  - [ ] Error messages display
  - [ ] Forgot password link works

- [ ] **Register**
  - [ ] Registration form displays
  - [ ] All fields validate
  - [ ] Password strength indicator works (if enabled)
  - [ ] Register button works
  - [ ] Success message displays

- [ ] **Account Dashboard**
  - [ ] Order history displays
  - [ ] Order details link works
  - [ ] Address book displays
  - [ ] Edit address works
  - [ ] Add address works
  - [ ] Delete address works
  - [ ] Logout works

### Checkout

**Note:** Test in preview mode or test store

- [ ] **Checkout Flow**
  - [ ] Checkout button redirects correctly
  - [ ] Customer information form works
  - [ ] Shipping method selection works
  - [ ] Payment method selection works
  - [ ] Order summary displays
  - [ ] Place order button works

---

## Accessibility Testing

### Keyboard Navigation

- [ ] **Tab Navigation**
  - [ ] Tab key moves focus forward
  - [ ] Shift+Tab moves focus backward
  - [ ] Tab order is logical
  - [ ] All interactive elements are reachable
  - [ ] No keyboard traps

- [ ] **Focus Indicators**
  - [ ] Focus indicator is visible (yellow outline)
  - [ ] Focus indicator has sufficient contrast
  - [ ] Focus indicator is consistent
  - [ ] Custom controls have focus styles

- [ ] **Keyboard Shortcuts**
  - [ ] Enter activates buttons/links
  - [ ] Space activates buttons
  - [ ] Escape closes modals/drawers
  - [ ] Arrow keys navigate carousels
  - [ ] Arrow keys navigate dropdowns

### Screen Reader Testing

**Tools:** NVDA (Windows), VoiceOver (Mac), TalkBack (Android), VoiceOver (iOS)

- [ ] **Page Structure**
  - [ ] Page title is announced
  - [ ] Headings are announced correctly
  - [ ] Heading hierarchy is logical (H1 → H2 → H3)
  - [ ] Landmarks are identified (header, nav, main, footer)
  - [ ] Lists are announced as lists

- [ ] **Images**
  - [ ] All images have alt text
  - [ ] Alt text is descriptive
  - [ ] Decorative images have empty alt
  - [ ] Complex images have long descriptions

- [ ] **Links and Buttons**
  - [ ] Link purpose is clear from text
  - [ ] Button labels are descriptive
  - [ ] Icon buttons have aria-labels
  - [ ] Links open in new tab are announced

- [ ] **Forms**
  - [ ] Form fields have labels
  - [ ] Labels are associated with inputs
  - [ ] Required fields are announced
  - [ ] Error messages are announced
  - [ ] Success messages are announced
  - [ ] Field instructions are announced

- [ ] **Dynamic Content**
  - [ ] Cart updates are announced
  - [ ] Filter updates are announced
  - [ ] Loading states are announced
  - [ ] Error messages are announced
  - [ ] Success messages are announced

- [ ] **ARIA Attributes**
  - [ ] aria-label on icon buttons
  - [ ] aria-expanded on toggles
  - [ ] aria-haspopup on dropdowns
  - [ ] aria-live on dynamic regions
  - [ ] aria-modal on dialogs
  - [ ] aria-current on active items

### Skip Links

- [ ] **Skip to Content**
  - [ ] Skip link appears on Tab
  - [ ] Skip link is visible
  - [ ] Skip link moves focus to main content
  - [ ] Skip link text is clear

### Color Contrast

**Tool:** WAVE, axe DevTools, Contrast Checker

- [ ] **Text Contrast**
  - [ ] Body text meets AA (4.5:1)
  - [ ] Heading text meets AA (4.5:1)
  - [ ] Link text meets AA (4.5:1)
  - [ ] Button text meets AA (4.5:1)
  - [ ] Large text meets AA (3:1)

- [ ] **UI Contrast**
  - [ ] Form borders meet AA (3:1)
  - [ ] Button borders meet AA (3:1)
  - [ ] Focus indicators meet AA (3:1)
  - [ ] Icons meet AA (3:1)

### Reduced Motion

**Enable:** System Settings → Accessibility → Reduce Motion

- [ ] **Animations**
  - [ ] Animations are disabled/minimal
  - [ ] Transitions are instant
  - [ ] Parallax effects are disabled
  - [ ] Autoplay is disabled
  - [ ] Scroll behavior is instant

### Touch Targets

- [ ] **Size**
  - [ ] All touch targets are 44x44px minimum
  - [ ] Buttons are large enough
  - [ ] Links are large enough
  - [ ] Form inputs are large enough

- [ ] **Spacing**
  - [ ] Touch targets have adequate spacing
  - [ ] No overlapping touch targets

### Zoom and Reflow

- [ ] **Browser Zoom**
  - [ ] Page works at 200% zoom
  - [ ] Text is readable
  - [ ] No horizontal scrolling
  - [ ] Content reflows correctly
  - [ ] No content is cut off

---

## Performance Testing

### Lighthouse Audit

**Tool:** Chrome DevTools → Lighthouse

- [ ] **Performance Score**
  - [ ] Score: 90+ (Target: 94)
  - [ ] First Contentful Paint: <1.8s
  - [ ] Largest Contentful Paint: <2.5s
  - [ ] Total Blocking Time: <200ms
  - [ ] Cumulative Layout Shift: <0.1
  - [ ] Speed Index: <3.4s

- [ ] **Accessibility Score**
  - [ ] Score: 90+ (Target: 98)
  - [ ] No violations

- [ ] **Best Practices Score**
  - [ ] Score: 90+ (Target: 96)
  - [ ] HTTPS used
  - [ ] No console errors
  - [ ] Images have correct aspect ratio

- [ ] **SEO Score**
  - [ ] Score: 90+ (Target: 100)
  - [ ] Meta description present
  - [ ] Page has title
  - [ ] Links are crawlable
  - [ ] Images have alt text

### Core Web Vitals

**Tool:** Google Search Console, PageSpeed Insights

- [ ] **LCP (Largest Contentful Paint)**
  - [ ] Desktop: <2.5s
  - [ ] Mobile: <2.5s
  - [ ] Main image loads quickly
  - [ ] Text renders quickly

- [ ] **FID (First Input Delay)**
  - [ ] Desktop: <100ms
  - [ ] Mobile: <100ms
  - [ ] Page responds quickly to clicks
  - [ ] No long tasks blocking main thread

- [ ] **CLS (Cumulative Layout Shift)**
  - [ ] Desktop: <0.1
  - [ ] Mobile: <0.1
  - [ ] Images have width/height
  - [ ] Fonts load without layout shift
  - [ ] Ads don't cause shifts (if applicable)

### Page Load Speed

**Tool:** WebPageTest, GTmetrix

- [ ] **Load Times**
  - [ ] Homepage: <3s
  - [ ] Product page: <3s
  - [ ] Collection page: <3s
  - [ ] Cart page: <2s

- [ ] **Resource Loading**
  - [ ] CSS loads first
  - [ ] JavaScript is deferred
  - [ ] Images are lazy loaded
  - [ ] Fonts are preloaded

### Network Performance

- [ ] **HTTP Requests**
  - [ ] Total requests: <50
  - [ ] No duplicate requests
  - [ ] No 404 errors
  - [ ] No 500 errors

- [ ] **File Sizes**
  - [ ] HTML: <50KB
  - [ ] CSS: <100KB
  - [ ] JavaScript: <200KB
  - [ ] Images: <200KB each
  - [ ] Total page size: <2MB

### Caching

- [ ] **Browser Caching**
  - [ ] Static assets cached (1 year)
  - [ ] Images cached
  - [ ] CSS cached
  - [ ] JavaScript cached

- [ ] **CDN**
  - [ ] Assets served from CDN
  - [ ] CDN is fast
  - [ ] CDN is reliable

---

## SEO Testing

### On-Page SEO

- [ ] **Title Tags**
  - [ ] Homepage has title
  - [ ] Product pages have unique titles
  - [ ] Collection pages have unique titles
  - [ ] Titles are 50-60 characters
  - [ ] Titles include keywords

- [ ] **Meta Descriptions**
  - [ ] Homepage has description
  - [ ] Product pages have unique descriptions
  - [ ] Collection pages have unique descriptions
  - [ ] Descriptions are 150-160 characters
  - [ ] Descriptions are compelling

- [ ] **Headings**
  - [ ] Each page has one H1
  - [ ] H1 contains main keyword
  - [ ] Heading hierarchy is logical
  - [ ] Headings are descriptive

- [ ] **URLs**
  - [ ] URLs are clean and readable
  - [ ] URLs include keywords
  - [ ] No unnecessary parameters
  - [ ] Hyphens separate words

- [ ] **Images**
  - [ ] All images have alt text
  - [ ] Alt text is descriptive
  - [ ] Alt text includes keywords (naturally)
  - [ ] File names are descriptive

### Structured Data

**Tool:** Google Rich Results Test, Schema Markup Validator

- [ ] **Organization Schema**
  - [ ] Present on homepage
  - [ ] Valid JSON-LD
  - [ ] No errors
  - [ ] All required fields present

- [ ] **Website Schema**
  - [ ] Present on homepage
  - [ ] Valid JSON-LD
  - [ ] Search action present
  - [ ] No errors

- [ ] **Product Schema**
  - [ ] Present on product pages
  - [ ] Valid JSON-LD
  - [ ] No errors
  - [ ] All required fields present:
    - [ ] name
    - [ ] image
    - [ ] description
    - [ ] offers (price, currency, availability)
    - [ ] brand
    - [ ] sku

- [ ] **Breadcrumb Schema**
  - [ ] Present on product/collection pages
  - [ ] Valid JSON-LD
  - [ ] No errors
  - [ ] Hierarchy is correct

### Open Graph & Twitter Cards

- [ ] **Open Graph Tags**
  - [ ] og:title present
  - [ ] og:description present
  - [ ] og:image present
  - [ ] og:url present
  - [ ] og:type present
  - [ ] Image is 1200x630px

- [ ] **Twitter Card Tags**
  - [ ] twitter:card present
  - [ ] twitter:title present
  - [ ] twitter:description present
  - [ ] twitter:image present

### Canonical URLs

- [ ] **Canonical Tags**
  - [ ] Present on all pages
  - [ ] Point to correct URL
  - [ ] Use absolute URLs
  - [ ] No duplicate content

### XML Sitemap

- [ ] **Sitemap**
  - [ ] Sitemap exists (/sitemap.xml)
  - [ ] All pages included
  - [ ] No 404 pages
  - [ ] Submitted to Google Search Console

### Robots.txt

- [ ] **Robots File**
  - [ ] Robots.txt exists
  - [ ] Allows crawling of important pages
  - [ ] Blocks admin pages
  - [ ] Includes sitemap URL

### Mobile-Friendly

**Tool:** Google Mobile-Friendly Test

- [ ] **Mobile Optimization**
  - [ ] Page is mobile-friendly
  - [ ] Text is readable
  - [ ] Tap targets are sized appropriately
  - [ ] Content fits screen
  - [ ] No horizontal scrolling

---

## Cross-Browser Testing

### Desktop Browsers

- [ ] **Google Chrome (Latest)**
  - [ ] Layout correct
  - [ ] Functionality works
  - [ ] No console errors
  - [ ] Performance good

- [ ] **Mozilla Firefox (Latest)**
  - [ ] Layout correct
  - [ ] Functionality works
  - [ ] No console errors
  - [ ] Performance good

- [ ] **Safari (Latest)**
  - [ ] Layout correct
  - [ ] Functionality works
  - [ ] No console errors
  - [ ] Performance good

- [ ] **Microsoft Edge (Latest)**
  - [ ] Layout correct
  - [ ] Functionality works
  - [ ] No console errors
  - [ ] Performance good

### Mobile Browsers

- [ ] **Chrome Mobile (Android)**
  - [ ] Layout correct
  - [ ] Touch interactions work
  - [ ] Swipe gestures work
  - [ ] Performance good

- [ ] **Safari (iOS)**
  - [ ] Layout correct
  - [ ] Touch interactions work
  - [ ] Swipe gestures work
  - [ ] Performance good

- [ ] **Samsung Internet**
  - [ ] Layout correct
  - [ ] Functionality works
  - [ ] Performance good

### Responsive Design

- [ ] **Breakpoints**
  - [ ] Mobile (320px-767px)
  - [ ] Tablet (768px-1023px)
  - [ ] Desktop (1024px-1279px)
  - [ ] Large Desktop (1280px+)

- [ ] **Layout**
  - [ ] Grid adjusts correctly
  - [ ] Navigation adapts
  - [ ] Images scale properly
  - [ ] Text is readable
  - [ ] No horizontal scrolling

---

## Mobile Testing

### Device Testing

- [ ] **iPhone (iOS)**
  - [ ] iPhone SE (small screen)
  - [ ] iPhone 12/13 (standard)
  - [ ] iPhone 12/13 Pro Max (large)

- [ ] **Android**
  - [ ] Samsung Galaxy S21
  - [ ] Google Pixel 5
  - [ ] OnePlus 9

- [ ] **Tablet**
  - [ ] iPad (10.2")
  - [ ] iPad Pro (12.9")
  - [ ] Samsung Galaxy Tab

### Touch Interactions

- [ ] **Gestures**
  - [ ] Tap works
  - [ ] Double tap works (if applicable)
  - [ ] Long press works (if applicable)
  - [ ] Swipe works (carousels, drawers)
  - [ ] Pinch zoom works (if enabled)

- [ ] **Touch Targets**
  - [ ] All buttons are tappable
  - [ ] No accidental taps
  - [ ] Adequate spacing between targets

### Mobile-Specific Features

- [ ] **Viewport**
  - [ ] Viewport meta tag present
  - [ ] Content fits screen
  - [ ] No horizontal scrolling
  - [ ] Zoom works correctly

- [ ] **Forms**
  - [ ] Keyboard appears for inputs
  - [ ] Correct keyboard type (email, number, etc.)
  - [ ] Autocomplete works
  - [ ] Form submission works

- [ ] **Performance**
  - [ ] Page loads quickly on 3G
  - [ ] Images load progressively
  - [ ] Interactions are smooth
  - [ ] No jank or lag

---

## Security Testing

### HTTPS

- [ ] **SSL Certificate**
  - [ ] Site uses HTTPS
  - [ ] Certificate is valid
  - [ ] No mixed content warnings
  - [ ] All resources load over HTTPS

### Forms

- [ ] **Input Validation**
  - [ ] Email validation works
  - [ ] Required fields enforced
  - [ ] Input sanitization works
  - [ ] No XSS vulnerabilities

- [ ] **CSRF Protection**
  - [ ] Forms have CSRF tokens (Shopify handles this)
  - [ ] Tokens are validated

### Content Security

- [ ] **XSS Prevention**
  - [ ] User input is escaped
  - [ ] HTML is sanitized
  - [ ] Scripts are validated

- [ ] **Clickjacking**
  - [ ] X-Frame-Options header set (Shopify handles this)
  - [ ] Content-Security-Policy set

---

## User Acceptance Testing

### User Scenarios

- [ ] **First-Time Visitor**
  - [ ] Can find products easily
  - [ ] Can understand navigation
  - [ ] Can search for products
  - [ ] Can view product details
  - [ ] Can add to cart
  - [ ] Can checkout

- [ ] **Returning Customer**
  - [ ] Can log in
  - [ ] Can view order history
  - [ ] Can reorder previous items
  - [ ] Can update account info

- [ ] **Mobile Shopper**
  - [ ] Can browse on mobile
  - [ ] Can add to cart on mobile
  - [ ] Can checkout on mobile
  - [ ] Experience is smooth

### Usability

- [ ] **Navigation**
  - [ ] Menu structure is logical
  - [ ] Links are clearly labeled
  - [ ] Breadcrumbs help orientation
  - [ ] Search is easy to find

- [ ] **Product Discovery**
  - [ ] Products are easy to find
  - [ ] Filters are helpful
  - [ ] Sorting options are useful
  - [ ] Search results are relevant

- [ ] **Product Pages**
  - [ ] Information is clear
  - [ ] Images are high quality
  - [ ] Variants are easy to select
  - [ ] Add to cart is prominent

- [ ] **Cart & Checkout**
  - [ ] Cart is easy to access
  - [ ] Cart contents are clear
  - [ ] Checkout process is smooth
  - [ ] Payment options are clear

### Feedback Collection

- [ ] **User Testing**
  - [ ] Conduct user testing sessions
  - [ ] Collect feedback
  - [ ] Identify pain points
  - [ ] Prioritize improvements

- [ ] **Analytics**
  - [ ] Set up Google Analytics
  - [ ] Track key metrics
  - [ ] Monitor conversion funnel
  - [ ] Identify drop-off points

---

## Testing Sign-Off

### Pre-Launch Checklist

- [ ] All functional tests passed
- [ ] All accessibility tests passed
- [ ] All performance tests passed
- [ ] All SEO tests passed
- [ ] All cross-browser tests passed
- [ ] All mobile tests passed
- [ ] All security tests passed
- [ ] User acceptance testing completed
- [ ] Stakeholder approval received

### Post-Launch Monitoring

- [ ] Monitor Core Web Vitals
- [ ] Monitor error logs
- [ ] Monitor user feedback
- [ ] Monitor analytics
- [ ] Monitor search rankings
- [ ] Monitor conversion rates

---

## Testing Tools Reference

### Accessibility
- **WAVE:** https://wave.webaim.org/
- **axe DevTools:** https://www.deque.com/axe/devtools/
- **NVDA:** https://www.nvaccess.org/
- **Lighthouse:** Built into Chrome DevTools

### Performance
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **WebPageTest:** https://www.webpagetest.org/
- **GTmetrix:** https://gtmetrix.com/
- **Lighthouse:** Built into Chrome DevTools

### SEO
- **Google Search Console:** https://search.google.com/search-console
- **Rich Results Test:** https://search.google.com/test/rich-results
- **Schema Validator:** https://validator.schema.org/
- **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly

### Cross-Browser
- **BrowserStack:** https://www.browserstack.com/
- **LambdaTest:** https://www.lambdatest.com/
- **Sauce Labs:** https://saucelabs.com/

### Security
- **SSL Labs:** https://www.ssllabs.com/ssltest/
- **Security Headers:** https://securityheaders.com/
- **Observatory:** https://observatory.mozilla.org/

---

**Testing Checklist Version:** 2.0.0  
**Last Updated:** November 24, 2025  
**Maintained By:** QA Team

---

**End of Testing Checklist**
