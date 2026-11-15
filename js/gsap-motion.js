/**
 * GSAP motion (gsap + ScrollTrigger from cdnjs, loaded with defer before this file).
 * Experience timeline: a line draws down the left edge as you scroll, and each
 * internship's dot lights up when the line reaches it (scrubbed, so scrolling up reverses it).
 * Without GSAP, or with prefers-reduced-motion, all dots are simply shown lit.
 */
(function () {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!gsap || !ScrollTrigger || reduced) {
    document.documentElement.classList.add('no-gsap');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  function timeline() {
    const list = document.getElementById('experienceList');
    if (!list || list.querySelector('.timeline-progress')) return;
    const bar = document.createElement('span');
    bar.className = 'timeline-progress';
    bar.setAttribute('aria-hidden', 'true');
    list.prepend(bar);

    gsap.fromTo(bar, { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: list, start: 'top 65%', end: 'bottom 55%', scrub: 0.4 },
    });

    list.querySelectorAll('.experience-card').forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 62%',
        onEnter: () => card.classList.add('is-reached'),
        onLeaveBack: () => card.classList.remove('is-reached'),
      });
    });
  }

  if (window.PortfolioData) timeline();
  else document.addEventListener('portfolio:content-ready', timeline, { once: true });

  // Tabs show and hide sections; recompute trigger positions when they do.
  // Wait until scrolling has stopped: refreshing mid-scroll cancels the smooth scroll
  // a nav click just started.
  let timer = 0;
  const refreshWhenIdle = () => {
    clearTimeout(timer);
    timer = setTimeout(() => ScrollTrigger.refresh(), 200);
  };
  document.addEventListener('portfolio:sections-changed', () => {
    refreshWhenIdle();
    window.addEventListener('scroll', refreshWhenIdle, { passive: true });
    setTimeout(() => window.removeEventListener('scroll', refreshWhenIdle), 3000);
  });
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
