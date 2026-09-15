/* ==========================================================================
   1. NAVIGATION ENGINE
   ========================================================================== */
window.navigateTo = function(target) {
  if (target === undefined || target === null) return;

  let targetId = String(target).trim();
  if (!targetId.startsWith('page-')) {
    targetId = `page-${targetId}`;
  }

  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active-page'));

  const targetPage = document.getElementById(targetId);
  if (targetPage) {
    targetPage.classList.add('active-page');
    targetPage.style.animation = 'none';
    targetPage.offsetHeight; // Trigger reflow for animation reset
    targetPage.style.animation = '';
  }

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
   2. THEME ENGINE
   ========================================================================== */
window.setTheme = function(themeName) {
  document.body.setAttribute('data-theme', themeName);

  const cards = document.querySelectorAll('.theme-card');
  cards.forEach(card => {
    if (card.getAttribute('onclick') && card.getAttribute('onclick').includes(themeName)) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
};

/* ==========================================================================
   3. AUTOMATIC BACKGROUND AUDIO CONTROLLER
   ========================================================================== */
function initAudioEngine() {
  const audio = document.getElementById('bg-audio');
  const musicBtn = document.getElementById('music-toggle-btn');
  const musicIcon = document.getElementById('music-icon');
  const startBtn = document.getElementById('start-app-btn');
  const welcomeOverlay = document.getElementById('welcome-overlay');

  let isPlaying = false;

  function playAudio() {
    if (!audio) return;
    audio.play().then(() => {
      isPlaying = true;
      if (musicIcon) musicIcon.className = "fa-solid fa-volume-high";
    }).catch(err => {
      console.log("Audio waiting for user interaction:", err);
    });
  }

  function pauseAudio() {
    if (!audio) return;
    audio.pause();
    isPlaying = false;
    if (musicIcon) musicIcon.className = "fa-solid fa-volume-xmark";
  }

  // If Welcome Overlay is used, play music when button clicked
  if (startBtn && welcomeOverlay) {
    startBtn.addEventListener('click', () => {
      playAudio();
      welcomeOverlay.classList.add('fade-out');
      setTimeout(() => {
        welcomeOverlay.style.display = 'none';
      }, 500);
    });
  }

  // Music toggle button listener (🔊 / 🔇)
  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  // Auto-play music as soon as she taps or clicks ANYTHING on screen
  function handleFirstInteraction() {
    if (!isPlaying) {
      playAudio();
    }
    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('touchstart', handleFirstInteraction);
  }

  document.addEventListener('click', handleFirstInteraction);
  document.addEventListener('touchstart', handleFirstInteraction);
}

/* ==========================================================================
   4. DOM CONTENT LOADED & INTERACTIVE LISTENERS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Theme Drawer Controls
  const sidebar = document.getElementById('theme-panel');
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const closeBtn = document.getElementById('close-sidebar-btn');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => sidebar.classList.toggle('hidden'));
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => sidebar.classList.add('hidden'));
  }

  // Evasive "Chl hatt Nhi jana" Button Effect
  const maybeBtn = document.getElementById('maybe-btn');
  if (maybeBtn) {
    const moveBtn = () => {
      const x = Math.floor(Math.random() * 200) - 100;
      const y = Math.floor(Math.random() * 120) - 60;
      maybeBtn.style.transform = `translate(${x}px, ${y}px)`;
    };
    maybeBtn.addEventListener('mouseover', moveBtn);
    maybeBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      moveBtn();
    });
  }

  // Load Confetti Library Dynamically
  if (typeof confetti !== 'function') {
    const confettiScript = document.createElement('script');
    confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    document.head.appendChild(confettiScript);
  }

  // Initialize Particles Background
  initParticles();

  // Initialize Audio Logic
  initAudioEngine();
});

/* ==========================================================================
   5. RESPONSE MODAL & CONFETTI CELEBRATION
   ========================================================================== */
window.handleResponse = function(type) {
  const modal = document.getElementById('response-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalIcon = document.getElementById('modal-icon');

  if (!modal) return;

  if (type === 'yes') {
    if (modalIcon) modalIcon.textContent = '💖🎉';
    if (modalTitle) modalTitle.textContent = 'Yayyy!';
    if (modalDesc) modalDesc.textContent = 'Good Girl 🎀 to btaa.... kab aur kaha Jana hai??? u choose it.....';
    fireConfettiExplosion();
  } else if (type === 'maybe') {
    if (modalIcon) modalIcon.textContent = '😉✨';
    if (modalTitle) modalTitle.textContent = 'Nice Try!';
    if (modalDesc) modalDesc.textContent = 'Nhi jana is not an option! 😜';
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
   6. BACKGROUND CANVAS PARTICLES ANIMATION
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
