/**
 * OBSIDIAN INTELLIGENCE — Portfolio Interactions & Neural Network Engine
 * Pure vanilla JavaScript, zero external dependencies, GitHub Pages compatible.
 */

// ==========================================================================
// 1. Pure Testable Logic
// ==========================================================================

/**
 * Filter projects by category string.
 * @param {Array<{id: string, category: string}>} projects
 * @param {string} category
 * @returns {string[]}
 */
function filterProjectsByCategory(projects, category) {
  const normalized = String(category || 'all').toLowerCase().trim();
  if (normalized === 'all') return projects.map((item) => item.id);
  return projects
    .filter((item) => String(item.category || '').toLowerCase() === normalized)
    .map((item) => item.id);
}

/**
 * Single-open accordion state resolver.
 * @param {string | null} currentOpenId
 * @param {string} clickedId
 * @returns {string | null}
 */
function getNextAccordionState(currentOpenId, clickedId) {
  if (!clickedId) return null;
  return currentOpenId === clickedId ? null : clickedId;
}

/**
 * Active navigation section resolver based on scrollY position.
 * @param {Array<{id: string, top: number}>} sections
 * @param {number} scrollY
 * @param {number} offset
 * @returns {string | null}
 */
function resolveActiveSection(sections, scrollY, offset = 140) {
  if (!Array.isArray(sections) || sections.length === 0) return null;
  const cursor = scrollY + offset;
  let activeId = null;
  for (const section of sections) {
    if (cursor >= section.top) {
      activeId = section.id;
    }
  }
  return activeId;
}

/**
 * Build a properly encoded mailto URI.
 * @param {string} email
 * @param {string} subject
 * @returns {string}
 */
function buildMailtoHref(email, subject) {
  const cleanEmail = String(email || '').trim();
  if (!cleanEmail) return '';
  if (!subject) return `mailto:${cleanEmail}`;
  return `mailto:${cleanEmail}?subject=${encodeURIComponent(subject)}`;
}

// ==========================================================================
// 2. Global Monochromatic Neural Network Background Engine
// ==========================================================================

/**
 * Initialize high-performance, organic monochromatic neural network on HTML Canvas.
 */
