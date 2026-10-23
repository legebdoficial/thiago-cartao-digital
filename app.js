(() => {
  'use strict';
  const intro = document.getElementById('intro');
  const key = 'legend-thiago-intro-v1';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let introTimer;
  let hideTimer;
  let previousFocus;
  const shell = document.querySelector('.page-shell');
  function finishIntro() {
    clearTimeout(introTimer);
    intro.classList.add('exit');
    shell.inert = false;
    document.body.style.overflow = '';
    try { sessionStorage.setItem(key, 'seen'); } catch (_) { /* Browsing remains available without storage. */ }
    hideTimer = setTimeout(() => { intro.hidden = true; intro.classList.remove('exit'); }, 650);
    if (previousFocus) previousFocus.focus({ preventScroll: true });
  }
  function startIntro(replay = false) {
    clearTimeout(introTimer);
    clearTimeout(hideTimer);
    if (reducedMotion.matches) return;
    previousFocus = replay ? document.activeElement : null;
    intro.hidden = false;
    intro.classList.remove('exit');
    shell.inert = true;
    document.body.style.overflow = 'hidden';
    document.getElementById('skip-intro').focus({ preventScroll: true });
    // Four seconds total, including the transition that reveals the card.
    introTimer = setTimeout(finishIntro, 3350);
  }
  let seen = false;
  try { seen = sessionStorage.getItem(key) === 'seen'; } catch (_) { /* Show once where session storage is unavailable. */ }
  if (!seen) startIntro();
  document.getElementById('skip-intro').addEventListener('click', finishIntro);
  document.getElementById('replay-intro').addEventListener('click', () => startIntro(true));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !intro.hidden) finishIntro(); });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches && !intro.hidden) finishIntro(); });

  const shareDialog = document.getElementById('share-dialog');
  const shareUrl = 'https://thiago.uselegend.com';
  let toastTimer;
  function toast(message) {
    const node = document.getElementById('toast');
    clearTimeout(toastTimer);
    node.textContent = message;
    node.classList.add('visible');
    toastTimer = setTimeout(() => node.classList.remove('visible'), 3500);
  }
  async function share() {
    if (navigator.share) {
      try { await navigator.share({ title: 'Thiago | Legend', text: 'Conheça o Thiago, da Legend.', url: shareUrl }); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    shareDialog.showModal();
  }
  document.querySelectorAll('[data-share]').forEach(button => button.addEventListener('click', share));
  document.getElementById('close-share').addEventListener('click', () => shareDialog.close());
  shareDialog.addEventListener('click', event => { if (event.target === shareDialog) { const r = shareDialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) shareDialog.close(); } });
  document.getElementById('copy-link').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(shareUrl); toast('Link copiado. Pronto para compartilhar!'); }
    catch (_) { document.getElementById('share-url').select(); toast('Selecione e copie o endereço do cartão.'); }
  });
})();
