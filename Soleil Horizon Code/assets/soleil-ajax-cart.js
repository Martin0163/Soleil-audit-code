/**
 * INTEGRATED FROM: Codigo Soleil (Assets/ajax-cart.js)
 * INTEGRATION DATE: 2026-02-11
 * CHANGES: Renamed with soleil- prefix to avoid conflicts with Horizon assets
 * NOTE: Uses Codigo Soleil's custom patterns (global IIFE, window.* globals)
 */

/**
 * Enhanced Ajax Cart for Soleil Beauty
 * Improved version with better error handling, performance, and UX
 */

class EnhancedAjaxCart {
  constructor() {
    this.cart = null;
    this.isUpdating = false;
    this.updateQueue = [];
    this.config = {
      freeShippingThreshold: 50000, // $500 MXN in cents
      currency: 'MXN',
      locale: 'es-MX',
      autoOpenDrawer: true,
      notificationDuration: 3000,
      maxRetries: 3
    };
    this.init();
  }

  init() {
    try {
      this.bindEvents();
      this.getCart();
      this.initializeDrawerEvents();
      this.setupKeyboardNavigation();
    } catch (error) {
      console.error('Cart initialization failed:', error);
    }
  }

  bindEvents() {
    // Add to cart forms with error handling
    document.addEventListener('submit', (e) => {
      if (e.target.matches('form[action="/cart/add"]')) {
        e.preventDefault();
        this.addItem(e.target);
      }
    });

    // Update cart quantity with debouncing
    document.addEventListener('change', (e) => {
      if (e.target.matches('.cart-quantity-input, [data-quantity-input]')) {
        this.debounce(() => this.updateItem(e.target), 500)();
      }
    });

    // Remove from cart
    document.addEventListener('click', (e) => {
      if (e.target.closest('.cart-remove-btn, [data-remove-item]')) {
        e.preventDefault();
        const btn = e.target.closest('.cart-remove-btn, [data-remove-item]');
        const key = btn.dataset.key || btn.dataset.line;
        this.removeItem(key);
      }
    });

    // Cart note update with debouncing
    const cartNote = document.querySelector('#cart-note');
    if (cartNote) {
      cartNote.addEventListener('input', this.debounce(() => {
        this.updateNote(cartNote.value);
      }, 1000));
    }

    // Quantity controls
    document.addEventListener('click', (e) => {
      if (e.target.matches('.quantity-minus, [data-quantity-minus]')) {
        e.preventDefault();
        this.handleQuantityChange(e.target, -1);
      }
      if (e.target.matches('.quantity-plus, [data-quantity-plus]')) {
        e.preventDefault();
        this.handleQuantityChange(e.target, 1);
      }
    });
  }