function initNeuralNetwork() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationFrameId = null;
  let particles = [];
  let pulses = [];
  let mouse = { x: -9999, y: -9999, active: false };

  // Responsive scaling
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    initParticles();
  }

  function initParticles() {
    particles = [];
    pulses = [];

    // Scale particle count dynamically with screen size (monochromatic minimalism)
    const area = width * height;
    const count = isTouchDevice
      ? Math.min(Math.max(Math.floor(area / 32000), 22), 40)
      : Math.min(Math.max(Math.floor(area / 24000), 30), 65);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.3 + 0.9,
        baseAlpha: Math.random() * 0.35 + 0.15,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    // Seed 4-6 travelling signal pulses for synaptic transmission feel
    const pulseCount = isTouchDevice ? 2 : 4;
    for (let i = 0; i < pulseCount; i++) {
      pulses.push({
        fromIndex: Math.floor(Math.random() * count),
        toIndex: -1,
        progress: Math.random(),
        speed: Math.random() * 0.008 + 0.005,
        active: false,
      });
    }
  }

  // Pointer interactions (desktop only, gentle proximity)
  if (!isTouchDevice) {
    window.addEventListener(
      'pointermove',
      (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
      },
      { passive: true }
    );

    window.addEventListener(
      'pointerleave',
      () => {
        mouse.active = false;
        mouse.x = -9999;
        mouse.y = -9999;
      },
      { passive: true }
    );
  }

  // Draw loop
  function draw() {
    ctx.clearRect(0, 0, width, height);

    const maxDist = Math.min(Math.max(width * 0.12, 110), 145);
    const maxDistSq = maxDist * maxDist;
    const mouseMaxDist = 135;
    const mouseMaxDistSq = mouseMaxDist * mouseMaxDist;

    // 1. Update and draw nodes
    const pCount = particles.length;
    for (let i = 0; i < pCount; i++) {
      const p = particles[i];

      if (!prefersReducedMotion) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries smoothly
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // Gentle cursor repulsion/influence
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dsq = dx * dx + dy * dy;
          if (dsq < mouseMaxDistSq && dsq > 1) {
            const force = (1 - Math.sqrt(dsq) / mouseMaxDist) * 0.15;
            p.x += (dx / Math.sqrt(dsq)) * force;
            p.y += (dy / Math.sqrt(dsq)) * force;
          }
        }
      }

      // Subtle sinusoidal breathing
      p.phase += p.pulseSpeed;
      const alpha = Math.max(
        0.08,
        p.baseAlpha + Math.sin(p.phase) * 0.12
      );

      // Render node (pure silver/soft-white monochromatic)
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(241, 241, 239, ${alpha.toFixed(3)})`;
      ctx.fill();
    }

    // 2. Draw dynamic connection lines
    ctx.lineWidth = 1;
    for (let i = 0; i < pCount; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < pCount; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const lineAlpha = (1 - dist / maxDist) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(226, 227, 230, ${lineAlpha.toFixed(3)})`;
          ctx.stroke();
        }
      }

      // Mouse connection line
      if (mouse.active) {
        const mdx = p1.x - mouse.x;
        const mdy = p1.y - mouse.y;
        const mDistSq = mdx * mdx + mdy * mdy;
        if (mDistSq < mouseMaxDistSq) {
          const mDist = Math.sqrt(mDistSq);
          const mLineAlpha = (1 - mDist / mouseMaxDist) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(241, 241, 239, ${mLineAlpha.toFixed(3)})`;
          ctx.stroke();
        }
      }
    }

    // 3. Occasional travelling pulses along connections
    if (!prefersReducedMotion) {
      for (let k = 0; k < pulses.length; k++) {
        const pulse = pulses[k];
        if (!pulse.active) {
          // Find a connected neighbor for pulse.fromIndex
          const f = particles[pulse.fromIndex];
          if (!f) continue;
          let candidate = -1;
          for (let j = 0; j < pCount; j++) {
            if (j === pulse.fromIndex) continue;
            const t = particles[j];
            const dx = f.x - t.x;
            const dy = f.y - t.y;
            if (dx * dx + dy * dy < maxDistSq) {
              candidate = j;
              break;
            }
          }
          if (candidate !== -1) {
            pulse.toIndex = candidate;
            pulse.progress = 0;
            pulse.active = true;
          } else {
            pulse.fromIndex = Math.floor(Math.random() * pCount);
          }
        } else {
          pulse.progress += pulse.speed;
          if (pulse.progress >= 1.0) {
            // Hand off to new connection or reset
            pulse.fromIndex = pulse.toIndex;
            pulse.active = false;
          } else {
            const pFrom = particles[pulse.fromIndex];
            const pTo = particles[pulse.toIndex];
            if (pFrom && pTo) {
              const pulseX = pFrom.x + (pTo.x - pFrom.x) * pulse.progress;
              const pulseY = pFrom.y + (pTo.y - pFrom.y) * pulse.progress;
              const pulseAlpha = Math.sin(pulse.progress * Math.PI) * 0.75;

              ctx.beginPath();
              ctx.arc(pulseX, pulseY, 1.6, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha.toFixed(3)})`;
              ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
              ctx.shadowBlur = 4;
              ctx.fill();
              ctx.shadowBlur = 0;
            } else {
              pulse.active = false;
            }
          }
        }
      }
    }

    if (!prefersReducedMotion) {
      animationFrameId = window.requestAnimationFrame(draw);
    }
  }

  // Handle visibility & resize
  let resizeTimer = null;
  window.addEventListener(
    'resize',
    () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    },
    { passive: true }
  );

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    } else {
      if (!prefersReducedMotion && !animationFrameId) {
        animationFrameId = window.requestAnimationFrame(draw);
      }
    }
  });

  resize();
  draw();
}

// ==========================================================================
// 3. Browser UI Initialization
// ==========================================================================

