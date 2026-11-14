/**
 * Gestures: one swipe detector used by every swipeable area.
 *
 *   Gestures.swipe(el, {
 *     axis: 'x' | 'y' | 'both',     which directions count as a swipe
 *     mouse: true,                  also allow mouse drags (touch + pen always work)
 *     ignore: 'css selector',       drags starting here are ignored
 *     onStart(info), onMove(info),  live feedback while the finger moves
 *     onEnd(info), onCancel(info)   info = { dx, dy, axis, dir, velocity }
 *   })
 *   Gestures.wheelSwipe(el, { onSwipe(dir) })   two-finger trackpad swipes
 *
 * A drag only becomes a swipe once it clearly moves along a tracked axis, so
 * normal vertical page scrolling keeps working. A click that ends a drag is swallowed.
 */
window.Gestures = (function () {
  const LOCK_DISTANCE = 10; // px before deciding the drag's direction
  const MIN_DISTANCE = 60; // px for a slow swipe to count
  const MIN_VELOCITY = 0.45; // px/ms for a short, fast flick to count
  const DEFAULT_IGNORE = 'input, textarea, select, [contenteditable], .no-swipe';

  // Don't hijack drags inside something that scrolls sideways itself
  function inHorizontalScroller(target, root) {
    for (let el = target; el && el !== root; el = el.parentElement) {
      if (el.scrollWidth > el.clientWidth + 2) {
        const ox = getComputedStyle(el).overflowX;
        if (ox === 'auto' || ox === 'scroll') return true;
      }
    }
    return false;
  }

  function swipe(el, opts = {}) {
    const axis = opts.axis || 'x';
    const ignore = [DEFAULT_IGNORE, opts.ignore].filter(Boolean).join(', ');
    let s = null;
    let swallowClick = false;

    const info = (e) => {
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      const dt = Math.max(1, performance.now() - s.vt);
      const along = s.locked === 'x' ? e.clientX - s.vx : e.clientY - s.vy;
      const main = s.locked === 'x' ? dx : dy;
      const dir = s.locked === 'x' ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
      return { dx, dy, axis: s.locked, dir, distance: Math.abs(main), velocity: along / dt, event: e };
    };

    el.addEventListener('pointerdown', (e) => {
      if (!e.isPrimary || (e.pointerType === 'mouse' && (!opts.mouse || e.button !== 0))) return;
      if (e.target.closest(ignore) || inHorizontalScroller(e.target, el)) return;
      if (opts.canStart && !opts.canStart(e)) return;
      const now = performance.now();
      s = { x: e.clientX, y: e.clientY, vx: e.clientX, vy: e.clientY, vt: now, id: e.pointerId, locked: null, type: e.pointerType };
    });

    el.addEventListener('pointermove', (e) => {
      if (!s || e.pointerId !== s.id) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;

      if (!s.locked) {
        if (Math.hypot(dx, dy) < LOCK_DISTANCE) return;
        const horizontal = Math.abs(dx) > Math.abs(dy) * 1.15;
        const locked = horizontal ? 'x' : 'y';
        if (axis !== 'both' && locked !== axis) { s = null; return; } // let the page scroll
        s.locked = locked;
        try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        document.documentElement.classList.add('is-swiping');
        window.getSelection?.().removeAllRanges();
        opts.onStart?.(info(e));
      }

      if (s.type === 'mouse') e.preventDefault();
      // Velocity is measured over the last ~100ms only
      if (performance.now() - s.vt > 100) {
        s.vx = e.clientX; s.vy = e.clientY; s.vt = performance.now();
      }
      opts.onMove?.(info(e));
    });

    const finish = (e, cancelled) => {
      if (!s || e.pointerId !== s.id) return;
      if (s.locked) {
        const i = info(e);
        const isSwipe = !cancelled && (i.distance >= MIN_DISTANCE || (i.distance >= 24 && Math.abs(i.velocity) >= MIN_VELOCITY));
        swallowClick = true;
        setTimeout(() => { swallowClick = false; }, 0);
        document.documentElement.classList.remove('is-swiping');
        if (isSwipe) opts.onEnd?.(i); else opts.onCancel?.(i);
      }
      s = null;
    };

    el.addEventListener('pointerup', (e) => finish(e, false));
    el.addEventListener('pointercancel', (e) => finish(e, true));
    // Only when *this* element loses capture: on touch the browser first captures to the
    // inner element under the finger, and moving capture here fires (and bubbles) its loss.
    el.addEventListener('lostpointercapture', (e) => { if (e.target === el && s && s.locked) finish(e, true); });
    // A drag shouldn't also count as a click on whatever it started on
    el.addEventListener('click', (e) => {
      if (swallowClick) { e.preventDefault(); e.stopPropagation(); swallowClick = false; }
    }, true);
  }

  // Horizontal two-finger trackpad swipe (one trigger per gesture)
  function wheelSwipe(el, { onSwipe, threshold = 90 }) {
    let sum = 0;
    let locked = false;
    let idleTimer = null;
    el.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || e.ctrlKey) return;
      if (inHorizontalScroller(e.target, el)) return;
      e.preventDefault(); // stop the browser's back/forward swipe here
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { sum = 0; locked = false; }, 180); // gesture ended
      if (locked) return;
      sum += e.deltaX;
      if (Math.abs(sum) >= threshold) {
        locked = true;
        onSwipe(sum > 0 ? 'left' : 'right'); // fingers move left = content moves left
      }
    }, { passive: false });
  }

  return { swipe, wheelSwipe };
})();