  initializeDrawerEvents() {
    // Cart drawer toggle
    document.addEventListener('click', (e) => {
      if (e.target.closest('.cart-toggle, [data-cart-toggle]')) {
        e.preventDefault();
        this.toggleCartDrawer();
      }
      
      if (e.target.closest('.cart-drawer-close, .mini-cart-close')) {
        e.preventDefault();
        this.closeCartDrawer();
      }

      // Close on overlay click
      if (e.target.matches('.cart-drawer-overlay, .mini-cart-overlay')) {
        this.closeCartDrawer();
      }
    });
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const cartDrawer = document.querySelector('.mini-cart.is-open, .cart-drawer.is-open');
        if (cartDrawer) {
          this.closeCartDrawer();
        }
      }
    });
  }

  async getCart() {
    try {
      const response = await fetch('/cart.js');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      this.cart = await response.json();
      this.updateUI();
      return this.cart;
    } catch (error) {
      console.error('Error fetching cart:', error);
      this.showNotification('Error loading cart data', 'error');
      return null;
    }
  }

  async addItem(form) {
    if (this.isUpdating) return;
    
    this.isUpdating = true;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn?.textContent;
    
    // Add loading state
    this.setButtonLoading(submitBtn, true);

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle Shopify-specific errors
        const errorMessage = responseData.message || responseData.description || 'Failed to add item';
        throw new Error(errorMessage);
      }

      // Refresh cart
      await this.getCart();
      
      // Show success notification
      const productName = responseData.product_title || 'Item';
      this.showNotification(`${productName} ${theme.strings.itemAdded}`, 'success');
      
      // Open cart drawer if enabled
      if (this.config.autoOpenDrawer) {
        this.openCartDrawer();
      }
      
      // Dispatch custom event
      this.dispatchEvent('cart:item-added', { 
        item: responseData,
        cart: this.cart 
      });
      
    } catch (error) {
      console.error('Error adding item:', error);
      this.showNotification(error.message || 'Error adding item to cart', 'error');
    } finally {
      this.setButtonLoading(submitBtn, false, originalText);
      this.isUpdating = false;
    }
  }

  handleQuantityChange(button, change) {
    const line = button.dataset.line;
    const input = document.querySelector(`[data-quantity-input][data-line="${line}"], [data-line="${line}"] input`);
    
    if (!input) return;

    const currentValue = parseInt(input.value) || 0;
    const newValue = Math.max(0, currentValue + change);
    
    input.value = newValue;
    
    if (newValue === 0) {
      this.removeItem(line);
    } else {
      this.updateItem(input);
    }
  }

  async updateItem(input) {
    if (this.isUpdating) {
      this.updateQueue.push(() => this.updateItem(input));
      return;
    }

    this.isUpdating = true;
    const line = parseInt(input.dataset.line);
    const quantity = parseInt(input.value);
    const originalValue = input.dataset.originalValue || input.defaultValue;

    // Validate quantity
    if (quantity < 0) {
      input.value = originalValue;
      this.isUpdating = false;
      return;
    }

    // Store original value for rollback
    input.dataset.originalValue = originalValue;

    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: line, quantity: quantity })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.cart = await response.json();
      this.updateUI();
      
      // Update stored value
      input.dataset.originalValue = quantity;
      
      this.dispatchEvent('cart:updated', { 
        cart: this.cart,
        line: line,
        quantity: quantity
      });
      
    } catch (error) {
      console.error('Error updating item:', error);
      // Rollback on error
      input.value = originalValue;
      this.showNotification('Error updating cart', 'error');
    } finally {
      this.isUpdating = false;
      this.processQueue();
    }
  }

  async removeItem(key) {
    if (this.isUpdating) return;
    
    this.isUpdating = true;
    const lineItem = document.querySelector(`[data-line="${key}"]`);

    // Add loading state
    if (lineItem) {
      lineItem.style.opacity = '0.5';
      lineItem.style.pointerEvents = 'none';
    }

    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: 0 })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.cart = await response.json();
      
      // Animate removal
      if (lineItem) {
        lineItem.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          lineItem.remove();
          this.updateUI();
        }, 300);
      } else {
        this.updateUI();
      }

      this.dispatchEvent('cart:item-removed', { cart: this.cart, key });
      this.showNotification(theme.strings.itemRemoved, 'success');

    } catch (error) {
      console.error('Error removing item:', error);
      this.showNotification('Error removing item', 'error');
      
      // Restore item state
      if (lineItem) {
        lineItem.style.opacity = '1';
        lineItem.style.pointerEvents = 'auto';
      }
    } finally {
      this.isUpdating = false;
    }
  }

  async updateNote(note) {
    try {
      const response = await fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: note })
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      this.cart = await response.json();
      this.dispatchEvent('cart:note-updated', { note: note, cart: this.cart });
      
    } catch (error) {
      console.error('Error updating note:', error);
      this.showNotification('Error updating cart note', 'error');
    }
  }

  updateUI() {
    if (!this.cart) return;

    try {
      // Update cart count with animation
      this.updateCartCount();
      
      // Update pricing
      this.updateCartPricing();
      
      // Update free shipping progress
      this.updateShippingProgress();
      
      // Update empty state
      this.updateEmptyState();

      // Announce to screen readers
      this.announceToScreenReader(`Cart updated. ${this.cart.item_count} items, total ${this.formatMoney(this.cart.total_price)}`);
    } catch (error) {
      console.error('Error updating UI:', error);
    }
  }

  updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(count => {
      const currentCount = parseInt(count.textContent) || 0;
      const newCount = this.cart.item_count;
      
      if (currentCount !== newCount) {
        count.textContent = newCount;
        
        // Add animation class
        count.classList.add('cart-count-updated');
        setTimeout(() => {
          count.classList.remove('cart-count-updated');
        }, 300);
      }
      
      count.classList.toggle('has-items', newCount > 0);
      
      // Update ARIA label
      const cartToggle = count.closest('[aria-label*="cart"]');
      if (cartToggle) {
        cartToggle.setAttribute('aria-label', `Open cart (${newCount} items)`);
      }
    });
  }

  updateCartPricing() {
    // Update cart total
    const cartTotals = document.querySelectorAll('.cart-total-price, .cart-subtotal-price');
    cartTotals.forEach(total => {
      total.textContent = this.formatMoney(this.cart.total_price);
    });

    // Update original total if there are discounts
    if (this.cart.original_total_price > this.cart.total_price) {
      const originalTotals = document.querySelectorAll('.cart-original-total');
      originalTotals.forEach(original => {
        original.textContent = this.formatMoney(this.cart.original_total_price);
        original.style.display = 'block';
      });
    }
  }

  updateShippingProgress() {
    const shippingBars = document.querySelectorAll('.shipping-progress-bar, .mini-cart-shipping-bar');
    const threshold = this.config.freeShippingThreshold;

    shippingBars.forEach(bar => {
      const progress = Math.min((this.cart.total_price / threshold) * 100, 100);
      const progressFill = bar.querySelector('.shipping-progress-fill, .shipping-progress-bar');
      const message = bar.querySelector('.shipping-message');

      if (progressFill) {
        progressFill.style.width = `${progress}%`;
        progressFill.setAttribute('aria-valuenow', progress);
      }

      if (message) {
        if (this.cart.total_price < threshold) {
          const remaining = threshold - this.cart.total_price;
          message.innerHTML = `You are <strong>${this.formatMoney(remaining)}</strong> away from free shipping!`;
        } else {
          message.innerHTML = `
            <svg class="icon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg> 
            You qualify for free shipping!
          `;
        }
        message.setAttribute('aria-live', 'polite');
      }
    });
  }

  updateEmptyState() {
    const cartDrawer = document.querySelector('.mini-cart, .cart-drawer');
    const emptyState = document.querySelector('.cart-empty, .cart-empty-state');
    const cartContent = document.querySelector('.cart-content, .cart-items');
    
    const isEmpty = this.cart.item_count === 0;
    
    if (cartDrawer) cartDrawer.classList.toggle('is-empty', isEmpty);
    if (emptyState) emptyState.classList.toggle('hidden', !isEmpty);
    if (cartContent) cartContent.classList.toggle('hidden', isEmpty);
  }

  toggleCartDrawer() {
    const cartDrawer = document.querySelector('.mini-cart, .cart-drawer');
    if (cartDrawer?.classList.contains('is-open')) {
      this.closeCartDrawer();
    } else {
      this.openCartDrawer();
    }
  }

  openCartDrawer() {
    const cartDrawer = document.querySelector('.mini-cart, .cart-drawer');
    if (cartDrawer) {
      cartDrawer.classList.add('is-open');
      document.body.classList.add('cart-open');
      
      // Focus management for accessibility
      const firstFocusable = cartDrawer.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 300);
      }
      
      this.dispatchEvent('cart:drawer-opened');
    }
  }

  closeCartDrawer() {
    const cartDrawer = document.querySelector('.mini-cart, .cart-drawer');
    if (cartDrawer) {
      cartDrawer.classList.remove('is-open');
      document.body.classList.remove('cart-open');
      this.dispatchEvent('cart:drawer-closed');
    }
  }

  setButtonLoading(button, loading, originalText = '') {
    if (!button) return;

    if (loading) {
      button.classList.add('is-loading');
      button.disabled = true;
      if (originalText) {
        button.dataset.originalText = originalText;
        button.textContent = 'Adding...';
      }
    } else {
      button.classList.remove('is-loading');
      button.disabled = false;
      if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
        delete button.dataset.originalText;
      }
    }
  }

  showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.cart-notification');
    existingNotifications.forEach(notification => {
      this.hideNotification(notification);
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `cart-notification cart-notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    const iconSVG = type === 'success' 
      ? '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 6v4M10 14h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    notification.innerHTML = `
      <div class="cart-notification-content">
        <div class="cart-notification-icon">${iconSVG}</div>
        <span class="cart-notification-message">${message}</span>
        <button class="cart-notification-close" aria-label="Close notification">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add('is-visible');
    }, 10);

    // Auto hide
    setTimeout(() => {
      this.hideNotification(notification);
    }, this.config.notificationDuration);

    // Close button
    const closeBtn = notification.querySelector('.cart-notification-close');
    closeBtn.addEventListener('click', () => {
      this.hideNotification(notification);
    });
  }

  hideNotification(notification) {
    if (notification && notification.parentNode) {
      notification.classList.remove('is-visible');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }

  formatMoney(cents) {
    const amount = cents / 100;
    return new Intl.NumberFormat(this.config.locale, {
      style: 'currency',
      currency: this.config.currency
    }).format(amount);
  }

  announceToScreenReader(message) {
    const announcer = document.getElementById('a11y-announcer');
    if (announcer) {
      announcer.textContent = message;
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  }

  dispatchEvent(eventName, detail = {}) {
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  processQueue() {
    if (this.updateQueue.length > 0) {
      const nextUpdate = this.updateQueue.shift();
      nextUpdate();
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Public API methods
  getCartData() {
    return this.cart;
  }

  getItemCount() {
    return this.cart?.item_count || 0;
  }

  getTotalPrice() {
    return this.cart?.total_price || 0;
  }

  isCartEmpty() {
    return this.getItemCount() === 0;
  }
}

// Initialize on DOM ready with error handling
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    try {
      window.ajaxCart = new EnhancedAjaxCart();
    } catch (error) {
      console.error('Failed to initialize cart:', error);
    }
  });
} else {
  try {
    window.ajaxCart = new EnhancedAjaxCart();
  } catch (error) {
    console.error('Failed to initialize cart:', error);
  }
}

// Enhanced notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  .cart-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    transform: translateX(400px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 400px;
    min-width: 300px;
  }

  .cart-notification.is-visible {
    transform: translateX(0);
  }

  .cart-notification--success {
    border-left: 4px solid #10b981;
  }

  .cart-notification--error {
    border-left: 4px solid #ef4444;
  }

  .cart-notification-content {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .cart-notification-icon {
    color: #10b981;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .cart-notification--error .cart-notification-icon {
    color: #ef4444;
  }

  .cart-notification-message {
    font-size: 0.9375rem;
    color: #1a1a1a;
    line-height: 1.4;
    flex: 1;
  }

  .cart-notification-close {
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    color: #666;
    flex-shrink: 0;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .cart-notification-close:hover {
    color: #000;
    background: #f3f4f6;
  }

  .cart-notification-close:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Cart count animation */
  .cart-count-updated {
    animation: cartCountPulse 0.3s ease;
  }

  @keyframes cartCountPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  /* Loading states */
  .is-loading {
    position: relative;
    pointer-events: none;
    opacity: 0.7;
  }

  .is-loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .cart-notification {
      top: 10px;
      right: 10px;
      left: 10px;
      max-width: none;
      min-width: auto;
    }
  }
`;
document.head.appendChild(notificationStyles);