function initPortfolio() {
  if (typeof document === 'undefined') return;

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Dynamic footer copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 2. Global Neural Network Canvas
  initNeuralNetwork();

  // 3. Sticky header backdrop elevation on scroll
  const header = document.querySelector('.site-header');
  function updateHeaderScroll() {
    if (!header) return;
    header.classList.toggle('header-scrolled', window.scrollY > 20);
  }

  // 4. Mobile Navigation Drawer
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');

  function setMenuOpen(isOpen) {
    if (!menuToggle || !nav) return;
    nav.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      setMenuOpen(!nav.classList.contains('is-open'));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('is-open')) return;
      if (
        e.target instanceof Node &&
        !nav.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    });
  }

  // 5. Project Category Filtering
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const projectRecords = projectCards.map((card) => ({
    id: card.getAttribute('data-project-id') || '',
    category: card.getAttribute('data-category') || '',
  }));

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedCategory = button.getAttribute('data-filter') || 'all';
      const matchingIds = new Set(
        filterProjectsByCategory(projectRecords, selectedCategory)
      );

      filterButtons.forEach((btn) => {
        const active = btn === button;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });

      projectCards.forEach((card) => {
        const id = card.getAttribute('data-project-id') || '';
        const visible = matchingIds.has(id);
        card.classList.toggle('is-hidden', !visible);
        if (visible) {
          card.classList.add('is-visible');
        }
      });
    });
  });

  // 6. Accessible Single-Open FAQ Accordion
  const faqTriggers = Array.from(document.querySelectorAll('.faq-trigger'));
  let openPanelId = null;

  faqTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetPanelId = trigger.getAttribute('aria-controls') || '';
      openPanelId = getNextAccordionState(openPanelId, targetPanelId);

      faqTriggers.forEach((btn) => {
        const panelId = btn.getAttribute('aria-controls') || '';
        const panel = document.getElementById(panelId);
        const isOpen = panelId === openPanelId;
        btn.setAttribute('aria-expanded', String(isOpen));
        if (panel) {
          panel.hidden = !isOpen;
        }
      });
    });
  });

  // 7. Copy Email with Accessible Feedback
  const copyBtn = document.getElementById('copy-email-btn');
  const copyLabel = document.getElementById('copy-email-label');
  const copyFeedback = document.getElementById('copy-feedback');
  let copyTimer = null;

  if (copyBtn && copyLabel && copyFeedback) {
    copyBtn.addEventListener('click', async () => {
      const email =
        copyBtn.getAttribute('data-email') || 'naguruganesh2005@gmail.com';
      let copied = false;

      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        try {
          await navigator.clipboard.writeText(email);
          copied = true;
        } catch {
          copied = false;
        }
      }

      if (!copied) {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          copied = document.execCommand('copy');
        } catch {
          copied = false;
        }
        document.body.removeChild(textarea);
      }

      if (copyTimer) clearTimeout(copyTimer);

      if (copied) {
        copyLabel.textContent = 'Email Copied';
        copyFeedback.textContent = `Copied ${email} to clipboard.`;
      } else {
        copyFeedback.textContent = `Email address: ${email}`;
      }

      copyTimer = setTimeout(() => {
        copyLabel.textContent = 'Copy Email Address';
      }, 2500);
    });
  }

  // 8. Active Section Scroll Spy
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[data-nav]'));
  const trackedSections = navLinks
    .map((link) => {
      const id = link.getAttribute('data-nav');
      const el = id ? document.getElementById(id) : null;
      return el ? { id, el } : null;
    })
    .filter(Boolean);

  function updateActiveNav() {
    if (trackedSections.length === 0) return;
    const positions = trackedSections.map((item) => ({
      id: item.id,
      top: item.el.offsetTop,
    }));
    const activeId = resolveActiveSection(positions, window.scrollY, 150);
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('data-nav') === activeId);
    });
  }

  // Unified scroll handler
  let scrollTicking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(() => {
        updateHeaderScroll();
        updateActiveNav();
        scrollTicking = false;
      });
    },
    { passive: true }
  );

  updateHeaderScroll();
  updateActiveNav();

  // 9. Restrained Scroll Reveal (Intersection Observer)
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (!prefersReducedMotion && 'IntersectionObserver' in window && revealEls.length > 0) {
    document.documentElement.classList.add('js-ready');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
}

// Browser bootstrap
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
  } else {
    initPortfolio();
  }
}

// Node.js CommonJS test compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    filterProjectsByCategory,
    getNextAccordionState,
    resolveActiveSection,
    buildMailtoHref,
  };
}
