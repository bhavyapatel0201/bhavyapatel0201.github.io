/**
 * 3D effects
 *  - Depth.tilt(root): cards tilt toward the pointer with a moving glare (mouse/pen only)
 *  - Hero parallax: hero layers sit at different depths and turn with the pointer
 *  - Hero swipe: drag/swipe sideways on the hero to spin the background scene (scene.js)
 * Pointer-driven motion is skipped for prefers-reduced-motion; spinning the scene by
 * hand still works, since it only moves when the visitor moves it.
 */
window.Depth = (function () {
  const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = () => window.Motion?.reduced();

  // ---------- Card tilt ----------
  const TILT_SELECTOR = '.project-card, .cert-card, .pillar-card, .skill-category-card, .experience-card, .hero-stats-grid, .resume-spotlight-card, .contact-form-container';

  function tilt(root = document) {
    root.querySelectorAll(TILT_SELECTOR).forEach((card) => {
      if (card.dataset.tilt) return;
      card.dataset.tilt = 'on';
      card.classList.add('tilt');
      let frame = 0;

      card.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch' || reduced() || !finePointer()) return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width; // 0..1
          const py = (e.clientY - r.top) / r.height;
          const max = Math.min(9, 2600 / Math.max(r.width, 1)); // big cards tilt less
          card.style.setProperty('--ry', `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
          card.style.setProperty('--rx', `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
          card.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
          card.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
          card.classList.add('is-tilting');
        });
      });

      card.addEventListener('pointerleave', () => {
        cancelAnimationFrame(frame);
        card.classList.remove('is-tilting');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  // ---------- Hero parallax ----------
  function heroParallax() {
    const hero = document.getElementById('hero');
    const content = hero?.querySelector('.hero-content');
    if (!content) return;
    let frame = 0;
    hero.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch' || reduced() || !finePointer()) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        content.style.setProperty('--hx', `${(x * 10).toFixed(2)}deg`);
        content.style.setProperty('--hy', `${(-y * 8).toFixed(2)}deg`);
      });
    });
    hero.addEventListener('pointerleave', () => {
      content.style.setProperty('--hx', '0deg');
      content.style.setProperty('--hy', '0deg');
    });
  }

  // ---------- Hero swipe spins the background scene ----------
  function heroSpin() {
    const hero = document.getElementById('hero');
    const scene = window.Scene;
    if (!hero || !scene || !window.Gestures) return;

    // Anywhere on the hero except links/buttons; mouse drags only on empty space
    window.Gestures.swipe(hero, {
      axis: 'both',
      mouse: true,
      ignore: 'a, button',
      canStart: (e) => e.pointerType !== 'mouse' || !e.target.closest('p, h1, .hero-role-badge, .hero-status-pill, .stat-item, img'),
      onStart: () => hero.classList.add('is-spinning'),
      onMove: (i) => {
        // Vertical touch drags are page scrolls: only spin on horizontal ones
        if (i.axis === 'y' && i.event.pointerType !== 'mouse') return;
        scene.drag(i.dx, i.axis === 'x' ? 0 : i.dy);
      },
      onEnd: (i) => {
        hero.classList.remove('is-spinning');
        const vx = i.axis === 'x' ? i.velocity : 0;
        const vy = i.axis === 'y' && i.event.pointerType === 'mouse' ? i.velocity : 0;
        scene.fling(vx, vy);
      },
      onCancel: () => { hero.classList.remove('is-spinning'); scene.release(); },
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    tilt(document);
    heroParallax();
    heroSpin();
  });

  return { tilt };
})();
