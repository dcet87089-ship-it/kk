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
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.1);
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
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const startT = now + idx * 0.08;
      gain.gain.setValueAtTime(0.25, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 1.0);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startT);
      osc.stop(startT + 1.05);
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

// --- GIF POOL ---
const GIFS = [
  'https://media.tenor.com/vHqB105x1L4AAAAM/mocha-crying.gif',
  'https://media.tenor.com/X4sW3N34oYwAAAAM/bubu-dudu-crying.gif',
  'https://media.tenor.com/7bQy6mF3w1sAAAAM/milk-and-mocha-hug.gif',
  'https://media.tenor.com/m44qg5B3j7cAAAAM/peach-goma-love.gif',
  'https://media.tenor.com/vHqB105x1L4AAAAM/mocha-crying.gif',
  'https://media.tenor.com/X4sW3N34oYwAAAAM/bubu-dudu-crying.gif',
  'https://media.tenor.com/6UeK3CskjKMAAAAM/bubu-dudu-kiss.gif'
];

// --- 30 PLEADING STAGES & BRIBES ---
const STAGES = [
  {
    title: 'Do you love me?',
    subtitle: 'หายงอนเค้านะ... คืนดีกันนะคนดี 🥺💖',
    note: 'เค้าสัญญาว่าจะเป็นเด็กดี ไม่ดื้อไม่ซนแล้วค้าบ 🙇‍♂️',
    bribe: null,
    noText: 'ไม่คืนดี 😤',
    hint: '👇 แตะปุ่มสีชมพูตรงกลางเพื่อคืนดี หรือลองกดปุ่มปฏิเสธดูสิ 😜'
  },
  {
    title: 'Are you sure? 🥺',
    subtitle: 'คิดดูดีๆ อีกทีน้าาา ตัวเองงง... 😭',
    note: 'เค้าสำนึกผิดแล้วจริงๆ น้าาา อย่าเพิ่งใจร้ายเลย 💔',
    bribe: '🎁 ข้อเสนอ: ชานมไข่มุก 1 แก้ว 🧋',
    noText: 'คิดดูก่อน 🤔',
    hint: 'อุ๊ย! ปุ่มมันแอบวิ่งหนีแน่ะ 🏃‍♂️💨'
  },
  {
    title: 'ใจร้ายจังงง 💔',
    subtitle: 'เค้าขอโทษษษ จะไม่ทำอีกแล้วค้าบบบ 🙇‍♂️',
    note: 'ชานมไข่มุกหวาน 100% เพิ่มไข่มุก 2 เท่าเลยยย 🧋✨',
    bribe: '🎁 ข้อเสนอ: ชานมไข่มุก 1 สัปดาห์เต็ม! 🧋',
    noText: 'ยังไม่พอ 😒',
    hint: 'มีชานมมาง้อแล้วนะเธอ ยอมหน่อยเร้ววว'
  },
  {
    title: 'แถมหมูกระทะด้วย! 🥩',
    subtitle: 'หมูกระทะชุดใหญ่ไฟกะพริบ + น้ำจิ้มรสเด็ด!',
    note: 'ปิ้งให้ แกะกุ้งให้ ตักน้ำจิ้มให้ทุกคำเลยยย 🦐🥓',
    bribe: '🎁 ข้อเสนอ: ชานม 🧋 + หมูกระทะชุดใหญ่ 🥩',
    noText: 'ติดสินบนเหรอ 🧋',
    hint: 'แกะกุ้งให้ด้วยนะเธอ ยอมเถอะนะะะ'
  },
  {
    title: 'แกะปูให้ด้วยเอ้า! 🦀',
    subtitle: 'แกะกุ้ง แกะปู แกะหอย บริการระดับ 5 ดาว 🦀✨',
    note: 'ไม่ต้องจับช้อนเลย เค้าจะป้อนถึงปากทุกคำ! 🥄',
    bribe: '🎁 ข้อเสนอ: บริการแกะอาหารและป้อนถึงปาก 🦀🥄',
    noText: 'ไม่อะ 🙅‍♀️',
    hint: 'จะป้อนถึงปากเลยนะ! ยังใจแข็งอีก!'
  },
  {
    title: 'ยอมให้คุมเงินเลย! 💸',
    subtitle: 'เงินเดือนทั้งหมดโอนเข้าบัญชีเธอหมดเลย!',
    note: 'กระเป๋าตังค์เค้าก็คือกระเป๋าตังค์เธอ คืนดีเถอะนะ 🥺',
    bribe: '🎁 ข้อเสนอ: ยึดสมุดบัญชี & เงินเดือนทั้งหมด 💸',
    noText: 'จริงเหรอออ 😏',
    hint: 'ให้คุมเงินแล้วนะ! ยังไม่ยอมอีกเหรออออ'
  },
  {
    title: 'ยึดบัตรเครดิตด้วย! 💳',
    subtitle: 'รูดได้ไม่อั้น ไม่ถาม ไม่บ่นสักคำเดียว!',
    note: 'อยากได้อะไรชี้เลย รูดปรื๊ดๆ สบายใจเฉิบ 💳✨',
    bribe: '🎁 ข้อเสนอ: บัตรเครดิตรูดได้ไม่อั้น 💳',
    noText: 'ยังโกรธอยู่ 😤',
    hint: 'ให้บัตรเครดิตแล้วยังจะโกรธอีกเหรอค้าบ!'
  },
  {
    title: 'ยอมเป็นทาสรับใช้! 💆‍♀️',
    subtitle: 'นวดไหล่ นวดหลัง นวดขา 1 เดือนเต็ม!',
    note: 'จะบีบนวดดูแลเธออย่างดีเหมือนเจ้าหญิงเลยยย 👑',
    bribe: '🎁 ข้อเสนอ: บริการนวดสปาฟรี 1 เดือน 💆‍♀️',
    noText: 'เมื่อยมือแย่ 😜',
    hint: 'นวดให้ทุกวันหลังเลิกงานเลยนะเธอ'
  },
  {
    title: 'ทำงานบ้านทุกอย่าง! 🧹',
    subtitle: 'ซักผ้า ตากผ้า ถูบ้าน ล้างห้องน้ำ ล้างจาน!',
    note: 'เธอแค่นอนดูซีรีส์เฉยๆ เดี๋ยวเค้าจัดการให้หมด! 📺🍿',
    bribe: '🎁 ข้อเสนอ: ทำงานบ้านแทนทุกอย่าง 1 เดือน 🧹',
    noText: 'ทำทุกวันนะ 🧐',
    hint: 'ไม่ต้องทำงานบ้านเลยนะ สบายขนาดนี้แล้ว!'
  },
  {
    title: 'จะไม่เถียงสักคำ! 🤐',
    subtitle: 'จะพูดแค่ "ครับที่รัก" "ถูกต้องที่สุดครับ"',
    note: 'เธอถูกเสมอ 100% ในทุกมิติของจักรวาล 🪐✨',
    bribe: '🎁 ข้อเสนอ: พูดแค่ "ครับที่รัก" ตลอดกาล 🤐',
    noText: 'จะคอยดู 😒',
    hint: 'เธอเป็นหัวหน้าบ้านเลยเอ้า คืนดีเร้ววว'
  },
  {
    title: 'ยอมให้ตีก้น 10 ที! 🍑',
    subtitle: 'ตีให้ดัง ป้าบๆๆๆ หายโกรธได้เลยยย!',
    note: 'ยอมเจ็บตูดเพื่อแลกกับรอยยิ้มเธอคนเดียวเลย 🍑👋',
    bribe: '🎁 ข้อเสนอ: สิทธิ์ตีก้น 10 ทีเน้นๆ 🍑',
    noText: 'เจ็บนะเตือนไว้ 😈',
    hint: 'ตีตูดให้หายแค้นเลยเอ้า ยอมทุกอย่างแย้ว'
  },
  {
    title: 'บุฟเฟต์แซลมอนไม่อั้น! 🍣',
    subtitle: 'แซลมอน ทูน่า ซาชิมิ กุ้งดองซีอิ๊วเกาหลี 🍣✨',
    note: 'กินจนพุงกาง เดี๋ยวเค้าจ่ายบิลเองคนเดียว!',
    bribe: '🎁 ข้อเสนอ: บุฟเฟต์อาหารญี่ปุ่นพรีเมียม 🍣',
    noText: 'แพงนะไหวเหรอ 🍣',
    hint: 'แซลมอนเนื้อฉ่ำๆ รออยู่น้าาา คืนดีเถอะะะ'
  },
  {
    title: 'ยอมให้เช็กมือถือ 24 ชม.! 📱',
    subtitle: 'สแกนหน้าเธอ ปลดล็อกรหัสผ่านทุกแอป!',
    note: 'บริสุทธิ์ใจ 100% ไม่มีใครนอกจากเธอแน่นอน 📱🔒',
    bribe: '🎁 ข้อเสนอ: ปลดล็อกมือถือให้เช็ก 24 ชม. 📱',
    noText: 'มีอะไรซ่อนปะ 📱',
    hint: 'เช็กได้ทุกแชทเลย ไม่มีอะไรปิดบังแน่นอน!'
  },
  {
    title: 'พาไปเที่ยวทะเล! 🏖️',
    subtitle: 'นอนโรงแรมหรูริมหาด ฟังเสียงคลื่นรับลม 🌊',
    note: 'เป็นตากล้องส่วนตัว ถ่ายให้ 1,000 รูปจนกว่าจะชอบ! 📸',
    bribe: '🎁 ข้อเสนอ: ทริปทะเล + ตากล้องส่วนตัว 📸',
    noText: 'ถ่ายไม่สวยโดนแน่ 📸',
    hint: 'ถ่ายมุมไหนก็สวยเพราะเธอสวยที่สุดอยู่แล้ว!'
  },
  {
    title: 'พาไปช้อปปิ้งไม่อั้น! 👜',
    subtitle: 'กระเป๋า เสื้อผ้า รองเท้า เครื่องสำอาง 🛍️',
    note: 'เธอเลือกใส่ตะกร้า เดี๋ยวเค้าเป็นคนถือถุงให้หมด! 🛒',
    bribe: '🎁 ข้อเสนอ: ช้อปปิ้งฟรี 1 วันเต็ม 👜🛍️',
    noText: 'พูดแล้วห้ามคืนคำ 🛍️',
    hint: 'เดินถือถุงตามหลังให้เป็นบอดี้การ์ดเลยยย'
  },
  {
    title: 'ปุ่มนี้เริ่มเหนื่อยหอบแล้วนะ! 🏃‍♂️',
    subtitle: 'วิ่งหนีจนหอบแฮ่กๆ รองเท้าจะพังแล้ววว 👟',
    note: 'เหนื่อยแล้วนะะะ กดปุ่มตรงกลางเถอะ ขอร้องงง 🙏',
    bribe: '🎁 ข้อเสนอ: ปุ่มวิ่งหนีจนเหนื่อยหอบ 🏃‍♂️💨',
    noText: 'วิ่งต่อไปสิ 🏃‍♀️',
    hint: 'สงสารปุ่มมันหน่อย มันวิ่งจนขาขวิดแย้ว!'
  },
  {
    title: 'เหงื่อซ่กไปหมดแย้ววว! 💦',
    subtitle: 'วิ่งรอบจอมาหลายกิโลแล้วนะตัวเองงง 😭',
    note: 'หัวใจเต้นเหนื่อย แต่รักเธอไม่เคยเหนื่อยเลยนะ 💕',
    bribe: '🎁 ข้อเสนอ: หัวใจที่รักเธอไม่เคยเหนื่อย 💕',
    noText: 'เหนื่อยก็ยอมสิ 😜',
    hint: 'ดูสิ เค้าตั้งใจง้อขนาดนี้แล้วน้าาา'
  },
  {
    title: 'ดูหน้าเค้าสิ ตาบวมหมดแล้ว! 🐼',
    subtitle: 'ร้องไห้จนตาบวมเป็นหมีแพนด้าแล้ววว 😭',
    note: 'น้ำตาท่วมห้องจนต้องพายเรือแล้วนะคนดี 🛶',
    bribe: '🎁 ข้อเสนอ: ตาบวมจนน่าสงสาร 🐼',
    noText: 'สงสารนิดนึง 🥺',
    hint: 'เห็นมั้ยว่าเค้าเสียใจจริงๆ ยิ้มให้หน่อยเร้ววว'
  },
  {
    title: 'ยังจะตามมากดอีกเหรอออ! 👆',
    subtitle: 'นิ้วมือเธอไม่เมื่อยบ้างเหรอคะะะ 😂',
    note: 'จิ้มเก่งขนาดนี้ เอาไปจิ้มปุ่มตรงกลางดีกว่าน้าาา 💖',
    bribe: '🎁 ข้อเสนอ: ยอมให้นวดนิ้วให้ 1 ชั่วโมง 👆',
    noText: 'ยังไม่เมื่อยยย 😈',
    hint: 'กดปุ่มสีชมพูตรงกลางทีเดียว จบแฮปปี้เลยนะ!'
  },
  {
    title: 'จอโทรศัพท์จะเป็นรอยแล้วนะ! 📱💥',
    subtitle: 'ฟิล์มกระจกจะทะลุแล้วนะตัวเองงง 😱',
    note: 'เดี๋ยวเค้าซื้อฟิล์มใหม่ติดให้ด้วยเอ้า! คืนดีเถอะ 🥺',
    bribe: '🎁 ข้อเสนอ: ฟิล์มกระจกใหม่อีก 1 แผ่น 📱',
    noText: 'ไม่สนนน 💥',
    hint: 'อย่าทำร้ายหน้าจอโทรศัพท์เลยนะะะ'
  },
  {
    title: 'เค้าสำนึกผิดแล้วจริงๆ นะ! 🙇‍♂️',
    subtitle: 'สาบานต่อหน้าดาวทุกดวงบนฟ้าเลยยย ⭐✨',
    note: 'จะไม่ทำตัวน่าตีแบบนี้อีกแล้ว สัญญาจากใจจริง 💖',
    bribe: '🎁 ข้อเสนอ: คำสัญญาของลูกผู้ชาย 🙇‍♂️✨',
    noText: 'สาบานวัดไหน ⛩️',
    hint: 'สาบานต่อหน้าเธอคนเดียวเลยครับผม!'
  },
  {
    title: 'กราบแนบอกงามๆ 3 ที! 🙏',
    subtitle: 'กราบ 1... กราบ 2... กราบ 3... แนบอกเลยยย 🙇‍♂️',
    note: 'อ้อนขนาดนี้ มีแฟนใครยอมง้อเท่านี้อีกมั้ยยย 🥺',
    bribe: '🎁 ข้อเสนอ: กราบแนบอกงามๆ 3 จบ 🙏',
    noText: 'เกือบใจอ่อนละ 🤏',
    hint: 'ใจอ่อนอีกนิดนึงน้าาา คนดีของเค้า'
  },
  {
    title: 'ยอมโกนหัวบวชให้เลยเอ้า! 🦲',
    subtitle: 'อุทิศผลบุญให้เธอหายงอนเลยยย สาธุ! 🙏🦲',
    note: 'บวชไม่สึกจนกว่าเธอจะยิ้มเลยเอ้า 55555 😂',
    bribe: '🎁 ข้อเสนอ: บุญบวชชดเชยความผิด 🦲✨',
    noText: 'เว่อร์ไปมั้ยยย 😂',
    hint: 'หัวเราะแล้วใช่มั้ยล่าาา ยิ้มแล้วคืนดีน้าาา'
  },
  {
    title: 'จะไม่มองใครอีกเลยในโลก! 🙈',
    subtitle: 'มีตาไว้มองแค่ความสวยของเธอคนเดียว! 👀💖',
    note: 'ในสายตาเค้า ไม่มีใครน่ารักเท่าเธออีกแล้วในจักรวาล ✨',
    bribe: '🎁 ข้อเสนอ: มองแค่เธอคนเดียวตลอดชีพ 🙈',
    noText: 'ถ้าแอบมองโดนแน่ 🔪',
    hint: 'ไม่แอบมองแน่นอน มีแฟนสวยขนาดนี้จะมองใครอีก!'
  },
  {
    title: 'ปุ่มนี้ร้องขอชีวิตแล้วนะะะ 😭',
    subtitle: 'ปุ่มปฏิเสธแทบจะก้มกราบเธอแล้วนะะะ 🙏',
    note: 'กดปุ่มตรงกลางทีเถอะะะ สงสารพวกเค้าหน่อยยย 💖',
    bribe: '🎁 ข้อเสนอ: ปุ่มขอยกธงขาวยอมแพ้ 🏳️',
    noText: 'อีกนิดนึงน่าาา 😋',
    hint: 'ดูปุ่มตรงกลางสิ มันใหญ่จนจะเต็มจอแล้วนะ!'
  },
  {
    title: 'ดูปุ่มตรงกลางสิ! 💖',
    subtitle: 'มันใหญ่คับจอจนจะระเบิดแล้วนะตัวเองงง!',
    note: 'กดยังไงก็โดนปุ่มตรงกลางแล้วนะ ไม่เชื่อลองกดดูสิ! 🥰',
    bribe: '🎁 ข้อเสนอ: ปุ่มคืนดีไซส์ยักษ์แห่งความรัก 💖',
    noText: 'จิ้มไม่โดนหรอก 😜',
    hint: 'จิ้มปุ่มตรงกลางเลยจ้าาา รอมอบกอดอยู่นะ'
  },
  {
    title: 'รักเธอที่สุดในสามโลกเลยยย 🌌',
    subtitle: 'รักมากกว่าเมื่อวาน และน้อยกว่าวันพรุ่งนี้เสมอ 💕',
    note: 'ไม่มีใครมาแทนที่เธอได้หรอกนะคนเก่ง 🧸✨',
    bribe: '🎁 ข้อเสนอ: ความรักที่ไม่มีวันหมดอายุ 🌌💖',
    noText: 'รักแค่ไหนกันเชียว 💖',
    hint: 'รักเท่าฟ้า เท่าทะเล เท่าจักรวาลเลยครับ!'
  },
  {
    title: 'ไม่มีใครยอมเธอเท่าเค้าแล้วนะ 💕',
    subtitle: 'ยอมเป็นทุกอย่างให้เธอแล้วจริงๆ นะคะ 🥺',
    note: 'ยอมเป็นแฟน เป็นเพื่อน เป็นคนรับใช้ เป็นทุกอย่างให้เธอแล้ว!',
    bribe: '🎁 ข้อเสนอ: ยอมเป็นทุกอย่างให้เธอคนเดียว 💕',
    noText: 'จริงเหยอออ 🥺',
    hint: 'จริงที่สุดในโลกเลยค้าบบบ'
  },
  {
    title: 'จะกอดขาไว้แบบนี้ตลอดไป! 🧸',
    subtitle: 'ไม่ยอมให้ไปไหนหรอก อยู่ด้วยกันไปจนแก่เฒ่าเลยยย 👵👴',
    note: 'เกาะขาแน่นมาก แกะไม่ออกแล้วน้าาา จุ๊บๆ 😘',
    bribe: '🎁 ข้อเสนอ: กอดแน่นๆ ไม่ปล่อยตลอดกาล 🧸',
    noText: 'ยอมก็ได้... มั้ง 😳',
    hint: 'อีกนิดเดียว ยอมกดปุ่มตรงกลางเลยยย!'
  },
  {
    title: 'ยอมจำนนทุกข้อหาแล้วจ้าาา! 🥰',
    subtitle: 'ยอมแพ้ความน่ารักของเธอแล้วคนดี 💖',
    note: 'กดปุ่มสีชมพูตรงกลางเพื่อรับความรักคืนดีเลยยยย 🎉',
    bribe: '🎁 ข้อเสนอ: คืนดีกันนะ สัญญาจะเป็นแฟนที่ดีที่สุด! 💖',
    noText: 'ยอมคืนดีแล้วจ้าาา 💕',
    hint: '🎉 กดตรงไหนก็คืนดีแล้วจ้าาา เย้้้้้!'
  }
];

