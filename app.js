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

  // Cute squeak / dodge whoosh when NO button escapes
  playDodge() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Romantic victory harp celebration when YES is clicked
  playVictory() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    // C-major romantic harp arpeggio: C4, E4, G4, C5, E5, G5, C6
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const startT = now + idx * 0.09;
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
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
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
    for (let i = 0; i < 22; i++) {
      this.hearts.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 18 + 10,
        speedY: -(Math.random() * 0.7 + 0.3),
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        scale: Math.random() * 0.6 + 0.7
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
    // Left curve
    this.ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    this.ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.15);
    // Right curve
    this.ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    this.ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  explodeHeartConfetti(originX, originY) {
    const colors = ['#ff2a5f', '#ff6584', '#ff758c', '#ffd2dc', '#ffffff', '#ff9bb2'];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      this.confetti.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 14 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 14,
        opacity: 1,
        gravity: 0.22,
        drag: 0.96
      });
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Floating background hearts
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

    // Confetti particles
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

// --- Pleading Stages Database ---
const STAGES = [
  {
    img: 'https://media.tenor.com/vHqB105x1L4AAAAM/mocha-crying.gif',
    title: 'Do you love me?',
    subtitle: 'หายงอนเค้านะ... คืนดีกันนะคนดี 🥺💖',
    note: 'เค้าสัญญาว่าจะเป็นเด็กดี ไม่ดื้อไม่ซนแล้วค้าบ 🙇‍♂️',
    noText: 'ไม่คืนดี 😤',
    hint: 'ลองกดปุ่มปฏิเสธดูสิ... แต่อย่าใจร้ายนานนะ 🥺'
  },
  {
    img: 'https://media.tenor.com/X4sW3N34oYwAAAAM/bubu-dudu-crying.gif',
    title: 'Are you sure? 🥺',
    subtitle: 'คิดดูดีๆ อีกทีน้าาา ตัวเองงง... 😭',
    note: 'เค้าสำนึกผิดแล้วจริงๆ น้าาา อย่าเพิ่งเมินเค้าเลย 💔',
    noText: 'คิดดูก่อน 🤔',
    hint: 'อุ๊ย! ปุ่มมันแอบหนีแน่ะ 🏃‍♂️'
  },
  {
    img: 'https://media.tenor.com/7bQy6mF3w1sAAAAM/milk-and-mocha-hug.gif',
    title: 'ใจร้ายจังงง 💔',
    subtitle: 'เค้าขอโทษษษษษ จะไม่ทำอีกแล้วค้าบบบ 🙇‍♂️',
    note: 'ยอมให้กินชานมไข่มุก 1 สัปดาห์เต็มๆ เลยยย! 🧋✨',
    noText: 'ติดสินบนเหรอ 🧋',
    hint: 'ชานมไข่มุกหวาน 100% ก็ยังไม่ยอมเหรอ!'
  },
  {
    img: 'https://media.tenor.com/X4sW3N34oYwAAAAM/bubu-dudu-crying.gif',
    title: 'แถมหมูกระทะด้วย! 🥩',
    subtitle: 'หมูกระทะชุดใหญ่ไฟกะพริบ + ไอติม 🍨',
    note: 'ปิ้งให้ แกะกุ้งให้ ตักน้ำจิ้มให้ทุกคำเลยยย! 🦐🥓',
    noText: 'ยังไม่พอ 😒',
    hint: 'แกะกุ้งให้ด้วยนะเธอ ยอมเถอะนะะะ'
  },
  {
    img: 'https://media.tenor.com/m44qg5B3j7cAAAAM/peach-goma-love.gif',
    title: 'อย่าใจร้ายกับเค้าเลยยย 😭😭',
    subtitle: 'ฮือออออ น้ำตาท่วมห้องแล้วนะคนดี...',
    note: 'ปุ่มนี้เริ่มเหนื่อยแล้วนะ กดปุ่มข้างๆ เหอะ ขอร้อง 🙏',
    noText: 'ปุ่มนี้เหนื่อยแล้วนะ 😢',
    hint: 'ดูปุ่มข้างๆ สิ มันโตขึ้นมาพร้อมกอดเธอแล้วนะ!'
  },
  {
    img: 'https://media.tenor.com/vHqB105x1L4AAAAM/mocha-crying.gif',
    title: 'รักเค้าหน่อยน้าาา 🧸💖',
    subtitle: 'เค้ามีแค่เธอคนเดียวในใจทั้งดวงเลยนะ!',
    note: 'ไม่ยอมให้ไปไหนหรอก จะกอดขาไว้แบบนี้แหละ! 💕',
    noText: 'ยอมก็ได้ 😳',
    hint: 'ยอมกดคืนดีเหอะน้าาาา จุ๊บๆ'
  }
];

