/**
 * Soleil Beauty Shop - Main Theme JavaScript
 * Version: 2.0
 * Features:
 * - Mobile menu toggle
 * - Header scroll behavior
 * - Cart functionality
 * - Product quick view
 * - Image lazy loading
 * - Smooth scroll
 * - Animations on scroll
 */

(function() {
  'use strict';

  // ============================================
  // Utility Functions
  // ============================================
  
  const debounce = (func, wait) => {
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

  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // ============================================
  // Header Functionality
  // ============================================
  
  class Header {
    constructor() {
      this.header = document.querySelector('.site-header');
      this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
      this.mobileMenu = document.querySelector('.mobile-menu');
      this.searchToggle = document.querySelector('.search-toggle');
      this.searchOverlay = document.querySelector('.search-overlay');
      this.lastScrollTop = 0;
      this.scrollThreshold = 100;
      
      if (this.header) {
        this.init();
      }
    }

    init() {
      this.handleScroll();
      this.handleMobileMenu();
      this.handleSearch();
      this.handleDropdowns();
    }

    handleScroll() {
      let ticking = false;
      
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class
            if (scrollTop > 50) {
              this.header.classList.add('is-scrolled');
            } else {
              this.header.classList.remove('is-scrolled');
            }
            
            // Hide/show header on scroll
            if (scrollTop > this.scrollThreshold) {
              if (scrollTop > this.lastScrollTop) {
                this.header.classList.add('is-hidden');
              } else {
                this.header.classList.remove('is-hidden');
              }
            }
            
            this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            ticking = false;
          });
          
          ticking = true;
        }
      });
    }

    handleMobileMenu() {
      if (!this.mobileMenuToggle || !this.mobileMenu) return;

      this.mobileMenuToggle.addEventListener('click', () => {
        const isOpen = this.mobileMenu.classList.toggle('is-open');
        this.mobileMenuToggle.classList.toggle('is-active');
        document.body.classList.toggle('menu-open', isOpen);
        
        // Update aria attributes
        this.mobileMenuToggle.setAttribute('aria-expanded', isOpen);
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.mobileMenu.contains(e.target) && !this.mobileMenuToggle.contains(e.target)) {
          this.mobileMenu.classList.remove('is-open');
          this.mobileMenuToggle.classList.remove('is-active');
          document.body.classList.remove('menu-open');
          this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
      });

      // Handle submenu toggles
      const submenuToggles = this.mobileMenu.querySelectorAll('.has-submenu > a');
      submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          const parent = toggle.parentElement;
          parent.classList.toggle('is-open');
        });
      });
    }

    handleSearch() {
      if (!this.searchToggle || !this.searchOverlay) return;

      this.searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.searchOverlay.classList.add('is-open');
        document.body.classList.add('search-open');
        
        // Focus on search input
        const searchInput = this.searchOverlay.querySelector('input[type="search"]');
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 300);
        }
      });

      // Close search overlay
      const closeSearch = this.searchOverlay.querySelector('.search-close');
      if (closeSearch) {
        closeSearch.addEventListener('click', () => {
          this.searchOverlay.classList.remove('is-open');
          document.body.classList.remove('search-open');
        });
      }

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.searchOverlay.classList.contains('is-open')) {
          this.searchOverlay.classList.remove('is-open');
          document.body.classList.remove('search-open');
        }
      });
    }

    handleDropdowns() {
      const dropdowns = this.header.querySelectorAll('.has-dropdown');
      
      dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('a');
        
        toggle.addEventListener('mouseenter', () => {
          dropdown.classList.add('is-open');
        });
        
        dropdown.addEventListener('mouseleave', () => {
          dropdown.classList.remove('is-open');
        });
      });
    }
  }

  // ============================================
  // Cart Functionality
  // ============================================
  
  class Cart {
    constructor() {
      this.cartDrawer = document.querySelector('.mini-cart');
      this.cartToggle = document.querySelector('.cart-toggle');
      this.cartClose = document.querySelector('.mini-cart-close');
      this.cartCount = document.querySelector('.cart-count');
      
      if (this.cartDrawer) {
        this.init();
      }
    }

    init() {
      this.handleToggle();
      this.handleQuantityChange();
      this.handleRemoveItem();
    }

    handleToggle() {
      if (this.cartToggle) {
        this.cartToggle.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      }

      if (this.cartClose) {
        this.cartClose.addEventListener('click', () => {
          this.close();
        });
      }

      // Close on overlay click
      const overlay = this.cartDrawer.querySelector('.mini-cart-overlay');
      if (overlay) {
        overlay.addEventListener('click', () => {
          this.close();
        });
      }

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.cartDrawer.classList.contains('is-open')) {
          this.close();
        }
      });
    }

    open() {
      this.cartDrawer.classList.add('is-open');
      document.body.classList.add('cart-open');
    }

    close() {
      this.cartDrawer.classList.remove('is-open');
      document.body.classList.remove('cart-open');
    }

    handleQuantityChange() {
      const quantityInputs = this.cartDrawer.querySelectorAll('.quantity-input');
      
      quantityInputs.forEach(input => {
        const minusBtn = input.querySelector('.quantity-minus');
        const plusBtn = input.querySelector('.quantity-plus');
        const qtyInput = input.querySelector('input[type="number"]');
        
        if (minusBtn) {
          minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(qtyInput.value);
            if (currentValue > 1) {
              qtyInput.value = currentValue - 1;
              this.updateCart(qtyInput);
            }
          });
        }
        
        if (plusBtn) {
          plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(qtyInput.value);
            qtyInput.value = currentValue + 1;
            this.updateCart(qtyInput);
          });
        }
        
        if (qtyInput) {
          qtyInput.addEventListener('change', () => {
            this.updateCart(qtyInput);
          });
        }
      });
    }

    handleRemoveItem() {
      const removeButtons = this.cartDrawer.querySelectorAll('.cart-item-remove');
      
      removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const lineItem = button.closest('.cart-item');
          const key = button.dataset.key;
          
          this.removeItem(key, lineItem);
        });
      });
    }

    async updateCart(input) {
      const line = input.dataset.line;
      const quantity = parseInt(input.value);
      
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
        
        const cart = await response.json();
        this.refreshCart(cart);
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }

    async removeItem(key, lineItem) {
      lineItem.style.opacity = '0.5';
      
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
        
        const cart = await response.json();
        lineItem.remove();
        this.refreshCart(cart);
      } catch (error) {
        console.error('Error removing item:', error);
        lineItem.style.opacity = '1';
      }
    }

    refreshCart(cart) {
      // Update cart count
      if (this.cartCount) {
        this.cartCount.textContent = cart.item_count;
        
        if (cart.item_count > 0) {
          this.cartCount.classList.add('has-items');
        } else {
          this.cartCount.classList.remove('has-items');
        }
      }
      
      // Update cart total
      const cartTotal = this.cartDrawer.querySelector('.cart-total-price');
      if (cartTotal) {
        cartTotal.textContent = this.formatMoney(cart.total_price);
      }
      
      // Dispatch custom event
      document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
    }

    formatMoney(cents) {
      return '$' + (cents / 100).toFixed(2);
    }
  }

  // ============================================
  // Product Functionality
  // ============================================
  
  class Product {
    constructor() {
      this.quickViewButtons = document.querySelectorAll('.quick-view-btn');
      this.quickViewModal = document.querySelector('.quick-view-modal');
      
      this.init();
    }

    init() {
      this.handleQuickView();
      this.handleVariantChange();
      this.handleAddToCart();
    }

    handleQuickView() {
      this.quickViewButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
          e.preventDefault();
          const productHandle = button.dataset.productHandle;
          
          if (productHandle) {
            await this.loadQuickView(productHandle);
          }
        });
      });
    }

    async loadQuickView(handle) {
      try {
        const response = await fetch(`/products/${handle}?view=quick-view`);
        const html = await response.text();
        
        if (this.quickViewModal) {
          this.quickViewModal.querySelector('.quick-view-content').innerHTML = html;
          this.quickViewModal.classList.add('is-open');
          document.body.classList.add('modal-open');
        }
      } catch (error) {
        console.error('Error loading quick view:', error);
      }
    }

    handleVariantChange() {
      const variantSelects = document.querySelectorAll('.product-variant-select');
      
      variantSelects.forEach(select => {
        select.addEventListener('change', (e) => {
          const selectedVariant = e.target.value;
          this.updateProductInfo(selectedVariant);
        });
      });
    }

    updateProductInfo(variantId) {
      // Update price, availability, etc.
      // This would be customized based on your product structure
    }

    handleAddToCart() {
      const addToCartForms = document.querySelectorAll('form[action="/cart/add"]');
      
      addToCartForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const formData = new FormData(form);
          const button = form.querySelector('button[type="submit"]');
          
          button.classList.add('is-loading');
          button.disabled = true;
          
          try {
            const response = await fetch('/cart/add.js', {
              method: 'POST',
              body: formData
            });
            
            const item = await response.json();
            
            // Show success message
            this.showAddToCartSuccess(item);
            
            // Update cart
            const cartResponse = await fetch('/cart.js');
            const cart = await cartResponse.json();
            
            document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
            
          } catch (error) {
            console.error('Error adding to cart:', error);
            this.showAddToCartError();
          } finally {
            button.classList.remove('is-loading');
            button.disabled = false;
          }
        });
      });
    }

    showAddToCartSuccess(item) {
      // Show a toast notification or open cart drawer
      const cart = new Cart();
      cart.open();
    }

    showAddToCartError() {
      alert('Sorry, there was an error adding this item to your cart. Please try again.');
    }
  }

  // ============================================
  // Animations on Scroll
  // ============================================
  
  class ScrollAnimations {
    constructor() {
      this.elements = document.querySelectorAll('[data-animate]');
      this.observer = null;
      
      if (this.elements.length > 0) {
        this.init();
      }
    }

    init() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            
            // Optionally unobserve after animation
            if (entry.target.dataset.animateOnce !== 'false') {
              this.observer.unobserve(entry.target);
            }
          } else {
            if (entry.target.dataset.animateOnce === 'false') {
              entry.target.classList.remove('is-visible');
            }
          }
        });
      }, options);

      this.elements.forEach(element => {
        this.observer.observe(element);
      });
    }
  }

  // ============================================
  // Smooth Scroll
  // ============================================
  
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ============================================
  // Image Lazy Loading (Fallback for older browsers)
  // ============================================
  
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      return;
    }

    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // ============================================
  // Initialize Everything
  // ============================================
  
  function init() {
    new Header();
    new Cart();
    new Product();
    new ScrollAnimations();
    initSmoothScroll();
    initLazyLoading();
    
    // Dispatch ready event
    document.dispatchEvent(new Event('theme:loaded'));
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