let noClickCount = 0;
let yesScale = 1;
let heartsCanvas = null;
let lastNoInteractionTime = 0;

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
  yesBtn.addEventListener('touchend', (e) => {
    // Only accept genuine touch on YES button
    if (Date.now() - lastNoInteractionTime >= 700) {
      e.preventDefault();
      handleYesClick();
    }
  });

  // NO Button Dodging: Trigger immediately on touchstart or pointerdown
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevents synthetic ghost click on underlying element!
    e.stopPropagation();
    handleNoInteraction(e);
  }, { passive: false });

  noBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleNoInteraction(e);
  });

  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleNoInteraction(e);
  });

  // Touch proximity evasion: On mobile, dodge if finger comes within 50px of NO button!
  document.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0] && noBtn.classList.contains('dodging')) {
      const tx = e.touches[0].clientX;
      const ty = e.touches[0].clientY;
      const rect = noBtn.getBoundingClientRect();
      const dist = Math.hypot(tx - (rect.left + rect.width / 2), ty - (rect.top + rect.height / 2));
      if (dist < 55) {
        handleNoInteraction(e);
      }
    }
  }, { passive: true });

  // Screen tap heart burst
  document.addEventListener('pointerdown', (e) => {
    spawnTapHeart(e.clientX, e.clientY);
  });

  // Replay
  hugAgainBtn.addEventListener('click', resetApp);

  // Sound Toggle
  soundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    audio.enabled = !audio.enabled;
    soundIcon.innerText = audio.enabled ? '🔊' : '🔇';
    if (audio.enabled) audio.playPop();
  });
}

