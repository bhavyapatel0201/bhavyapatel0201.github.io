/**
 * Command palette: a small terminal for getting around the site.
 * Open with "/" or Ctrl/Cmd+K (or the >_ button). Type to filter, ↑/↓ to move, Enter to run.
 * Commands are built from the page content, so new projects/certificates appear automatically.
 */
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('paletteOverlay');
  const input = document.getElementById('paletteInput');
  const list = document.getElementById('paletteList');
  const output = document.getElementById('paletteOutput');
  if (!overlay || !input || !list) return;

  let commands = [];
  let shown = [];
  let index = 0;
  let opener = null;

  const say = (text) => { if (output) output.textContent = text; };
  const content = () => window.PortfolioData || window.DEFAULT_CONTENT_FALLBACK || {};

  // Go to a section the same way a navbar link would (explorer tabs included)
  function goTo(id) {
    close();
    if (id === 'hero') { window.Motion.scrollTo(0); return; }
    const link = document.querySelector(`.nav-link[href="#${id}"], .rail-link[href="#${id}"]`);
    if (link) link.click();
    else document.getElementById(id)?.scrollIntoView();
  }

  function build() {
    const data = content();
    const profile = data.profile || {};
    const socials = profile.socials || {};
    const email = (data.contact && data.contact.email) || socials.email || 'patel61d@uwindsor.ca';
    const sections = [['hero', 'Home'], ['about', 'About'], ['experience', 'Experience'], ['projects', 'Projects'],
      ['skills', 'Skills'], ['certifications', 'Certifications'], ['resume', 'Resume'], ['contact', 'Contact']];

    commands = [
      ...sections.map(([id, label]) => ({
        group: 'Go to', title: label, alias: `cd ${id === 'hero' ? '~' : id}`, keys: `${id} section`, run: () => goTo(id),
      })),
      ...(data.projects || []).map((p) => ({
        group: 'Projects', title: p.title, alias: `open ${p.id}`, keys: `${(p.tags || []).join(' ')} ${p.category} project`,
        run: () => { close(); goTo('projects'); setTimeout(() => window.ProjectsController?.open(p.id), 450); },
      })),
      ...(data.certifications || []).filter((c) => c.certificateFile).map((c) => ({
        group: 'Certificates', title: c.name, alias: `cert ${c.id}`, keys: `${c.issuer} certificate pdf`,
        run: () => { window.open(c.certificateFile, '_blank', 'noopener'); close(); },
      })),
      { group: 'Actions', title: 'Download master resume', alias: 'resume --download', keys: 'cv pdf',
        run: () => { document.querySelector('.resume-download-trigger[download]')?.click(); close(); } },
      { group: 'Actions', title: `Copy email (${email})`, alias: 'copy email', keys: 'mail contact',
        run: async () => {
          try { await navigator.clipboard.writeText(email); say(`Copied ${email} to the clipboard.`); }
          catch (e) { say(`Email: ${email}`); }
        } },
      { group: 'Actions', title: 'Write a message', alias: 'mail', keys: 'contact form hire',
        run: () => { goTo('contact'); setTimeout(() => document.getElementById('contactName')?.focus(), 700); } },
      { group: 'Actions', title: 'Switch light / dark theme', alias: 'theme --toggle', keys: 'dark light mode',
        run: () => { window.toggleTheme?.(); say(`Theme: ${document.documentElement.getAttribute('data-theme')}.`); } },
      { group: 'Actions', title: 'Show all sections at once', alias: 'view --all', keys: 'scroll mode tabs',
        run: () => { document.getElementById('modeAllBtn')?.click(); close(); } },
      { group: 'Actions', title: 'Show one section at a time', alias: 'view --tabbed', keys: 'tabs mode swipe',
        run: () => { document.getElementById('modeTabbedBtn')?.click(); close(); } },
      ...(socials.github ? [{ group: 'Links', title: 'GitHub profile', alias: 'open github', keys: 'code repos',
        run: () => { window.open(socials.github, '_blank', 'noopener'); close(); } }] : []),
      ...(socials.linkedin ? [{ group: 'Links', title: 'LinkedIn profile', alias: 'open linkedin', keys: 'network',
        run: () => { window.open(socials.linkedin, '_blank', 'noopener'); close(); } }] : []),
      { group: 'Terminal', title: 'Who is Bhavya?', alias: 'whoami', keys: 'about bio',
        run: () => say(`${profile.name || 'Bhavya Patel'}: ${profile.title || 'Master of Applied Computing student'}. ${profile.availabilityStatus || ''}`.trim()) },
      { group: 'Terminal', title: 'What is Bhavya doing now?', alias: 'now', keys: 'current status learning building',
        run: () => say((data.now || []).map((n) => `${n.label}: ${n.text}`).join(' · ') || 'No status yet.') },
      { group: 'Terminal', title: 'List commands', alias: 'help', keys: '? commands',
        run: () => { input.value = ''; render(); say('Try: cd projects · open <project> · resume --download · copy email · theme --toggle · whoami'); } },
    ];
  }

  // Simple fuzzy score: substring matches beat in-order letter matches; title beats keywords
  function score(cmd, q) {
    if (!q) return 1;
    const fields = [[cmd.title, 3], [cmd.alias, 3], [`${cmd.group} ${cmd.keys}`, 1]];
    let best = 0;
    for (const [text, weight] of fields) {
      const t = text.toLowerCase();
      const at = t.indexOf(q);
      if (at >= 0) best = Math.max(best, weight * 10 - Math.min(at, 9));
      else {
        let i = 0;
        for (const ch of t) if (ch === q[i]) i++;
        if (i === q.length) best = Math.max(best, weight * 2);
      }
    }
    return best;
  }

  function render() {
    const q = input.value.trim().toLowerCase();
    shown = commands.map((c) => ({ c, s: score(c, q) })).filter((x) => x.s > 0)
      .sort((a, b) => (q ? b.s - a.s : 0)).map((x) => x.c);
    index = Math.min(index, Math.max(0, shown.length - 1));

    list.innerHTML = '';
    if (!shown.length) {
      const li = document.createElement('li');
      li.className = 'palette-empty';
      li.setAttribute('role', 'presentation');
      li.textContent = `command not found: ${input.value.trim()} (type "help")`;
      list.append(li);
      input.removeAttribute('aria-activedescendant');
      return;
    }
    let lastGroup = null;
    shown.forEach((cmd, i) => {
      if (!q && cmd.group !== lastGroup) {
        const head = document.createElement('li');
        head.className = 'palette-group';
        head.setAttribute('role', 'presentation');
        head.textContent = cmd.group;
        list.append(head);
        lastGroup = cmd.group;
      }
      const li = document.createElement('li');
      li.id = `palette-opt-${i}`;
      li.className = 'palette-option';
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === index));
      li.innerHTML = '<span class="palette-option-title"></span><code class="palette-option-alias"></code>';
      li.firstChild.textContent = cmd.title;
      li.lastChild.textContent = cmd.alias;
      li.addEventListener('mousemove', () => { if (index !== i) { index = i; highlight(); } });
      li.addEventListener('click', () => runAt(i));
      list.append(li);
    });
    highlight();
  }

  function highlight() {
    list.querySelectorAll('.palette-option').forEach((li, i) => li.setAttribute('aria-selected', String(i === index)));
    const active = document.getElementById(`palette-opt-${index}`);
    if (active) {
      input.setAttribute('aria-activedescendant', active.id);
      active.scrollIntoView({ block: 'nearest' });
    }
  }

  function runAt(i) {
    const cmd = shown[i];
    if (!cmd) return;
    say('');
    cmd.run();
  }

  function open() {
    if (!overlay.hidden) return;
    build();
    opener = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    input.value = '';
    index = 0;
    say('');
    render();
    requestAnimationFrame(() => input.focus());
  }

  function close() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  }

  input.addEventListener('input', () => { index = 0; render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); index = (index + 1) % Math.max(1, shown.length); highlight(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); index = (index - 1 + shown.length) % Math.max(1, shown.length); highlight(); }
    else if (e.key === 'Enter') { e.preventDefault(); runAt(index); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') e.preventDefault(); // keep focus in the palette
  });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  document.addEventListener('keydown', (e) => {
    const typing = e.target.closest?.('input, textarea, select, [contenteditable="true"]');
    if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      overlay.hidden ? open() : close();
    } else if (e.key === '/' && !typing && overlay.hidden && !document.querySelector('.modal-overlay.open')) {
      e.preventDefault();
      open();
    }
  });

  document.querySelectorAll('[data-open-palette]').forEach((btn) => btn.addEventListener('click', () => {
    document.getElementById('mobileNavToggle')?.getAttribute('aria-expanded') === 'true' && document.getElementById('mobileNavToggle').click();
    open();
  }));

  // Show ⌘ instead of Ctrl on Apple devices in every shortcut hint
  const platform = [navigator.userAgentData?.platform, navigator.platform, navigator.userAgent].join(' ');
  const isMac = /Mac|iPhone|iPad/.test(platform);
  if (isMac) {
    document.querySelectorAll('.mod-key').forEach((k) => { k.textContent = '⌘'; });
    document.querySelectorAll('[data-open-palette][title]').forEach((b) => { b.title = b.title.replace('Ctrl+K', '⌘K'); });
  }

  window.Palette = { open, close };
});
