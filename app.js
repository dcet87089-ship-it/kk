/* ==========================================================
   Chatkawee (Sakai) Bio Link - Interactive Script
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initCopyActions();
  initShareAction();
});

// Toast notification controller
let toastTimeout = null;
function showToast(message, icon = '✨') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = toast.querySelector('.toast-icon');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  if (toastIcon) toastIcon.textContent = icon;

  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// Copy to clipboard helper
async function copyToClipboard(text, successMsg = 'คัดลอกเรียบร้อยแล้ว!') {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
    showToast(successMsg, '📋');
    triggerHaptic();
  } catch (err) {
    showToast('ไม่สามารถคัดลอกได้อัตโนมัติ: ' + text, '⚠️');
  }
}

// Haptic feedback for mobile devices (if supported)
function triggerHaptic() {
  if (navigator.vibrate) {
    navigator.vibrate(25);
  }
}

// Share profile or copy URL
function initShareAction() {
  const shareBtn = document.getElementById('share-btn');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', async () => {
    triggerHaptic();
    const shareData = {
      title: 'Chatkawee (Sakai) - Official Links',
      text: 'รวมช่องทางการติดต่อและโซเชียลมีเดียของ Chatkawee (Sakai)',
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(window.location.href, 'คัดลอกลิงก์โปรไฟล์แล้ว!');
        }
      }
    } else {
      copyToClipboard(window.location.href, 'คัดลอกลิงก์โปรไฟล์แล้ว!');
    }
  });
}

// Copy email actions
function initCopyActions() {
  const targetEmail = 'dcet87089@gmail.com';

  const quickCopyBtn = document.getElementById('quick-copy-email-btn');
  if (quickCopyBtn) {
    quickCopyBtn.addEventListener('click', () => {
      copyToClipboard(targetEmail, 'คัดลอกอีเมลเรียบร้อย: ' + targetEmail);
    });
  }

  const cardCopyBtn = document.getElementById('card-copy-btn');
  if (cardCopyBtn) {
    cardCopyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard(targetEmail, 'คัดลอกอีเมลเรียบร้อย: ' + targetEmail);
    });
  }

  const emailCard = document.getElementById('email-card');
  if (emailCard) {
    emailCard.addEventListener('click', () => {
      copyToClipboard(targetEmail, 'คัดลอกอีเมลเรียบร้อย: ' + targetEmail);
    });
  }
}

// Subtle floating particle canvas background
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 32;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.6 + 0.6;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.4 + 0.15;
      this.pulseSpeed = 0.015 * Math.random() + 0.005;
      this.color = Math.random() > 0.5 ? 'rgba(56, 189, 248,' : 'rgba(168, 85, 247,';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.005;
      if (this.alpha < 0.08) this.alpha = 0.08;
      if (this.alpha > 0.6) this.alpha = 0.6;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw subtle connection lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const lineAlpha = (1 - dist / 110) * 0.08;
          ctx.strokeStyle = `rgba(148, 163, 184, ${lineAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}
