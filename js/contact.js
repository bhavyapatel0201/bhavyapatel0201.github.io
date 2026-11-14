/**
 * Contact form: validation (on submit, then live once a field has been flagged)
 * and an inline success state. Sending is simulated: connect a service such as
 * Formspree or EmailJS inside sendMessage() to deliver real email.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');
  const resetBtn = document.getElementById('contactResetBtn');
  if (!form) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const fields = [
    { input: document.getElementById('contactName'), error: 'nameError',
      check: (v) => v.length >= 2, message: 'Please enter your name (at least 2 characters).' },
    { input: document.getElementById('contactEmail'), error: 'emailError',
      check: (v) => emailPattern.test(v), message: 'Please enter a valid email address, like name@company.com.' },
    { input: document.getElementById('contactMessage'), error: 'messageError',
      check: (v) => v.length >= 10, message: 'Please write a message of at least 10 characters.' },
  ].filter((f) => f.input);

  function validate(field) {
    const ok = field.check(field.input.value.trim());
    const errorEl = document.getElementById(field.error);
    field.input.setAttribute('aria-invalid', String(!ok));
    if (errorEl) {
      errorEl.textContent = ok ? '' : field.message;
      errorEl.classList.toggle('show', !ok);
    }
    return ok;
  }

  // After a field has been flagged, re-check it as the visitor types
  fields.forEach((field) => {
    field.input.addEventListener('input', () => {
      if (field.input.getAttribute('aria-invalid') === 'true') validate(field);
    });
    field.input.addEventListener('blur', () => {
      if (field.input.value.trim()) validate(field);
    });
  });

  /**
   * Sends the message to the form endpoint (data-endpoint on the <form>, set from
   * contact.formEndpoint in content.json). Default: FormSubmit, which emails it to you.
   * Throws on failure so the caller can offer a mailto fallback.
   */
  async function sendMessage(data) {
    const endpoint = form.dataset.endpoint;
    if (!endpoint) throw new Error('No form endpoint configured');
    const payload = {
      name: data.name,
      email: data.email,
      message: data.message,
      _subject: data.subject ? `Portfolio: ${data.subject}` : `Portfolio message from ${data.name}`,
      _replyto: data.email,
      _template: 'table',
      _honey: data._honey || '',
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || body.success === false || body.success === 'false') throw new Error(body.message || `HTTP ${res.status}`);
      return body;
    } finally {
      clearTimeout(timer);
    }
  }

  // If sending fails, give the visitor a pre-filled email instead of losing the message
  function showSendError(data) {
    const box = document.getElementById('contactSendError');
    if (!box) return;
    const to = document.getElementById('contactDisplayEmail')?.textContent.trim() || 'patel61d@uwindsor.ca';
    const subject = encodeURIComponent(data.subject || `Portfolio message from ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
    box.querySelector('a').href = `mailto:${to}?subject=${subject}&body=${body}`;
    box.hidden = false;
    box.focus();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const results = fields.map(validate);
    if (results.includes(false)) {
      fields[results.indexOf(false)].input.focus();
      return;
    }

    const submitBtn = document.getElementById('contactSubmitBtn');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      <span>Sending…</span>`;

    const name = document.getElementById('contactName').value.trim();
    const data = Object.fromEntries(new FormData(form));
    const errorBox = document.getElementById('contactSendError');
    if (errorBox) errorBox.hidden = true;

    // Bots fill the hidden honeypot field; pretend success and send nothing
    if (!data._honey) {
      try {
        await sendMessage(data);
      } catch (err) {
        console.warn('Contact form send failed:', err);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        showSendError(data); // keep what they typed; offer email instead
        return;
      }
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
    form.reset();
    fields.forEach((f) => f.input.removeAttribute('aria-invalid'));

    const text = document.getElementById('contactSuccessText');
    if (text) text.textContent = `Thanks, ${name.split(' ')[0]}! Your message is on its way. Bhavya will reply soon.`;
    form.hidden = true;
    if (success) {
      success.hidden = false;
      success.focus();
    }
  });

  resetBtn?.addEventListener('click', () => {
    success.hidden = true;
    form.hidden = false;
    document.getElementById('contactName')?.focus();
  });
});
