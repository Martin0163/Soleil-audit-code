// component.js
class Component {
  constructor(root) {
    this.root = root;
    this.init();
  }

  init() {
    // Initialize component logic here
  }

  destroy() {
    // Cleanup if needed
  }
}

// Example auto-init for elements with data-component
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-component]').forEach(el => {
    const component = new Component(el);
    // Store component instance if needed
  });
});

export default Component;