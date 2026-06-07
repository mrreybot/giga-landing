/* ============================================================
   GIGA LANDING — app.js
   Interactions: nav, scroll, tabs, accordion, counters, animations
   ============================================================ */

'use strict';

// ─── NAVBAR: Glassmorphic on scroll ──────────────────────────
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('nav-toggle');
  const navMenu  = document.getElementById('nav-menu');
  let lastScroll = 0;

  function updateNavbar() {
    const currentScroll = window.scrollY;
    if (currentScroll > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Hamburger toggle
  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu on nav link click
    navMenu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();


// ─── SMOOTH SCROLL for anchor links ──────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === '#!') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


// ─── INTERSECTION OBSERVER: Fade-in on scroll ─────────────────
(function initFadeIn() {
  const fadeElements = document.querySelectorAll('.fade-in');

  if (!fadeElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling cards
        const siblings = Array.from(entry.target.parentElement.children).filter(
          el => el.classList.contains('fade-in') || el === entry.target
        );
        const index = siblings.indexOf(entry.target);
        const delay = index * 80;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  fadeElements.forEach(el => observer.observe(el));
})();


// ─── ANIMATED COUNTERS in Hero ────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-value[data-count]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOut(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();


// ─── SERVER SETUP TABS ────────────────────────────────────────
(function initTabs() {
  const tabMac  = document.getElementById('tab-mac');
  const tabWin  = document.getElementById('tab-win');
  const panelMac = document.getElementById('panel-mac');
  const panelWin = document.getElementById('panel-win');

  if (!tabMac || !tabWin) return;

  function switchTab(activeTab, inactiveTab, activePanel, inactivePanel) {
    // Update tab buttons
    activeTab.classList.add('tab-active');
    activeTab.setAttribute('aria-selected', 'true');
    inactiveTab.classList.remove('tab-active');
    inactiveTab.setAttribute('aria-selected', 'false');

    // Update panels
    activePanel.classList.remove('hidden');
    inactivePanel.classList.add('hidden');

    // Re-trigger fade animations in the newly shown panel
    activePanel.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
      el.classList.add('visible');
    });
  }

  tabMac.addEventListener('click', () => {
    switchTab(tabMac, tabWin, panelMac, panelWin);
  });

  tabWin.addEventListener('click', () => {
    switchTab(tabWin, tabMac, panelWin, panelMac);
  });
})();


// ─── FAQ ACCORDION ────────────────────────────────────────────
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    // Remove native hidden; we control visibility via CSS
    answer.removeAttribute('hidden');
    answer.style.maxHeight = '0';
    answer.style.visibility = 'hidden';
    answer.style.pointerEvents = 'none';

    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';

      // Collapse all others
      faqItems.forEach(otherItem => {
        const otherQ = otherItem.querySelector('.faq-question');
        const otherA = otherItem.querySelector('.faq-answer');
        if (otherQ !== question && otherQ.getAttribute('aria-expanded') === 'true') {
          otherQ.setAttribute('aria-expanded', 'false');
          otherA.style.maxHeight = '0';
          otherA.style.paddingBottom = '0';
          otherA.style.visibility = 'hidden';
          otherA.style.pointerEvents = 'none';
        }
      });

      // Toggle current
      if (!isExpanded) {
        question.setAttribute('aria-expanded', 'true');
        answer.style.visibility = 'visible';
        answer.style.pointerEvents = '';
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
        answer.style.paddingBottom = '22px';
      } else {
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
        answer.style.paddingBottom = '0';
        // delay hiding for transition
        setTimeout(() => {
          answer.style.visibility = 'hidden';
          answer.style.pointerEvents = 'none';
        }, 350);
      }
    });
  });
})();


// ─── COPY BUTTONS ─────────────────────────────────────────────
(function initCopyButtons() {
  document.querySelectorAll('.copy-btn[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = '✅';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = '📋';
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        // Fallback for older browsers
        const el = document.createElement('textarea');
        el.value = text;
        el.style.position = 'absolute';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        btn.textContent = '✅';
        setTimeout(() => { btn.textContent = '📋'; }, 2000);
      }
    });
  });
})();


// ─── ACTIVE NAV LINK on scroll ───────────────────────────────
(function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));
})();


// ─── FLOATING HERO CARDS: subtle parallax on mouse move ───────
(function initHeroParallax() {
  const visual = document.querySelector('.hero-visual');
  if (!visual) return;

  let rafId = null;

  document.addEventListener('mousemove', (e) => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const { innerWidth: w, innerHeight: h } = window;
      const xRatio = (e.clientX / w - 0.5) * 2;  // -1 to 1
      const yRatio = (e.clientY / h - 0.5) * 2;

      const cards = visual.querySelectorAll('.mockup-card');
      cards.forEach((card, i) => {
        const factor = (i + 1) * 4;
        card.style.transform = `translate(${xRatio * factor}px, ${yRatio * factor}px)`;
      });
    });
  });

  // Reset on mouse leave
  document.addEventListener('mouseleave', () => {
    visual.querySelectorAll('.mockup-card').forEach(card => {
      card.style.transform = '';
    });
  });
})();


// ─── ADD ACTIVE STYLE for nav links ──────────────────────────
(function addActiveNavStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: var(--blue-light) !important;
    }
  `;
  document.head.appendChild(style);
})();
