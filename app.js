(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const intro = document.getElementById('intro');
  const page = document.querySelector('.page');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const bar = intro.querySelector('.intro-progress i');
  const video = document.getElementById('intro-video');
  const word = document.getElementById('intro-word');
  const wordImg = word.querySelector('img');
  const WORD_MS = 1900;      // tempo da escrita LEGEND no centro antes de subir
  const WORD_LEAD = 0.25;    // a escrita começa a entrar um pouco antes do vídeo acabar (s)
  // Vertical no celular, horizontal em telas largas.
  const wide = window.matchMedia('(min-aspect-ratio: 1/1)').matches;
  video.poster = video.dataset[wide ? 'posterH' : 'posterV'];
  video.src = video.dataset[wide ? 'srcH' : 'srcV'];
  let timers = [];
  let previousFocus;
  let running = false;
  let wordShown = false;
  let raf = 0;

  function clearTimers() { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); }

  // Barra de progresso acompanha o vídeo; a parte final é a da escrita LEGEND.
  function paintBar() {
    if (!running) return;
    if (!wordShown && video.duration) {
      const ratio = Math.min(1, video.currentTime / video.duration);
      bar.style.transform = `scaleX(${ratio * 0.85})`;
      if (video.duration - video.currentTime <= WORD_LEAD) showWord();
    }
    raf = requestAnimationFrame(paintBar);
  }

  // Fim do vídeo: o vídeo some e a escrita LEGEND se desenha no centro.
  function showWord() {
    if (wordShown || !running) return;
    wordShown = true;
    intro.classList.add('word');
    bar.style.transition = `transform ${WORD_MS}ms linear`;
    bar.style.transform = 'scaleX(1)';
    timers.push(setTimeout(finishIntro, WORD_MS));
  }

  // Final da abertura: a escrita LEGEND encolhe e sobe até a logo do topo,
  // enquanto o fundo branco some e revela o cartão por baixo.
  function finishIntro() {
    clearTimers();
    if (intro.hidden) return;
    running = false;
    const target = document.getElementById('topbar-logo');
    if (!wordShown) intro.classList.add('word');
    if (target && !reducedMotion.matches) {
      // Sem a escrita aberta (pulou cedo), ela aparece já inteira para subir.
      if (!wordShown) wordImg.style.transition = 'none';
      wordImg.style.clipPath = 'inset(0 0 0 0)';
      const from = wordImg.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
      const dy = (to.top + to.height / 2) - (from.top + from.height / 2);
      void wordImg.offsetWidth;
      wordImg.style.transition = 'transform .95s cubic-bezier(.65,0,.25,1)';
      wordImg.style.transform = `translate(${dx}px, ${dy}px) scale(${to.width / from.width})`;
    }
    intro.classList.add('exit');
    video.pause();
    page.inert = false;
    document.body.style.overflow = '';
    timers.push(setTimeout(() => {
      document.documentElement.classList.remove('intro-running');
    }, 900));
    timers.push(setTimeout(() => {
      intro.hidden = true;
      intro.classList.remove('exit', 'word');
      wordImg.style.transition = 'none';
      wordImg.style.transform = '';
      wordImg.style.clipPath = '';
      wordImg.style.filter = '';
      void wordImg.offsetWidth;
      wordImg.style.transition = '';
    }, 1000));
    if (previousFocus) previousFocus.focus({ preventScroll: true });
  }

  function startIntro(replay = false) {
    clearTimers();
    if (reducedMotion.matches) return;
    previousFocus = replay ? document.activeElement : null;
    running = true;
    wordShown = false;
    intro.hidden = false;
    intro.classList.remove('exit', 'word');
    document.documentElement.classList.add('intro-running');
    window.scrollTo({ top: 0 });
    page.inert = true;
    document.body.style.overflow = 'hidden';
    document.getElementById('skip-intro').focus({ preventScroll: true });

    bar.style.transition = 'none';
    bar.style.transform = 'scaleX(0)';
    void bar.offsetWidth;
    bar.style.transition = '';

    try { video.currentTime = 0; } catch (e) { /* vídeo ainda carregando */ }
    const playing = video.play();
    if (playing && playing.catch) {
      // Sem autoplay (modo economia do celular): vai direto para a logo.
      playing.catch(() => { if (running) showWord(); });
    }
    // Rede lenta: se o vídeo não começar em 4 s, segue para a logo.
    timers.push(setTimeout(() => { if (running && video.currentTime < 0.05) showWord(); }, 4000));
    raf = requestAnimationFrame(paintBar);
  }

  video.addEventListener('ended', showWord);
  video.addEventListener('error', () => { if (running) showWord(); });

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

  /* ---------- Linha do tempo: a linha se acende conforme a rolagem ---------- */
  const timeline = document.getElementById('timeline');
  const progress = document.getElementById('tl-progress');
  if (timeline && progress) {
    const items = [...timeline.querySelectorAll('.tl-item')];
    let ticking = false;
    const paint = () => {
      ticking = false;
      const box = timeline.getBoundingClientRect();
      const anchor = window.innerHeight * 0.62;
      const ratio = Math.min(1, Math.max(0, (anchor - box.top) / box.height));
      progress.style.transform = `scaleY(${ratio})`;
      items.forEach(item => {
        const mark = item.querySelector('.tl-mark').getBoundingClientRect();
        item.classList.toggle('reached', mark.top + mark.height / 2 < anchor);
      });
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
    window.addEventListener('resize', paint);
    paint();
  }

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
