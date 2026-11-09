import { useEffect, useState } from 'react'
import CalculatorCard from './components/CalculatorCard'

function Icon({ name, size = 18 }) {
  const paths = {
    github: <><path d="M9 19c-4 1-4-2-6-2m12 4v-3.3a2.9 2.9 0 0 0-.8-2.2c2.7-.3 5.5-1.3 5.5-6a4.8 4.8 0 0 0-1.3-3.3 4.4 4.4 0 0 0-.1-3.2S17.2 2.7 15 4.4a10.8 10.8 0 0 0-6 0C6.8 2.7 5.7 3 5.7 3a4.4 4.4 0 0 0-.1 3.2 4.8 4.8 0 0 0-1.3 3.3c0 4.7 2.8 5.7 5.5 6a2.9 2.9 0 0 0-.8 2.2V21" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    diagonal: <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>,
    moon: <path d="M20.9 13.2A9 9 0 0 1 10.8 3.1 9 9 0 1 0 20.9 13.2Z" />,
    bolt: <path d="m13 2-9 12h7l-1 8 10-12h-7l0-8Z" />,
    keyboard: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M5 9h.01M9 9h.01M13 9h.01M17 9h.01M5 12h.01M9 12h.01M13 12h.01M17 12h.01M7 16h10" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    sparkle: <><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" /><path d="m19 17 .6 2.4L22 20l-2.4.6L19 23l-.6-2.4L16 20l2.4-.6L19 17Z" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.sparkle}</svg>
}

function initialTheme() {
  try { return localStorage.getItem('cwr-calculator-theme') === 'light' ? 'light' : 'dark' } catch { return 'dark' }
}

function App() {
  const [theme, setTheme] = useState(initialTheme)
  useEffect(() => {
    try { localStorage.setItem('cwr-calculator-theme', theme) } catch { /* private browser mode */ }
  }, [theme])

  return (
    <div className="app" data-theme={theme}>
      <div className="ambient ambient-1" aria-hidden="true" />
      <div className="ambient ambient-2" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />
      <header className="topbar page-width">
        <a href="https://github.com/CodeWithRoni" target="_blank" rel="noopener noreferrer" className="brand" aria-label="CodeWithRoni GitHub profile">
          <span className="brand-mark"><span>+</span><span>−</span><span>×</span><span>÷</span></span>
          <span className="brand-name">codewith<span>roni</span><b>.</b><small>LABS / 001</small></span>
        </a>
        <div className="topbar-end">
          <span className="topbar-badge"><span className="online-dot" /> MADE WITH REACT</span>
          <button className="theme-switch" onClick={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')} type="button" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
          </button>
          <a href="https://github.com/CodeWithRoni/Calculator" className="github-button" target="_blank" rel="noopener noreferrer"><Icon name="github" size={17} /> <span>View on GitHub</span> <Icon name="diagonal" size={14} /></a>
        </div>
      </header>

      <main className="hero page-width">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /><span>THE EVERYDAY CALCULATOR, REIMAGINED</span></div>
          <h1>Simple math.<br /><span className="gradient-text">Extraordinary</span><br />experience<span className="hero-period">.</span></h1>
          <p className="intro">Every tap should feel effortless. Meet <strong>Calculator</strong> — a thoughtfully designed calculator that makes everyday numbers feel a little more beautiful.</p>
          <div className="feature-chips">
            <span><Icon name="bolt" size={16} /> Instant results</span>
            <span><Icon name="keyboard" size={16} /> Keyboard-friendly</span>
            <span><Icon name="shield" size={16} /> Local & private</span>
          </div>
          <div className="divider-line" />
          <div className="built-for">
            <div className="mini-icon"><Icon name="sparkle" size={23} /></div>
            <div><strong>Designed to feel different.</strong><p>Clean interactions. Powerful little details. No clutter, no distractions.</p></div>
          </div>
          <div className="creator-line"><span className="creator-avatar">R</span><span>CRAFTED BY <strong>CODEWITHRONI</strong></span><span className="creator-line-tail" /></div>
        </div>
        <div className="calculator-area">
          <div className="halo halo-one" aria-hidden="true" />
          <div className="halo halo-two" aria-hidden="true" />
          <div className="floating-label float-top"><span className="floating-star">✦</span> YOUR DAILY NUMBER COMPANION</div>
          <CalculatorCard />
          <div className="below-card"><span><span className="tiny-sparkle">✳</span> Fast, focused, beautiful.</span><span>POWERED BY REACT <span className="dot-separator">•</span> VITE</span></div>
        </div>
      </main>

      <footer className="footer page-width"><span>© {new Date().getFullYear()} CodeWithRoni · Designed with intention.</span><a href="https://codewithroni.github.io/" target="_blank" rel="noopener noreferrer">Explore my portfolio <Icon name="arrow" size={16} /></a></footer>
    </div>
  )
}

export default App
