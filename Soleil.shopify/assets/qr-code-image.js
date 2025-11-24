// qr-code-image.js

import { generateQRCode } from './qr-code-generator.js';

class QRCodeImage extends HTMLElement {
  connectedCallback() {
    const identifier = this.getAttribute('data-identifier') || '';
    const size = parseInt(this.getAttribute('width')) || 72;

    if (identifier) {
      generateQRCode(this, identifier, { width: size, height: size });
    } else {
      this.style.display = 'none';
    }
  }
}

customElements.define('qr-code-image', QRCodeImage);