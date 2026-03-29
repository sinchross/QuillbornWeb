// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const topnav = document.getElementById('topnav');

if (navToggle && topnav) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    topnav.classList.toggle('open');
  });

  topnav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => topnav.classList.remove('open'));
  });

  document.addEventListener('click', (e) => {
    if (topnav.classList.contains('open') && !topnav.contains(e.target) && e.target !== navToggle) {
      topnav.classList.remove('open');
    }
  });
}

// Scroll-triggered fade-in animations
const faders = document.querySelectorAll('.anim-fade');

if (faders.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  faders.forEach(el => observer.observe(el));
} else {
  faders.forEach(el => el.classList.add('visible'));
}

// Active nav link on scroll (throttled)
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.topnav a');

if (sections.length && navLinks.length) {
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollY = window.scrollY + 120;
      let current = '';

      sections.forEach(section => {
        if (section.offsetTop <= scrollY) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('nav-active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('nav-active');
        }
      });

      ticking = false;
    });
  }, { passive: true });
}

// ── Feature slides ──
const slidesContainer = document.getElementById('feature-slides');
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('slides-dots');
const prevBtn = document.getElementById('slide-prev');
const nextBtn = document.getElementById('slide-next');
let currentSlide = 0;

if (slides.length && dotsContainer) {
  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  // First slide active
  slides[0].classList.add('active');

  function goToSlide(index) {
    // Pause current video
    const currentVid = slides[currentSlide].querySelector('.slide-vid');
    if (currentVid) currentVid.pause();

    // Hide current
    slides[currentSlide].classList.remove('active');
    dotsContainer.children[currentSlide].classList.remove('active');

    // Show new
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dotsContainer.children[currentSlide].classList.add('active');

    // Play new video
    const newVid = slides[currentSlide].querySelector('.slide-vid');
    if (newVid) {
      newVid.currentTime = 0;
      newVid.play();
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    });
  }

  // Keyboard arrows when slides area is visible
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });
}

// ── Video zoom modal ──
const zoomOverlay = document.getElementById('vid-zoom-overlay');
const zoomPlayer = document.getElementById('vid-zoom-player');
const zoomClose = document.getElementById('vid-zoom-close');

function openZoom(videoSrc, currentTime) {
  if (!zoomOverlay || !zoomPlayer) return;
  zoomPlayer.src = videoSrc;
  zoomPlayer.currentTime = currentTime || 0;
  zoomOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  zoomPlayer.play();
}

function closeZoom() {
  if (!zoomOverlay || !zoomPlayer) return;
  zoomOverlay.classList.remove('open');
  document.body.style.overflow = '';
  zoomPlayer.pause();
  zoomPlayer.src = '';
}

if (zoomClose) zoomClose.addEventListener('click', closeZoom);
if (zoomOverlay) {
  zoomOverlay.addEventListener('click', (e) => {
    if (e.target === zoomOverlay) closeZoom();
  });
}

// Add zoom button to all videos (slides + more grid)
document.querySelectorAll('.slide-vid, .inline-vid').forEach(video => {
  const wrap = document.createElement('div');
  wrap.className = 'vid-wrap';
  video.parentNode.insertBefore(wrap, video);
  wrap.appendChild(video);

  const btn = document.createElement('button');
  btn.className = 'vid-zoom-btn';
  btn.setAttribute('aria-label', 'Ampliar vídeo');
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>Ampliar';
  wrap.appendChild(btn);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const src = video.querySelector('source')?.src || video.src;
    openZoom(src, video.currentTime);
  });
});

// Escape key
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (zoomOverlay && zoomOverlay.classList.contains('open')) {
    closeZoom();
  } else if (topnav && topnav.classList.contains('open')) {
    topnav.classList.remove('open');
  }
});
