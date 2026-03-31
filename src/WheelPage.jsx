import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WheelPage.css';

const PRIZES = [
  { label: '10%', full: '10% Off', color: '#c25b41' },
  { label: 'Free\nDelivery', full: 'Free Delivery', color: '#222222' },
  { label: '15%', full: '15% Off', color: '#8b6f4e' },
  { label: 'Free\nConsult', full: 'Free Design Consultation', color: '#6b6560' },
  { label: '20%', full: '20% Off', color: '#c25b41' },
  { label: '5%', full: '5% Off', color: '#a0937d' },
  { label: 'Free\nDelivery', full: 'Free Delivery', color: '#222222' },
  { label: '10%', full: '10% Off', color: '#8b6f4e' },
];

const SEGMENT_ANGLE = 360 / PRIZES.length;

const LANGS = ['en', 'bg', 'ru'];

const UI = {
  en: {
    title: 'Spin & Win',
    subtitle: 'Try your luck and win an exclusive discount!',
    emailPlaceholder: 'Enter your email',
    spin: 'Spin the Wheel',
    spinning: 'Spinning...',
    congrats: 'Congratulations!',
    youWon: 'You won',
    emailSent: 'A coupon has been sent to your email!',
    alreadyPlayed: 'You have already played with this email.',
    invalidEmail: 'Please enter a valid email address.',
    backToLinks: 'Back to Links',
    terms: 'One spin per email. Show the coupon at our store to redeem.',
  },
  bg: {
    title: 'Завърти & Спечели',
    subtitle: 'Опитай късмета си и спечели ексклузивна отстъпка!',
    emailPlaceholder: 'Въведи имейл',
    spin: 'Завърти колелото',
    spinning: 'Върти се...',
    congrats: 'Поздравления!',
    youWon: 'Спечели',
    emailSent: 'Купон беше изпратен на имейла ти!',
    alreadyPlayed: 'Вече си играл с този имейл.',
    invalidEmail: 'Моля, въведи валиден имейл адрес.',
    backToLinks: 'Обратно към линкове',
    terms: 'Едно завъртане на имейл. Покажи купона в магазина, за да го използваш.',
  },
  ru: {
    title: 'Крути & Выиграй',
    subtitle: 'Испытай удачу и выиграй эксклюзивную скидку!',
    emailPlaceholder: 'Введите email',
    spin: 'Крутить колесо',
    spinning: 'Крутится...',
    congrats: 'Поздравляем!',
    youWon: 'Вы выиграли',
    emailSent: 'Купон отправлен на ваш email!',
    alreadyPlayed: 'Вы уже играли с этим email.',
    invalidEmail: 'Пожалуйста, введите действительный email.',
    backToLinks: 'Назад к ссылкам',
    terms: 'Одно вращение на email. Покажите купон в магазине для активации.',
  },
};

function getInitialLang() {
  const saved = localStorage.getItem('lang');
  if (saved && LANGS.includes(saved)) return saved;
  const nav = navigator.language?.slice(0, 2);
  if (nav === 'bg') return 'bg';
  if (nav === 'ru') return 'ru';
  return 'en';
}

function getPlayedEmails() {
  try {
    return JSON.parse(localStorage.getItem('wheel_played') || '[]');
  } catch {
    return [];
  }
}

function markEmailPlayed(email) {
  const played = getPlayedEmails();
  played.push(email.toLowerCase().trim());
  localStorage.setItem('wheel_played', JSON.stringify(played));
}

