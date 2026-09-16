// --- Web Audio API Romantic Synthesizer ---
class SweetAudio {
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

  playDodge() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  playVictory() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const startT = now + idx * 0.08;
      gain.gain.setValueAtTime(0.25, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.9);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startT);
      osc.stop(startT + 0.95);
    });
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }
}

const audio = new SweetAudio();

// --- Floating Hearts & Confetti Canvas ---
class FloatingHeartsCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.hearts = [];
    this.confetti = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initHearts();
    this.loop();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initHearts() {
    for (let i = 0; i < 20; i++) {
      this.hearts.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 16 + 10,
        speedY: -(Math.random() * 0.6 + 0.2),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.45 + 0.2
      });
    }
  }

  drawHeart(x, y, size, color, opacity) {
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;
    this.ctx.translate(x, y);
    this.ctx.beginPath();
    const topCurveHeight = size * 0.3;
    this.ctx.moveTo(0, topCurveHeight);
    this.ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    this.ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.15);
    this.ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    this.ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  explodeHeartConfetti(originX, originY) {
    const colors = ['#ff2a5f', '#ff5277', '#ff758c', '#ffd2dc', '#ffffff', '#ff9bb2', '#fbc531'];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 5;
      this.confetti.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        size: Math.random() * 14 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 16,
        opacity: 1,
        gravity: 0.25,
        drag: 0.95
      });
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (const h of this.hearts) {
      this.drawHeart(h.x, h.y, h.size, '#ff477e', h.opacity);
      h.y += h.speedY;
      h.x += h.speedX;

      if (h.y < -30) {
        h.y = this.height + 20;
        h.x = Math.random() * this.width;
      }
      if (h.x < -20) h.x = this.width + 10;
      if (h.x > this.width + 20) h.x = -10;
    }

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
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate((c.rotation * Math.PI) / 180);
      this.drawHeart(0, 0, c.size, c.color, Math.max(0, c.opacity));
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.loop());
  }
}

// --- Pleading Stages & Bribes ---
const STAGES = [
  {
    img: 'https://media.tenor.com/vHqB105x1L4AAAAM/mocha-crying.gif',
    title: 'Do you love me?',
    subtitle: 'หายงอนเค้านะ... คืนดีกันนะคนดี 🥺💖',
    note: 'เค้าสัญญาว่าจะเป็นเด็กดี ไม่ดื้อไม่ซนแล้วค้าบ 🙇‍♂️',
    bribe: null,
    noText: 'ไม่คืนดี 😤',
    hint: '👇 กดปุ่มสีชมพูตรงกลางเพื่อคืนดี หรือลองกดปุ่มปฏิเสธดูสิ 😜'
  },
  {
    img: 'https://media.tenor.com/X4sW3N34oYwAAAAM/bubu-dudu-crying.gif',
    title: 'Are you sure? 🥺',
    subtitle: 'คิดดูดีๆ อีกทีน้าาา ตัวเองงง... 😭',
    note: 'เค้าสำนึกผิดแล้วจริงๆ น้าาา อย่าเพิ่งใจร้ายเลย 💔',
    bribe: '🎁 ข้อเสนอ: เลี้ยงชานมไข่มุก 1 สัปดาห์! 🧋',
    noText: 'คิดดูก่อน 🤔',
    hint: 'อุ๊ย! ปุ่มมันแอบวิ่งหนีแน่ะ 🏃‍♂️💨'
  },
  {
    img: 'https://media.tenor.com/7bQy6mF3w1sAAAAM/milk-and-mocha-hug.gif',
    title: 'ใจร้ายจังงง 💔',
    subtitle: 'เค้าขอโทษษษ จะไม่ทำอีกแล้วค้าบบบ 🙇‍♂️',
    note: 'แถมหมูกระทะชุดใหญ่ไฟกะพริบ! ปิ้งให้แกะกุ้งให้ทุกคำ 🥩🦐',
    bribe: '🎁 ข้อเสนอ: ชานม 🧋 + หมูกระทะชุดใหญ่ 🥩',
    noText: 'ติดสินบนเหรอ 🧋',
    hint: 'มีหมูกระทะมาง้อแล้วนะเธอ ยอมหน่อยเร้ววว'
  },
  {
    img: 'https://media.tenor.com/X4sW3N34oYwAAAAM/bubu-dudu-crying.gif',
    title: 'ยอมให้คุมเงินเลย! 💸',
    subtitle: 'เงินเดือนทั้งหมดโอนเข้าบัญชีเธอหมดเลย!',
    note: 'กระเป๋าตังค์เค้าก็คือกระเป๋าตังค์เธอ คืนดีเถอะนะ 🥺',
    bribe: '🎁 ข้อเสนอ: ชานม + หมูกระทะ + ยอมให้คุมเงิน 💸',
    noText: 'ยังไม่พอ 😒',
    hint: 'ให้คุมเงินแล้วนะ! ยังไม่ยอมอีกเหรออออ'
  },
  {
    img: 'https://media.tenor.com/m44qg5B3j7cAAAAM/peach-goma-love.gif',
    title: 'ยอมเป็นทาสรับใช้! 💆‍♀️',
    subtitle: 'นวดไหล่ ซักผ้า ล้างจาน กวาดบ้าน 1 เดือนเต็ม!',
    note: 'จะรับใช้ดูแลเธออย่างดีเหมือนเจ้าหญิงเลยยย 👑',
    bribe: '🎁 ข้อเสนอ: บริการนวด & งานบ้านฟรี 1 เดือน 💆‍♀️🧹',
    noText: 'ปุ่มนี้เริ่มเหนื่อยแล้ว 😢',
    hint: 'ดูปุ่มตรงกลางสิ มันโตขึ้นมาพร้อมกอดเธอแล้วนะ!'
  },
  {
    img: 'https://media.tenor.com/vHqB105x1L4AAAAM/mocha-crying.gif',
    title: 'อย่าใจร้ายกับเค้าเลย 😭😭',
    subtitle: 'ฮือออออ น้ำตาท่วมหน้าจอหมดแล้วนะคนดี...',
    note: 'ปุ่มนี้จะไม่ยอมให้กดแล้ว! กดปุ่มตรงกลางเถอะนะะะ 🙏',
    bribe: '🎁 ข้อเสนอ: มอบหัวใจทั้งดวงให้เธอคนเดียวตลอดชีพ 💖',
    noText: 'ยอมก็ได้ 😳',
    hint: 'กดปุ่มสีชมพูตรงกลางเลยยย เร็วเข้า! 💕'
  }
];

