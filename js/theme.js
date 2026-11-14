/**
 * Theme Controller (Dark / Light Mode)
 * The initial theme is applied by the inline script in <head> (before first paint).
 * Here: the toggle button, saving an explicit choice, and following OS changes
 * while the visitor has not picked a theme themselves.
 */
(function initTheme() {
  const THEME_STORAGE_KEY = 'bhavya_portfolio_theme';
  const root = document.documentElement;
  const themeColors = { dark: '#0a0f1d', light: '#f8fafc' };
  const osLight = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

  function readSaved() {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved === 'light' || saved === 'dark' ? saved : null;
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[theme]);
    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });
  }

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  // Only an explicit toggle is saved, so an untouched visitor keeps following the OS.
  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch (e) { /* private mode: still works for this visit */ }
  }

  if (osLight) {
    osLight.addEventListener('change', (e) => {
      if (!readSaved()) applyTheme(e.matches ? 'light' : 'dark');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(readSaved() || currentTheme());
    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => btn.addEventListener('click', toggleTheme));
  });

  window.toggleTheme = toggleTheme;
})();
