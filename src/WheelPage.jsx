import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    namePlaceholder: 'Full Name *',
    emailPlaceholder: 'Email *',
    phonePlaceholder: 'Phone Number *',
    companyPlaceholder: 'Company',
    spin: 'Spin the Wheel',
    spinning: 'Spinning...',
    congrats: 'Congratulations!',
    youWon: 'You won',
    tryAgainMsg: 'Better luck next time!',
    emailSent: 'A coupon has been sent to your email.',
    alreadyPlayed: 'You have already played with this email.',
    invalidEmail: 'Please enter a valid email address.',
    missingFields: 'Please fill in all required fields.',
    invalidPhone: 'Please enter a valid phone number.',
    backToLinks: 'Back to Links',
    terms: 'One spin per email. Show the coupon at our store to redeem.',
    spinAgain: 'Try Again',
    step1: 'Check your email for the coupon',
    step2: 'Print it or show it on your phone',
    step3: 'Visit our store to redeem your prize',
    close: 'Got it!',
  },
  bg: {
    title: 'Завърти & Спечели',
    subtitle: 'Опитай късмета си и спечели ексклузивна награда!',
    namePlaceholder: 'Име и Фамилия *',
    emailPlaceholder: 'Имейл *',
    phonePlaceholder: 'Телефонен номер *',
    companyPlaceholder: 'Фирма',
    spin: 'Завърти колелото',
    spinning: 'Върти се...',
    congrats: 'Поздравления!',
    youWon: 'Спечели',
    tryAgainMsg: 'Повече късмет следващия път!',
    emailSent: 'Купон беше изпратен на имейла ти.',
    alreadyPlayed: 'Вече си играл с този имейл.',
    invalidEmail: 'Моля, въведи валиден имейл адрес.',
    missingFields: 'Моля, попълни всички задължителни полета.',
    invalidPhone: 'Моля, въведи валиден телефонен номер.',
    backToLinks: 'Обратно към линкове',
    terms: 'Едно завъртане на имейл. Покажи купона в магазина, за да го използваш.',
    spinAgain: 'Опитай пак',
    step1: 'Провери имейла си за купона',
    step2: 'Принтирай го или покажи на телефона',
    step3: 'Посети магазина ни, за да вземеш наградата',
    close: 'Разбрах!',
  },
  ru: {
    title: 'Крути & Выиграй',
    subtitle: 'Испытай удачу и выиграй эксклюзивный приз!',
    namePlaceholder: 'Полное имя *',
    emailPlaceholder: 'Email *',
    phonePlaceholder: 'Номер телефона *',
    companyPlaceholder: 'Компания',
    spin: 'Крутить колесо',
    spinning: 'Крутится...',
    congrats: 'Поздравляем!',
    youWon: 'Вы выиграли',
    tryAgainMsg: 'Повезёт в следующий раз!',
    emailSent: 'Купон отправлен на ваш email.',
    alreadyPlayed: 'Вы уже играли с этим email.',
    invalidEmail: 'Пожалуйста, введите действительный email.',
    missingFields: 'Пожалуйста, заполните все обязательные поля.',
    invalidPhone: 'Пожалуйста, введите действительный номер телефона.',
    backToLinks: 'Назад к ссылкам',
    terms: 'Одно вращение на email. Покажите купон в магазине для активации.',
    spinAgain: 'Попробовать снова',
    step1: 'Проверьте почту — купон уже там',
    step2: 'Распечатайте или покажите на телефоне',
    step3: 'Посетите наш магазин, чтобы забрать приз',
    close: 'Понятно!',
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

function isValidPhone(phone) {
  // At least 6 digits, allows +, spaces, dashes, parens
  return /^[+]?[\d\s\-()]{6,}$/.test(phone.trim());
}

function drawWheel(canvas, lang, size) {
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

    // Text — runs along the radius, reading from rim toward center (like the physical wheel)
    const midAngle = startAngle + segRad / 2;
    ctx.save();
    ctx.translate(center, center);
    // Rotate so +X points outward along this segment, then flip so text reads rim→center
    ctx.rotate(midAngle + Math.PI);

    const label = prize[lang] || prize.en;
    const lines = label.split('\n');
    const fontSize = Math.max(10, size * 0.0375);
    ctx.font = `600 ${fontSize}px "Inter", sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lineSpacing = fontSize * 1.3;
    const textDist = radius * 0.54;
    // Max text length constrained to fit between hub and rim
    const maxLen = radius * 0.7;

    lines.forEach((line, li) => {
      // Each line is offset perpendicular to the radius (across the segment width)
      const perpOffset = (li - (lines.length - 1) / 2) * lineSpacing;
      ctx.fillText(line, -textDist, perpOffset, maxLen);
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [phase, setPhase] = useState('form'); // form | spinning | won | retry | done
  const [prize, setPrize] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const t = UI[lang];

  const getWheelSize = () => {
    const w = window.innerWidth;
    if (w >= 1024) return 640;
    if (w >= 768) return 500;
    if (w <= 360) return 280;
    return 320;
  };

  const initCanvas = (currentLang) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const size = getWheelSize();
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawWheel(canvas, currentLang, size);
  };

  useEffect(() => {
    initCanvas(lang);
    const onResize = () => initCanvas(lang);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [lang]);

  const handleSpin = async () => {
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError(t.missingFields);
      return;
    }

    if (!isValidEmail(email)) {
      setError(t.invalidEmail);
      return;
    }

    if (!isValidPhone(phone)) {
      setError(t.invalidPhone);
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
        sendSpinData({ name, email, phone, company, prize: prizeText.replace('\n', ' ') }).catch(() => {});
      }
    }, 4500);
  };

  const handleRetry = () => {
    setPhase('form');
    setPrize(null);
  };

  const handleNewSpin = () => {
    setPhase('form');
    setPrize(null);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setError('');
  };

  const sendSpinData = async (data) => {
    try {
      await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // API is optional
    }
  };

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  return createPortal(
    <div className="wheel-page">
      {/* Top bar */}
      <div className="wheel-topbar">
        <Link to="/" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          {t.backToLinks}
        </Link>
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
      </div>

      <div className="wheel-layout">
        {/* Left / Top: Wheel */}
        <div className="wheel-col-left">
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
        </div>

        {/* Right / Bottom: Form */}
        <div className="wheel-col-right">
          <header className="wheel-header">
            <h1 className="wheel-title">{t.title}</h1>
            <p className="wheel-subtitle">{t.subtitle}</p>
          </header>

          {(phase === 'form' || phase === 'spinning') && (
            <div className="wheel-form">
              <input
                type="text"
                className="wheel-input"
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={phase === 'spinning'}
              />
              <input
                type="email"
                className="wheel-input"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={phase === 'spinning'}
              />
              <input
                type="tel"
                className="wheel-input"
                placeholder={t.phonePlaceholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={phase === 'spinning'}
              />
              <input
                type="text"
                className="wheel-input"
                placeholder={t.companyPlaceholder}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={phase === 'spinning'}
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

          {phase === 'done' && (
            <div className="wheel-form">
              <button className="wheel-btn" onClick={handleNewSpin}>
                {t.spinAgain}
              </button>
            </div>
          )}

          <p className="wheel-terms">{t.terms}</p>
        </div>
      </div>

      {/* Prize popup overlay */}
      {phase === 'won' && prize && (
        <div className="modal-overlay" onClick={() => setPhase('done')}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <span className="modal-congrats">{t.congrats}</span>
            <div className="modal-prize-card">
              <span className="modal-prize-label">{t.youWon}</span>
              <span className="modal-prize-value">{(prize[lang] || prize.en).replace('\n', ' ')}</span>
            </div>
            <div className="modal-steps">
              <div className="modal-step"><span className="modal-step-num">1</span>{t.step1}</div>
              <div className="modal-step"><span className="modal-step-num">2</span>{t.step2}</div>
              <div className="modal-step"><span className="modal-step-num">3</span>{t.step3}</div>
            </div>
            <span className="modal-email-note">{t.emailSent}</span>
            <button className="wheel-btn modal-btn" onClick={() => setPhase('done')}>
              {t.close}
            </button>
            <button className="wheel-btn-secondary modal-btn" onClick={handleNewSpin}>
              {t.spinAgain}
            </button>
          </div>
        </div>
      )}

      {/* Try again popup overlay */}
      {phase === 'retry' && (
        <div className="modal-overlay" onClick={handleRetry}>
          <div className="modal retry-modal" onClick={(e) => e.stopPropagation()}>
            <div className="retry-icon">&#8635;</div>
            <span className="retry-heading">{t.tryAgainMsg}</span>
            <p className="retry-sub">{t.terms}</p>
            <button className="wheel-btn modal-btn" onClick={handleRetry}>
              {t.spinAgain}
            </button>
          </div>
        </div>
      )}

    </div>,
    document.body
  );
}
