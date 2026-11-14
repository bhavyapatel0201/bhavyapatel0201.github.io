/**
 * Application Core Controller
 * Loads /data/content.json and hydrates DOM elements
 */
document.addEventListener('DOMContentLoaded', async () => {
  let content = null;

  try {
    const res = await fetch('./data/content.json');
    if (res.ok) {
      content = await res.json();
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    console.warn('Could not fetch /data/content.json via network (likely local file:// origin). Using embedded schema fallback.', err);
    // Fallback embedded data ensures zero breaks under direct local file preview
    content = window.DEFAULT_CONTENT_FALLBACK;
  }

  if (!content) {
    console.error('No content data available.');
    return;
  }

  // --- Hydrate Hero Section ---
  hydrateHero(content);

  // --- Hydrate About & Specializations ---
  hydrateAbout(content);

  // --- Hydrate Experience Section ---
  hydrateExperience(content);

  // --- Hydrate Projects ---
  if (window.ProjectsController && content.projects) {
    window.ProjectsController.init(content.projects);
  }

  // --- Hydrate Skills & Certifications ---
  hydrateSkills(content);
  hydrateCertifications(content);

  // --- Hydrate Resume Section ---
  hydrateResume(content);

  // --- Hydrate Contact & Footer ---
  hydrateContact(content);
  hydrateNow(content);

  // Shared with the command palette
  window.PortfolioData = content;
  loadAnalytics(content.analytics);

  // Scroll-reveal for everything rendered above, then type the hero tagline
  window.Motion.observe(document);
  window.Depth?.tilt(document);
  window.Motion.type(document.getElementById('heroTagline'));
});

// "Now" panel in the hero: what Bhavya is doing at the moment (edit "now" in content.json)
function hydrateNow(data) {
  const panel = document.getElementById('nowPanel');
  const listEl = document.getElementById('nowList');
  if (!panel || !listEl) return;
  if (!data.now || !data.now.length) { panel.hidden = true; return; }
  listEl.innerHTML = data.now.map((item) => `
    <li class="now-item">
      <span class="now-label">${item.label}</span>
      <span class="now-text">${item.text}</span>
    </li>
  `).join('');
  const updated = document.getElementById('nowUpdated');
  if (updated) updated.textContent = data.nowUpdated ? `Updated ${data.nowUpdated}` : '';
}

// Privacy-friendly visit counts with GoatCounter (no cookies). Off until a code is set
// in content.json: "analytics": { "goatcounter": "yourcode" } (yourcode.goatcounter.com).
function loadAnalytics(config) {
  const code = config && String(config.goatcounter || '').trim();
  if (!code || !/^[a-z0-9-]+$/i.test(code) || location.protocol === 'file:' || /^(localhost|127\.)/.test(location.hostname)) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
  document.head.appendChild(script);
}

function hydrateHero(data) {
  const { profile, stats } = data;
  if (!profile) return;

  const heroStatusPill = document.getElementById('heroStatusPill');
  if (heroStatusPill && profile.availabilityStatus) {
    heroStatusPill.innerHTML = `
      <span class="status-dot"></span>
      <span>${profile.availabilityStatus}</span>
    `;
  }

  const heroName = document.getElementById('heroName');
  if (heroName) heroName.textContent = profile.name;

  const heroBadge = document.getElementById('heroRoleBadge');
  if (heroBadge) heroBadge.textContent = profile.specializationBadge || profile.title;

  const heroTagline = document.getElementById('heroTagline');
  if (heroTagline && profile.tagline) heroTagline.textContent = profile.tagline;

  const heroResumeBtn = document.getElementById('heroResumeBtn');
  if (heroResumeBtn && profile.resumeUrl) {
    heroResumeBtn.setAttribute('href', profile.resumeUrl);
  }

  // Hydrate Stats Grid
  const statsGrid = document.getElementById('heroStatsGrid');
  if (statsGrid && stats) {
    statsGrid.innerHTML = stats.map(stat => `
      <div class="stat-item">
        <div class="stat-value">${stat.value}</div>
        <div class="stat-label">${stat.label}</div>
      </div>
    `).join('');
  }
}

function hydrateAbout(data) {
  const { profile, specializations, education } = data;

  // Pillars
  const pillarsGrid = document.getElementById('aboutPillarsGrid');
  if (pillarsGrid && specializations) {
    const iconSVGs = {
      brain: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-4.54z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-4.54z"></path></svg>`,
      database: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
      cpu: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`
    };

    pillarsGrid.innerHTML = specializations.map((item, idx) => `
      <div class="pillar-card reveal" style="--reveal-delay: ${idx * 100}ms">
        <div class="pillar-icon-box" style="background: ${item.accentColor}18; color: ${item.accentColor};">
          ${iconSVGs[item.icon] || iconSVGs.brain}
        </div>
        <h3>${item.title}</h3>
        <div class="pillar-subtitle">${item.subtitle || ''}</div>
        <p>${item.description}</p>
      </div>
    `).join('');
  }

  // Bio
  const bioContainer = document.getElementById('aboutBioParagraph');
  if (bioContainer && profile?.bio) {
    bioContainer.textContent = profile.bio;
  }

  // Education Timeline
  const eduContainer = document.getElementById('educationTimeline');
  if (eduContainer && education) {
    eduContainer.innerHTML = education.map(edu => `
      <div class="edu-item">
        <div class="edu-degree">${edu.degree}</div>
        <div class="edu-institution">${edu.institution} • ${edu.location}</div>
        <div class="edu-period">${edu.period} ${edu.gpa ? `• GPA: ${edu.gpa}` : ''}</div>
        ${edu.coopStatus ? `<div style="font-size: 0.8rem; color: var(--accent-emerald); font-weight: 600; margin-bottom: 0.35rem;">✓ ${edu.coopStatus}</div>` : ''}
        ${edu.highlights ? `
          <div class="edu-courses">
            ${edu.highlights.map(c => `<span class="course-tag">${c}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');
  }
}

function hydrateExperience(data) {
  const { experience } = data;
  const list = document.getElementById('experienceList');
  if (!list || !experience) return;

  list.innerHTML = experience.map((exp, idx) => `
    <article class="experience-card reveal" style="--reveal-delay: ${idx * 80}ms">
      <div class="experience-header">
        <div>
          <h3 class="experience-role">${exp.role}</h3>
          <div class="experience-company">
            <span>${exp.company}</span>
          </div>
        </div>
        <div class="experience-meta">
          <span class="experience-period">${exp.period}</span>
          <span class="experience-location">${exp.location}</span>
        </div>
      </div>
      <div class="experience-bullets">
        ${exp.highlights.map(h => `<div class="experience-bullet">${h}</div>`).join('')}
      </div>
      <div class="experience-skills">
        ${exp.skills.map(s => `<span class="exp-skill-tag">${s}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

function hydrateSkills(data) {
  const { skills } = data;
  const grid = document.getElementById('skillsGrid');
  if (!grid || !skills) return;

  grid.innerHTML = Object.entries(skills).map(([category, list], idx) => `
    <div class="skill-category-card reveal" style="--reveal-delay: ${idx * 80}ms">
      <div class="skill-card-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-primary);">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
        <h3>${category}</h3>
      </div>
      <div class="skills-pill-group">
        ${list.map((skill, i) => `
          <div class="skill-pill-item" style="--i: ${i}">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-level-badge">${skill.level}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function hydrateCertifications(data) {
  const { certifications } = data;
  const grid = document.getElementById('certificationsGrid');
  if (!grid || !certifications) return;

  const iconMap = {
    'badge-aws': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
    'badge-genai': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>`,
    'badge-datacamp': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h7a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5H4z"></path><path d="M4 14l8 6"></path></svg>`,
    'badge-sec': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`
  };

  grid.innerHTML = certifications.map((cert, idx) => `
    <div class="cert-card reveal" style="--reveal-delay: ${idx * 50}ms">
      <div>
        <div class="cert-card-top">
          <div class="cert-badge-icon ${cert.badgeClass || ''}">
            ${iconMap[cert.badgeClass] || `<span style="font-weight: 800; font-size: 0.8rem;">${cert.badge}</span>`}
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem;">
            <span class="cert-status-pill">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>${cert.status || 'Verified'}</span>
            </span>
            ${cert.hours ? `<span class="cert-hours-pill">${cert.hours}</span>` : ''}
          </div>
        </div>
        <div class="cert-info">
          <h3 class="cert-title">${cert.name}</h3>
          <div class="cert-meta-row">
            <span class="cert-issuer">${cert.issuer}</span>
            ${cert.date ? `<span class="cert-date">• ${cert.date}</span>` : ''}
          </div>
          ${cert.partners ? `<p class="cert-partners">${cert.partners}</p>` : ''}
          ${cert.credentialId ? `
            <div class="cert-id-row">
              <span class="cert-id-label">ID:</span>
              <code class="cert-id-code">${cert.credentialId}</code>
            </div>
          ` : ''}
          ${cert.topics ? `
            <div class="cert-topics">
              ${cert.topics.map(t => `<span class="cert-topic-tag">${t}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
      ${cert.certificateFile || cert.credentialUrl ? `
        <div class="cert-card-footer">
          ${cert.certificateFile ? `
            <a href="${cert.certificateFile}" target="_blank" rel="noopener" class="cert-verify-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>View Certificate</span>
              <span class="visually-hidden">: ${cert.name} (PDF, opens in a new tab)</span>
            </a>
          ` : ''}
          ${cert.credentialUrl ? `
            <a href="${cert.credentialUrl}" target="_blank" rel="noopener noreferrer" class="cert-verify-link">
              <span>${/credly\.com/.test(cert.credentialUrl) ? 'Verify on Credly' : 'Verify Credential'}</span>
              <span class="visually-hidden">: ${cert.name} (opens in a new tab)</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `).join('');
}

function hydrateResume(data) {
  const { profile } = data;
  if (!profile) return;

  const downloadBtns = document.querySelectorAll('.resume-download-trigger');
  downloadBtns.forEach(btn => {
    btn.setAttribute('href', profile.resumeUrl || 'assets/Bhavya_Patel_Master_Resume.pdf');
  });
}

function hydrateContact(data) {
  const { profile, contact } = data;
  if (!contact) return;

  const emailEl = document.getElementById('contactDisplayEmail');
  if (emailEl) {
    emailEl.textContent = contact.email;
    emailEl.setAttribute('href', `mailto:${contact.email}`);
  }

  const phoneEl = document.getElementById('contactDisplayPhone');
  if (phoneEl && (contact.phone || profile.phone)) {
    const phone = contact.phone || profile.phone;
    phoneEl.textContent = phone;
    phoneEl.setAttribute('href', `tel:${phone.replace(/[^+\d]/g, '')}`);
  }

  // Where the contact form sends messages (see js/contact.js)
  const form = document.getElementById('contactForm');
  if (form && contact.formEndpoint) form.dataset.endpoint = contact.formEndpoint;

  const locEl = document.getElementById('contactDisplayLocation');
  if (locEl) locEl.textContent = contact.location || profile.location;

  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  const footerName = document.getElementById('footerName');
  if (footerName && profile) footerName.textContent = profile.name;
}
