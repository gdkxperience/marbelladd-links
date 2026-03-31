import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WheelPage.css';

// 10 prizes matching the physical wheel — clockwise from top
const PRIZES = [
  {
    bg: 'Безплатна\nдоставка маса',
    en: 'Free Table\nDelivery',
    ru: 'Бесплатная\nдоставка стола',
  },
  {
    bg: '15% отстъпка\nмаса',
    en: '15% Off\nTable',
    ru: 'Скидка 15%\nна стол',
  },
  {
    bg: 'Томбола\nMarbella маса',
    en: 'Raffle\nMarbella Table',
    ru: 'Розыгрыш\nстола Marbella',
  },
  {
    bg: 'Дизайн проект\nконсултация',
    en: 'Design Project\nConsultation',
    ru: 'Дизайн-проект\nконсультация',
  },
  {
    bg: 'Опитай пак',
    en: 'Try Again',
    ru: 'Попробуй снова',
    isRetry: true,
  },
  {
    bg: 'Marbella gift\ncoaster',
    en: 'Marbella Gift\nCoaster',
    ru: 'Подарок Marbella\nподставка',
  },
  {
    bg: 'Отстъпка 10%\nаксесоари',
    en: '10% Off\nAccessories',
    ru: 'Скидка 10%\nаксессуары',
  },
  {
    bg: '25% отстъпка\nаксесоари',
    en: '25% Off\nAccessories',
    ru: 'Скидка 25%\nаксессуары',
  },
  {
    bg: 'Отстъпка 5%\nаксесоари',
    en: '5% Off\nAccessories',
    ru: 'Скидка 5%\nаксессуары',
  },
  {
    bg: '200€ подарък\nмаса',
    en: '€200 Gift\nToward a Table',
    ru: 'Подарок 200€\nна стол',
  },
];

const NUM_SEGMENTS = PRIZES.length;
const SEGMENT_ANGLE = 360 / NUM_SEGMENTS;

const LANGS = ['en', 'bg', 'ru'];