let noClickCount = 0;
let yesScale = 1;
let heartsCanvas = null;

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
  heartsCanvas = new FloatingHeartsCanvas('hearts-canvas');
  setupEvents();
});

function setupEvents() {
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const hugAgainBtn = document.getElementById('hug-again-btn');
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');

  // YES Button Click
  yesBtn.addEventListener('click', handleYesClick);

  // NO Button Runaway on Hover & Touch
  noBtn.addEventListener('mouseover', handleNoInteraction);
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleNoInteraction(e);
  });
  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleNoInteraction(e);
  });

  // Tap ripple effect anywhere on screen
  document.addEventListener('pointerdown', (e) => {
    spawnTapHeart(e.clientX, e.clientY);
  });

  // Replay Button
  hugAgainBtn.addEventListener('click', resetApp);

  // Sound Toggle
  soundBtn.addEventListener('click', () => {
    audio.enabled = !audio.enabled;
    soundIcon.innerText = audio.enabled ? '🔊' : '🔇';
    if (audio.enabled) audio.playPop();
  });
}

// Floating tap heart FX
function spawnTapHeart(x, y) {
  if (!x || !y) return;
  const emojis = ['💖', '💕', '✨', '🥺', '🌸'];
  const heart = document.createElement('div');
  heart.className = 'tap-heart-burst';
  heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 900);
}

