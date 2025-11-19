/**
 * Soleil Beauty Shop - Theme JavaScript
 * Version: 2.0
 * 
 * Features:
 * - Header scroll behavior
 * - Mobile menu
 * - AJAX cart functionality
 * - Quick view modal
 * - Product carousels
 * - Search functionality
 * - Wishlist
 * - Accessibility enhancements
 */

// =============================================================================
// Utility Functions
// =============================================================================

const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit = 100) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const fetchJSON = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const showNotification = (message, type = 'success') => {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification__content">
      <svg class="notification__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        ${type === 'success' 
          ? '<path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
          : '<path d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 6v4M10 14h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
        }
      </svg>
      <span class="notification__message">${message}</span>
    </div>
    <button type="button" class="notification__close" aria-label="Close notification">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  requestAnimationFrame(() => {
    notification.classList.add('notification--visible');
  });
  
  // Close button
  notification.querySelector('.notification__close').addEventListener('click', () => {
    closeNotification(notification);
  });
  
  // Auto close after 5 seconds
  setTimeout(() => {
    closeNotification(notification);
  }, 5000);
};

const closeNotification = (notification) => {
  notification.classList.remove('notification--visible');
  setTimeout(() => {
    notification.remove();
  }, 300);
};

// =============================================================================
// Header & Navigation
// =============================================================================

class Header {
  constructor() {
    this.header = document.querySelector('[data-header]');
    if (!this.header) return;
    
    this.lastScroll = 0;
    this.scrollThreshold = 100;
    
    this.init();
  }
  
  init() {
    this.handleScroll();
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
  }
  
  handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > this.scrollThreshold) {
      this.header.classList.add('header--scrolled');
    } else {
      this.header.classList.remove('header--scrolled');
    }
    
    // Hide/show header on scroll
    if (currentScroll > this.lastScroll && currentScroll > this.scrollThreshold) {
      this.header.classList.add('header--hidden');
    } else {
      this.header.classList.remove('header--hidden');
    }
    
    this.lastScroll = currentScroll;
  }
}

class MobileMenu {
  constructor() {
    this.menuToggle = document.querySelector('[data-mobile-menu-toggle]');
    this.menu = document.querySelector('[data-mobile-menu]');
    this.overlay = document.querySelector('[data-mobile-menu-overlay]');
    
    if (!this.menuToggle || !this.menu) return;
    
    this.isOpen = false;
    this.init();
  }
  
  init() {
    this.menuToggle.addEventListener('click', () => this.toggle());
    
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
    
    // Handle submenu toggles
    const submenuToggles = this.menu.querySelectorAll('[data-submenu-toggle]');
    submenuToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const submenu = toggle.nextElementSibling;
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        
        toggle.setAttribute('aria-expanded', !isExpanded);
        submenu.hidden = isExpanded;
      });
    });
  }
  
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  
  open() {
    this.isOpen = true;
    this.menu.classList.add('mobile-menu--open');
    this.menu.setAttribute('aria-hidden', 'false');
    this.menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    
    // Focus first focusable element
    const firstFocusable = this.menu.querySelector('a, button');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }
  
  close() {
    this.isOpen = false;
    this.menu.classList.remove('mobile-menu--open');
    this.menu.setAttribute('aria-hidden', 'true');
    this.menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    this.menuToggle.focus();
  }
}

// =============================================================================
// Cart Functionality
// =============================================================================

class Cart {
  constructor() {
    this.miniCart = document.querySelector('[data-mini-cart]');
    this.cartCount = document.querySelectorAll('[data-cart-count]');
    this.cartSubtotal = document.querySelector('[data-cart-subtotal]');
    this.cartItems = document.querySelector('[data-cart-items]');
    this.cartStatus = document.querySelector('[data-cart-status]');
    
    this.init();
  }
  
