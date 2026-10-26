import {
  profile,
  services,
  education,
  experience,
  projects,
  portfolioFilters,
  showResume,
} from './content.js';

const C = {
  ink: '#051F20',
  mid: '#235347',
  sage: '#8EB69B',
  mint: '#DAF1DE',
};

const serviceIcons = {
  web: `<svg viewBox="0 0 64 64" class="service-card__icon" aria-hidden="true">
    <rect x="8" y="12" width="48" height="36" rx="2" fill="none" stroke="${C.ink}" stroke-width="2"/>
    <line x1="8" y1="20" x2="56" y2="20" stroke="${C.sage}" stroke-width="2"/>
    <circle cx="14" cy="16" r="2" fill="${C.sage}"/>
    <path d="M20 32h24M20 40h16" stroke="${C.mid}" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  mobile: `<svg viewBox="0 0 64 64" class="service-card__icon" aria-hidden="true">
    <rect x="22" y="8" width="20" height="48" rx="3" fill="none" stroke="${C.ink}" stroke-width="2"/>
    <rect x="26" y="14" width="12" height="32" fill="${C.mint}" stroke="${C.sage}"/>
    <circle cx="32" cy="50" r="2" fill="${C.sage}"/>
  </svg>`,
  tools: `<svg viewBox="0 0 64 64" class="service-card__icon" aria-hidden="true">
    <path d="M36 12l16 16-8 8-16-16 8-8z" fill="none" stroke="${C.ink}" stroke-width="2"/>
    <path d="M20 44l-4 12 12-4 20-20-8-8-20 20z" fill="none" stroke="${C.ink}" stroke-width="2"/>
    <circle cx="44" cy="20" r="6" fill="none" stroke="${C.sage}" stroke-width="2"/>
  </svg>`,
};

function rcmCalculatorThumb() {
  return `
    <div class="calc-anim">
      <div class="calc-anim__device">
        <div class="calc-anim__screen">
          <span class="calc-anim__label">Patient portion</span>
          <div class="calc-anim__readout" aria-hidden="true">
            <span class="calc-anim__value calc-anim__value--a">$86.40</span>
            <span class="calc-anim__value calc-anim__value--b">$124.50</span>
            <span class="calc-anim__value calc-anim__value--c">$52.00</span>
          </div>
          <div class="calc-anim__meta">
            <span><em>Ins</em> 80%</span>
            <span class="calc-anim__code">D0120</span>
          </div>
        </div>
        <div class="calc-anim__keypad">
          <span class="calc-anim__key"></span><span class="calc-anim__key"></span><span class="calc-anim__key calc-anim__key--active"></span>
          <span class="calc-anim__key"></span><span class="calc-anim__key calc-anim__key--pulse"></span><span class="calc-anim__key"></span>
          <span class="calc-anim__key"></span><span class="calc-anim__key"></span><span class="calc-anim__key calc-anim__key--equals">=</span>
        </div>
        <div class="calc-anim__scan"></div>
      </div>
    </div>`;
}

function bazaarRadarThumb() {
  return `
    <div class="bazaar-anim" aria-hidden="true">
      <div class="bazaar-anim__panel">
        <div class="bazaar-anim__head">
          <span class="bazaar-anim__title">Bazaar Radar</span>
          <span class="bazaar-anim__live">LIVE</span>
        </div>
        <div class="bazaar-anim__bars">
          <span class="bazaar-anim__bar bazaar-anim__bar--1"></span>
          <span class="bazaar-anim__bar bazaar-anim__bar--2"></span>
          <span class="bazaar-anim__bar bazaar-anim__bar--3"></span>
          <span class="bazaar-anim__bar bazaar-anim__bar--4"></span>
        </div>
        <div class="bazaar-anim__row"><span>Interest</span><span>78</span></div>
        <div class="bazaar-anim__row"><span>Opportunity</span><span>84</span></div>
      </div>
      <div class="bazaar-anim__scan"></div>
    </div>`;
}

function projectThumb(project) {
  if (project.id === 'rcm-calculator') {
    return rcmCalculatorThumb();
  }
  if (project.id === 'bazaar-radar') {
    return bazaarRadarThumb();
  }
  const accent = project.accent || C.ink;
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="300" fill="${accent}"/>
    <rect x="40" y="50" width="320" height="180" fill="#fff" opacity="0.95"/>
    <rect x="56" y="70" width="120" height="8" fill="${C.sage}"/>
    <rect x="56" y="88" width="200" height="6" fill="${C.mint}"/>
    <rect x="56" y="102" width="160" height="6" fill="${C.mint}"/>
    <circle cx="320" cy="140" r="40" fill="none" stroke="${C.sage}" stroke-width="3"/>
    <path d="M300 140h40M320 120v40" stroke="${C.mint}" stroke-width="2"/>
  </svg>`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHero() {
  document.getElementById('hero-greeting').textContent = profile.greeting;
  document.getElementById('hero-title-line').textContent = profile.titleLine;
  document.getElementById('hero-name').textContent = profile.firstName;
  document.getElementById('hero-role').textContent = profile.role;

  const social = document.getElementById('hero-social');
  const links = [{ label: 'GitHub', url: profile.github }];

  social.innerHTML = links
    .map(
      (l) =>
        `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`
    )
    .join('');
}

function renderAbout() {
  document.getElementById('about-bio').textContent = profile.tagline;

  document.getElementById('services-grid').innerHTML = services
    .map(
      (s) => `
    <article class="service-card">
      ${serviceIcons[s.id] || serviceIcons.web}
      <h4 class="service-card__title">${escapeHtml(s.title.toUpperCase())}</h4>
      <p class="service-card__text">${escapeHtml(s.description)}</p>
    </article>`
    )
    .join('');
}

function renderTimeline(items) {
  return items
    .map(
      (item) => `
    <article class="timeline-item">
      <p class="timeline-item__period">${escapeHtml(item.period)}</p>
      <h4 class="timeline-item__title">${escapeHtml(item.title)}</h4>
      <p class="timeline-item__place">${escapeHtml(item.place)}</p>
      <p class="timeline-item__detail">${escapeHtml(item.detail)}</p>
    </article>`
    )
    .join('');
}

function renderResume() {
  if (!showResume) return;
  document.getElementById('education-list').innerHTML = renderTimeline(education);
  document.getElementById('experience-list').innerHTML = renderTimeline(experience);
  const gh = document.getElementById('resume-github-link');
  gh.href = profile.github;
  gh.textContent = profile.githubHandle || 'GitHub';
}

let activeFilter = 'all';

function renderPortfolioGrid() {
  const grid = document.getElementById('portfolio-grid');
  const filtered =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.categories?.includes(activeFilter) || p.category === activeFilter);

  grid.innerHTML = filtered
    .map((p) => {
      const overlayLinks = p.links
        .map(
          (l) =>
            `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label.toUpperCase())}</a>`
        )
        .join('');

      const inlineLinks = p.links
        .map(
          (l) =>
            `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`
        )
        .join('');

      return `
    <article class="project-card" data-category="${escapeHtml(p.category)}">
      <div class="project-card__thumb">
        ${projectThumb(p)}
        <div class="project-card__overlay">${overlayLinks}</div>
      </div>
      <div class="project-card__body">
        <h3 class="project-card__title">${escapeHtml(p.title)}</h3>
        <p class="project-card__desc">${escapeHtml(p.description)}</p>
        <div class="project-card__links">${inlineLinks}</div>
      </div>
    </article>`;
    })
    .join('');
}

