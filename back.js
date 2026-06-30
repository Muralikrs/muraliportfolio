
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Loading Screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    // Small delay so the loader animation is perceivable, not just a flash.
    setTimeout(() => loader.classList.add('loader-hidden'), 0);
  });


  /* ---------- 3. Theme Toggle (Dark / Light) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const THEME_KEY = 'smk-portfolio-theme';

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = getStoredTheme();
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setStoredTheme(next);
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      themeToggle.setAttribute('aria-pressed', 'true');
    } else {
      root.removeAttribute('data-theme');
      themeToggle.setAttribute('aria-pressed', 'false');
    }
  }

  // localStorage can throw in privacy modes / sandboxed contexts — fail gracefully.
  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); }
    catch (e) { return null; }
  }
  function setStoredTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); }
    catch (e) { /* ignore storage errors */ }
  }

  /* ---------- 4. Mobile Nav Toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu after a nav link is clicked.
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 5. Sticky Navbar Background on Scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScrollNav = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- 6. Active Nav Link on Scroll (IntersectionObserver) ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const setActiveLink = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
    });
  };

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      // Pick the entry closest to the top of the viewport that is intersecting.
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length > 0) {
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveLink(topMost.target.id);
      }
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => navObserver.observe(section));
  }

  /* ---------- 7. Scroll Reveal Animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything immediately if IntersectionObserver is unsupported.
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- 8. Back to Top Button ---------- */
  const backToTop = document.getElementById('backToTop');

  const onScrollBackToTop = () => {
    backToTop.classList.toggle('visible', window.scrollY > 480);
  };
  onScrollBackToTop();
  window.addEventListener('scroll', onScrollBackToTop, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


});