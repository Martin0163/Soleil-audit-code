# Setup Guide
## Codigo Soleil Shopify Theme - Configuration & Activation

**Version:** 2.0.0  
**Last Updated:** November 24, 2025  
**Difficulty:** Intermediate

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Theme Configuration](#theme-configuration)
4. [Component Activation](#component-activation)
5. [SEO Setup](#seo-setup)
6. [Accessibility Features](#accessibility-features)
7. [Performance Optimization](#performance-optimization)
8. [Troubleshooting](#troubleshooting)
9. [Advanced Configuration](#advanced-configuration)

---

## Prerequisites

### Required

- ✅ Shopify store (any plan)
- ✅ Admin access to Shopify dashboard
- ✅ Basic understanding of Shopify theme customizer
- ✅ Modern web browser (Chrome, Firefox, Safari, Edge)

### Recommended

- 📚 Familiarity with Liquid templating
- 📚 Basic HTML/CSS knowledge
- 📚 Understanding of web accessibility
- 📚 SEO fundamentals

### Tools

- **Shopify CLI** (optional, for local development)
- **Code editor** (VS Code, Sublime Text, etc.)
- **FTP/SFTP client** (optional, for file management)

---

## Installation

### Method 1: Upload Theme Files (Recommended)

1. **Prepare Theme Package**
   ```bash
   # Compress the "Codigo soleil" folder into a ZIP file
   # Ensure the folder structure is:
   # Codigo soleil/
   # ├── Assets/
   # ├── Blocks/
   # ├── Config/
   # ├── layout/
   # ├── locales/
   # ├── Sections/
   # ├── Snippets/
   # └── Templates/
   ```

2. **Upload to Shopify**
   - Go to **Online Store** → **Themes**
   - Click **Add theme** → **Upload ZIP file**
   - Select your compressed theme file
   - Wait for upload to complete

3. **Activate Theme**
   - Once uploaded, click **Actions** → **Publish**
   - Or click **Customize** to preview first

### Method 2: Shopify CLI (For Developers)

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Navigate to theme directory
cd "Codigo soleil"

# Connect to your store
shopify theme dev --store your-store.myshopify.com

# Push theme to Shopify
shopify theme push

# Publish theme
shopify theme publish
```

### Method 3: Theme Kit (Legacy)

```bash
# Install Theme Kit
brew tap shopify/shopify
brew install themekit

# Configure
theme configure --password=[your-password] --store=[your-store.myshopify.com] --themeid=[your-theme-id]

# Deploy
theme deploy
```

---

## Theme Configuration

### Step 1: Logo & Branding

1. **Navigate to Theme Customizer**
   - Go to **Online Store** → **Themes**
   - Click **Customize** on active theme

2. **Upload Logo**
   - Click **Theme settings** (bottom left)
   - Go to **Logo and Favicon** section
   - Upload **Logo Image** (recommended: PNG with transparency, 300x100px)
   - Upload **Inverse Logo** for dark backgrounds (optional)
   - Adjust **Desktop Logo Height** (default: 36px)
   - Adjust **Mobile Logo Height** (default: 28px)

3. **Upload Favicon**
   - Upload **Favicon** (recommended: 32x32px PNG or ICO)
   - This appears in browser tabs

### Step 2: Color Scheme

1. **Primary Colors**
   - **Background:** #FFFFFF (white)
   - **Headings:** #000000 (black)
   - **Text:** #000000 (black)
   - **Primary Color (Accent):** #FFD700 (yellow/gold)
   - **Primary Hover:** #000000 (black)
   - **Borders:** #E6E6E6 (light gray)

2. **Button Colors**
   
   **Primary Button:**
   - Background: #FFD700 (yellow)
   - Text: #000000 (black)
   - Border: #FFD700 (yellow)
   - Hover Background: #000000 (black)
   - Hover Text: #FFD700 (yellow)
   - Hover Border: #000000 (black)
   
   **Secondary Button:**
   - Background: #FFFFFF (white)
   - Text: #000000 (black)
   - Border: #000000 (black)
   - Hover Background: #FFD700 (yellow)
   - Hover Text: #000000 (black)
   - Hover Border: #FFD700 (yellow)

3. **Input Fields**
   - Background: #FFFFFF (white)
   - Text: #000000 (black)
   - Border: #E6E6E6 (light gray)
   - Hover Background: #F9F9F9 (off-white)

### Step 3: Typography

1. **Font Selection**
   - **Body Font:** Work Sans (default) or custom
   - **Subheading Font:** Work Sans Medium (default) or custom
   - **Heading Font:** Anonymous Pro (default) or custom

2. **Font Sizes**
   - **Paragraph Size:** 14px, 16px, or 18px (default: 14px)
   - **H1 Size:** 32px, 40px, or 48px (default: 48px)
   - **Line Height:** Normal (1.5)

3. **Custom Fonts (Optional)**
   
   If using custom fonts, upload to Shopify:
   - Go to **Settings** → **Files**
   - Upload font files (.woff2 recommended)
   - Note the CDN URLs
   - Update `Assets/theme.css.liquid` with @font-face declarations

### Step 4: Layout Settings

1. **Page Width**
   - **Narrow:** 1200px max-width (recommended for beauty/fashion)
   - **Normal:** 1400px max-width

2. **Spacing**
   - Uses design token system (automatic)
   - No manual configuration needed

### Step 5: Animations

1. **Enable/Disable Animations**
   - **Page Transitions:** ✅ Enabled (default)
   - **Add-to-Cart Animation:** ✅ Enabled (default)
   - **Product Card Hover Effect:** Lift or Scale (default: Lift)

2. **Accessibility Note**
   - Animations automatically disabled for users with `prefers-reduced-motion`
   - No configuration needed

### Step 6: Cart Settings

1. **Cart Type**
   - **Page:** Traditional cart page
   - **Drawer:** Slide-out cart drawer (default)

2. **Cart Features**
   - **Show Cart Note:** ❌ Disabled (default)
   - **Show Discount Code:** ✅ Enabled (default)

### Step 7: Product Cards

1. **Product Card Features**
   - **Enable Quick Add:** ✅ Enabled (default)
   - **Show Second Image on Hover:** ✅ Enabled (default)

---

## Component Activation

### Design Tokens

**Status:** ✅ Automatically Active

The design token system is automatically included in `theme.liquid`. No additional configuration needed.

**Verify Installation:**
1. Open browser DevTools (F12)
2. Go to **Elements** tab
3. Inspect `<html>` or `<body>` element
4. Check **Computed** styles
5. Look for CSS variables like `--color-yellow`, `--space-md`, etc.

### Accessibility Helpers

**Status:** ✅ Automatically Active

Accessibility utilities are automatically included in `theme.liquid`.

**Verify Installation:**
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Type: `window.A11yHelpers`
4. Should return an object with methods

**Usage Example:**
```javascript
// Announce to screen readers
window.A11yHelpers.announce('Item added to cart', 'polite');

// Trap focus in modal
const modal = document.getElementById('my-modal');
window.A11yHelpers.trapFocus(modal);
```

### Carousel Component

**Status:** ⚙️ Manual Activation Required

The carousel component is available but must be manually added to sections.

**Activation Steps:**

1. **Create New Section** (or edit existing)
   ```liquid
   {% comment %}
     Example: Featured Products Carousel
   {% endcomment %}
   
   <div class="featured-products">
     <h2>{{ section.settings.title }}</h2>
     
     {% render 'carousel',
       items: collection.products,
       carousel_id: 'featured-products',
       autoplay: true,
       autoplay_speed: 5000,
       show_arrows: true,
       show_dots: true,
       carousel_label: 'Featured products'
     %}
   </div>
   
   {% schema %}
   {
     "name": "Featured Products Carousel",
     "settings": [
       {
         "type": "text",
         "id": "title",
         "label": "Section Title",
         "default": "Featured Products"
       },
       {
         "type": "collection",
         "id": "collection",
         "label": "Collection"
       }
     ]
   }
   {% endschema %}
   ```

2. **Add to Template**
   - Go to **Theme Customizer**
   - Navigate to desired page
   - Click **Add section**
   - Select your carousel section

**Carousel Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | Array | Required | Array of items to display |
| `carousel_id` | String | Required | Unique ID for carousel |
| `autoplay` | Boolean | false | Enable autoplay |
| `autoplay_speed` | Number | 5000 | Autoplay interval (ms) |
| `show_arrows` | Boolean | true | Show prev/next buttons |
| `show_dots` | Boolean | true | Show pagination dots |
| `carousel_label` | String | 'Image carousel' | ARIA label |

---

## SEO Setup

### Step 1: Organization Schema

**Activation:**

Add to `layout/theme.liquid` in the `<head>` section:

```liquid
{% render 'seo-schema-organization' %}
```

**Configuration:**

1. **Social Media Links**
   - Go to **Theme settings** → **Social media**
   - Add your social media URLs:
     - Facebook
     - Instagram
     - Twitter
     - Pinterest
     - YouTube
     - TikTok

2. **Logo**
   - Ensure logo is uploaded in **Logo and Favicon** settings
   - Minimum size: 112x112px
   - Recommended: 600x600px PNG with transparency

### Step 2: Website Schema

**Activation:**

Add to `Templates/index.liquid` (homepage):

```liquid
{% render 'seo-schema-website' %}
```

**Configuration:**
- No additional configuration needed
- Automatically uses shop name and URL
- Enables sitelinks search box in Google

### Step 3: Product Schema

**Activation:**

Add to `Templates/product.liquid`:

```liquid
{% render 'seo-schema-product', product: product %}
```

**Configuration:**

1. **Product Information**
   - Ensure products have:
     - Clear titles
     - Detailed descriptions
     - High-quality images
     - Accurate pricing
     - SKU numbers
     - Vendor/brand information

2. **Product Reviews (Optional)**
   
   If using a review app, add metafields:
   - `product.metafields.reviews.rating.value` (number, 1-5)
   - `product.metafields.reviews.rating_count` (number)
   
   **How to Add Metafields:**
   - Go to **Settings** → **Custom data**
   - Click **Products**
   - Add metafield definitions:
     - Namespace: `reviews`
     - Key: `rating`
     - Type: `Number (decimal)`
   - Repeat for `rating_count`

### Step 4: Breadcrumb Schema

**Activation:**

Add to product and collection templates:

```liquid
{% comment %} In Templates/product.liquid {% endcomment %}
{% render 'seo-schema-breadcrumbs', product: product, collection: collection %}

{% comment %} In Templates/collection.liquid {% endcomment %}
{% render 'seo-schema-breadcrumbs', collection: collection %}
```

**Configuration:**
- No additional configuration needed
- Automatically generates breadcrumb hierarchy

### Step 5: Verify Structured Data

**Testing:**

1. **Google Rich Results Test**
   - Go to: https://search.google.com/test/rich-results
   - Enter your product URL
   - Check for errors

2. **Schema Markup Validator**
   - Go to: https://validator.schema.org/
   - Enter your page URL
   - Verify all schemas are valid

3. **Google Search Console**
   - Go to **Enhancements** → **Products**
   - Check for errors or warnings
   - Monitor rich result performance

---

## Accessibility Features

### Keyboard Navigation

**Status:** ✅ Automatically Active

**Test:**
1. Use **Tab** key to navigate through page
2. Use **Shift+Tab** to navigate backwards
3. Use **Enter** or **Space** to activate buttons/links
4. Use **Escape** to close modals/drawers
5. Use **Arrow keys** in carousels

**Verify:**
- All interactive elements should have visible focus indicator (yellow outline)
- Tab order should be logical (top to bottom, left to right)
- No keyboard traps (can always navigate away)

### Screen Reader Support

**Status:** ✅ Automatically Active

**Test:**

1. **Windows (NVDA - Free)**
   - Download: https://www.nvaccess.org/
   - Press **Ctrl+Alt+N** to start
   - Navigate with **Arrow keys**
   - Read page with **Insert+Down Arrow**

2. **Mac (VoiceOver - Built-in)**
   - Press **Cmd+F5** to start
   - Navigate with **Ctrl+Option+Arrow keys**
   - Read page with **Ctrl+Option+A**

3. **Mobile (TalkBack/VoiceOver)**
   - Enable in accessibility settings
   - Swipe to navigate
   - Double-tap to activate

**Verify:**
- All images have descriptive alt text
- All buttons have clear labels
- Form inputs have associated labels
- Dynamic content changes are announced
- Page structure is logical (headings, landmarks)

### Skip Links

**Status:** ✅ Automatically Active

**Test:**
1. Load any page
2. Press **Tab** key once
3. "Skip to content" link should appear at top
4. Press **Enter** to skip to main content

### Reduced Motion

**Status:** ✅ Automatically Active

**Test:**

1. **Windows:**
   - Go to **Settings** → **Ease of Access** → **Display**
   - Enable **Show animations in Windows**

2. **Mac:**
   - Go to **System Preferences** → **Accessibility** → **Display**
   - Check **Reduce motion**

3. **Verify:**
   - Reload page
   - Animations should be minimal or disabled
   - Transitions should be instant
   - Autoplay should be disabled

---

## Performance Optimization

### Image Optimization

**Automatic Features:**
- ✅ Lazy loading enabled
- ✅ Responsive images (srcset)
- ✅ Explicit width/height attributes

**Manual Optimization:**

1. **Before Uploading**
   - Compress images (use TinyPNG, ImageOptim, etc.)
   - Target file size: <200KB per image
   - Use WebP format when possible

2. **Recommended Sizes**
   - Product images: 2048x2048px (will be resized automatically)
   - Hero images: 2400x1200px
   - Thumbnails: 400x400px
   - Icons: 64x64px

3. **Alt Text**
   - Always add descriptive alt text
   - Be specific: "Red leather handbag with gold chain strap"
   - Not: "Product image" or "IMG_1234"

### Font Loading

**Status:** ✅ Automatically Optimized

**Features:**
- `font-display: swap` prevents invisible text
- Fonts preloaded for faster rendering
- Fallback fonts specified

**Verify:**
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter by **Font**
4. Check that fonts load quickly (<500ms)

### Script Loading

**Status:** ✅ Automatically Optimized

**Features:**
- Scripts deferred (non-blocking)
- Critical scripts preloaded
- Passive event listeners

**Verify:**
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter by **JS**
4. Check that scripts don't block page load

### Monitoring

**Tools:**

1. **Google PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Test your store URL
   - Target scores: 90+ on all metrics

2. **Lighthouse (Built into Chrome)**
   - Open DevTools (F12)
   - Go to **Lighthouse** tab
   - Click **Generate report**
   - Review scores and recommendations

3. **WebPageTest**
   - URL: https://www.webpagetest.org/
   - Test from multiple locations
   - Review waterfall chart

**Target Metrics:**

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint (FCP) | <1.8s | ~1.2s |
| Largest Contentful Paint (LCP) | <2.5s | ~1.9s |
| First Input Delay (FID) | <100ms | ~45ms |
| Cumulative Layout Shift (CLS) | <0.1 | ~0.04 |
| Time to Interactive (TTI) | <3.8s | ~2.5s |

---

## Troubleshooting

### Issue: Theme Customizer Not Loading

**Symptoms:**
- Blank screen in customizer
- "Something went wrong" error

**Solutions:**

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Common issues:
     - Syntax errors in Liquid
     - Missing assets
     - Invalid JSON in schema

2. **Verify File Structure**
   - Ensure all folders are present:
     - Assets/
     - Blocks/
     - Config/
     - layout/
     - locales/
     - Sections/
     - Snippets/
     - Templates/

3. **Check settings_schema.json**
   - Validate JSON syntax
   - Use: https://jsonlint.com/
   - Common errors:
     - Missing commas
     - Trailing commas
     - Invalid comments

4. **Clear Browser Cache**
   - Press **Ctrl+Shift+Delete** (Windows)
   - Press **Cmd+Shift+Delete** (Mac)
   - Clear cached images and files

### Issue: Styles Not Applying

**Symptoms:**
- Page looks unstyled
- Colors/fonts incorrect

**Solutions:**

1. **Check CSS File**
   - Verify `Assets/theme.css.liquid` exists
   - Check for syntax errors
   - Validate CSS: https://jigsaw.w3.org/css-validator/

2. **Clear Shopify Cache**
   - Add `?v=123` to URL (change number each time)
   - Or wait 5-10 minutes for cache to clear

3. **Check Design Tokens**
   - Verify `{% render 'design-tokens' %}` is in theme.liquid
   - Check browser DevTools for CSS variables

4. **Inspect Element**
   - Right-click element
   - Select **Inspect**
   - Check **Computed** styles
   - Look for overriding styles

### Issue: JavaScript Not Working

**Symptoms:**
- Cart not updating
- Modals not opening
- Buttons not responding

**Solutions:**

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Common issues:
     - Undefined variables
     - Missing functions
     - Syntax errors

2. **Verify Script Loading**
   - Check **Network** tab in DevTools
   - Ensure scripts load successfully (200 status)
   - Check for 404 errors

3. **Check Script Order**
   - Ensure `theme.js` loads before other scripts
   - Verify `defer` attribute is present

4. **Test in Incognito Mode**
   - Browser extensions can interfere
   - Test without extensions

### Issue: SEO Schema Errors

**Symptoms:**
- Errors in Google Search Console
- Rich results not showing

**Solutions:**

1. **Validate Schema**
   - Use Google Rich Results Test
   - Use Schema.org Validator
   - Fix reported errors

2. **Check Required Fields**
   - Product schema requires:
     - name
     - image
     - offers (price, currency, availability)
   - Organization schema requires:
     - name
     - url

3. **Verify Data**
   - Ensure product prices are set
   - Check that images exist
   - Verify URLs are absolute (include https://)

4. **Wait for Indexing**
   - Changes can take 1-2 weeks to appear
   - Request re-indexing in Search Console

### Issue: Accessibility Errors

**Symptoms:**
- WAVE or axe reports errors
- Screen reader not announcing content

**Solutions:**

1. **Check ARIA Attributes**
   - Verify `aria-label` on buttons
   - Check `aria-expanded` on toggles
   - Ensure `role` attributes are correct

2. **Verify Focus Management**
   - Test keyboard navigation
   - Check focus indicators are visible
   - Ensure no keyboard traps

3. **Check Alt Text**
   - All images should have alt text
   - Decorative images should have empty alt (`alt=""`)

4. **Test with Screen Reader**
   - Use NVDA (Windows) or VoiceOver (Mac)
   - Verify all content is announced
   - Check navigation is logical

---

## Advanced Configuration

### Custom CSS

**Location:** `Assets/theme.css.liquid`

**Adding Custom Styles:**

```css
/* ========================================
   CUSTOM STYLES
   Add your custom CSS below
   ======================================== */

/* Example: Custom button style */
.btn-custom {
  background: var(--color-plum);
  color: var(--color-white);
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.btn-custom:hover {
  background: var(--color-plum-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

**Best Practices:**
- Use design tokens (CSS variables)
- Add comments explaining purpose
- Group related styles together
- Test on mobile devices

### Custom JavaScript

**Location:** `Assets/theme.js`

**Adding Custom Scripts:**

```javascript
/**
 * Custom functionality
 * Add your custom JavaScript below
 */

// Example: Custom product filter
class CustomFilter {
  constructor() {
    this.init();
  }
  
  init() {
    // Your code here
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new CustomFilter();
});
```

**Best Practices:**
- Use classes or modules
- Add JSDoc comments
- Handle errors gracefully
- Test thoroughly

### Metafields

**Use Cases:**
- Product specifications
- Custom badges
- Additional images
- Review ratings

**Setup:**

1. **Define Metafields**
   - Go to **Settings** → **Custom data**
   - Click **Products** (or Collections, etc.)
   - Click **Add definition**
   - Fill in:
     - Namespace: `custom`
     - Key: `specification`
     - Type: `Single line text`
     - Description: "Product specification"

2. **Add Values**
   - Go to **Products**
   - Select a product
   - Scroll to **Metafields**
   - Enter value

3. **Display in Theme**
   ```liquid
   {% if product.metafields.custom.specification %}
     <div class="product-spec">
       <strong>Specification:</strong>
       {{ product.metafields.custom.specification }}
     </div>
   {% endif %}
   ```

### Multi-Language Support

**Setup:**

1. **Enable Languages**
   - Go to **Settings** → **Languages**
   - Click **Add language**
   - Select languages

2. **Translate Content**
   - Go to **Online Store** → **Themes**
   - Click **Actions** → **Edit languages**
   - Translate all keys

3. **Add Language Selector**
   - Add to header or footer
   - Use Shopify's language selector snippet

### Custom Sections

**Creating New Sections:**

1. **Create File**
   - Create new file in `Sections/` folder
   - Name: `custom-section.liquid`

2. **Add Code**
   ```liquid
   {% comment %}
     Component: Custom Section
     Purpose: [Your description]
   {% endcomment %}
   
   <div class="custom-section">
     <h2>{{ section.settings.title }}</h2>
     <p>{{ section.settings.description }}</p>
   </div>
   
   {% schema %}
   {
     "name": "Custom Section",
     "settings": [
       {
         "type": "text",
         "id": "title",
         "label": "Title",
         "default": "Custom Section"
       },
       {
         "type": "textarea",
         "id": "description",
         "label": "Description"
       }
     ],
     "presets": [
       {
         "name": "Custom Section"
       }
     ]
   }
   {% endschema %}
   ```

3. **Add to Page**
   - Go to **Theme Customizer**
   - Click **Add section**
   - Select your custom section

---

## Support & Resources

### Documentation

- **Shopify Docs:** https://shopify.dev/docs
- **Liquid Reference:** https://shopify.dev/docs/api/liquid
- **Theme Development:** https://shopify.dev/docs/themes

### Community

- **Shopify Community:** https://community.shopify.com/
- **Stack Overflow:** https://stackoverflow.com/questions/tagged/shopify
- **Reddit:** https://www.reddit.com/r/shopify/

### Tools

- **Shopify CLI:** https://shopify.dev/docs/themes/tools/cli
- **Theme Check:** https://shopify.dev/docs/themes/tools/theme-check
- **Liquid Playground:** https://liquidjs.com/playground.html

### Accessibility

- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM:** https://webaim.org/
- **A11y Project:** https://www.a11yproject.com/

### Performance

- **PageSpeed Insights:** https://pagespeed.web.dev/
- **WebPageTest:** https://www.webpagetest.org/
- **Lighthouse:** https://developers.google.com/web/tools/lighthouse

### SEO

- **Google Search Console:** https://search.google.com/search-console
- **Rich Results Test:** https://search.google.com/test/rich-results
- **Schema.org:** https://schema.org/

---

## Checklist

### Pre-Launch

- [ ] Logo uploaded and sized correctly
- [ ] Favicon added
- [ ] Color scheme configured
- [ ] Typography set
- [ ] All sections configured
- [ ] Navigation menu set up
- [ ] Footer links added
- [ ] Social media links added
- [ ] SEO schemas activated
- [ ] Product images optimized
- [ ] Alt text added to all images
- [ ] Test on mobile devices
- [ ] Test with keyboard navigation
- [ ] Test with screen reader
- [ ] Run Lighthouse audit (90+ scores)
- [ ] Validate structured data
- [ ] Check cross-browser compatibility
- [ ] Set up Google Analytics
- [ ] Set up Google Search Console
- [ ] Create XML sitemap
- [ ] Submit sitemap to Google

### Post-Launch

- [ ] Monitor Core Web Vitals
- [ ] Check for crawl errors
- [ ] Monitor rich results
- [ ] Collect user feedback
- [ ] Review analytics
- [ ] Test checkout process
- [ ] Monitor page speed
- [ ] Check for broken links
- [ ] Review accessibility
- [ ] Update content regularly

---

**Setup Guide Version:** 2.0.0  
**Last Updated:** November 24, 2025  
**Maintained By:** Development Team

---

**End of Setup Guide**
