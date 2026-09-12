/* ==========================================================================
   1. NAVIGATION ENGINE
   ========================================================================== */

/**
 * Robust navigation function attached directly to global window
 */
window.navigateTo = function(target) {
  if (target === undefined || target === null) return;

  // Format ID correctly ('1' -> 'page-1')
  let targetId = String(target).trim();
  if (!targetId.startsWith('page-')) {
    targetId = `page-${targetId}`;
  }

  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active-page');
  });

  // Display target page
  const targetPage = document.getElementById(targetId);
  if (targetPage) {
    targetPage.classList.add('active-page');
    // Force CSS reflow for fade animation
    targetPage.style.animation = 'none';
    targetPage.offsetHeight; 
    targetPage.style.animation = '';
  }

  // Update navbar active state
  const pageNum = parseInt(targetId.replace('page-', ''), 10);
  if (!isNaN(pageNum)) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
      if (index === pageNum - 1) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.nextPage = function(target) {
  window.navigateTo(target);
};

/* ==========================================================================
   2. ONE-CLICK THEME ENGINE
   ========================================================================== */
window.setTheme = function(themeName) {
  document.body.setAttribute('data-theme', themeName);

  // Update theme option card active state inside drawer
  const cards = document.querySelectorAll('.theme-card');
  cards.forEach(card => {
    if (card.getAttribute('onclick').includes(themeName)) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
};

/* ==========================================================================
   3. SIDEBAR & EVENT LISTENERS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('theme-panel');
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const closeBtn = document.getElementById('close-sidebar-btn');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => sidebar.classList.toggle('hidden'));
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => sidebar.classList.add('hidden'));
  }

  // Evasive "Maybe" Button Hover Effect
  const maybeBtn = document.getElementById('maybe-btn');
  if (maybeBtn) {
    maybeBtn.addEventListener('mouseover', () => {
      const x = Math.floor(Math.random() * 200) - 100;
      const y = Math.floor(Math.random() * 120) - 60;
      maybeBtn.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // Dynamically load Confetti script
  const confettiScript = document.createElement('script');
  confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
  document.head.appendChild(confettiScript);

  // Start background particle canvas animation
  initParticles();
});

/* ==========================================================================
   4. MODAL & CONFETTI
   ========================================================================== */
window.handleResponse = function(type) {
  const modal = document.getElementById('response-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalIcon = document.getElementById('modal-icon');

  if (!modal) return;

  if (type === 'yes') {
    if (modalIcon) modalIcon.textContent = '💖🎉';
    if (modalTitle) modalTitle.textContent = 'Woohoo! It’s a Date!';
    if (modalDesc) modalDesc.textContent = 'I can’t wait! Pick a date and time, and I will take care of the rest.';
    fireConfettiExplosion();
  } else if (type === 'maybe') {
    if (modalIcon) modalIcon.textContent = '😉✨';
    if (modalTitle) modalTitle.textContent = 'Nice Try!';
    if (modalDesc) modalDesc.textContent = 'That wasn’t really an option! Dinner & drinks on me soon?';
  }

  modal.classList.remove('hidden');
};

window.closeModal = function() {
  const modal = document.getElementById('response-modal');
  if (modal) modal.classList.add('hidden');
};

function fireConfettiExplosion() {
  if (typeof confetti !== 'function') return;

  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  })();
}

/* ==========================================================================
   5. BACKGROUND CANVAS PARTICLES
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('fx-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 30 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 4 + 1,
    speedY: Math.random() * 0.8 + 0.2,
    opacity: Math.random() * 0.5 + 0.2
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--particle-color') || 'rgba(255, 255, 255, 0.6)';
      ctx.fill();

      p.y -= p.speedY;
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}