function isEmailPlayed(email) {
  return getPlayedEmails().includes(email.toLowerCase().trim());
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function drawWheel(canvas) {
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const center = size / 2;
  const radius = center - 4;

  ctx.clearRect(0, 0, size, size);

  PRIZES.forEach((prize, i) => {
    const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
    const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);

    // Segment fill
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? '#f7f6f4' : '#ede6cf';
    ctx.fill();

    // Segment border
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.strokeStyle = '#e8e6e2';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Text
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(startAngle + (SEGMENT_ANGLE * Math.PI) / 360);
    ctx.textAlign = 'center';
    ctx.fillStyle = prize.color;
    ctx.font = `600 ${size * 0.038}px Montserrat, sans-serif`;

    const lines = prize.label.split('\n');
    const lineHeight = size * 0.045;
    const textOffset = radius * 0.62;

    lines.forEach((line, li) => {
      const y = textOffset + (li - (lines.length - 1) / 2) * lineHeight;
      ctx.fillText(line, 0, y);
    });

    ctx.restore();
  });

  // Center circle
  ctx.beginPath();
  ctx.arc(center, center, radius * 0.15, 0, Math.PI * 2);
  ctx.fillStyle = '#222222';
  ctx.fill();

  // Inner ring
  ctx.beginPath();
  ctx.arc(center, center, radius * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = '#333333';
  ctx.fill();

  // Outer ring
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#222222';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Tick marks
  for (let i = 0; i < PRIZES.length * 3; i++) {
    const angle = (i * (360 / (PRIZES.length * 3)) - 90) * (Math.PI / 180);
    const inner = radius - 8;
    const outer = radius - 2;
    ctx.beginPath();
    ctx.moveTo(center + inner * Math.cos(angle), center + inner * Math.sin(angle));
    ctx.lineTo(center + outer * Math.cos(angle), center + outer * Math.sin(angle));
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

export default function WheelPage() {
  const [lang, setLang] = useState(getInitialLang);
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState('form'); // form | spinning | won | played
  const [prize, setPrize] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const t = UI[lang];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const size = 320;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.getContext('2d').scale(dpr, dpr);
    // Redraw at the correct canvas dimensions
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawWheel(canvas);
  }, []);

  const handleSpin = async () => {
    setError('');

    if (!isValidEmail(email)) {
      setError(t.invalidEmail);
      return;
    }

    if (isEmailPlayed(email)) {
      setError(t.alreadyPlayed);
      return;
    }

    setPhase('spinning');

    // Pick random prize
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const won = PRIZES[prizeIndex];

    // Calculate spin: land on the winning segment
    // Wheel top (pointer) = 0deg. Segment i center = i * SEGMENT_ANGLE + SEGMENT_ANGLE/2
    // We need to rotate so that segment center aligns with top (0deg)
    const targetAngle = 360 - (prizeIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
    const totalRotation = rotation + fullSpins * 360 + targetAngle + Math.random() * (SEGMENT_ANGLE * 0.6) - SEGMENT_ANGLE * 0.3;

    setRotation(totalRotation);

    // Wait for animation
    setTimeout(() => {
      setPrize(won);
      setPhase('won');
      markEmailPlayed(email);

      // Fire API call (non-blocking)
      sendSpinData(email, won.full).catch(() => {});
    }, 4500);
  };

  const sendSpinData = async (email, prizeName) => {
    try {
      await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, prize: prizeName }),
      });
    } catch {
      // API is optional — localStorage already tracks the spin
    }
  };

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  return (
    <div className="app">
      <div className="container wheel-container">
        {/* Language Switcher */}
        <div className="lang-switcher">
          {LANGS.map((l) => (
            <button
              key={l}
              className={`lang-btn${lang === l ? ' active' : ''}`}
              onClick={() => changeLang(l)}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Back link */}
        <Link to="/" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          {t.backToLinks}
        </Link>

        <header className="wheel-header">
          <h1 className="wheel-title">{t.title}</h1>
          <p className="wheel-subtitle">{t.subtitle}</p>
        </header>

        {/* Wheel */}
        <div className="wheel-wrapper">
          <div className="wheel-pointer" />
          <div
            className="wheel-spin-area"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: phase === 'spinning'
                ? 'transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                : 'none',
            }}
          >
            <canvas ref={canvasRef} className="wheel-canvas" />
          </div>
        </div>

        {/* Prize result */}
        {phase === 'won' && prize && (
          <div className="prize-reveal">
            <div className="prize-badge">
              <span className="prize-congrats">{t.congrats}</span>
              <span className="prize-value">{prize.full}</span>
              <span className="prize-email-sent">{t.emailSent}</span>
            </div>
          </div>
        )}

        {/* Form */}
        {(phase === 'form' || phase === 'spinning') && (
          <div className="wheel-form">
            <input
              type="email"
              className="wheel-input"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={phase === 'spinning'}
              onKeyDown={(e) => e.key === 'Enter' && phase === 'form' && handleSpin()}
            />
            {error && <p className="wheel-error">{error}</p>}
            <button
              className="wheel-btn"
              onClick={handleSpin}
              disabled={phase === 'spinning'}
            >
              {phase === 'spinning' ? t.spinning : t.spin}
            </button>
          </div>
        )}

        <p className="wheel-terms">{t.terms}</p>
      </div>
    </div>
  );
}
