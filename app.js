const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));
document.querySelector('#year').textContent = new Date().getFullYear();
const form = document.querySelector('#interest-form');
const status = document.querySelector('#form-status');
form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button');
  button.disabled = true;
  status.textContent = 'Sending your enquiry…';
  try {
    const response = await fetch('/api/contact-interest', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    if (!response.ok) throw new Error('request failed');
    status.textContent = 'Thank you — our admissions team will be in touch.';
    form.reset();
  } catch { status.textContent = 'Thanks for reaching out. Please email admissions@saintgits.org to continue.'; }
  button.disabled = false;
});
