/**
 * Projects: tag filters, cards (hover lift + click to open), and the details modal.
 * Categories come from each project's "category" in data/content.json.
 */
window.ProjectsController = (function () {
  // To add a category: add it here and use its id as a project's "category".
  const CATEGORIES = {
    aiml: { filter: 'AI/ML', badge: 'AI / ML', long: 'AI / Machine Learning', cls: 'cat-aiml' },
    data: { filter: 'Data', badge: 'Data Eng', long: 'Data Engineering', cls: 'cat-data' },
    systems: { filter: 'Systems', badge: 'Systems', long: 'Systems Programming', cls: 'cat-systems' },
    web: { filter: 'Web', badge: 'Web', long: 'Web Development', cls: 'cat-web' },
  };
  const catInfo = (id) => CATEGORIES[id] || { filter: id, badge: id, long: id, cls: 'cat-systems' };

  const icons = {
    github: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>',
    external: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>',
    trend: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
    chevron: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>',
  };

  let projectsData = [];
  let currentFilter = 'all';
  let lastTrigger = null;
  let modalId = null; // project currently shown in the modal
  let flipping = null;

  function init(projects) {
    projectsData = projects || [];
    renderFilters();
    renderProjects();
    setupModalListeners();
  }

  // --- Filters ---
  function renderFilters() {
    const bar = document.getElementById('projectFilterContainer');
    if (!bar) return;

    // Show every known category, plus any extra category used in content.json
    const used = [...new Set(projectsData.map((p) => p.category))];
    const ids = [...new Set([...Object.keys(CATEGORIES), ...used])];
    const filters = [{ id: 'all', label: 'All', count: projectsData.length }].concat(
      ids.map((id) => ({ id, label: catInfo(id).filter, count: projectsData.filter((p) => p.category === id).length }))
    );

    bar.innerHTML = filters.map((f) => `
      <button type="button" class="filter-btn ${f.id === currentFilter ? 'active' : ''}" data-category="${f.id}"
        aria-pressed="${f.id === currentFilter}" ${f.count === 0 ? 'disabled' : ''}>
        <span>${f.label}</span>
        <span class="filter-count-badge" aria-label="${f.count} projects">${f.count}</span>
      </button>
    `).join('');

    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn || btn.disabled) return;
      currentFilter = btn.dataset.category;
      bar.querySelectorAll('.filter-btn').forEach((b) => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      applyFilter();
    });
  }

  function applyFilter() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    let shown = 0;
    grid.querySelectorAll('.project-card').forEach((card) => {
      const match = currentFilter === 'all' || card.dataset.category === currentFilter;
      card.hidden = !match;
      if (match) {
        shown += 1;
        card.classList.add('active'); // filtered-in cards appear without waiting for scroll
      }
    });
    const status = document.getElementById('projectFilterStatus');
    if (status) {
      const label = currentFilter === 'all' ? 'all categories' : catInfo(currentFilter).long;
      status.textContent = `Showing ${shown} project${shown === 1 ? '' : 's'} in ${label}.`;
    }
  }

  // --- Cards ---
  function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    if (projectsData.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">No projects yet.</p>';
      return;
    }

    grid.innerHTML = projectsData.map((project, index) => {
      const cat = catInfo(project.category);
      return `
        <article class="project-card reveal" data-category="${project.category}" data-project-id="${project.id}"
          style="--reveal-delay: ${(index % 3) * 80}ms">
          <div class="project-card-header">
            <span class="project-category-badge ${cat.cls}">${cat.badge}</span>
            <div class="project-links">
              ${project.links?.github ? `
                <a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="project-icon-link"
                  aria-label="${project.title} source code on GitHub (opens in a new tab)">${icons.github}</a>` : ''}
              ${project.links?.demo ? `
                <a href="${project.links.demo}" target="_blank" rel="noopener noreferrer" class="project-icon-link"
                  aria-label="${project.title} live demo (opens in a new tab)">${icons.external}</a>` : ''}
            </div>
          </div>

          <h3 class="project-title">${project.title}</h3>
          <p class="project-summary">${project.summary}</p>

          ${project.metrics ? `<div class="project-metrics-box">${icons.trend}<span>${project.metrics}</span></div>` : ''}

          <ul class="project-tags" aria-label="Technologies">
            ${(project.tags || []).map((tag) => `<li class="project-tag">${tag}</li>`).join('')}
          </ul>

          <div class="project-footer">
            <button type="button" class="btn btn-outline btn-sm expand-project-btn" data-project-id="${project.id}"
              aria-haspopup="dialog">
              <span>View details<span class="visually-hidden">: ${project.title}</span></span>
              ${icons.chevron}
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Whole card opens the modal; links inside it keep working normally.
    // Keyboard users reach the same action through the card's "View details" button.
    grid.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const card = e.target.closest('.project-card');
      if (!card) return;
      if (window.getSelection && String(window.getSelection()).length > 0) return; // let people select text
      openProjectModal(card.dataset.projectId, card.querySelector('.expand-project-btn'));
    });

    applyFilter();
    window.Motion?.observe(grid);
  }

  // --- Modal ---
  function openProjectModal(id, trigger) {
    const overlay = document.getElementById('projectModalOverlay');
    if (!renderModal(id) || !overlay) return;

    lastTrigger = trigger || document.activeElement;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.modal-dialog').scrollTop = 0;
    // Wait a frame: the overlay must be visible before it can take focus
    requestAnimationFrame(() => document.getElementById('modalCloseBtn')?.focus());
  }

  // Projects in the order they appear under the current filter
  function visibleIds() {
    return [...document.querySelectorAll('#projectsGrid .project-card:not([hidden])')].map((c) => c.dataset.projectId);
  }

  function renderModal(id) {
    const project = projectsData.find((p) => p.id === id);
    const content = document.getElementById('modalProjectContent');
    if (!project || !content) return false;
    modalId = id;

    const cat = catInfo(project.category);
    const section = (title, color, body) => `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: ${color}; margin-bottom: 0.35rem;">${title}</h3>
        ${body}
      </div>`;

    content.innerHTML = `
      <div style="margin-bottom: 0.75rem; padding-right: 3rem;">
        <span class="project-category-badge ${cat.cls}">${cat.long}</span>
      </div>
      <h2 id="modalProjectTitle" style="font-size: clamp(1.35rem, 1.1rem + 1.2vw, 1.85rem); font-weight: 800; color: var(--text-primary); margin-bottom: 1rem; line-height: 1.2; padding-right: 2.5rem;">
        ${project.title}
      </h2>
      <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">${project.summary}</p>
      ${project.details?.highlights?.length ? section('What I built', 'var(--accent-primary)',
        `<ul class="modal-highlights-list">${project.details.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>`) : ''}
      <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <ul class="project-tags" aria-label="Technologies" style="margin-bottom: 0;">
          ${(project.tags || []).map((t) => `<li class="project-tag">${t}</li>`).join('')}
        </ul>
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
          ${project.links?.github ? `<a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">${icons.github}<span>GitHub Repo</span><span class="visually-hidden"> (opens in a new tab)</span></a>` : ''}
          ${project.links?.demo ? `<a href="${project.links.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm"><span>Live Demo</span>${icons.external}<span class="visually-hidden"> (opens in a new tab)</span></a>` : ''}
        </div>
      </div>
    `;

    // Pager: "3 / 9" plus prev/next availability
    const ids = visibleIds();
    const index = ids.indexOf(id);
    const position = document.getElementById('modalPosition');
    if (position) position.textContent = `${index + 1} / ${ids.length}`;
    const prevBtn = document.getElementById('modalPrevBtn');
    const nextBtn = document.getElementById('modalNextBtn');
    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index < 0 || index >= ids.length - 1;
    return true;
  }

  /**
   * Show the previous (-1) or next (+1) project with a 3D card flip.
   * from: the current swipe offset, so the flip continues from the finger.
   */
  async function stepModal(delta, from = null) {
    const ids = visibleIds();
    const target = ids[ids.indexOf(modalId) + delta];
    const content = document.getElementById('modalProjectContent');
    const dialog = content?.closest('.modal-dialog');
    if (!target || !content) { snapModal(); return; }

    const animate = !window.Motion?.reduced() && content.animate;
    if (animate) {
      flipping?.cancel();
      flipping = content.animate([
        { transform: `translateX(${from ? from.x : 0}px) rotateY(${from ? from.rot : 0}deg)`, opacity: from ? from.opacity : 1 },
        { transform: `translateX(${-delta * 18}%) rotateY(${delta * 70}deg)`, opacity: 0 },
      ], { duration: 200, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' });
      try { await flipping.finished; } catch (e) { /* superseded */ }
    }
    content.style.transform = '';
    content.style.opacity = '';
    renderModal(target);
    if (dialog) dialog.scrollTop = 0;
    if (animate) {
      content.getAnimations().forEach((a) => a.cancel());
      content.animate([
        { transform: `translateX(${delta * 18}%) rotateY(${-delta * 70}deg)`, opacity: 0 },
        { transform: 'none', opacity: 1 },
      ], { duration: 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    }
    const announcer = document.getElementById('modalAnnouncer');
    const now = visibleIds();
    if (announcer) announcer.textContent = `Project ${now.indexOf(target) + 1} of ${now.length}: ${projectsData.find((p) => p.id === target)?.title}`;
  }

  function snapModal() {
    const content = document.getElementById('modalProjectContent');
    if (!content) return;
    const from = content.style.transform;
    const opacity = content.style.opacity || 1;
    content.style.transform = '';
    content.style.opacity = '';
    if (from && !window.Motion?.reduced()) {
      content.animate([{ transform: from, opacity }, { transform: 'none', opacity: 1 }], { duration: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    }
  }

  function closeModal() {
    const overlay = document.getElementById('projectModalOverlay');
    if (!overlay?.classList.contains('open')) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    const dialog = overlay.querySelector('.modal-dialog');
    if (dialog) dialog.style.transform = '';
    // Return focus to the card of the project that was open last
    const card = document.querySelector(`.project-card[data-project-id="${modalId}"] .expand-project-btn`);
    (card && !card.closest('[hidden]') ? card : lastTrigger)?.focus();
  }

  function trapFocus(e) {
    const overlay = document.getElementById('projectModalOverlay');
    if (e.key !== 'Tab' || !overlay?.classList.contains('open')) return;
    const focusable = overlay.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function setupModalListeners() {
    const overlay = document.getElementById('projectModalOverlay');
    document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (!overlay?.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') { e.preventDefault(); stepModal(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); stepModal(-1); }
      trapFocus(e);
    });

    document.getElementById('modalPrevBtn')?.addEventListener('click', () => stepModal(-1));
    document.getElementById('modalNextBtn')?.addEventListener('click', () => stepModal(1));

    const dialog = overlay?.querySelector('.modal-dialog');
    const content = document.getElementById('modalProjectContent');
    if (!dialog || !content || !window.Gestures) return;

    // Swipe left/right on the details: the card turns with the finger, then flips to the next project
    window.Gestures.swipe(dialog, {
      axis: 'x',
      mouse: true,
      ignore: 'a, button, .modal-arch-diagram, .modal-grabber',
      onMove: ({ dx }) => {
        if (window.Motion?.reduced()) return;
        const ids = visibleIds();
        const hasNext = Boolean(ids[ids.indexOf(modalId) + (dx < 0 ? 1 : -1)]);
        const eased = hasNext ? dx : dx * 0.25;
        const progress = Math.max(-1, Math.min(1, eased / (dialog.clientWidth || 1)));
        content.style.transform = `translateX(${eased * 0.5}px) rotateY(${progress * 45}deg)`;
        content.style.opacity = 1 - Math.abs(progress) * 0.5;
      },
      onEnd: ({ dx, dir }) => {
        const progress = Math.max(-1, Math.min(1, dx / (dialog.clientWidth || 1)));
        stepModal(dir === 'left' ? 1 : -1, { x: dx * 0.5, rot: progress * 45, opacity: 1 - Math.abs(progress) * 0.5 });
      },
      onCancel: snapModal,
    });
    window.Gestures.wheelSwipe(dialog, { onSwipe: (dir) => stepModal(dir === 'left' ? 1 : -1) });

    // Drag the handle down to dismiss (bottom-sheet style on touch screens)
    const grabber = dialog.querySelector('.modal-grabber');
    if (grabber) {
      window.Gestures.swipe(grabber, {
        axis: 'y',
        mouse: true,
        onStart: () => { dialog.style.transition = 'none'; }, // follow the finger exactly
        onMove: ({ dy }) => { dialog.style.transform = `translateY(${Math.max(0, dy)}px) rotateX(${Math.min(12, Math.max(0, dy) / 20)}deg)`; },
        onEnd: ({ dir }) => {
          dialog.style.transition = '';
          if (dir === 'down') closeModal();
          else dialog.style.transform = '';
        },
        onCancel: () => { dialog.style.transition = ''; dialog.style.transform = ''; },
      });
    }
  }

  // open(id): used by the command palette
  return { init, open: (id) => openProjectModal(id) };
})();
