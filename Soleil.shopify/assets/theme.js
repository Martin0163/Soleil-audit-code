/**
 * theme.js
 * Handles UI interactions: mobile menu toggle, desktop buttons,
 * carousel sliding, header hide/show on scroll,
 * and quick view modal loading.
 * Includes performance optimizations and accessibility considerations.
 */

// Mobile hamburger toggle
const menuToggle = document.getElementById('menu-toggle');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const menu = document.getElementById('primary-menu');
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', (!expanded).toString());
    menu.classList.toggle('active');
  });
}

// Header hide/show on scroll down/up
let lastScrollTop = 0;
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (!header) return;

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scrolling down - hide header
    header.classList.add('header--hidden');
  } else {
    // Scrolling up - show header
    header.classList.remove('header--hidden');
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Prevent negative scroll
});

// Inject desktop buttons excluding current page button
document.addEventListener('DOMContentLoaded', () => {
  const primaryMenu = document.getElementById('primary-menu');

  const menuItems = [
    { href: '/', text: 'Home' },
    { href: '/collections/all', text: 'Products' },
    { href: '/collections/brands', text: 'Brands' },
    { href: '/pages/about-us', text: 'About Us' },
  ];

  // Normalize current path
  const currentPath = window.location.pathname.replace(/\/$/, '');

  if (primaryMenu && !document.querySelector('.desktop-menu-buttons')) {
    const desktopButtonWrapper = document.createElement('div');
    desktopButtonWrapper.className = 'desktop-menu-buttons';

    menuItems.forEach(item => {
      const itemPath = item.href.replace(/\/$/, '');
      if (itemPath !== currentPath) {
        const btn = document.createElement('a');
        btn.href = item.href;
        btn.textContent = item.text;
        btn.className = 'desktop-menu-btn';
        desktopButtonWrapper.appendChild(btn);
      }
    });

    primaryMenu.parentNode.insertBefore(desktopButtonWrapper, primaryMenu.nextSibling);
  }

  // Inject mobile menu if empty
  if (primaryMenu && primaryMenu.children.length === 0) {
    primaryMenu.innerHTML = menuItems.map(item => `<li><a href="${item.href}" class="menu-item">${item.text}</a></li>`).join('');
  }

  // Carousel setup
  updateSlides();
  setInterval(nextSlide, 7000);

  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Setup quick view modal events
  setupQuickViewModal();
});

// Carousel functions
let currentSlide = 0;
let slides = [];

function updateSlides() {
  slides = document.querySelectorAll('.carousel-item');
}

function nextSlide() {
  if (!slides.length) return;
  currentSlide = (currentSlide + 1) % slides.length;
  updateCarouselTransform();
}

function prevSlide() {
  if (!slides.length) return;
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateCarouselTransform();
}

function updateCarouselTransform() {
  const carouselInner = document.getElementById('carouselInner');
  if(carouselInner) {
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
}

// Quick View Modal Functions
let modal, modalClose, productDetails;

function setupQuickViewModal() {
  modal = document.getElementById('quick-view-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quick-view-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.classList.add('quick-view-modal');
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="quick-view-content" role="document">
        <button id="quick-view-close" aria-label="Close quick view" class="quick-view-close">×</button>
        <div id="quick-view-product-details" class="quick-view-product-details"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  modalClose = document.getElementById('quick-view-close');
  productDetails = document.getElementById('quick-view-product-details');

  if (modalClose) {
    modalClose.addEventListener('click', closeQuickView);
  }
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeQuickView();
  });
}

window.openQuickView = function(productHandle) {
  if (!productDetails) return;
  productDetails.innerHTML = '<p>Cargando...</p>';
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');

  fetch(`/products/${productHandle}.js`)
    .then(res => res.json())
    .then(product => {
      productDetails.innerHTML = generateQuickViewHTML(product);
      attachAddToCart(productDetails, product);
    })
    .catch(() => {
      productDetails.innerHTML = '<p>Error cargando el producto.</p>';
    });
};

function closeQuickView() {
  if (modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }
}

function generateQuickViewHTML(product) {
  const price = product.price ? (product.price / 100).toFixed(2) : '';
  const imgSrc = product.images.length > 0 ? product.images[0] : '';
  return `
    <div class="quick-view-inner">
      <img src="${imgSrc}" alt="${product.title}" style="max-width: 100%; border-radius: 10px;"/>
      <h2>${product.title}</h2>
      <p>${product.description}</p>
      <p><strong>Precio: </strong>$${price}</p>
      <form id="quick-view-add-to-cart">
        <select name="id">
          ${product.variants.map(variant => `<option value="${variant.id}">${variant.title} - $${(variant.price / 100).toFixed(2)}</option>`).join('')}
        </select>
        <button type="submit" class="add-to-cart-button">Añadir al Carrito</button>
      </form>
    </div>
  `;
}

function attachAddToCart(container, product) {
  const form = container.querySelector('#quick-view-add-to-cart');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    fetch('/cart/add.js', {
      method: 'POST',
      body: JSON.stringify({ id: formData.get('id'), quantity: 1 }),
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    })
    .then(res => res.json())
    .then(() => {
      alert('Producto añadido al carrito');
      closeQuickView();
      // Optionally call updateCartUI() here if implemented
    })
    .catch(error => console.error('Error añadiendo al carrito:', error));
  });
}