function renderFilters() {
  const nav = document.getElementById('portfolio-filters');
  nav.innerHTML = portfolioFilters
    .map(
      (f) =>
        `<button type="button" class="filter-btn${f.id === activeFilter ? ' is-active' : ''}" data-filter="${escapeHtml(f.id)}">${escapeHtml(f.label)}</button>`
    )
    .join('');

  nav.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      nav.querySelectorAll('.filter-btn').forEach((b) => b.classList.toggle('is-active', b === btn));
      renderPortfolioGrid();
    });
  });
}

function renderContact() {
  const emailEl = document.getElementById('contact-email');
  emailEl.href = `mailto:${profile.email}`;
  emailEl.textContent = profile.email;
  document.getElementById('contact-location').textContent = profile.location;

  const links = document.getElementById('contact-links');
  links.innerHTML = [{ label: `GitHub @${profile.githubHandle}`, url: profile.github }]
    .map(
      (l) =>
        `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`
    )
    .join('');
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target || target.hasAttribute('hidden')) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function setupSectionReveal() {
  const sections = document.querySelectorAll('.section:not(.section--hero)');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  sections.forEach((s) => {
    if (!s.classList.contains('section--hidden')) observer.observe(s);
  });
}

function setupNavHighlight() {
  const sections = document.querySelectorAll('[data-section]:not([hidden])');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.section;
          document.querySelectorAll('[data-nav]').forEach((link) => {
            link.classList.toggle('is-active', link.dataset.nav === id);
          });
        }
      });
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

function setupMobileNav() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  backdrop.hidden = true;
  document.body.insertBefore(backdrop, sidebar);

  const header = document.createElement('header');
  header.className = 'mobile-header';
  header.setAttribute('aria-label', 'Mobile navigation');
  header.innerHTML = `
    <button type="button" class="mobile-header__toggle" aria-expanded="false" aria-controls="mobile-sidebar" aria-label="Open navigation menu">
      <span></span><span></span><span></span>
    </button>
    <a href="#home" class="mobile-header__brand">SHUBHAM</a>
    <nav class="mobile-header__tabs" aria-label="Sections"></nav>
  `;
  sidebar.id = 'mobile-sidebar';
  document.body.insertBefore(header, sidebar);

  const tabs = header.querySelector('.mobile-header__tabs');
  document.querySelectorAll('.sidebar__link').forEach((link) => {
    const tab = link.cloneNode(true);
    tab.classList.add('mobile-header__tab');
    tabs.appendChild(tab);
  });

  const toggle = header.querySelector('.mobile-header__toggle');

  const setOpen = (open) => {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    backdrop.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    setOpen(!document.body.classList.contains('nav-open'));
  });

  backdrop.addEventListener('click', () => setOpen(false));

  document.querySelectorAll('.sidebar__link, .mobile-header__tab').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

function init() {
  document.getElementById('year').textContent = String(new Date().getFullYear());
  document.getElementById('footer-name').textContent = profile.firstName;

  renderHero();
  renderAbout();
  renderResume();
  renderFilters();
  renderPortfolioGrid();
  renderContact();
  setupMobileNav();
  setupSmoothScroll();
  setupSectionReveal();
  setupNavHighlight();

  document.title = `${profile.firstName} — Portfolio`;
}

init();
