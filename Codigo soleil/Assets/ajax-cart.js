class AjaxCart {

  constructor() {

    this.cart = null;

    this.isUpdating = false;

    this.init();

  }



  init() {

    this.bindEvents();

    this.getCart();

  }



  bindEvents() {

    // Add to cart forms

    document.addEventListener('submit', (e) => {

      if (e.target.matches('form[action="/cart/add"]')) {

        e.preventDefault();

        this.addItem(e.target);

      }

    });



    // Update cart quantity

    document.addEventListener('change', (e) => {

      if (e.target.matches('.cart-quantity-input')) {

        this.updateItem(e.target);

      }

    });



    // Remove from cart

    document.addEventListener('click', (e) => {

      if (e.target.closest('.cart-remove-btn')) {

        e.preventDefault();

        const btn = e.target.closest('.cart-remove-btn');

        this.removeItem(btn.dataset.key);

      }

    });



    // Cart note update

    const cartNote = document.querySelector('#cart-note');

    if (cartNote) {

      cartNote.addEventListener('blur', () => {

        this.updateNote(cartNote.value);

      });

    }

  }



  async getCart() {

    try {

      const response = await fetch('/cart.js');

      this.cart = await response.json();

      this.updateUI();

      return this.cart;

    } catch (error) {

      console.error('Error fetching cart:', error);

      return null;

    }

  }



  async addItem(form) {

    if (this.isUpdating) return;

    

    this.isUpdating = true;

    const formData = new FormData(form);

    const submitBtn = form.querySelector('[type="submit"]');

    

    // Add loading state

    if (submitBtn) {

      submitBtn.classList.add('is-loading');

      submitBtn.disabled = true;

    }



    try {

      const response = await fetch('/cart/add.js', {

        method: 'POST',

        body: formData

      });



      if (!response.ok) {

        throw new Error('Failed to add item');

      }



      const item = await response.json();

      

      // Refresh cart

      await this.getCart();

      

      // Show success notification

      this.showNotification('Item added to cart!', 'success');

      

      // Open cart drawer

      this.openCartDrawer();

      

      // Dispatch event

      document.dispatchEvent(new CustomEvent('cart:item-added', { detail: item }));

      

    } catch (error) {

      console.error('Error adding item:', error);

      this.showNotification('Error adding item to cart', 'error');

    } finally {

      if (submitBtn) {

        submitBtn.classList.remove('is-loading');

        submitBtn.disabled = false;

      }

      this.isUpdating = false;

    }

  }



  async updateItem(input) {

    if (this.isUpdating) return;

    

    this.isUpdating = true;

    const line = parseInt(input.dataset.line);

    const quantity = parseInt(input.value);



    if (quantity < 1) {

      input.value = 1;

      this.isUpdating = false;

      return;

    }



    try {

      const response = await fetch('/cart/change.js', {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          line: line,

          quantity: quantity

        })

      });



      if (!response.ok) {

        throw new Error('Failed to update item');

      }



      this.cart = await response.json();

      this.updateUI();

      

      document.dispatchEvent(new CustomEvent('cart:updated', { detail: this.cart }));

      

    } catch (error) {

      console.error('Error updating item:', error);

      this.showNotification('Error updating cart', 'error');

    } finally {

      this.isUpdating = false;

    }

  }



  async removeItem(key) {

    if (this.isUpdating) return;

    

    this.isUpdating = true;



    try {

      const response = await fetch('/cart/change.js', {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          id: key,

          quantity: 0

        })

      });



      if (!response.ok) {

        throw new Error('Failed to remove item');

      }



      this.cart = await response.json();

      this.updateUI();

      

      this.showNotification('Item removed from cart', 'success');

      

      document.dispatchEvent(new CustomEvent('cart:item-removed', { detail: { key } }));

      

    } catch (error) {

      console.error('Error removing item:', error);

      this.showNotification('Error removing item', 'error');

    } finally {

      this.isUpdating = false;

    }

  }



  async updateNote(note) {

    try {

      const response = await fetch('/cart/update.js', {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          note: note

        })

      });



      if (!response.ok) {

        throw new Error('Failed to update note');

      }



      this.cart = await response.json();

      

    } catch (error) {

      console.error('Error updating note:', error);

    }

  }



  updateUI() {

    if (!this.cart) return;



    // Update cart count

    const cartCounts = document.querySelectorAll('.cart-count');

    cartCounts.forEach(count => {

      count.textContent = this.cart.item_count;

      

      if (this.cart.item_count > 0) {

        count.classList.add('has-items');

      } else {

        count.classList.remove('has-items');

      }

    });



    // Update cart total

    const cartTotals = document.querySelectorAll('.cart-total-price');

    cartTotals.forEach(total => {

      total.textContent = this.formatMoney(this.cart.total_price);

    });



    // Update subtotal

    const cartSubtotals = document.querySelectorAll('.cart-subtotal-price');

    cartSubtotals.forEach(subtotal => {

      subtotal.textContent = this.formatMoney(this.cart.total_price);

    });



    // Update free shipping progress

    this.updateShippingProgress();

  }



  updateShippingProgress() {

    const shippingBars = document.querySelectorAll('.mini-cart-shipping-bar');

    

    shippingBars.forEach(bar => {

      const threshold = parseFloat(bar.dataset.threshold) * 100 || 5000; // Default $50

      const progress = Math.min((this.cart.total_price / threshold) * 100, 100);

      

      const progressBar = bar.querySelector('.shipping-progress-bar');

      const message = bar.querySelector('.shipping-message');

      

      if (progressBar) {

        progressBar.style.width = `${progress}%`;

      }

      

      if (message && this.cart.total_price < threshold) {

        const remaining = threshold - this.cart.total_price;

        message.innerHTML = `You are <strong>${this.formatMoney(remaining)}</strong> away from free shipping!`;

      } else if (message) {

        message.innerHTML = '<svg class="icon" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> You qualify for free shipping!';

      }

    });

  }



  openCartDrawer() {

    const cartDrawer = document.querySelector('.mini-cart');

    if (cartDrawer) {

      cartDrawer.classList.add('is-open');

      document.body.classList.add('cart-open');

    }

  }



  closeCartDrawer() {

    const cartDrawer = document.querySelector('.mini-cart');

    if (cartDrawer) {

      cartDrawer.classList.remove('is-open');

      document.body.classList.remove('cart-open');

    }

  }



  showNotification(message, type = 'success') {

    // Create notification element

    const notification = document.createElement('div');

    notification.className = `cart-notification cart-notification--${type}`;

    notification.innerHTML = `

      <div class="cart-notification-content">

        <span class="cart-notification-message">${message}</span>

        <button class="cart-notification-close" aria-label="Close">

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



    // Auto hide after 3 seconds

    setTimeout(() => {

      this.hideNotification(notification);

    }, 3000);



    // Close button

    const closeBtn = notification.querySelector('.cart-notification-close');

    closeBtn.addEventListener('click', () => {

      this.hideNotification(notification);

    });

  }



  hideNotification(notification) {

    notification.classList.remove('is-visible');

    setTimeout(() => {

      notification.remove();

    }, 300);

  }



  formatMoney(cents) {

    const amount = cents / 100;

    return new Intl.NumberFormat('en-US', {

      style: 'currency',

      currency: 'USD'

    }).format(amount);

  }

}



// Initialize on DOM ready

if (document.readyState === 'loading') {

  document.addEventListener('DOMContentLoaded', () => {

    window.ajaxCart = new AjaxCart();

  });

} else {

  window.ajaxCart = new AjaxCart();

}



// Add notification styles

const notificationStyles = document.createElement('style');

notificationStyles.textContent = `

  .cart-notification {

    position: fixed;

    top: 20px;

    right: 20px;

    z-index: 10000;

    background: white;

    padding: 1rem 1.5rem;

    border-radius: 8px;

    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

    transform: translateX(400px);

    transition: transform 0.3s ease;

    max-width: 350px;

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

    align-items: center;

    justify-content: space-between;

    gap: 1rem;

  }



  .cart-notification-message {

    font-size: 0.9375rem;

    color: #1a1a1a;

  }



  .cart-notification-close {

    background: none;

    border: none;

    padding: 0.25rem;

    cursor: pointer;

    color: #666;

    flex-shrink: 0;

  }



  .cart-notification-close:hover {

    color: #000;

  }



  @media (max-width: 768px) {

    .cart-notification {

      top: 10px;

      right: 10px;

      left: 10px;

      max-width: none;

    }

  }

`;

document.head.appendChild(notificationStyles);