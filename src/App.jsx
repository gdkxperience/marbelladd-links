import { useState } from 'react';
import data from './links.json';
import { icons } from './Icons';
import './App.css';

function App() {
  const [ripple, setRipple] = useState(null);

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

  return (
    <div className="app">
      <div className="marble-bg" />

      <div className="container">
        <header className="profile">
          <div className="avatar-ring">
            <div className="avatar">
              <span className="avatar-text">MDD</span>
            </div>
          </div>
          <h1 className="brand-name">{data.profile.name}</h1>
          <p className="tagline">{data.profile.tagline}</p>
        </header>

        <nav className="links">
          {data.links.map((link, i) => (
            <button
              key={i}
              className={`link-card${link.featured ? ' featured' : ''}`}
              onClick={(e) => handleClick(link.url, i, e)}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span className="link-icon">{icons[link.icon]}</span>
              <span className="link-title">{link.title}</span>
              <span className="link-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        <footer className="footer">
          <div className="social-row">
            {Object.entries(data.socials).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label={platform}
              >
                {icons[platform]}
              </a>
            ))}
          </div>
          <p className="copyright">
            &copy; {new Date().getFullYear()} Marbella Decor &amp; Design
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