let currentStageIndex = 0;
let noClickCount = 0;
let yesScale = 1;
let heartsCanvas = null;

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
  heartsCanvas = new FloatingHeartsCanvas('hearts-canvas');
  setupInteractions();
});

function setupInteractions() {
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const hugAgainBtn = document.getElementById('hug-again-btn');
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');

  // YES Button Click
  yesBtn.addEventListener('click', handleYesClick);

  // NO Button Interactions (Mouseover, Click, Touch)
  noBtn.addEventListener('mouseover', handleNoInteraction);
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleNoInteraction();
  });
  noBtn.addEventListener('click', handleNoInteraction);

  // Replay / Hug Again
  hugAgainBtn.addEventListener('click', resetApp);

  // Sound Toggle
  soundBtn.addEventListener('click', () => {
    audio.enabled = !audio.enabled;
    soundIcon.innerText = audio.enabled ? '🔊' : '🔇';
    if (audio.enabled) audio.playPop();
  });
}

// --- NO Button Runaway & Stage Progression ---
function handleNoInteraction() {
  audio.playDodge();

  noClickCount++;
  currentStageIndex = Math.min(noClickCount, STAGES.length - 1);
  const stage = STAGES[currentStageIndex];

  // Update Character & Texts
  const charImg = document.getElementById('character-img');
  const mainTitle = document.getElementById('main-title');
  const mainSubtitle = document.getElementById('main-subtitle');
  const pleadNote = document.getElementById('plead-note');
  const noText = document.getElementById('no-text');
  const dodgeHint = document.getElementById('dodge-hint');

  charImg.src = stage.img;
  mainTitle.innerText = stage.title;
  mainSubtitle.innerText = stage.subtitle;
  pleadNote.innerText = stage.note;
  noText.innerText = stage.noText;
  dodgeHint.innerText = stage.hint;

  // Shake image effect
  charImg.style.transform = 'scale(1.1) rotate(' + (Math.random() > 0.5 ? 8 : -8) + 'deg)';
  setTimeout(() => {
    charImg.style.transform = 'scale(1) rotate(0deg)';
  }, 250);

  // Make YES button grow bigger each time!
  yesScale += 0.22;
  const yesBtn = document.getElementById('yes-btn');
  yesBtn.style.transform = `scale(${yesScale})`;
  yesBtn.style.zIndex = '50';

  // Move NO button to a random safe position on screen
  const noBtn = document.getElementById('no-btn');
  noBtn.classList.add('running');

  const btnWidth = noBtn.offsetWidth || 120;
  const btnHeight = noBtn.offsetHeight || 50;

  // Calculate safe boundary margins (leave 30px from borders)
  const maxX = window.innerWidth - btnWidth - 30;
  const maxY = window.innerHeight - btnHeight - 30;

  const randomX = Math.max(25, Math.floor(Math.random() * maxX));
  const randomY = Math.max(60, Math.floor(Math.random() * maxY));

  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;

  // If reached maximum stage (stage 5+), pressing NO also triggers YES (Surprise Love!)
  if (noClickCount >= STAGES.length + 2) {
    handleYesClick();
  }
}

// --- YES Button Celebration ---
function handleYesClick() {
  audio.playVictory();

  const questionCard = document.getElementById('question-card');
  const celebrationCard = document.getElementById('celebration-card');
  const noBtn = document.getElementById('no-btn');

  // Hide question card and NO button
  questionCard.style.display = 'none';
  noBtn.style.display = 'none';

  // Show celebration card
  celebrationCard.style.display = 'block';

  // Explode heart confetti from center of screen!
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  heartsCanvas.explodeHeartConfetti(centerX, centerY);

  // Second burst for extra joy
  setTimeout(() => {
    heartsCanvas.explodeHeartConfetti(centerX - 80, centerY - 60);
    heartsCanvas.explodeHeartConfetti(centerX + 80, centerY + 60);
  }, 400);
}

// --- Reset to Initial State ---
function resetApp() {
  audio.playPop();

  currentStageIndex = 0;
  noClickCount = 0;
  yesScale = 1;

  const stage = STAGES[0];
  const charImg = document.getElementById('character-img');
  const mainTitle = document.getElementById('main-title');
  const mainSubtitle = document.getElementById('main-subtitle');
  const pleadNote = document.getElementById('plead-note');
  const noText = document.getElementById('no-text');
  const dodgeHint = document.getElementById('dodge-hint');
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

  yesBtn.style.transform = 'scale(1)';
  noBtn.classList.remove('running');
  noBtn.style.left = '';
  noBtn.style.top = '';
  noBtn.style.display = 'inline-flex';

  celebrationCard.style.display = 'none';
  questionCard.style.display = 'block';
}