const UI = {
  en: {
    title: 'Spin & Win',
    subtitle: 'Try your luck and win an exclusive prize!',
    emailPlaceholder: 'Enter your email',
    spin: 'Spin the Wheel',
    spinning: 'Spinning...',
    congrats: 'Congratulations!',
    tryAgainMsg: 'Better luck next time!',
    emailSent: 'A coupon has been sent to your email!',
    alreadyPlayed: 'You have already played with this email.',
    invalidEmail: 'Please enter a valid email address.',
    backToLinks: 'Back to Links',
    terms: 'One spin per email. Show the coupon at our store to redeem.',
    spinAgain: 'Try Again',
  },
  bg: {
    title: 'Завърти & Спечели',
    subtitle: 'Опитай късмета си и спечели ексклузивна награда!',
    emailPlaceholder: 'Въведи имейл',
    spin: 'Завърти колелото',
    spinning: 'Върти се...',
    congrats: 'Поздравления!',
    tryAgainMsg: 'Повече късмет следващия път!',
    emailSent: 'Купон беше изпратен на имейла ти!',
    alreadyPlayed: 'Вече си играл с този имейл.',
    invalidEmail: 'Моля, въведи валиден имейл адрес.',
    backToLinks: 'Обратно към линкове',
    terms: 'Едно завъртане на имейл. Покажи купона в магазина, за да го използваш.',
    spinAgain: 'Опитай пак',
  },
  ru: {
    title: 'Крути & Выиграй',
    subtitle: 'Испытай удачу и выиграй эксклюзивный приз!',
    emailPlaceholder: 'Введите email',
    spin: 'Крутить колесо',
    spinning: 'Крутится...',
    congrats: 'Поздравляем!',
    tryAgainMsg: 'Повезёт в следующий раз!',
    emailSent: 'Купон отправлен на ваш email!',
    alreadyPlayed: 'Вы уже играли с этим email.',
    invalidEmail: 'Пожалуйста, введите действительный email.',
    backToLinks: 'Назад к ссылкам',
    terms: 'Одно вращение на email. Покажите купон в магазине для активации.',
    spinAgain: 'Попробовать снова',
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

function drawWheel(canvas, lang) {
  const size = 320; // logical size
  const ctx = canvas.getContext('2d');
  const center = size / 2;
  const radius = center - 6;
  const segRad = (SEGMENT_ANGLE * Math.PI) / 180;

  ctx.clearRect(0, 0, size, size);

  // Draw segments
  PRIZES.forEach((prize, i) => {
    const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
    const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);

    // Alternating dark segments
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? '#1a1a1a' : '#2a2a2a';
    ctx.fill();

    // Segment divider lines
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(
      center + radius * Math.cos(startAngle),
      center + radius * Math.sin(startAngle)
    );
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Text — drawn radially, reading from rim toward center (like the physical wheel)
    const midAngle = startAngle + segRad / 2;
    ctx.save();
    ctx.translate(center, center);
    // Rotate so "up" on the canvas points to mid-angle, then turn 90° so text reads along radius
    ctx.rotate(midAngle + Math.PI / 2);

    const label = prize[lang] || prize.en;
    const lines = label.split('\n');
    const fontSize = 8.5;
    ctx.font = `600 ${fontSize}px "Inter", "Montserrat", sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lineHeight = fontSize * 1.4;
    // Position text centered between hub and rim
    const textCenterDist = radius * 0.55;
    // Max width constrained by segment arc width at the text distance
    const maxWidth = 2 * textCenterDist * Math.sin(segRad / 2) * 0.85;

    lines.forEach((line, li) => {
      const offset = (li - (lines.length - 1) / 2) * lineHeight;
      // x goes along radius direction, y is 0 (centered)
      ctx.fillText(line, offset, -textCenterDist, maxWidth);
    });

    ctx.restore();
  });

  // Peg dots on segment borders
  for (let i = 0; i < NUM_SEGMENTS; i++) {
    const angle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
    const pegR = radius - 8;
    ctx.beginPath();
    ctx.arc(
      center + pegR * Math.cos(angle),
      center + pegR * Math.sin(angle),
      3.5, 0, Math.PI * 2
    );
    ctx.fillStyle = '#111111';
    ctx.fill();
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Outer ring (white, like the physical wheel)
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#f7f6f4';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Center hub
  ctx.beginPath();
  ctx.arc(center, center, radius * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = '#333333';
  ctx.fill();
  ctx.strokeStyle = '#555555';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Center bolt
  ctx.beginPath();
  ctx.arc(center, center, radius * 0.05, 0, Math.PI * 2);
  ctx.fillStyle = '#777777';
  ctx.fill();
}

export default function WheelPage() {
  const [lang, setLang] = useState(getInitialLang);
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState('form'); // form | spinning | won | retry
  const [prize, setPrize] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const t = UI[lang];

  const initCanvas = (currentLang) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const size = 320;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawWheel(canvas, currentLang);
  };

  useEffect(() => {
    initCanvas(lang);
  }, [lang]);

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

    // Pick random prize (excluding "Try Again" for email coupon, but still landable)
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const won = PRIZES[prizeIndex];

    // Calculate spin to land on the correct segment
    const targetAngle = 360 - (prizeIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const jitter = (Math.random() - 0.5) * SEGMENT_ANGLE * 0.6;
    const totalRotation = rotation + fullSpins * 360 + targetAngle + jitter;

    setRotation(totalRotation);

    setTimeout(() => {
      setPrize(won);
      if (won.isRetry) {
        setPhase('retry');
      } else {
        setPhase('won');
        markEmailPlayed(email);
        const prizeText = won[lang] || won.en;
        sendSpinData(email, prizeText.replace('\n', ' ')).catch(() => {});
      }
    }, 4500);
  };

  const handleRetry = () => {
    setPhase('form');
    setPrize(null);
  };

  const sendSpinData = async (userEmail, prizeName) => {
    try {
      await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, prize: prizeName }),
      });
    } catch {
      // API is optional
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
              <span className="prize-value">{(prize[lang] || prize.en).replace('\n', ' ')}</span>
              <span className="prize-email-sent">{t.emailSent}</span>
            </div>
          </div>
        )}

        {/* Try again result */}
        {phase === 'retry' && (
          <div className="prize-reveal">
            <div className="prize-badge retry-badge">
              <span className="prize-value">{t.tryAgainMsg}</span>
              <button className="wheel-btn retry-btn" onClick={handleRetry}>
                {t.spinAgain}
              </button>
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
