/**
 * ajax-cart.js
 * Handles asynchronous cart operations: add, remove, update UI.
 * Includes error handling, loading states, and accessibility.
 * Future: Integrate with mini-cart modal or notifications.
 */

// Global loading state for UX feedback
let isCartUpdating = false;

// Add product to cart asynchronously
function addToCart(variantId, quantity = 1) {
  if (isCartUpdating) return; // Prevent multiple simultaneous requests
  isCartUpdating = true;
  showLoadingIndicator();

  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: variantId, quantity })
  })
  .then(response => {
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  })
  .then(data => {
    console.log('Producto añadido:', data); // Keep for debugging
    updateCartUI();
    hideLoadingIndicator();
    // Future: Add success notification here
  })
  .catch(err => {
    console.error('Error al añadir:', err);
    hideLoadingIndicator();
    alert('Error al añadir al carrito. Inténtalo de nuevo.'); // User-friendly error
  })
  .finally(() => isCartUpdating = false);
}

// Update cart UI (count, total) dynamically
function updateCartUI() {
  fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      // Update cart count
      const cartCounts = document.querySelectorAll('.cart-count');
      cartCounts.forEach(el => el.textContent = cart.item_count);

      // Update cart total
      const cartTotals = document.querySelectorAll('.cart-total');
      cartTotals.forEach(el => el.textContent = `$${(cart.total_price / 100).toFixed(2)}`);

      // Future: Update mini-cart items list here if needed
    })
    .catch(err => console.error('Error updating cart UI:', err));
}

// Remove item from cart
function removeFromCart(lineItemKey) {
  if (isCartUpdating) return;
  isCartUpdating = true;
  showLoadingIndicator();

  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: lineItemKey, quantity: 0 })
  })
  .then(() => {
    updateCartUI();
    hideLoadingIndicator();
  })
  .catch(err => {
    console.error('Error removing from cart:', err);
    hideLoadingIndicator();
  })
  .finally(() => isCartUpdating = false);
}

// Helper: Show loading indicator (add a CSS class or element)
function showLoadingIndicator() {
  const loader = document.getElementById('cart-loader') || createLoader();
  loader.style.display = 'block';
}

// Helper: Hide loading indicator
function hideLoadingIndicator() {
  const loader = document.getElementById('cart-loader');
  if (loader) loader.style.display = 'none';
}

// Helper: Create a simple loader element if not exists
function createLoader() {
  const loader = document.createElement('div');
  loader.id = 'cart-loader';
  loader.innerHTML = '<p>Actualizando carrito...</p>';
  loader.style.position = 'fixed';
  loader.style.top = '50%';
  loader.style.left = '50%';
  loader.style.transform = 'translate(-50%, -50%)';
  loader.style.background = 'rgba(0,0,0,0.8)';
  loader.style.color = 'white';
  loader.style.padding = '1rem';
  loader.style.borderRadius = '5px';
  loader.style.display = 'none';
  loader.setAttribute('aria-live', 'polite');
  document.body.appendChild(loader);
  return loader;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
});