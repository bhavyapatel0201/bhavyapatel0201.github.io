/**
 * Section explorer bar: "Tabbed" shows one section at a time, "All" shows every section.
 * In Tabbed mode, swipe left/right on the section (touch, mouse drag or two-finger
 * trackpad swipe), click a tab, or use the arrow keys on the tab row: the section
 * turns away in 3D and the next one turns in. While swiping, it follows the finger.
 *
 * The navbar highlight is owned by navigation.js; this file only fires
 * `portfolio:sections-changed` so the highlight can update.
 */
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('selectableSectionsWrapper');
  const selectorBar = document.getElementById('topSectionSelectorBar');
  const pillBtns = [...document.querySelectorAll('.selector-pill-btn')];
  const modeTabbedBtn = document.getElementById('modeTabbedBtn');
  const modeAllBtn = document.getElementById('modeAllBtn');
  const panes = document.querySelectorAll('.selectable-pane');
  const hint = document.getElementById('swipeHint');
  const announcer = document.getElementById('sectionAnnouncer');
  if (!wrapper || pillBtns.length === 0) return;

  const order = pillBtns.map((btn) => btn.dataset.section);
  const labelOf = (id) => pillBtns.find((b) => b.dataset.section === id)?.querySelector('.pill-title')?.textContent.trim() || id;
  let mode = 'tabbed';
  let currentSection = order[0]; // first tab (About)
  let animating = null;
  const isSelectable = (id) => order.includes(id);
  const notify = () => document.dispatchEvent(new CustomEvent('portfolio:sections-changed'));
  const reduced = () => window.Motion.reduced();

  // Fixed header + (on tablet/desktop) the sticky bar itself
  function stickyOffset() {
    const header = document.getElementById('siteHeader')?.offsetHeight || 0;
    const barIsSticky = selectorBar && getComputedStyle(selectorBar).position === 'sticky';
    return header + (barIsSticky ? selectorBar.offsetHeight : 0) + 12;
  }

  // Page position from layout (offsetTop ignores transforms; a section mid-flip
  // in 3D would report a very different getBoundingClientRect)
  function layoutTop(el) {
    let y = 0;
    for (let node = el; node; node = node.offsetParent) y += node.offsetTop;
    return y;
  }

  function scrollToEl(el) {
    if (!el) return;
    window.Motion.scrollTo(layoutTop(el) - stickyOffset());
  }

  // If the top of the new section is off screen, bring it into view
  function ensureTopVisible(el) {
    if (el && layoutTop(el) - window.scrollY < stickyOffset() - 4) scrollToEl(el);
  }

  function setMode(next) {
    mode = next;
    wrapper.setAttribute('data-view-mode', mode);
    modeTabbedBtn?.classList.toggle('active', mode === 'tabbed');
    modeAllBtn?.classList.toggle('active', mode === 'all');
    modeTabbedBtn?.setAttribute('aria-pressed', String(mode === 'tabbed'));
    modeAllBtn?.setAttribute('aria-pressed', String(mode === 'all'));
    if (hint) hint.hidden = mode !== 'tabbed' || hint.dataset.dismissed === 'true';
    if (mode === 'tabbed') showSection(currentSection, { scroll: false, animate: false });
    else panes.forEach((pane) => { pane.classList.add('active'); pane.style.transform = ''; pane.style.opacity = ''; });
    notify();
  }

  function markPills(id) {
    pillBtns.forEach((btn) => {
      const match = btn.dataset.section === id;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-current', match ? 'true' : 'false');
      if (match) {
        // Keep the active tab visible in the scrolling row (without scrolling the page)
        const row = btn.parentElement;
        const left = btn.offsetLeft - (row.clientWidth - btn.offsetWidth) / 2;
        row.scrollTo({ left, behavior: reduced() ? 'auto' : 'smooth' });
      }
    });
  }

  /**
   * dir: 1 = moving forward (new section comes in from the right), -1 = backward.
   * from: optional current drag offset so a swipe continues smoothly.
   */
  async function showSection(id, { scroll = true, animate = true, dir = 0, from = null } = {}) {
    if (!isSelectable(id)) return;
    const prev = currentSection;
    const prevPane = document.getElementById(prev);
    const nextPane = document.getElementById(id);
    currentSection = id;
    markPills(id);

    if (mode !== 'tabbed') {
      if (scroll) scrollToEl(nextPane);
      notify();
      return;
    }

    if (!dir) dir = Math.sign(order.indexOf(id) - order.indexOf(prev)) || 1;
    if (prev !== id) window.Scene?.kick(dir); // background spins the way the content moves
    const canAnimate = animate && !reduced() && prevPane && prevPane !== nextPane && prevPane.animate;

    if (canAnimate) {
      animating?.cancel();
      // Old section turns away in 3D
      const startX = from ? from.x : 0;
      const startRot = from ? from.rot : 0;
      animating = prevPane.animate([
        { transform: `translateX(${startX}px) rotateY(${startRot}deg)`, opacity: from ? from.opacity : 1 },
        { transform: `translateX(${-dir * 30}%) rotateY(${dir * 38}deg)`, opacity: 0 },
      ], { duration: 260, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' });
      try { await animating.finished; } catch (e) { /* replaced by a newer swipe */ }
      prevPane.getAnimations().forEach((a) => a.cancel());
    }

    prevPane.style.transform = '';
    prevPane.style.opacity = '';
    panes.forEach((pane) => pane.classList.toggle('active', pane.id === id));
    // Content in a newly shown pane may not have been revealed yet
    window.Motion.observe(nextPane || document);
    window.Depth?.tilt(nextPane || document);

    if (canAnimate) {
      // New section turns in from the other side
      nextPane.animate([
        { transform: `translateX(${dir * 30}%) rotateY(${-dir * 38}deg)`, opacity: 0 },
        { transform: 'none', opacity: 1 },
      ], { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    }

    if (scroll) scrollToEl(nextPane);
    else if (from) ensureTopVisible(nextPane);
    if (announcer && prev !== id) announcer.textContent = `Showing ${labelOf(id)}, section ${order.indexOf(id) + 1} of ${order.length}`;
    notify();
  }

  const step = (delta) => order[order.indexOf(currentSection) + delta];

  // Edge fades on the tab row only where tabs are actually scrolled out of view
  const pillRow = pillBtns[0].parentElement;
  function updateFade() {
    const max = pillRow.scrollWidth - pillRow.clientWidth;
    const edge = 8; // px tolerance (snap points and sub-pixel widths)
    pillRow.classList.toggle('fade-start', max > edge && pillRow.scrollLeft > edge);
    pillRow.classList.toggle('fade-end', max > edge && pillRow.scrollLeft < max - edge);
  }
  pillRow.addEventListener('scroll', updateFade, { passive: true });
  window.addEventListener('resize', updateFade, { passive: true });
  updateFade();

  // When the visitor is reading a section outside the explorer, quiet the tab highlight
  function updateOutside() {
    const top = (el) => { let y = 0; for (let n = el; n; n = n.offsetParent) y += n.offsetTop; return y; };
    const probe = window.scrollY + window.innerHeight * 0.4;
    const start = top(wrapper);
    selectorBar?.classList.toggle('is-outside', probe < start || probe > start + wrapper.offsetHeight);
  }
  window.addEventListener('scroll', updateOutside, { passive: true });
  document.addEventListener('portfolio:sections-changed', () => requestAnimationFrame(updateOutside));
  updateOutside();

  // --- Tabs, mode buttons, keyboard ---
  pillBtns.forEach((btn) => btn.addEventListener('click', () => showSection(btn.dataset.section)));
  modeTabbedBtn?.addEventListener('click', () => setMode('tabbed'));
  modeAllBtn?.addEventListener('click', () => setMode('all'));

  pillBtns[0].parentElement.addEventListener('keydown', (e) => {
    const delta = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!delta) return;
    const target = step(delta);
    if (!target) return;
    e.preventDefault();
    showSection(target, { scroll: false, dir: delta });
    pillBtns[order.indexOf(target)].focus();
  });

  // --- Swipe: the section follows the finger, then turns to the next one ---
  function dismissHint() {
    if (!hint || hint.dataset.dismissed === 'true') return;
    hint.dataset.dismissed = 'true';
    hint.hidden = true;
    try { localStorage.setItem('bhavya_portfolio_swiped', '1'); } catch (e) { /* ignore */ }
  }

  function dragState(dx) {
    const pane = document.getElementById(currentSection);
    const width = wrapper.clientWidth || 1;
    const hasNext = Boolean(step(dx < 0 ? 1 : -1));
    const eased = hasNext ? dx : dx * 0.25; // rubber-band at the first/last section
    const progress = Math.max(-1, Math.min(1, eased / width));
    return { pane, x: eased * 0.6, rot: progress * 30, opacity: 1 - Math.abs(progress) * 0.55, hasNext };
  }

  window.Gestures.swipe(wrapper, {
    axis: 'x',
    mouse: true,
    canStart: () => mode === 'tabbed',
    ignore: '.modal-overlay',
    onStart: () => { animating?.cancel(); wrapper.classList.add('is-dragging'); },
    onMove: ({ dx }) => {
      if (reduced()) return;
      const d = dragState(dx);
      d.pane.style.transformOrigin = dx < 0 ? '0% 50%' : '100% 50%';
      d.pane.style.transform = `translateX(${d.x}px) rotateY(${d.rot}deg)`;
      d.pane.style.opacity = d.opacity;
    },
    onEnd: ({ dx, dir }) => {
      wrapper.classList.remove('is-dragging');
      const delta = dir === 'left' ? 1 : -1;
      const target = step(delta);
      const d = dragState(dx);
      if (!target) return snapBack(d.pane);
      dismissHint();
      d.pane.style.transformOrigin = '';
      showSection(target, { scroll: false, dir: delta, from: reduced() ? null : d });
    },
    onCancel: () => {
      wrapper.classList.remove('is-dragging');
      snapBack(document.getElementById(currentSection));
    },
  });

  function snapBack(pane) {
    if (!pane) return;
    const from = pane.style.transform;
    const opacity = pane.style.opacity || 1;
    pane.style.transform = '';
    pane.style.opacity = '';
    pane.style.transformOrigin = '';
    if (from && !reduced()) {
      pane.animate([{ transform: from, opacity }, { transform: 'none', opacity: 1 }],
        { duration: 320, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    }
  }

  // Two-finger trackpad swipe does the same on laptops
  window.Gestures.wheelSwipe(wrapper, {
    onSwipe: (dir) => {
      if (mode !== 'tabbed' || document.getElementById('projectModalOverlay')?.classList.contains('open')) return;
      const delta = dir === 'left' ? 1 : -1;
      const target = step(delta);
      if (!target) return;
      dismissHint();
      showSection(target, { scroll: false, dir: delta, from: { x: 0, rot: 0, opacity: 1 } });
    },
  });

  // Navbar links to explorer sections switch the tab instead of jumping to a hidden element
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!isSelectable(id)) return;
      e.preventDefault();
      showSection(id, { scroll: true });
    });
  });

  // Show the swipe hint on touch screens until the visitor has swiped once
  if (hint) {
    let swiped = false;
    try { swiped = localStorage.getItem('bhavya_portfolio_swiped') === '1'; } catch (e) { /* ignore */ }
    const touch = window.matchMedia('(pointer: coarse)').matches;
    hint.dataset.dismissed = String(swiped || !touch);
    hint.hidden = swiped || !touch;
    hint.querySelector('button')?.addEventListener('click', dismissHint);
  }

  // The page always opens on the hero. A section in the address (e.g. /#projects, saved by
  // the <head> script before it was cleared) only decides which tab is preselected.
  const hash = window.__initialHash || '';
  showSection(isSelectable(hash) ? hash : order[0], { scroll: false, animate: false });

  // Typing a #section into the address bar (no reload) switches to that tab
  window.addEventListener('hashchange', () => {
    const id = window.location.hash.slice(1);
    if (!isSelectable(id)) return;
    history.replaceState(null, '', window.location.pathname + window.location.search);
    showSection(id, { scroll: true });
  });
});
