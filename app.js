// --- Audio Synthesizer via Web Audio API ---
class FunAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playRattle() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.19);
  }

  playBoing() {
    if (!this.enabled) return;
    this.init();
    // Comic Boing / Spring sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    
    // Pitch envelope: low to high then wobble
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.2);
    osc.frequency.linearRampToValueAtTime(320, now + 0.4);
    osc.frequency.linearRampToValueAtTime(440, now + 0.55);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.65);

    // Fanfare fanfare chords
    const fanfareNotes = [523.25, 659.25, 783.99, 1046.5];
    fanfareNotes.forEach((freq, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = freq;
      const startT = now + 0.2 + (i * 0.08);
      g.gain.setValueAtTime(0.18, startT);
      g.gain.exponentialRampToValueAtTime(0.001, startT + 0.5);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(startT);
      o.stop(startT + 0.55);
    });
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }
}

const audio = new FunAudio();

// --- Confetti & Particles System ---
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.confetti = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initFloatingIcons();
    this.loop();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initFloatingIcons() {
    const emojis = ['🌶️', '🥩', '⚽', '✨', '🔥', '💖'];
    for (let i = 0; i < 24; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: Math.random() * 18 + 14,
        speedY: -(Math.random() * 0.6 + 0.2),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02
      });
    }
  }

  explodeConfetti(originX, originY) {
    const colors = ['#e53935', '#ff9800', '#fbc02d', '#4caf50', '#2196f3', '#9c27b0'];
    const emojis = ['🌶️', '🥩', '⚽', '✨'];

    // Paper confetti
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 6;
      this.confetti.push({
        type: 'rect',
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 6,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 16,
        opacity: 1,
        gravity: 0.25,
        drag: 0.95
      });
    }

    // Emoji burst
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 4;
      this.confetti.push({
        type: 'emoji',
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6,
        size: Math.random() * 14 + 18,
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 6,
        opacity: 1,
        gravity: 0.2,
        drag: 0.96
      });
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Floating background particles
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.opacity;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rot);
      this.ctx.font = `${p.size}px serif`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(p.emoji, 0, 0);
      this.ctx.restore();

      p.y += p.speedY;
      p.x += p.speedX;
      p.rot += p.rotSpeed;

      if (p.y < -30) {
        p.y = this.height + 20;
        p.x = Math.random() * this.width;
      }
    }

    // Exploded Confetti
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.vx *= c.drag;
      c.vy *= c.drag;
      c.vy += c.gravity;
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.rotSpeed;
      c.opacity -= 0.009;

      if (c.opacity <= 0 || c.y > this.height + 50) {
        this.confetti.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, c.opacity);
      this.ctx.translate(c.x, c.y);

      if (c.type === 'emoji') {
        this.ctx.rotate((c.rotation * Math.PI) / 180);
        this.ctx.font = `${c.size}px serif`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(c.emoji, 0, 0);
      } else {
        this.ctx.rotate((c.rotation * Math.PI) / 180);
        this.ctx.fillStyle = c.color;
        this.ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.7);
      }

      this.ctx.restore();
    }

    requestAnimationFrame(() => this.loop());
  }
}

let isBoxOpened = false;
let particles = null;

document.addEventListener('DOMContentLoaded', () => {
  particles = new ParticleSystem('particle-canvas');
  setupEvents();
});

function setupEvents() {
  const giftStage = document.getElementById('gift-stage');
  const characterCard = document.getElementById('character-card');
  const bounceAgainBtn = document.getElementById('bounce-again-btn');
  const replayBtn = document.getElementById('replay-btn');
  const resetBtn = document.getElementById('reset-btn');
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');

  // Click on gift box to open
  giftStage.addEventListener('click', (e) => {
    if (!isBoxOpened) {
      openGiftBox();
    }
  });

  // Click on character card to bounce
  characterCard.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerCharacterBounce();
  });

  // Bounce again button
  bounceAgainBtn.addEventListener('click', () => {
    triggerCharacterBounce();
  });

  // Replay buttons
  replayBtn.addEventListener('click', closeAndResetGiftBox);
  resetBtn.addEventListener('click', closeAndResetGiftBox);

  // Sound toggle
  soundBtn.addEventListener('click', () => {
    audio.enabled = !audio.enabled;
    soundIcon.innerText = audio.enabled ? '🔊' : '🔇';
    if (audio.enabled) audio.playPop();
  });
}

function openGiftBox() {
  if (isBoxOpened) return;
  isBoxOpened = true;

  const giftBox = document.getElementById('gift-box');
  const surpriseCharacter = document.getElementById('surprise-character');
  const clickHint = document.getElementById('click-hint');
  const introText = document.getElementById('intro-text');
  const surpriseControls = document.getElementById('surprise-controls');
  const congratsCard = document.getElementById('congrats-card');
  const resetBtn = document.getElementById('reset-btn');

  // 1. Shake eagerly
  giftBox.classList.add('shaking');
  audio.playRattle();

  setTimeout(() => {
    // 2. Open Lid & Bow
    giftBox.classList.remove('shaking');
    giftBox.classList.add('opened');

    // Load character image on open so link preview cannot scrape it beforehand
    const charImg = document.getElementById('character-img');
    if (charImg && (!charImg.src || charImg.src === window.location.href)) {
      charImg.src = charImg.getAttribute('data-src') || 'larb_man.jpg';
    }

    // 3. Eject Character with Spring Boing!
    surpriseCharacter.classList.add('popped');
    audio.playBoing();

    // 4. Blast confetti & chilis
    const rect = giftBox.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;
    particles.explodeConfetti(centerX, centerY);

    // 5. Hide hint and show action controls
    clickHint.style.opacity = '0';
    introText.style.opacity = '0.5';
    surpriseControls.classList.add('active');
    congratsCard.classList.add('active');
    resetBtn.classList.remove('reset-btn-hidden');

  }, 400);
}

function triggerCharacterBounce() {
  const surpriseCharacter = document.getElementById('surprise-character');
  surpriseCharacter.classList.remove('bouncing');
  void surpriseCharacter.offsetWidth; // trigger reflow
  surpriseCharacter.classList.add('bouncing');

  audio.playBoing();

  // Burst mini confetti
  const rect = surpriseCharacter.getBoundingClientRect();
  particles.explodeConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

function closeAndResetGiftBox() {
  isBoxOpened = false;

  const giftBox = document.getElementById('gift-box');
  const surpriseCharacter = document.getElementById('surprise-character');
  const clickHint = document.getElementById('click-hint');
  const introText = document.getElementById('intro-text');
  const surpriseControls = document.getElementById('surprise-controls');
  const congratsCard = document.getElementById('congrats-card');
  const resetBtn = document.getElementById('reset-btn');

  surpriseCharacter.classList.remove('popped', 'bouncing');
  giftBox.classList.remove('opened');
  clickHint.style.opacity = '1';
  introText.style.opacity = '1';
  surpriseControls.classList.remove('active');
  congratsCard.classList.remove('active');
  resetBtn.classList.add('reset-btn-hidden');

  audio.playPop();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