function spawnTapHeart(x, y) {
  if (!x || !y) return;
  const emojis = ['💖', '💕', '✨', '🥺', '🌸', '🧸'];
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
  if (e) {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
  }

  // Mark timestamp to completely reject any ghost clicks on YES button
  lastNoInteractionTime = Date.now();

  audio.playDodge();

  // Mobile haptic vibration
  if (navigator.vibrate) {
    navigator.vibrate(40);
  }

  noClickCount++;
  const stageIndex = Math.min(noClickCount, STAGES.length - 1);
  const stage = STAGES[stageIndex];

  // Cycle GIFs
  const charImg = document.getElementById('character-img');
  charImg.src = GIFS[noClickCount % GIFS.length];

  // Update texts
  const mainTitle = document.getElementById('main-title');
  const mainSubtitle = document.getElementById('main-subtitle');
  const pleadNote = document.getElementById('plead-note');
  const noText = document.getElementById('no-text');
  const dodgeHint = document.getElementById('dodge-hint');
  const rejectCounter = document.getElementById('reject-counter');
  const rejectNum = document.getElementById('reject-num');
  const bribePerks = document.getElementById('bribe-perks');
  const perkTag = document.getElementById('perk-tag');

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
  charImg.style.transform = 'scale(1.15) rotate(' + (noClickCount % 2 === 0 ? 12 : -12) + 'deg)';
  setTimeout(() => {
    charImg.style.transform = 'scale(1) rotate(0deg)';
  }, 250);

  // YES BUTTON: Delay scale growth slightly so it doesn't expand into finger touch coordinate!
  setTimeout(() => {
    yesScale += 0.04;
    const yesBtn = document.getElementById('yes-btn');
    if (yesBtn) {
      yesBtn.style.transform = `scale(${Math.min(yesScale, 1.7)})`;
    }
  }, 350);

  // NO BUTTON: Move to document.body and fly to safe positions away from YES button
  const noBtn = document.getElementById('no-btn');
  const yesBtn = document.getElementById('yes-btn');
  
  if (noBtn.parentElement !== document.body) {
    document.body.appendChild(noBtn);
  }
  noBtn.classList.add('dodging');

  const rect = noBtn.getBoundingClientRect();
  const btnWidth = rect.width || 120;
  const btnHeight = rect.height || 42;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Safe screen bounds: 15px from left/right, 65px from top (below header), 50px from bottom
  const minX = 15;
  const maxX = Math.max(minX + 10, vw - btnWidth - 15);
  const minY = 65;
  const maxY = Math.max(minY + 10, vh - btnHeight - 50);

  // Avoid center zone where YES button is!
  const yesRect = yesBtn.getBoundingClientRect();

  let randomX = minX;
  let randomY = minY;
  let attempts = 0;

  do {
    randomX = Math.floor(Math.random() * (maxX - minX)) + minX;
    randomY = Math.floor(Math.random() * (maxY - minY)) + minY;
    attempts++;
  } while (
    attempts < 20 &&
    randomX + btnWidth > yesRect.left - 20 &&
    randomX < yesRect.right + 20 &&
    randomY + btnHeight > yesRect.top - 20 &&
    randomY < yesRect.bottom + 20
  );

  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;

  // Tap ripple FX
  const clickX = e && e.clientX ? e.clientX : randomX + btnWidth / 2;
  const clickY = e && e.clientY ? e.clientY : randomY + btnHeight / 2;
  spawnTapHeart(clickX, clickY);
}

