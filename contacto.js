(() => {
  const form = document.getElementById('project-contact');
  if (!form) return;
  const topic = form.elements.topic;
  const fields = document.getElementById('contact-fields');
  const status = document.getElementById('contact-status');
  const button = form.querySelector('[type="submit"]');
  let challenge = null;
  let challengePromise = null;
  let sending = false;
  let delivered = false;
  const loadChallenge = () => {
    if (challengePromise) return challengePromise;
    challengePromise = fetch('/api/contact', { cache: 'no-store' })
      .then(async response => {
        if (!response.ok) throw new Error('unavailable');
        const result = await response.json();
        challenge = result.challenge;
        return challenge;
      }).finally(() => { challengePromise = null; });
    return challengePromise;
  };
  const toggleFields = () => {
    fields.hidden = !topic.value;
    fields.disabled = !topic.value;
    if (topic.value && !challenge) loadChallenge().catch(() => {});
  };
  topic.addEventListener('change', toggleFields);
  toggleFields();
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || delivered || !form.reportValidity()) return;
    sending = true;
    button.disabled = true;
    button.textContent = 'Enviando…';
    status.textContent = '';
    status.removeAttribute('data-state');
    try {
      if (!challenge) await loadChallenge();
      const payload = Object.fromEntries(new FormData(form));
      payload.challenge = challenge;
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.code === 'expired') { challenge = null; loadChallenge().catch(() => {}); }
        throw new Error(result.message || 'No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.');
      }
      delivered = true;
      fields.disabled = true;
      topic.disabled = true;
      button.textContent = 'Solicitud enviada';
      status.dataset.state = 'success';
      status.textContent = 'Gracias. Recibimos tu solicitud y te contactaremos al correo que nos compartiste.';
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = error.message === 'unavailable' || error.name === 'TimeoutError' || error.name === 'TypeError'
        ? 'No pudimos confirmar el envío. Tus datos siguen aquí: puedes intentar de nuevo o escribirnos a contacto@vizualmx.com.' : error.message;
      button.disabled = false;
      button.textContent = 'Intentar de nuevo';
    } finally {
      sending = false;
      status.focus({ preventScroll: false });
    }
  });
})();
