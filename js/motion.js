/**
 * Motion helpers shared by the other scripts.
 *  - Motion.reduced()      true when the visitor asks for reduced motion
 *  - Motion.observe(root)  scroll-reveal for every .reveal inside root (call again after rendering new content)
 *  - Motion.type(el)       typing effect that reserves the final height (no layout shift)
 *  - Motion.scrollTo(top)  smooth scroll unless reduced motion is on
 */
window.Motion = (function () {
  const reducedQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const reduced = () => !!(reducedQuery && reducedQuery.matches);

  let revealObserver = null;
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }

  function observe(root = document) {
    const items = root.querySelectorAll('.reveal:not(.active)');
    items.forEach((el) => {
      if (!revealObserver || reduced()) {
        el.classList.add('active');
      } else {
        revealObserver.observe(el);
      }
    });
  }

  /**
   * Types el's text out character by character. The full text stays in the DOM
   * for screen readers (visually hidden) and as an invisible "ghost" that holds
   * the paragraph at its final size while the visible copy types in.
   */
  function type(el, { speed = 18, startDelay = 400 } = {}) {
    if (!el) return;
    const text = el.textContent.trim();
    if (el._typingTimer) clearTimeout(el._typingTimer);
    if (reduced() || !text) {
      el.textContent = text;
      return;
    }

    el.classList.remove('typing-done');
    el.classList.add('typing-host');
    el.innerHTML = '';

    const srText = document.createElement('span');
    srText.className = 'visually-hidden';
    srText.textContent = text;

    const ghost = document.createElement('span');
    ghost.className = 'typing-ghost';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.textContent = text;

    const live = document.createElement('span');
    live.setAttribute('aria-hidden', 'true');
    const typed = document.createTextNode('');
    const caret = document.createElement('span');
    caret.className = 'typing-caret';
    live.append(typed, caret);

    el.append(srText, ghost, live);

    let i = 0;
    const tick = () => {
      i += 1;
      typed.textContent = text.slice(0, i);
      if (i < text.length) {
        el._typingTimer = setTimeout(tick, speed);
      } else {
        el.classList.add('typing-done');
      }
    };
    el._typingTimer = setTimeout(tick, startDelay);
  }

  function scrollTo(top) {
    window.scrollTo({ top, behavior: reduced() ? 'auto' : 'smooth' });
  }

  return { reduced, observe, type, scrollTo };
})();
