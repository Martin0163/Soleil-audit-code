# Soleil Integration: Implementation Guide

**Date:** February 11, 2026  
**Scope:** Integration of "Codigo Soleil" custom theme into "Soleil Horizon Code" (Horizon v3.2.1)  
**Total Files Added:** 31 new files  
**Files Modified:** 3 existing files (locales + settings)

---

## Table of Contents

1. [Audit Summary](#1-audit-summary)
2. [Integration Overview](#2-integration-overview)
3. [Files Added](#3-files-added)
4. [Files Modified](#4-files-modified)
5. [Corrections and Modifications](#5-corrections-and-modifications)
6. [Replication Instructions](#6-replication-instructions)
7. [Dependencies and Configuration](#7-dependencies-and-configuration)
8. [Runtime Considerations](#8-runtime-considerations)
9. [Testing Checklist](#9-testing-checklist)

---

## 1. Audit Summary

### Architecture Comparison

| Aspect | Codigo Soleil | Soleil Horizon Code |
|--------|--------------|---------------------|
| Base Theme | Custom adaptation v1.0.0 | Horizon v3.2.1 by Shopify |
| Total Files | 144 | 418 (now 449) |
| Template Format | `.liquid` (direct sections) | `.json` (JSON templates) |
| Settings Schema | 10 sections, hardcoded labels | 18 sections, `t:` translation keys |
| Color System | Flat CSS variables (gold/burgundy) | `color_scheme_group` with alpha |
| Locale Structure | `general.*` nested keys | Flat top-level keys |
| CSS Approach | Inline `<style>` + standalone files | `{% stylesheet %}` blocks + `base.css` |
| JS Approach | Global IIFE patterns | ES modules with `importmap` |
| Directory Casing | PascalCase (`Assets/`, `Blocks/`) | lowercase (`assets/`, `blocks/`) |

### Issues Identified During Audit

#### Critical Issues (Resolved)
1. **Template Format Conflict** — Codigo Soleil uses `.liquid` templates; Horizon uses `.json`. Created new `.json` templates that reference the integrated sections.
2. **CSS Variable Conflicts** — Both themes define `:root` variables with different names/values. Resolved by keeping Codigo Soleil's variables scoped within their own sections (inline `<style>` blocks).
3. **Snippet Name Conflicts** — Both themes have `button.liquid`, `price.liquid`, `color-schemes.liquid`, etc. Resolved by prefixing all Codigo Soleil snippets with `soleil-`.
4. **Section Name Conflicts** — Both have `header.liquid`, `footer.liquid`, `hero.liquid`, `promotions.liquid`. Resolved by prefixing custom sections with `soleil-`.
5. **Locale Key Incompatibility** — Different key structures. Resolved by adding a `soleil` namespace to Horizon's locale files.

#### Structural Issues (Resolved)
6. **JavaScript Architecture Mismatch** — Codigo Soleil uses global IIFE patterns; Horizon uses ES modules. Resolved by keeping JS files separate (prefixed) so they don't interfere.
7. **Duplicate File** — `gift_card (1).liquid` was identical to `gift_card.liquid`. Excluded from integration.
8. **Missing Asset Reference** — Codigo Soleil's `theme.liquid` references `non-critical.css` which doesn't exist. Not carried over.
9. **Config Schema Incompatibility** — Different color system formats. Resolved by adding Soleil brand color schemes to Horizon's `settings_data.json`.

#### Redundancies Identified
10. **Block Overlap** — 87 blocks in Codigo Soleil overlap with Horizon's 93 blocks (same base theme). Not copied since Horizon's versions are more current.
11. **Layout Overlap** — Both have `theme.liquid`. Horizon's version is kept as the primary layout.
12. **Config Schema Overlap** — Horizon's `settings_schema.json` is a superset. Not modified.

---

## 2. Integration Overview

### Strategy
All Codigo Soleil files were integrated using a **namespace prefix strategy** (`soleil-`) to ensure zero conflicts with existing Horizon functionality. This means:

- Existing Horizon sections, snippets, and assets are **completely untouched**
- New Codigo Soleil components operate **independently** alongside Horizon components
- Both systems can be used simultaneously in the theme editor
- Removal of integrated files would have **zero impact** on Horizon functionality

### What Was Integrated
- **8 custom sections** — Unique page sections not present in Horizon (about us, brands, dreams, new arrivals, mini cart, promotions banner, product filters, products listing)
- **16 custom snippets** — Reusable components for the custom sections (product cards, carousels, ratings, SEO schemas, design tokens, etc.)
- **4 custom assets** — CSS and JavaScript files for custom functionality
- **3 JSON templates** — Page templates for custom pages (about us, brands, new arrivals)

### What Was NOT Integrated (and Why)
- **Blocks (87 files)** — Nearly identical to Horizon's blocks; Horizon's versions are newer
- **Layout (theme.liquid)** — Horizon's layout is more feature-rich; Codigo Soleil's layout functionality is preserved in sections
- **Config (settings_schema.json)** — Horizon's schema is a superset; brand colors added to settings_data.json instead
- **Existing Horizon sections** (header, footer, hero, promotions) — Already present in Horizon with more features

---

## 3. Files Added

### Sections (8 files) — `sections/`
| File | Purpose |
|------|---------|
| `soleil-about-us.liquid` | About Us page with hero, story, timeline, values, team, video, testimonials |
| `soleil-brands.liquid` | Brand showcase grid with logos and hover effects |
| `soleil-dreams.liquid` | Split-layout content + media with features and floating stats |
| `soleil-new-arrivals.liquid` | New arrivals grid/slider with collection selection |
| `soleil-mini-cart.liquid` | Slide-out cart drawer with shipping bar and quantity controls |
| `soleil-promotions-banner.liquid` | Promotional banner with countdown timer and dismissal |
| `soleil-product-filters.liquid` | Filter sidebar with price range, brand, color, size filters |
| `soleil-products.liquid` | Products listing with filters, sorting, and pagination |

### Snippets (16 files) — `snippets/`
| File | Purpose |
|------|---------|
| `soleil-brand.liquid` | Individual brand card component |
| `soleil-carousel.liquid` | Accessible carousel/slider with keyboard navigation |
| `soleil-product-card.liquid` | Product card with badges, quick actions, swatches |
| `soleil-product-filters.liquid` | Filter sidebar component |
| `soleil-product-rating.liquid` | Star rating display with accessibility |
| `soleil-quick-view.liquid` | Quick view modal content |
| `soleil-price.liquid` | Price display with sale/compare pricing |
| `soleil-button.liquid` | Button component with multiple styles |
| `soleil-accessibility-helpers.liquid` | Accessibility utilities and CSS |
| `soleil-design-tokens.liquid` | Design system tokens (colors, spacing, typography) |
| `soleil-color-schemes.liquid` | Color scheme CSS classes |
| `soleil-theme-styles-variables.liquid` | Theme style CSS variables |
| `soleil-seo-schema-breadcrumbs.liquid` | Breadcrumb structured data |
| `soleil-seo-schema-organization.liquid` | Organization structured data |
| `soleil-seo-schema-product.liquid` | Product structured data |
| `soleil-seo-schema-website.liquid` | Website structured data |

### Assets (4 files) — `assets/`
| File | Purpose |
|------|---------|
| `soleil-theme.css` | Complete CSS for all Codigo Soleil sections (3600+ lines) |
| `soleil-ajax-cart.js` | AJAX cart functionality (add, update, remove items) |
| `soleil-theme.js` | Theme JavaScript (modals, search, animations) |
| `soleil-critical.js` | Critical path JavaScript (performance, lazy loading) |

### Templates (3 files) — `templates/`
| File | Purpose |
|------|---------|
| `page.soleil-about-us.json` | About Us page template |
| `page.soleil-brands.json` | Brands page template |
| `page.soleil-new-arrivals.json` | New Arrivals page template |

---

## 4. Files Modified

### `locales/en.default.json`
- **What changed:** Added `soleil` namespace with English translation keys
- **Why:** Codigo Soleil sections reference custom translation keys not present in Horizon
- **Keys added:** `soleil.general.*`, `soleil.products.*`, `soleil.cart.*`, `soleil.collections.*`, `soleil.sections.*`, `soleil.accessibility.*`

### `locales/es.json`
- **What changed:** Added `soleil` namespace with Spanish translation keys
- **Why:** Same as above, for Spanish language support
- **Keys added:** Same structure as English, fully translated to Spanish

### `config/settings_data.json`
- **What changed:** Added two Soleil brand color schemes
- **Why:** Codigo Soleil uses a burgundy/gold brand palette not present in Horizon's defaults
- **Schemes added:**
  - `scheme-soleil-1` — Light theme (white background, burgundy #46202f primary)
  - `scheme-soleil-2` — Dark theme (dark background #121212, mauve #dfd2d7 primary)

---

## 5. Corrections and Modifications

### Reference Updates (Applied to All Copied Files)
Every copied file had its internal references updated:

| Original Reference | Updated Reference | Reason |
|-------------------|-------------------|--------|
| `{% render 'brand' %}` | `{% render 'soleil-brand' %}` | Avoid conflict with potential Horizon snippet |
| `{% render 'product_card' %}` | `{% render 'soleil-product-card' %}` | Avoid conflict with Horizon's `product-card.liquid` |
| `{% render 'price' %}` | `{% render 'soleil-price' %}` | Avoid conflict with Horizon's `price.liquid` |
| `{% render 'button' %}` | `{% render 'soleil-button' %}` | Avoid conflict with Horizon's `button.liquid` |
| `{% render 'carousel' %}` | `{% render 'soleil-carousel' %}` | No Horizon equivalent, but prefixed for consistency |
| `{% render 'product_rating' %}` | `{% render 'soleil-product-rating' %}` | No Horizon equivalent, prefixed for consistency |
| `{% section 'about_us' %}` | `{% section 'soleil-about-us' %}` | Match new section filename |
| `{% section 'brands' %}` | `{% section 'soleil-brands' %}` | Match new section filename |
| (and 20+ more similar replacements) | | |

### Documentation Added
Every integrated file includes a comment header documenting:
- Source file path in Codigo Soleil
- Integration date
- Purpose of the file
- Changes made during integration
- Dependencies required
- Future considerations

---

## 6. Replication Instructions

### Prerequisites
- Shopify CLI or access to Shopify theme editor
- The "Soleil Horizon Code" theme deployed to a Shopify store

### Step-by-Step Integration

#### Step 1: Deploy Files
Upload all 31 new files to their respective directories in the Shopify theme:

```
sections/soleil-about-us.liquid
sections/soleil-brands.liquid
sections/soleil-dreams.liquid
sections/soleil-mini-cart.liquid
sections/soleil-new-arrivals.liquid
sections/soleil-product-filters.liquid
sections/soleil-products.liquid
sections/soleil-promotions-banner.liquid
snippets/soleil-*.liquid (16 files)
assets/soleil-*.css, soleil-*.js (4 files)
templates/page.soleil-*.json (3 files)
```

#### Step 2: Update Locale Files
Merge the `soleil` namespace into your locale files:
- Add the `soleil` key and all its nested keys to `locales/en.default.json`
- Add the `soleil` key and all its nested keys to `locales/es.json`
- For other languages, copy the English keys and translate as needed

#### Step 3: Update Settings Data
Add the Soleil brand color schemes to `config/settings_data.json`:
- Add `scheme-soleil-1` (light burgundy theme)
- Add `scheme-soleil-2` (dark mauve theme)

#### Step 4: Create Pages in Shopify Admin
1. Go to **Online Store > Pages**
2. Create pages and assign the new templates:
   - "About Us" page → `page.soleil-about-us` template
   - "Brands" page → `page.soleil-brands` template
   - "New Arrivals" page → `page.soleil-new-arrivals` template

#### Step 5: Configure Sections
1. Go to **Online Store > Themes > Customize**
2. Navigate to each new page
3. Configure the soleil-* sections with your content (images, text, collections)

---

## 7. Dependencies and Configuration

### CSS Dependencies
The Codigo Soleil sections use custom CSS variables defined in:
- `snippets/soleil-design-tokens.liquid` — Core design tokens
- `assets/soleil-theme.css` — Complete theme stylesheet

These variables are **self-contained** within each section's `<style>` blocks and do not require global inclusion. However, for consistent styling across all Soleil sections, you may optionally include the design tokens in your layout:

```liquid
{%- comment -%} Optional: Include in layout/theme.liquid for global Soleil styling {%- endcomment -%}
{% render 'soleil-design-tokens' %}
```

### JavaScript Dependencies
- `assets/soleil-ajax-cart.js` — Required for the `soleil-mini-cart` section
- `assets/soleil-theme.js` — Required for modal management and search overlay
- `assets/soleil-critical.js` — Optional performance enhancements

To load these, add to your layout or specific sections:
```liquid
<script src="{{ 'soleil-ajax-cart.js' | asset_url }}" defer></script>
<script src="{{ 'soleil-theme.js' | asset_url }}" defer></script>
```

### Translation Dependencies
All Soleil sections use translation keys under the `soleil.*` namespace. Ensure these keys exist in all active locale files.

### Color Scheme Dependencies
Soleil sections use their own CSS variables by default. To use Horizon's color scheme system instead, update the section's `{% schema %}` to include `color_scheme` settings.

---

## 8. Runtime Considerations

### Performance
- Soleil sections include inline `<style>` and `<script>` blocks. These are only loaded when the section is rendered on a page, so there is **no performance impact** on pages that don't use Soleil sections.
- The `soleil-theme.css` file (3600+ lines) is only loaded if explicitly referenced. Consider using `preload` for pages that use multiple Soleil sections.

### Compatibility
- **Shopify OS 2.0** — All integrated sections are compatible with Shopify's Online Store 2.0 architecture
- **Theme Editor** — Soleil sections appear in the theme editor with their `{% schema %}` settings
- **Mobile** — All sections include responsive CSS with mobile breakpoints
- **Accessibility** — Soleil sections include ARIA labels, keyboard navigation, and screen reader support

### Known Limitations
1. **Soleil Mini Cart vs Horizon Cart Drawer** — Both provide cart drawer functionality. Use one or the other, not both simultaneously. The Horizon cart drawer (`settings.cart_type = 'drawer'`) is recommended for consistency.
2. **Search Overlay** — Codigo Soleil's search overlay (in `theme.liquid`) was not integrated. Use Horizon's `search-modal.liquid` instead.
3. **Header/Footer** — Codigo Soleil's header and footer were not integrated. Use Horizon's header and footer sections, which are more feature-rich.
4. **Translation Fallbacks** — Some Soleil sections use hardcoded English fallback strings in `| t | default:` patterns. These will display in English if translation keys are missing.

### Upgrade Path
When upgrading the Horizon base theme:
1. All `soleil-*` files are independent and won't be affected by Horizon updates
2. Re-apply the `soleil` namespace to locale files after any locale file updates
3. Re-apply the Soleil color schemes to `settings_data.json` after settings updates

---

## 9. Testing Checklist

### File Integrity
- [x] All 31 new files created successfully
- [x] All JSON files are syntactically valid
- [x] All Liquid render references resolve to existing snippets
- [x] All section type references in JSON templates resolve to existing sections
- [x] No broken asset references in integrated files
- [x] Integration comments present in all new files

### Functional Testing (To Be Done in Shopify)
- [ ] Soleil About Us section renders correctly
- [ ] Soleil Brands section displays brand grid
- [ ] Soleil Dreams section shows split layout
- [ ] Soleil New Arrivals section loads products from collection
- [ ] Soleil Mini Cart drawer opens and closes
- [ ] Soleil Promotions Banner displays with countdown
- [ ] Soleil Product Filters sidebar works on collection pages
- [ ] Soleil Products section displays product grid
- [ ] All sections are configurable in theme editor
- [ ] Spanish translations display correctly
- [ ] Soleil color schemes apply correctly
- [ ] Mobile responsive layouts work
- [ ] Keyboard navigation works on carousels and modals
- [ ] No console errors on pages using Soleil sections
- [ ] Horizon sections continue to work normally (regression test)

---

## Appendix: File Mapping Reference

| Codigo Soleil Source | Soleil Horizon Code Destination |
|---------------------|-------------------------------|
| `Sections/about_us.liquid` | `sections/soleil-about-us.liquid` |
| `Sections/brands.liquid` | `sections/soleil-brands.liquid` |
| `Sections/dreams.liquid` | `sections/soleil-dreams.liquid` |
| `Sections/new_arrivals.liquid` | `sections/soleil-new-arrivals.liquid` |
| `Sections/mini_cart.liquid` | `sections/soleil-mini-cart.liquid` |
| `Sections/promotions_banner.liquid` | `sections/soleil-promotions-banner.liquid` |
| `Sections/product_filters.liquid` | `sections/soleil-product-filters.liquid` |
| `Sections/products.liquid` | `sections/soleil-products.liquid` |
| `Snippets/brand.liquid` | `snippets/soleil-brand.liquid` |
| `Snippets/carousel.liquid` | `snippets/soleil-carousel.liquid` |
| `Snippets/product_card.liquid` | `snippets/soleil-product-card.liquid` |
| `Snippets/product_filters.liquid` | `snippets/soleil-product-filters.liquid` |
| `Snippets/product_rating.liquid` | `snippets/soleil-product-rating.liquid` |
| `Snippets/quick_view.liquid` | `snippets/soleil-quick-view.liquid` |
| `Snippets/accessibility-helpers.liquid` | `snippets/soleil-accessibility-helpers.liquid` |
| `Snippets/design-tokens.liquid` | `snippets/soleil-design-tokens.liquid` |
| `Snippets/price.liquid` | `snippets/soleil-price.liquid` |
| `Snippets/button.liquid` | `snippets/soleil-button.liquid` |
| `Snippets/color-schemes.liquid` | `snippets/soleil-color-schemes.liquid` |
| `Snippets/theme-styles-variables.liquid` | `snippets/soleil-theme-styles-variables.liquid` |
| `Snippets/seo-schema-breadcrumbs.liquid` | `snippets/soleil-seo-schema-breadcrumbs.liquid` |
| `Snippets/seo-schema-organization.liquid` | `snippets/soleil-seo-schema-organization.liquid` |
| `Snippets/seo-schema-product.liquid` | `snippets/soleil-seo-schema-product.liquid` |
| `Snippets/seo-schema-website.liquid` | `snippets/soleil-seo-schema-website.liquid` |
| `Assets/ajax-cart.js` | `assets/soleil-ajax-cart.js` |
| `Assets/critical.js` | `assets/soleil-critical.js` |
| `Assets/theme.js` | `assets/soleil-theme.js` |
| `Assets/theme.css` | `assets/soleil-theme.css` |
| `Templates/page.about_us.liquid` | `templates/page.soleil-about-us.json` |
| `Templates/page.brands.liquid` | `templates/page.soleil-brands.json` |
| `Templates/page.new_arrivals.liquid` | `templates/page.soleil-new-arrivals.json` |
| *(locale merge)* | `locales/en.default.json` (modified) |
| *(locale merge)* | `locales/es.json` (modified) |
| *(settings merge)* | `config/settings_data.json` (modified) |