  init() {
    // Add to cart buttons
    document.addEventListener('click', (e) => {
      const addToCartBtn = e.target.closest('[data-add-to-cart]');
      if (addToCartBtn) {
        e.preventDefault();
        const variantId = addToCartBtn.dataset.variantId;
        const quantity = addToCartBtn.dataset.quantity || 1;
        this.addItem(variantId, quantity, addToCartBtn);
      }
      
      // Mini cart toggle
      const cartToggle = e.target.closest('[data-cart-toggle]');
      if (cartToggle) {
        e.preventDefault();
        this.openMiniCart();
      }
      
      // Mini cart close
      const cartClose = e.target.closest('[data-mini-cart-close]');
      if (cartClose) {
        this.closeMiniCart();
      }
      
      // Quantity controls
      const quantityIncrease = e.target.closest('[data-quantity-increase]');
      if (quantityIncrease) {
        const key = quantityIncrease.dataset.lineItemKey;
        const input = document.querySelector(`[data-quantity-input][data-line-item-key="${key}"]`);
        const newQuantity = parseInt(input.value) + 1;
        this.updateItem(key, newQuantity);
      }
      
      const quantityDecrease = e.target.closest('[data-quantity-decrease]');
      if (quantityDecrease) {
        const key = quantityDecrease.dataset.lineItemKey;
        const input = document.querySelector(`[data-quantity-input][data-line-item-key="${key}"]`);
        const newQuantity = Math.max(1, parseInt(input.value) - 1);
        this.updateItem(key, newQuantity);
      }
      
      // Remove item
      const removeBtn = e.target.closest('[data-cart-remove]');
      if (removeBtn) {
        const key = removeBtn.dataset.lineItemKey;
        this.removeItem(key);
      }
    });
    
    // Quantity input change
    document.addEventListener('change', (e) => {
      const quantityInput = e.target.closest('[data-quantity-input]');
      if (quantityInput) {
        const key = quantityInput.dataset.lineItemKey;
        const newQuantity = parseInt(quantityInput.value);
        if (newQuantity > 0) {
          this.updateItem(key, newQuantity);
        }
      }
    });
    
    // Cart note
    const cartNote = document.querySelector('[data-cart-note]');
    if (cartNote) {
      cartNote.addEventListener('change', debounce((e) => {
        this.updateNote(e.target.value);
      }, 500));
    }
  }
  
