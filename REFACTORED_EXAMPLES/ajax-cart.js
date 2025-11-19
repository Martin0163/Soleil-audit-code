/**
 * Ajax Cart Module - Refactored
 * Handles all cart operations with smooth animations and error handling
 * Features:
 * - Optimistic UI updates
 * - Loading states
 * - Error handling with retry
 * - Accessibility announcements
 * - Smooth animations
 */

class AjaxCart {
  constructor() {
    this.cart = null;
    this.isUpdating = false;
    this.init();
  }

  init() {
    this.bindEvents();
    this.fetchCart();
  }

  bindEvents() {
    // Add to cart buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-add-to-cart]')) {
        e.preventDefault();
        this.addToCart(e.target);
      }
    });

    // Update quantity
    document.addEventListener('change', (e) => {
      if (e.target.matches('[data-cart-quantity]')) {
        this.updateQuantity(e.target);
      }
    });

    // Remove item
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-cart-remove]')) {
        e.preventDefault();
        this.removeItem(e.target);
      }
    });

    // Open/close cart drawer
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-cart-toggle]')) {
        e.preventDefault();
        this.toggleCart();
      }
    });
  }

  async fetchCart() {
    try {
      const response = await fetch('/cart.js');
      this.cart = await response.json();
      this.updateCartUI();
      return this.cart;
    } catch (error) {
      this.handleError('Failed to fetch cart', error);
    }
  }

  async addToCart(button) {
    if (this.isUpdating) return;

    const form = button.closest('form');
    const formData = new FormData(form);
    
    // Show loading state
    this.setLoadingState(button, true);
    this.isUpdating = true;

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to add to cart');

      const item = await response.json();
      
      // Optimistic update
      this.cart.item_count += item.quantity;
      this.updateCartBadge();
      
      // Fetch full cart
      await this.fetchCart();
      
      // Show success animation
      this.showSuccessAnimation(button);
      
      // Open cart drawer
      this.openCart();
      
      // Announce to screen readers
      this.announce(`${item.product_title} added to cart`);
      
    } catch (error) {
      this.handleError('Failed to add item to cart', error);
      this.showErrorAnimation(button);
    } finally {
      this.setLoadingState(button, false);
      this.isUpdating = false;
    }
  }

  async updateQuantity(input) {
    if (this.isUpdating) return;

    const lineItem = input.dataset.cartQuantity;
    const newQuantity = parseInt(input.value);
    const oldQuantity = parseInt(input.dataset.oldValue || input.value);

    if (newQuantity === oldQuantity) return;

    // Optimistic update
    input.dataset.oldValue = newQuantity;
    this.setLoadingState(input.closest('.cart-item'), true);
    this.isUpdating = true;

    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          line: lineItem,
          quantity: newQuantity
        })
      });

      if (!response.ok) throw new Error('Failed to update quantity');

      this.cart = await response.json();
      this.updateCartUI();
      
      this.announce(`Quantity updated to ${newQuantity}`);
      
    } catch (error) {
      // Revert on error
      input.value = oldQuantity;
      input.dataset.oldValue = oldQuantity;
      this.handleError('Failed to update quantity', error);
    } finally {
      this.setLoadingState(input.closest('.cart-item'), false);
      this.isUpdating = false;
    }
  }

  async removeItem(button) {
    if (this.isUpdating) return;

    const lineItem = button.dataset.cartRemove;
    const cartItem = button.closest('.cart-item');
    
    // Optimistic removal with animation
    cartItem.style.opacity = '0.5';
    this.isUpdating = true;

    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          line: lineItem,
          quantity: 0
        })
      });

      if (!response.ok) throw new Error('Failed to remove item');

      this.cart = await response.json();
      
      // Animate removal
      cartItem.style.transform = 'translateX(100%)';
      cartItem.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        this.updateCartUI();
        this.announce('Item removed from cart');
      }, 300);
      
    } catch (error) {
      // Revert on error
      cartItem.style.opacity = '1';
      this.handleError('Failed to remove item', error);
    } finally {
      this.isUpdating = false;
    }
  }

  updateCartUI() {
    this.updateCartBadge();
    this.updateCartDrawer();
    this.updateCartTotal();
  }

  updateCartBadge() {
    const badges = document.querySelectorAll('[data-cart-count]');
    badges.forEach(badge => {
      const count = this.cart?.item_count || 0;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
      
      // Pulse animation
      badge.classList.add('cart-badge-pulse');
      setTimeout(() => badge.classList.remove('cart-badge-pulse'), 300);
    });
  }

  updateCartDrawer() {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;

    const itemsContainer = drawer.querySelector('[data-cart-items]');
    if (!itemsContainer) return;

    if (this.cart.items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty">
          <svg class="cart-empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p class="cart-empty-text">Your cart is empty</p>
          <a href="/collections/all" class="btn btn-primary">Continue Shopping</a>
        </div>
      `;
      return;
    }

    itemsContainer.innerHTML = this.cart.items.map((item, index) => `
      <div class="cart-item" data-line-item="${index + 1}">
        <div class="cart-item-image">
          <img src="${item.featured_image?.url || ''}" alt="${item.product_title}" loading="lazy">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.product_title}</h4>
          ${item.variant_title ? `<p class="cart-item-variant">${item.variant_title}</p>` : ''}
          <div class="cart-item-price">
            ${this.formatMoney(item.final_line_price)}
          </div>
        </div>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="this.nextElementSibling.stepDown(); this.nextElementSibling.dispatchEvent(new Event('change'))">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <input 
            type="number" 
            class="quantity-input" 
            value="${item.quantity}" 
            min="1" 
            data-cart-quantity="${index + 1}"
            data-old-value="${item.quantity}"
            aria-label="Quantity for ${item.product_title}"
          >
          <button class="quantity-btn" onclick="this.previousElementSibling.stepUp(); this.previousElementSibling.dispatchEvent(new Event('change'))">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        <button class="cart-item-remove" data-cart-remove="${index + 1}" aria-label="Remove ${item.product_title}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `).join('');
  }

  updateCartTotal() {
    const totalElements = document.querySelectorAll('[data-cart-total]');
    totalElements.forEach(el => {
      el.textContent = this.formatMoney(this.cart?.total_price || 0);
    });

    // Update free shipping progress
    this.updateFreeShippingProgress();
  }

  updateFreeShippingProgress() {
    const progressBar = document.querySelector('[data-shipping-progress]');
    if (!progressBar) return;

    const freeShippingThreshold = 50000; // $50 in cents
    const currentTotal = this.cart?.total_price || 0;
    const percentage = Math.min((currentTotal / freeShippingThreshold) * 100, 100);

    progressBar.style.width = `${percentage}%`;

    const message = document.querySelector('[data-shipping-message]');
    if (message) {
      if (percentage >= 100) {
        message.textContent = '🎉 You qualify for free shipping!';
        message.classList.add('success');
      } else {
        const remaining = this.formatMoney(freeShippingThreshold - currentTotal);
        message.textContent = `Add ${remaining} more for free shipping`;
        message.classList.remove('success');
      }
    }
  }

  toggleCart() {
    const drawer = document.querySelector('[data-cart-drawer]');
    const overlay = document.querySelector('[data-cart-overlay]');
    
    if (!drawer) return;

    const isOpen = drawer.classList.contains('active');
    
    if (isOpen) {
      this.closeCart();
    } else {
      this.openCart();
    }
  }

  openCart() {
    const drawer = document.querySelector('[data-cart-drawer]');
    const overlay = document.querySelector('[data-cart-overlay]');
    
    if (!drawer) return;

    drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first focusable element
    const firstFocusable = drawer.querySelector('button, a, input');
    if (firstFocusable) firstFocusable.focus();
  }

  closeCart() {
    const drawer = document.querySelector('[data-cart-drawer]');
    const overlay = document.querySelector('[data-cart-overlay]');
    
    if (!drawer) return;

    drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  setLoadingState(element, isLoading) {
    if (isLoading) {
      element.classList.add('loading');
      element.disabled = true;
    } else {
      element.classList.remove('loading');
      element.disabled = false;
    }
  }

  showSuccessAnimation(button) {
    button.classList.add('success');
    setTimeout(() => button.classList.remove('success'), 1000);
  }

  showErrorAnimation(button) {
    button.classList.add('error');
    setTimeout(() => button.classList.remove('error'), 1000);
  }

  handleError(message, error) {
    console.error(message, error);
    
    // Show user-friendly error message
    const errorContainer = document.querySelector('[data-cart-error]');
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.style.display = 'block';
      setTimeout(() => {
        errorContainer.style.display = 'none';
      }, 5000);
    }
    
    this.announce(message);
  }

  announce(message) {
    const announcer = document.querySelector('[data-cart-announcer]') || this.createAnnouncer();
    announcer.textContent = message;
  }

  createAnnouncer() {
    const announcer = document.createElement('div');
    announcer.setAttribute('data-cart-announcer', '');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    document.body.appendChild(announcer);
    return announcer;
  }

  formatMoney(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }
}

// Initialize cart when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.ajaxCart = new AjaxCart();
  });
} else {
  window.ajaxCart = new AjaxCart();
}
