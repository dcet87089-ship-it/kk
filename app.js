/* ==========================================================
   Chatkawee (Sky) - 3D Interactive Engine & Animations
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStarsCanvas();
  init3DTilt();
  initConfettiCanvas();
  initCopyActions();
  initShareAction();
});

/* ==========================================================
   Toast Notification System
   ========================================================== */
let toastTimer = null;
function showToast(title, message, icon = '✨') {
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = toast.querySelector('.toast-icon');

  if (!toast) return;

  if (toastTitle) toastTitle.textContent = title;
  if (toastMsg) toastMsg.textContent = message;
  if (toastIcon) toastIcon.textContent = icon;

  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* ==========================================================
   Haptic & Feedback
   ========================================================== */
function triggerHaptic(pattern = 25) {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {}
  }
}

/* ==========================================================
   Clipboard Helper
   ========================================================== */
async function copyToClipboard(text, title = 'คัดลอกสำเร็จ', message = 'คัดลอกลงคลิปบอร์ดแล้ว!') {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.left = '-999999px';
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand('copy');
      el.remove();
    }
    showToast(title, message, '📋');
    triggerHaptic([30, 50, 30]);
    launchConfetti();
  } catch (err) {
    showToast('ข้อผิดพลาด', 'ไม่สามารถคัดลอกอัตโนมัติได้: ' + text, '⚠️');
  }
}

/* ==========================================================
   Interactive 3D Tilt Engine for Cards & Profile
   ========================================================== */
function init3DTilt() {
  // Check if device prefers reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const tiltCards = document.querySelectorAll('[data-tilt], .profile-card-3d');

  tiltCards.forEach(card => {
    let bounds = null;

    function handleMove(clientX, clientY) {
      if (!bounds) bounds = card.getBoundingClientRect();
      
      const mouseX = clientX - bounds.left;
      const mouseY = clientY - bounds.top;

      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      // Calculate tilt angles (limit to subtle elegant degrees)
      const maxTilt = 8;
      const tiltX = -((mouseY - centerY) / centerY) * maxTilt;
      const tiltY = ((mouseX - centerX) / centerX) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      // Set CSS variables for specular light position
      card.style.setProperty('--mouse-x', `${mouseX}px`);
      card.style.setProperty('--mouse-y', `${mouseY}px`);
    }

    function handleReset() {
      bounds = null;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }

    card.addEventListener('mouseenter', () => {
      bounds = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    card.addEventListener('mouseleave', handleReset);

    // Touch support for gentle dynamic response
    card.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    card.addEventListener('touchend', handleReset, { passive: true });
  });
}

/* ==========================================================
   Share Profile Action
   ========================================================== */
function initShareAction() {
  const shareBtn = document.getElementById('share-btn');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', async () => {
    triggerHaptic(35);
    const shareUrl = window.location.href.split('?')[0];
    const shareData = {
      title: 'Chatkawee (Sky) - Official Links',
      text: 'ช่องทางการติดต่อและโซเชียลมีเดียของ Chatkawee (Sky) 🏊‍♂️✨',
      url: shareUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        launchConfetti();
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl, 'คัดลอกลิงก์โปรไฟล์', 'ส่งต่อให้เพื่อนได้ทันที ✨');
        }
      }
    } else {
      copyToClipboard(shareUrl, 'คัดลอกลิงก์โปรไฟล์', 'ส่งต่อให้เพื่อนได้ทันที ✨');
    }
  });
}

/* ==========================================================
   Copy Email Actions
   ========================================================== */
function initCopyActions() {
  const targetEmail = 'dcet87089@gmail.com';

  const quickCopyBtn = document.getElementById('quick-copy-email-btn');
  if (quickCopyBtn) {
    quickCopyBtn.addEventListener('click', () => {
      copyToClipboard(targetEmail, 'คัดลอกอีเมลเรียบร้อย', targetEmail);
    });
  }

  const cardCopyBtn = document.getElementById('card-copy-btn');
  if (cardCopyBtn) {
    cardCopyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard(targetEmail, 'คัดลอกอีเมลเรียบร้อย', targetEmail);
    });
  }

  const emailCard = document.getElementById('email-card');
  if (emailCard) {
    emailCard.addEventListener('click', () => {
      copyToClipboard(targetEmail, 'คัดลอกอีเมลเรียบร้อย', targetEmail);
    });
  }
}

/* ==========================================================
   Star Constellations Canvas Engine
   ========================================================== */
function initStarsCanvas() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let stars = [];
  const STAR_COUNT = 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Star {
    constructor() {
      this.init();
    }

    init() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.5 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.twinkleSpeed = 0.02 * Math.random() + 0.008;
      this.color = Math.random() > 0.4 ? 'rgba(56, 189, 248,' : 'rgba(236, 72, 153,';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      this.alpha += Math.sin(Date.now() * this.twinkleSpeed) * 0.008;
      if (this.alpha < 0.1) this.alpha = 0.1;
      if (this.alpha > 0.8) this.alpha = 0.8;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    // Subtle connection lines between near stars
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          const lineAlpha = (1 - dist / 100) * 0.07;
          ctx.strokeStyle = `rgba(148, 163, 184, ${lineAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    stars.forEach(s => {
      s.update();
      s.draw();
    });

    requestAnimationFrame(loop);
  }

  loop();
}

/* ==========================================================
   Confetti Burst Celebration Engine
   ========================================================== */
let confettiParticles = [];
let confettiRunning = false;

function initConfettiCanvas() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
}

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const colors = ['#38bdf8', '#ec4899', '#a855f7', '#facc15', '#4ade80'];
  const count = 40;

  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.65,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 16,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      alpha: 1,
      gravity: 0.35
    });
  }

  if (!confettiRunning) {
    confettiRunning = true;
    animateConfetti(ctx, canvas);
  }
}

function animateConfetti(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rot += p.rotSpeed;
    p.alpha -= 0.015;

    if (p.alpha <= 0 || p.y > canvas.height) {
      confettiParticles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }

  if (confettiParticles.length > 0) {
    requestAnimationFrame(() => animateConfetti(ctx, canvas));
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiRunning = false;
  }
}
