(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const intro = document.getElementById('intro');
  const page = document.querySelector('.page');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const bar = intro.querySelector('.intro-progress i');
  // Tempo de cada etapa (ms): logos antigas, logo atual, escrita LEGEND, retrato.
  const STEP_MS = { 1: 1500, 2: 1500, 3: 1500, 4: 1900, 5: 1500 };
  let timers = [];
  let previousFocus;

  // Uma etapa de logo só entra se a imagem existir (as antigas são opcionais).
  function stepAvailable(node) {
    const img = node.querySelector('img');
    if (!node.classList.contains('intro-logo') || !img) return Promise.resolve(true);
    if (img.complete) return Promise.resolve(img.naturalWidth > 0);
    return new Promise(resolve => {
      img.addEventListener('load', () => resolve(true), { once: true });
      img.addEventListener('error', () => resolve(false), { once: true });
    });
  }

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function finishIntro() {
    clearTimers();
    if (intro.hidden) return;
    intro.classList.add('exit');
    page.inert = false;
    document.body.style.overflow = '';
    timers.push(setTimeout(() => {
      intro.hidden = true;
      intro.classList.remove('exit');
      intro.querySelectorAll('[data-step]').forEach(node => node.classList.remove('show', 'past'));
    }, 800));
    if (previousFocus) previousFocus.focus({ preventScroll: true });
  }

  async function startIntro(replay = false) {
    clearTimers();
    if (reducedMotion.matches) return;
    previousFocus = replay ? document.activeElement : null;
    intro.hidden = false;
    intro.classList.remove('exit');
    page.inert = true;
    document.body.style.overflow = 'hidden';
    if (replay) window.scrollTo({ top: 0 });
    document.getElementById('skip-intro').focus({ preventScroll: true });

    const nodes = [...intro.querySelectorAll('[data-step]')];
    nodes.forEach(node => node.classList.remove('show', 'past'));
    const flags = await Promise.all(nodes.map(stepAvailable));
    const steps = nodes.filter((_, i) => flags[i]);
    const total = steps.reduce((sum, node) => sum + STEP_MS[node.dataset.step], 0);

    bar.style.transition = 'none';
    bar.style.transform = 'scaleX(0)';
    void bar.offsetWidth;
    bar.style.transition = `transform ${total}ms linear`;
    bar.style.transform = 'scaleX(1)';

    let at = 0;
    steps.forEach((node, i) => {
      timers.push(setTimeout(() => {
        if (i > 0) { steps[i - 1].classList.remove('show'); steps[i - 1].classList.add('past'); }
        node.classList.add('show');
      }, at));
      at += STEP_MS[node.dataset.step];
    });
    timers.push(setTimeout(finishIntro, at));
  }

  startIntro();
  window.addEventListener('pageshow', event => { if (event.persisted) startIntro(); });
  document.getElementById('skip-intro').addEventListener('click', finishIntro);
  document.getElementById('replay-intro').addEventListener('click', () => startIntro(true));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !intro.hidden) finishIntro(); });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finishIntro(); });

  /* ---------- Revelar ao rolar e contadores ---------- */
  function countUp(node) {
    const target = Number(node.dataset.count);
    if (!Number.isFinite(target) || reducedMotion.matches) return;
    const start = node.hasAttribute('data-plain') ? Math.max(0, target - 40) : 0;
    const duration = 1400;
    const began = performance.now();
    const tick = now => {
      const progress = Math.min(1, (now - began) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const revealer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        entry.target.querySelectorAll('[data-count]').forEach(countUp);
        if (entry.target.matches('[data-count]')) countUp(entry.target);
        revealer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-reveal]').forEach(node => revealer.observe(node));

    // O vídeo em loop só toca quando aparece na tela (economiza dados).
    const player = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (video.preload === 'none') video.preload = 'auto';
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.35 });
    document.querySelectorAll('video[data-autoplay]').forEach(video => player.observe(video));
  } else {
    document.querySelectorAll('[data-reveal]').forEach(node => node.classList.add('in'));
  }

  /* ---------- WhatsApp fixo depois da capa ---------- */
  const floatWhats = document.querySelector('.float-whats');
  const hero = document.querySelector('.hero');
  const closing = document.querySelector('.closing');
  const onScroll = () => {
    const pastHero = hero.getBoundingClientRect().bottom < 0;
    const atClosing = closing.getBoundingClientRect().top < window.innerHeight * 0.6;
    floatWhats.classList.toggle('visible', pastHero && !atClosing);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Vídeo do Ronaldinho com som ---------- */
  const videoDialog = document.getElementById('video-dialog');
  const fullVideo = document.getElementById('full-video');
  document.getElementById('open-video').addEventListener('click', () => {
    videoDialog.showModal();
    fullVideo.currentTime = 0;
    fullVideo.play().catch(() => {});
  });
  const closeVideo = () => { fullVideo.pause(); videoDialog.close(); };
  document.getElementById('close-video').addEventListener('click', closeVideo);
  videoDialog.addEventListener('close', () => fullVideo.pause());
  videoDialog.addEventListener('click', event => { if (event.target === videoDialog) closeVideo(); });

  /* ---------- Compartilhar ---------- */
  const shareDialog = document.getElementById('share-dialog');
  const shareUrl = 'https://thiago.uselegend.com';
  let toastTimer;
  function toast(message) {
    const node = document.getElementById('toast');
    clearTimeout(toastTimer);
    node.textContent = message;
    node.classList.add('visible');
    toastTimer = setTimeout(() => node.classList.remove('visible'), 3200);
  }
  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Thiago Henrique | Legend', text: 'Conheça o Thiago Henrique, CEO da Legend.', url: shareUrl });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    shareDialog.showModal();
  }
  document.querySelectorAll('[data-share]').forEach(button => button.addEventListener('click', share));
  document.getElementById('close-share').addEventListener('click', () => shareDialog.close());
  shareDialog.addEventListener('click', event => { if (event.target === shareDialog) shareDialog.close(); });
  document.getElementById('copy-link').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast('Link copiado. Pronto para compartilhar!');
    } catch (_) {
      document.getElementById('share-url').select();
      toast('Selecione e copie o endereço do cartão.');
    }
  });
})();
