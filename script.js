const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  })
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const modal = document.getElementById('demoModal');
const openBtn = document.getElementById('playDemo');
const closeBtn = document.getElementById('closeModal');
openBtn?.addEventListener('click',()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false')});
closeBtn?.addEventListener('click',()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')});
modal?.addEventListener('click',(e)=>{if(e.target===modal) closeBtn?.click()});
document.addEventListener('keydown',(e)=>{if(e.key==='Escape') closeBtn?.click()});

// The first eligible trigger wins; storage is optional in private/restricted browsers.
(() => {
  const popup = document.getElementById('clinicPopup');
  if (!popup || typeof popup.showModal !== 'function') return;
  const sessionKey = 'vizual-clinic-promo-shown';
  let shown = false;
  try { shown = sessionStorage.getItem(sessionKey) === '1'; } catch (_) {}
  if (shown) return;
  let previousFocus;
  let timer;
  const stopTriggers = () => {
    clearTimeout(timer);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibility);
  };
  const remember = () => {
    shown = true;
    try { sessionStorage.setItem(sessionKey, '1'); } catch (_) {}
    stopTriggers();
  };
  const show = () => {
    if (shown) return;
    // Wait for an active tab and avoid interrupting another modal or text entry.
    if (document.hidden || modal.classList.contains('open') || document.querySelector('dialog[open]') || document.activeElement.matches('input, textarea, select, [contenteditable="true"]')) {
      clearTimeout(timer);
      timer = setTimeout(show, 1000);
      return;
    }
    previousFocus = document.activeElement;
    popup.showModal();
    document.documentElement.classList.add('clinic-popup-open');
    remember();
  };
  function onScroll() {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    if (range > 0 && window.scrollY / range >= 0.45) show();
  }
  function onVisibility() { if (!document.hidden) onScroll(); }
  popup.querySelector('button').addEventListener('click', () => popup.close());
  popup.addEventListener('click', event => {
    const rect = popup.getBoundingClientRect();
    if (event.target === popup && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) popup.close();
  });
  popup.addEventListener('close', () => {
    document.documentElement.classList.remove('clinic-popup-open');
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  });
  // Asking for a demo directly also suppresses the automatic invitation.
  document.querySelectorAll('.clinic-cta, .whatsapp-float').forEach(link => link.addEventListener('click', () => {
    remember();
    if (popup.open) popup.close();
  }));
  timer = setTimeout(show, 12000);
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
})();

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
  const close = () => { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
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

(() => {
  const dialog = document.getElementById('sleepy-dialog');
  const trigger = document.querySelector('[data-video-project]');
  if (!dialog || !trigger || typeof dialog.showModal !== 'function') return;
  const video = dialog.querySelector('video');
  trigger.addEventListener('click', event => {
    event.preventDefault();
    dialog.showModal();
    video.play().catch(() => { /* Native controls remain available. */ });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { video.pause(); trigger.focus({ preventScroll: true }); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
})();
