(() => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?';
  const selector = '.scrambled-name';
  const interval = 65;
  const style = document.createElement('style');
  style.textContent = `${selector}{color:#35f6aa;font-family:monospace;font-weight:800;letter-spacing:.04em;display:inline-block;white-space:nowrap}`;
  document.head.append(style);

  const elements = [...document.querySelectorAll(selector)];
  if (!elements.length) return;

  const lengths = elements.map(element => {
    const requested = Number.parseInt(element.dataset.length || '14', 10);
    element.setAttribute('aria-label', 'Hidden player');
    return Number.isFinite(requested) ? Math.max(1, Math.min(40, requested)) : 14;
  });

  function scramble() {
    elements.forEach((element, index) => {
      let value = '';
      for (let i = 0; i < lengths[index]; i++) {
        value += characters[Math.floor(Math.random() * characters.length)];
      }
      element.textContent = value;
    });
  }

  scramble();
  const timer = setInterval(scramble, interval);
  window.addEventListener('pagehide', () => clearInterval(timer), { once: true });
})();
