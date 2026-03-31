import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchLinks } from './sheets';
import fallbackData from './links.json';
import { icons } from './Icons';
import './App.css';

const SOCIAL_PLATFORMS = ['instagram', 'tiktok', 'facebook', 'youtube', 'twitter', 'x', 'linkedin', 'pinterest', 'threads'];

const LANGS = ['en', 'bg', 'ru'];

const UI_STRINGS = {
  en: { tagline: 'Elegant. Natural. Unique.', wheelCta: 'Spin & Win a Prize!' },
  bg: { tagline: 'Елегантно. Естествено. Уникално.', wheelCta: 'Завърти & Спечели награда!' },
  ru: { tagline: 'Элегантно. Натурально. Уникально.', wheelCta: 'Крути & Выиграй приз!' },
};

function getInitialLang() {
  const saved = localStorage.getItem('lang');
  if (saved && LANGS.includes(saved)) return saved;
  const nav = navigator.language?.slice(0, 2);
  if (nav === 'bg') return 'bg';
  if (nav === 'ru') return 'ru';
  return 'en';
}

function App() {
  const [links, setLinks] = useState(null);
  const [lang, setLang] = useState(getInitialLang);
  const [ripple, setRipple] = useState(null);

  useEffect(() => {
    fetchLinks()
      .then(setLinks)
      .catch(() => {
        setLinks(
          fallbackData.links.map((l) => ({
            ...l,
            title_en: l.title,
            title_bg: l.title,
            title_ru: l.title,
          }))
        );
      });
  }, []);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  const handleClick = (url, index, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ index, x, y });
    setTimeout(() => {
      setRipple(null);
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 300);
  };

  const getTitle = (link) => link[`title_${lang}`] || link.title_en || link.title;

  const socials = links
    ? links.filter((l) => SOCIAL_PLATFORMS.includes(l.icon))
    : [];

  return (
    <div className="app">
      <div className="container">
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

        <header className="profile">
          <img
            src="/marbella-logo.png"
            alt="Marbella Decor & Design"
            className="logo"
          />
          <p className="tagline">{UI_STRINGS[lang].tagline}</p>
        </header>

        <nav className="links">
          {!links && (
            <div className="loading">
              <div className="loading-spinner" />
            </div>
          )}
          {links &&
            links.map((link, i) => (
              <button
                key={i}
                className={`link-card${link.featured ? ' featured' : ''}`}
                onClick={(e) => handleClick(link.url, i, e)}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <span className="link-icon">
                  {icons[link.icon] || icons.globe}
                </span>
                <span className="link-title">{getTitle(link)}</span>
                <span className="link-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </span>
                {ripple && ripple.index === i && (
                  <span
                    className="ripple"
                    style={{ left: ripple.x, top: ripple.y }}
                  />
                )}
              </button>
            ))}
        </nav>

        <Link to="/wheel" className="wheel-promo">
          <span className="wheel-promo-icon">
            {icons.gift}
          </span>
          <span className="wheel-promo-text">{UI_STRINGS[lang].wheelCta}</span>
          <span className="link-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </span>
        </Link>

        <footer className="footer">
          {socials.length > 0 && (
            <div className="social-row">
              {socials.map((s) => (
                <a
                  key={s.icon}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label={s.icon}
                >
                  {icons[s.icon]}
                </a>
              ))}
            </div>
          )}
          <p className="copyright">
            &copy; {new Date().getFullYear()} Marbella Decor &amp; Design
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