// --- YES BUTTON CELEBRATION ---
function handleYesClick(e) {
  // CRITICAL: Prevent ghost click from mobile touch on NO button!
  if (Date.now() - lastNoInteractionTime < 700) {
    console.log('Blocked mobile ghost click on YES button');
    return;
  }

  audio.playVictory();

  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100, 50, 250]);
  }

  const questionCard = document.getElementById('question-card');
  const celebrationCard = document.getElementById('celebration-card');
  const noBtn = document.getElementById('no-btn');

  questionCard.style.display = 'none';
  noBtn.style.display = 'none';
  celebrationCard.style.display = 'flex';

  // Confetti Explosion
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

  charImg.src = GIFS[0];
  mainTitle.innerText = stage.title;
  mainSubtitle.innerText = stage.subtitle;
  pleadNote.innerText = stage.note;
  noText.innerText = stage.noText;
  dodgeHint.innerText = stage.hint;
  rejectCounter.style.display = 'none';
  bribePerks.style.display = 'none';

  yesBtn.style.transform = 'scale(1)';

  // Re-attach noBtn back to buttons area inside question card
  const buttonsArea = document.querySelector('.buttons-area');
  if (buttonsArea && noBtn.parentElement !== buttonsArea) {
    buttonsArea.appendChild(noBtn);
  }
  noBtn.classList.remove('dodging');
  noBtn.style.left = '';
  noBtn.style.top = '';
  noBtn.style.display = 'inline-flex';

  celebrationCard.style.display = 'none';
  questionCard.style.display = 'flex';
}