// --- NO BUTTON DODGING LOGIC ---
function handleNoInteraction(e) {
  audio.playDodge();

  // Haptic feedback vibration on mobile if supported
  if (navigator.vibrate) {
    navigator.vibrate(40);
  }

  noClickCount++;
  const stageIndex = Math.min(noClickCount, STAGES.length - 1);
  const stage = STAGES[stageIndex];

  // Update Texts & Image
  const charImg = document.getElementById('character-img');
  const mainTitle = document.getElementById('main-title');
  const mainSubtitle = document.getElementById('main-subtitle');
  const pleadNote = document.getElementById('plead-note');
  const noText = document.getElementById('no-text');
  const dodgeHint = document.getElementById('dodge-hint');
  const rejectCounter = document.getElementById('reject-counter');
  const rejectNum = document.getElementById('reject-num');
  const bribePerks = document.getElementById('bribe-perks');
  const perkTag = document.getElementById('perk-tag');

  charImg.src = stage.img;
  mainTitle.innerText = stage.title;
  mainSubtitle.innerText = stage.subtitle;
  pleadNote.innerText = stage.note;
  noText.innerText = stage.noText;
  dodgeHint.innerText = stage.hint;

  // Show rejection counter
  rejectCounter.style.display = 'inline-block';
  rejectNum.innerText = noClickCount;

  // Show accumulated bribe
  if (stage.bribe) {
    bribePerks.style.display = 'flex';
    perkTag.innerText = stage.bribe;
  }

  // Wiggle character image
  charImg.style.transform = 'scale(1.15) rotate(' + (noClickCount % 2 === 0 ? 10 : -10) + 'deg)';
  setTimeout(() => {
    charImg.style.transform = 'scale(1) rotate(0deg)';
  }, 250);

  // YES BUTTON: GROWS LARGER IN THE CENTER!
  yesScale += 0.24;
  const yesBtn = document.getElementById('yes-btn');
  yesBtn.style.transform = `scale(${yesScale})`;

  // NO BUTTON: FLIES AROUND SCREEN TO SAFE POSITIONS
  const noBtn = document.getElementById('no-btn');
  noBtn.classList.add('dodging');

  const btnWidth = noBtn.offsetWidth || 130;
  const btnHeight = noBtn.offsetHeight || 45;

  // Safe boundary margins on mobile & desktop (avoiding top bar and edges)
  const paddingX = 24;
  const paddingTop = 80;
  const paddingBottom = 40;

  const maxX = window.innerWidth - btnWidth - paddingX;
  const maxY = window.innerHeight - btnHeight - paddingBottom;

  const randomX = Math.max(paddingX, Math.floor(Math.random() * (maxX - paddingX) + paddingX));
  const randomY = Math.max(paddingTop, Math.floor(Math.random() * (maxY - paddingTop) + paddingTop));

  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;

  // Spawn tap burst where the button was
  if (e && (e.clientX || e.touches)) {
    const touchX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : randomX);
    const touchY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : randomY);
    spawnTapHeart(touchX, touchY);
  }
}

// --- YES BUTTON CELEBRATION ---
function handleYesClick() {
  audio.playVictory();

  // Haptic heartbeat vibration
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100, 50, 200]);
  }

  const questionCard = document.getElementById('question-card');
  const celebrationCard = document.getElementById('celebration-card');
  const noBtn = document.getElementById('no-btn');

  questionCard.style.display = 'none';
  noBtn.style.display = 'none';
  celebrationCard.style.display = 'flex';

  // Heart Confetti Explosion
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  heartsCanvas.explodeHeartConfetti(centerX, centerY);

  setTimeout(() => {
    heartsCanvas.explodeHeartConfetti(centerX - 80, centerY - 60);
    heartsCanvas.explodeHeartConfetti(centerX + 80, centerY + 60);
  }, 400);
}

// --- RESET APP ---
function resetApp() {
  audio.playPop();

  noClickCount = 0;
  yesScale = 1;

  const stage = STAGES[0];
  const charImg = document.getElementById('character-img');
  const mainTitle = document.getElementById('main-title');
  const mainSubtitle = document.getElementById('main-subtitle');
  const pleadNote = document.getElementById('plead-note');
  const noText = document.getElementById('no-text');
  const dodgeHint = document.getElementById('dodge-hint');
  const rejectCounter = document.getElementById('reject-counter');
  const bribePerks = document.getElementById('bribe-perks');
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const questionCard = document.getElementById('question-card');
  const celebrationCard = document.getElementById('celebration-card');

  charImg.src = stage.img;
  mainTitle.innerText = stage.title;
  mainSubtitle.innerText = stage.subtitle;
  pleadNote.innerText = stage.note;
  noText.innerText = stage.noText;
  dodgeHint.innerText = stage.hint;
  rejectCounter.style.display = 'none';
  bribePerks.style.display = 'none';

  yesBtn.style.transform = 'scale(1)';
  noBtn.classList.remove('dodging');
  noBtn.style.left = '';
  noBtn.style.top = '';
  noBtn.style.display = 'inline-flex';

  celebrationCard.style.display = 'none';
  questionCard.style.display = 'flex';
}
