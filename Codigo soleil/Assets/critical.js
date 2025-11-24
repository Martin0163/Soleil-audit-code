// critical.js

// Example: Web Font Loader initialization
if (window.WebFont) {
  window.WebFont.load({
    google: {
      families: ['Roboto:400,700', 'Open Sans']
    }
  });
}

// Polyfill example for browsers without fetch
if (!window.fetch) {
  import('whatwg-fetch').then(() => {
    console.log('Fetch polyfill loaded');
  });
}