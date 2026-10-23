const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Mobile logos behave as accessible toggle buttons; only one expands at a time.
(() => {
  const mobileLogos = window.matchMedia('(hover: none) and (pointer: coarse), (max-width: 640px)');
  const logos = [...document.querySelectorAll('.client-logo')];
  const collapse = () => logos.forEach(logo => {
    logo.classList.remove('is-expanded');
    if (mobileLogos.matches) logo.setAttribute('aria-pressed', 'false');
  });
  const update = () => {
    collapse();
    logos.forEach(logo => {
      if (mobileLogos.matches) {
        logo.setAttribute('role', 'button');
        logo.setAttribute('tabindex', '0');
        logo.setAttribute('aria-label', `Ampliar logo de ${logo.querySelector('img').alt}`);
      } else {
        ['role', 'tabindex', 'aria-label', 'aria-pressed'].forEach(attr => logo.removeAttribute(attr));
      }
    });
  };
  logos.forEach(logo => {
    logo.addEventListener('click', () => {
      if (!mobileLogos.matches) return;
      const expand = !logo.classList.contains('is-expanded');
      collapse();
      logo.classList.toggle('is-expanded', expand);
      logo.setAttribute('aria-pressed', String(expand));
    });
    logo.addEventListener('keydown', event => {
      if (!mobileLogos.matches) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        logo.click();
      } else if (event.key === 'Escape') collapse();
    });
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.client-logo')) collapse();
  });
  mobileLogos.addEventListener('change', update);
  update();
})();

// A disclosure menu: no scroll lock, with keyboard and outside-click dismissal.
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;
  toggle.hidden = false;
  document.documentElement.classList.add('has-mobile-menu');
  const label = toggle.querySelector('.menu-label');
  const close = () => { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); if (label) label.textContent = 'Menú'; };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    if (label) label.textContent = open ? 'Cerrar' : 'Menú';
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { close(); toggle.focus(); }
  });
  nav.addEventListener('focusout', event => { if (!nav.contains(event.relatedTarget) && event.relatedTarget !== toggle) close(); });
  window.matchMedia('(max-width: 980px)').addEventListener('change', close);
})();

document.querySelectorAll('.project-video-dialog').forEach(dialog => {
  if (typeof dialog.showModal !== 'function') return;
  const video = dialog.querySelector('video');
  let opener;
  document.querySelectorAll('[data-video-project]').forEach(trigger => {
    if (trigger.getAttribute('aria-controls') !== dialog.id) return;
    trigger.addEventListener('click', event => {
      event.preventDefault();
      opener = trigger;
      dialog.showModal();
      video.play().catch(() => {});
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { video.pause(); opener?.focus({ preventScroll: true }); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
});

// Let readers pause the moving solution strip; respect their motion preference.
(() => {
  const strip = document.querySelector('.business-ticker');
  const button = strip?.querySelector('.ticker-toggle');
  if (!button) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => { button.hidden = reduced.matches; };
  button.addEventListener('click', () => {
    const paused = strip.classList.toggle('is-paused');
    const label = paused ? 'Reanudar texto en movimiento' : 'Pausar texto en movimiento';
    button.setAttribute('aria-label', label);
    button.title = label;
    button.querySelector('span').textContent = paused ? '▷' : 'Ⅱ';
  });
  reduced.addEventListener('change', update);
  update();
})();
