/* VERD — Monolith Zero SS26 · Interactive Campaign JS */

// Image mapping — all 4 uploaded campaign images
const IMAGE_MAP = {
  heroImg:     CAMPAIGN_IMAGES.img4, // full coat movement shots
  conceptImg:  CAMPAIGN_IMAGES.img1, // four looks lineup
  z01a:        CAMPAIGN_IMAGES.img1, // four looks
  z01b:        CAMPAIGN_IMAGES.img2, // accessories detail
  z02a:        CAMPAIGN_IMAGES.img3, // coat construction
  z02b:        CAMPAIGN_IMAGES.img4, // oversized silhouette
  z03a:        CAMPAIGN_IMAGES.img4, // architectural coat
  closingImg:  CAMPAIGN_IMAGES.img3, // coat detail closing
};

// ── LOADER ──────────────────────────────────────────────────
const loader     = document.getElementById('loader');
const progress   = document.getElementById('loaderProgress');
let loadCount    = 0;
const totalImgs  = Object.keys(IMAGE_MAP).length;

function onImageLoaded() {
  loadCount++;
  progress.style.width = (loadCount / totalImgs * 100) + '%';
  if (loadCount >= totalImgs) {
    setTimeout(() => {
      loader.classList.add('out');
      document.getElementById('nav').classList.add('visible');
      triggerHeroReveal();
    }, 500);
  }
}

// ── INJECT IMAGES ────────────────────────────────────────────
Object.entries(IMAGE_MAP).forEach(([id, src]) => {
  const el = document.getElementById(id);
  if (!el) { onImageLoaded(); return; }
  const img = new Image();
  img.onload = () => { el.src = src; el.classList.add('loaded'); onImageLoaded(); };
  img.onerror = () => { el.src = src; onImageLoaded(); };
  img.src = src;
});

// ── CURSOR ───────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function followCursor() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(followCursor);
})();

document.querySelectorAll('a, .s-item, .prod-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
});

document.querySelectorAll('.img-hover, .zimg').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('img'); ring.classList.add('img'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('img'); ring.classList.remove('img'); });
});

// ── PARALLAX HERO ─────────────────────────────────────────────
const heroBg = document.getElementById('heroBg');
let ticking  = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      if (heroBg) heroBg.style.transform = `translateY(${window.pageYOffset * 0.32}px)`;
      ticking = false;
    });
    ticking = true;
  }
});

// ── NAV SCROLL STATE ─────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.pageYOffset > 60);
  nav.classList.toggle('visible', window.pageYOffset > 40);
});

// ── SCROLL REVEAL ────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('in'), delay);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── HERO REVEAL ───────────────────────────────────────────────
function triggerHeroReveal() {
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 200 + i * 180);
  });
}

// ── SMOOTH SECTION TRANSITIONS ───────────────────────────────
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── ZONE TITLE PARALLAX ON SCROLL ────────────────────────────
const zoneTitles = document.querySelectorAll('.zone-title');
const titleObs   = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateX(0)';
    }
  });
}, { threshold: 0.2 });

zoneTitles.forEach(t => {
  t.style.transition = 'opacity .9s ease, transform .9s cubic-bezier(.25,.46,.45,.94)';
  t.style.opacity    = '0';
  t.style.transform  = 'translateX(-30px)';
  titleObs.observe(t);
});

// ── PRODUCTION CARD HOVER LINES ───────────────────────────────
document.querySelectorAll('.prod-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.borderTop = '1px solid #6b7f8e';
  });
  card.addEventListener('mouseleave', () => {
    card.style.borderTop = '';
  });
});
