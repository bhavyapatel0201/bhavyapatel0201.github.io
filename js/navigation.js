/**
 * Navigation: mobile drawer, active-section highlight (scrollspy), back-to-top.
 */
document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .rail-link');
  const progressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const header = document.getElementById('siteHeader');
  const desktopQuery = window.matchMedia('(min-width: 768px)');

  // --- Mobile drawer ---
  function setMenu(open) {
    if (!mobileToggle || !mobileDrawer) return;
    mobileDrawer.classList.toggle('open', open);
    mobileToggle.classList.toggle('open', open);
    mobileToggle.setAttribute('aria-expanded', String(open));
    mobileToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    document.body.style.overflow = open ? 'hidden' : '';
    // Wait a frame: the drawer must be visible before it can take focus
    if (open) requestAnimationFrame(() => mobileDrawer.querySelector('a')?.focus());
  }

  const menuIsOpen = () => mobileDrawer?.classList.contains('open');

  mobileToggle?.addEventListener('click', () => setMenu(!menuIsOpen()));
  navLinks.forEach((link) => link.addEventListener('click', () => { if (menuIsOpen()) setMenu(false); }));
  mobileDrawer?.querySelectorAll('.resume-download-trigger').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuIsOpen()) {
      setMenu(false);
      mobileToggle.focus();
    }
  });

  // Rotating to / resizing past 768px hides the drawer; don't leave the page scroll-locked.
  desktopQuery.addEventListener('change', (e) => { if (e.matches && menuIsOpen()) setMenu(false); });

  // --- Active section highlight ---
  // The active section is the last one whose top has passed a line 35% down the
  // viewport (below the fixed header). Hidden tab panes are skipped.
  const sectionIds = [...new Set([...navLinks].map((a) => a.getAttribute('href')).filter((h) => h && h.startsWith('#')).map((h) => h.slice(1)))];

  function setActive(id) {
    navLinks.forEach((link) => {
      const match = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', match);
      if (match) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  // Layout position (ignores transforms, so a section mid-3D-flip still measures correctly)
  function layoutTop(el) {
    let y = 0;
    for (let node = el; node; node = node.offsetParent) y += node.offsetTop;
    return y;
  }

  function updateActive() {
    const line = (header?.offsetHeight || 64) + window.innerHeight * 0.35;
    let current = null;
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el || !el.getClientRects().length) return; // hidden (e.g. inactive tab)
      if (layoutTop(el) - window.scrollY <= line) current = id;
    });
    // At the very bottom, the last visible section wins even if it is short.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      const visible = sectionIds.filter((id) => document.getElementById(id)?.getClientRects().length);
      current = visible[visible.length - 1] || current;
    }
    setActive(current);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateActive();
      backToTopBtn?.classList.toggle('visible', window.scrollY > 400);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar?.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  // The tabbed explorer shows/hides sections; recompute when it does.
  document.addEventListener('portfolio:sections-changed', onScroll);
  updateActive();

  // --- Back to top ---
  backToTopBtn?.addEventListener('click', () => {
    window.Motion.scrollTo(0);
    document.getElementById('main')?.focus({ preventScroll: true });
  });

  // Reveal static content (dynamic content is observed by app.js after rendering)
  window.Motion.observe(document);
});