  async addItem(variantId, quantity, button) {
    try {
      // Show loading state
      if (button) {
        button.disabled = true;
        button.classList.add('btn--loading');
        const btnText = button.querySelector('.btn__text');
        const btnLoader = button.querySelector('.btn__loader');
        if (btnText) btnText.hidden = true;
        if (btnLoader) btnLoader.hidden = false;
      }
      
      const data = await fetchJSON('/cart/add.js', {
        method: 'POST',
        body: JSON.stringify({
          id: variantId,
          quantity: parseInt(quantity)
        })
      });
      
      // Update cart
      await this.refreshCart();
      
      // Show success notification
      showNotification(`${data.product_title} added to cart!`, 'success');
      
      // Open mini cart
      this.openMiniCart();
      
      // Announce to screen readers
      if (this.cartStatus) {
        this.cartStatus.textContent = `${data.product_title} added to cart. Cart now has ${data.quantity} items.`;
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Error adding item to cart. Please try again.', 'error');
    } finally {
      // Reset button state
      if (button) {
        button.disabled = false;
        button.classList.remove('btn--loading');
        const btnText = button.querySelector('.btn__text');
        const btnLoader = button.querySelector('.btn__loader');
        if (btnText) btnText.hidden = false;
        if (btnLoader) btnLoader.hidden = true;
      }
    }
  }
  
  async updateItem(key, quantity) {
    try {
      this.showLoading();
      
      await fetchJSON('/cart/change.js', {
        method: 'POST',
        body: JSON.stringify({
          id: key,
          quantity: quantity
        })
      });
      
      await this.refreshCart();
      
      if (this.cartStatus) {
        this.cartStatus.textContent = `Cart updated. Quantity changed to ${quantity}.`;
      }
      
    } catch (error) {
      console.error('Error updating cart:', error);
      showNotification('Error updating cart. Please try again.', 'error');
    } finally {
      this.hideLoading();
    }
  }
  
  async removeItem(key) {
    try {
      this.showLoading();
      
      await fetchJSON('/cart/change.js', {
        method: 'POST',
        body: JSON.stringify({
          id: key,
          quantity: 0
        })
      });
      
      await this.refreshCart();
      
      showNotification('Item removed from cart', 'success');
      
      if (this.cartStatus) {
        this.cartStatus.textContent = 'Item removed from cart.';
      }
      
    } catch (error) {
      console.error('Error removing item:', error);
      showNotification('Error removing item. Please try again.', 'error');
    } finally {
      this.hideLoading();
    }
  }
  
  async updateNote(note) {
    try {
      await fetchJSON('/cart/update.js', {
        method: 'POST',
        body: JSON.stringify({ note })
      });
    } catch (error) {
      console.error('Error updating cart note:', error);
    }
  }
  
  async refreshCart() {
    try {
      const cart = await fetchJSON('/cart.js');
      
      // Update cart count
      this.cartCount.forEach(el => {
        el.textContent = `(${cart.item_count})`;
      });
      
      // Update subtotal
      if (this.cartSubtotal) {
        this.cartSubtotal.textContent = this.formatMoney(cart.total_price);
      }
      
      // Reload cart items section
      if (this.cartItems) {
        const response = await fetch(window.location.href);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newCartItems = doc.querySelector('[data-cart-items]');
        
        if (newCartItems) {
          this.cartItems.innerHTML = newCartItems.innerHTML;
        }
      }
      
      return cart;
    } catch (error) {
      console.error('Error refreshing cart:', error);
      throw error;
    }
  }
  
  openMiniCart() {
    if (!this.miniCart) return;
    
    this.miniCart.classList.add('mini-cart--open');
    this.miniCart.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus first focusable element
    const firstFocusable = this.miniCart.querySelector('button, a');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
  }
  
  closeMiniCart() {
    if (!this.miniCart) return;
    
    this.miniCart.classList.remove('mini-cart--open');
    this.miniCart.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  
  showLoading() {
    const loading = document.querySelector('[data-cart-loading]');
    if (loading) {
      loading.hidden = false;
    }
  }
  
  hideLoading() {
    const loading = document.querySelector('[data-cart-loading]');
    if (loading) {
      loading.hidden = true;
    }
  }
  
  formatMoney(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }
}

// =============================================================================
// Quick View Modal
// =============================================================================

class QuickView {
  constructor() {
    this.modal = null;
    this.init();
  }
  
  init() {
    document.addEventListener('click', async (e) => {
      const quickViewBtn = e.target.closest('[data-quick-view]');
      if (quickViewBtn) {
        e.preventDefault();
        const handle = quickViewBtn.dataset.productHandle;
        await this.open(handle);
      }
      
      const closeBtn = e.target.closest('[data-quick-view-close]');
      if (closeBtn) {
        this.close();
      }
      
      // Close on overlay click
      if (e.target.classList.contains('modal__overlay')) {
        this.close();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal) {
        this.close();
      }
    });
  }
  
  async open(handle) {
    try {
      // Fetch product data
      const product = await fetchJSON(`/products/${handle}.js`);
      
      // Create modal
      this.createModal(product);
      
      // Show modal
      document.body.appendChild(this.modal);
      document.body.style.overflow = 'hidden';
      
      requestAnimationFrame(() => {
        this.modal.classList.add('modal--open');
      });
      
      // Focus close button
      const closeBtn = this.modal.querySelector('[data-quick-view-close]');
      if (closeBtn) {
        closeBtn.focus();
      }
      
    } catch (error) {
      console.error('Error loading product:', error);
      showNotification('Error loading product. Please try again.', 'error');
    }
  }
  
  close() {
    if (!this.modal) return;
    
    this.modal.classList.remove('modal--open');
    document.body.style.overflow = '';
    
    setTimeout(() => {
      this.modal.remove();
      this.modal = null;
    }, 300);
  }
  
  createModal(product) {
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.setAttribute('aria-labelledby', 'quick-view-title');
    
    const onSale = product.compare_at_price > product.price;
    
    this.modal.innerHTML = `
      <div class="modal__overlay"></div>
      <div class="modal__content">
        <button type="button" class="modal__close" data-quick-view-close aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <div class="quick-view">
          <div class="quick-view__images">
            <img
              src="${product.featured_image}"
              alt="${product.title}"
              class="quick-view__image"
            />
          </div>
          
          <div class="quick-view__info">
            ${product.vendor ? `<p class="quick-view__vendor">${product.vendor}</p>` : ''}
            <h2 class="quick-view__title" id="quick-view-title">${product.title}</h2>
            
            <div class="quick-view__price">
              ${onSale ? `
                <span class="price price--on-sale">
                  <span class="price__sale">${this.formatMoney(product.price)}</span>
                  <s class="price__compare">${this.formatMoney(product.compare_at_price)}</s>
                </span>
              ` : `
                <span class="price">${this.formatMoney(product.price)}</span>
              `}
            </div>
            
            ${product.description ? `
              <div class="quick-view__description">
                ${product.description}
              </div>
            ` : ''}
            
            <div class="quick-view__actions">
              ${product.available ? `
                <button
                  type="button"
                  class="btn btn--primary btn--full"
                  data-add-to-cart
                  data-variant-id="${product.variants[0].id}"
                >
                  <span class="btn__text">Add to Cart</span>
                  <span class="btn__loader" hidden>
                    <svg class="spinner" width="20" height="20" viewBox="0 0 20 20">
                      <circle class="spinner__path" cx="10" cy="10" r="8" fill="none" stroke-width="2"/>
                    </svg>
                  </span>
                </button>
              ` : `
                <button type="button" class="btn btn--secondary btn--full" disabled>
                  Sold Out
                </button>
              `}
              
              <a href="${product.url}" class="btn btn--outline btn--full">
                View Full Details
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  formatMoney(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }
}

// =============================================================================
// Wishlist
// =============================================================================

class Wishlist {
  constructor() {
    this.storageKey = 'soleil_wishlist';
    this.items = this.load();
    this.init();
  }
  
  init() {
    // Update UI on page load
    this.updateUI();
    
    // Toggle wishlist
    document.addEventListener('click', (e) => {
      const wishlistBtn = e.target.closest('[data-wishlist-toggle]');
      if (wishlistBtn) {
        e.preventDefault();
        const handle = wishlistBtn.dataset.productHandle;
        this.toggle(handle);
        wishlistBtn.classList.toggle('is-active');
      }
    });
  }
  
  toggle(handle) {
    if (this.items.includes(handle)) {
      this.remove(handle);
      showNotification('Removed from wishlist', 'success');
    } else {
      this.add(handle);
      showNotification('Added to wishlist', 'success');
    }
  }
  
  add(handle) {
    if (!this.items.includes(handle)) {
      this.items.push(handle);
      this.save();
      this.updateUI();
    }
  }
  
  remove(handle) {
    this.items = this.items.filter(item => item !== handle);
    this.save();
    this.updateUI();
  }
  
  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading wishlist:', error);
      return [];
    }
  }
  
  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  }
  
  updateUI() {
    // Update wishlist buttons
    document.querySelectorAll('[data-wishlist-toggle]').forEach(btn => {
      const handle = btn.dataset.productHandle;
      if (this.items.includes(handle)) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
    
    // Update wishlist count
    const wishlistCount = document.querySelectorAll('[data-wishlist-count]');
    wishlistCount.forEach(el => {
      el.textContent = this.items.length;
    });
  }
}

// =============================================================================
// Carousel
// =============================================================================

class Carousel {
  constructor(element) {
    this.carousel = element;
    this.track = this.carousel.querySelector('[data-carousel-track]');
    this.slides = Array.from(this.track.children);
    this.prevBtn = this.carousel.querySelector('[data-carousel-prev]');
    this.nextBtn = this.carousel.querySelector('[data-carousel-next]');
    this.dotsContainer = this.carousel.querySelector('[data-carousel-dots]');
    
    this.currentIndex = 0;
    this.autoplayInterval = null;
    this.autoplayDelay = parseInt(this.carousel.dataset.autoplayDelay) || 5000;
    
    this.init();
  }
  
  init() {
    if (this.slides.length === 0) return;
    
    // Create dots
    if (this.dotsContainer) {
      this.createDots();
    }
    
    // Button events
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }
    
    // Keyboard navigation
    this.carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
    
    // Touch/swipe support
    this.addSwipeSupport();
    
    // Autoplay
    if (this.carousel.dataset.autoplay === 'true') {
      this.startAutoplay();
      
      // Pause on hover
      this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
      this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    // Initial update
    this.updateCarousel();
  }
  
  createDots() {
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel__dot';
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => this.goTo(index));
      this.dotsContainer.appendChild(dot);
    });
  }
  
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateCarousel();
  }
  
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateCarousel();
  }
  
  goTo(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }
  
  updateCarousel() {
    // Move track
    const slideWidth = this.slides[0].offsetWidth;
    this.track.style.transform = `translateX(-${this.currentIndex * slideWidth}px)`;
    
    // Update dots
    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.carousel__dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('carousel__dot--active', index === this.currentIndex);
      });
    }
    
    // Update buttons
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
    }
    
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex === this.slides.length - 1;
    }
  }
  
  addSwipeSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    this.carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
    
    const handleSwipe = () => {
      if (touchEndX < touchStartX - 50) this.next();
      if (touchEndX > touchStartX + 50) this.prev();
    };
    
    this.handleSwipe = handleSwipe;
  }
  
  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.next();
    }, this.autoplayDelay);
  }
  
  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// =============================================================================
// Back to Top
// =============================================================================

class BackToTop {
  constructor() {
    this.button = document.querySelector('[data-back-to-top]');
    if (!this.button) return;
    
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', throttle(() => {
      if (window.pageYOffset > 500) {
        this.button.hidden = false;
      } else {
        this.button.hidden = true;
      }
    }, 100));
    
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// =============================================================================
// Initialize Everything
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  new Header();
  new MobileMenu();
  new Cart();
  new QuickView();
  new Wishlist();
  new BackToTop();
  
  // Initialize all carousels
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    new Carousel(carousel);
  });
  
  // Scroll indicator
  document.querySelectorAll('[data-scroll-to-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextSection = btn.closest('section').nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Parallax effect
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', throttle(() => {
      parallaxElements.forEach(el => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        el.style.transform = `translateY(${rate}px)`;
      });
    }, 10));
  }
  
  console.log('Soleil Beauty Shop theme initialized ✨');
});
