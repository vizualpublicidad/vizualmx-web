/* Set the owner's GA4 measurement ID here to activate collection. */
(() => {
  'use strict';
  const measurementId = '';
  // No provider requests or local event storage until an account is configured.
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) return;
  if (!['vizualmx.com', 'www.vizualmx.com'].includes(location.hostname)) return;
  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1') return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: location.origin + location.pathname,
    page_referrer: document.referrer ? new URL(document.referrer).origin : '',
  });
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(tag);
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-track-event]');
    if (!link || event.defaultPrevented) return;
    // Only controlled labels: never send messages, emails, full URLs or query strings.
    gtag('event', link.dataset.trackEvent, {
      link_placement: link.dataset.trackPlacement,
      interest: link.dataset.trackInterest,
      page_path: location.pathname,
      transport_type: 'beacon',
    });
  });
})();
