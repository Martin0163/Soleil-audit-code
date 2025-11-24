// copy-to-clipboard.js

document.addEventListener('click', e => {
  if (!e.target.matches('.gift-card__copy-button button')) return;

  const parent = e.target.closest('copy-to-clipboard-component');
  const text = parent?.getAttribute('text-to-copy');
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    const msg = parent.querySelector('[ref="copySuccessMessage"]');
    if (msg) {
      msg.classList.add('visible');
      setTimeout(() => msg.classList.remove('visible'), 3000);
    }
  }).catch(console.error);
});