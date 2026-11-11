import React, { useEffect, useState } from "react";
import "../Style/Hero.css";
import Mascot from "./Mascot";
import { popBurst } from "./Cartoon";

const RIBBON_A = [
  "Pages",
  "Profiles",
  "Products",
  "Portfolios",
  "Shops",
  "Playlists",
  "Videos",
  "Bookings",
];
const RIBBON_B = [
  "One link",
  "Every platform",
  "Your brand",
  "Live in minutes",
  "Share anywhere",
  "Made to stand out",
];

const WORD = "everything";

const LINES = [
  "Hi, I'm Mlinky!",
  "One link for everything you make.",
  "Psst... it's free to start.",
  "Go on, click me!",
];

const INK = "#120404";

/* Cartoon stickers: thick ink outline + hard shadow, one per thing you can put on an MLink */
const STICKERS = [
  {
    k: "heart",
    r: "-10deg",
    svg: (
      <svg viewBox="0 0 64 64">
        <path
          d="M32 55C10 39 6 25 14 16c7-7 15-3 18 3 3-6 11-10 18-3 8 9 4 23-18 39z"
          fill="#ff4d5e"
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M17 23c2-4 6-5 9-3"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    k: "star",
    r: "12deg",
    svg: (
      <svg viewBox="0 0 64 64">
        <path
          d="M32 6l7.5 17 18.5 1.8-14 12.4 4.2 18.2L32 46l-16.2 9.4L20 37.2 6 24.8 24.5 23z"
          fill="#ffd23f"
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    k: "play",
    r: "-8deg",
    svg: (
      <svg viewBox="0 0 64 64">
        <rect
          x="6"
          y="12"
          width="52"
          height="40"
          rx="12"
          fill="#fff"
          stroke={INK}
          strokeWidth="4"
        />
        <path
          d="M26 22l17 10-17 10z"
          fill="#d3141f"
          stroke={INK}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    k: "bag",
    r: "9deg",
    svg: (
      <svg viewBox="0 0 64 64">
        <path
          d="M23 24v-4a9 9 0 0118 0v4"
          fill="none"
          stroke={INK}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M13 24h38l3 31H10z"
          fill="#fff"
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <circle cx="25" cy="38" r="2.6" fill={INK} />
        <circle cx="39" cy="38" r="2.6" fill={INK} />
        <path
          d="M26 45q6 6 12 0"
          fill="none"
          stroke={INK}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    k: "link",
    r: "-12deg",
    svg: (
      <svg viewBox="0 0 64 64" fill="none" strokeLinecap="round">
        <rect
          x="4"
          y="22"
          width="32"
          height="20"
          rx="10"
          stroke={INK}
          strokeWidth="10"
        />
        <rect
          x="28"
          y="22"
          width="32"
          height="20"
          rx="10"
          stroke={INK}
          strokeWidth="10"
        />
        <rect
          x="4"
          y="22"
          width="32"
          height="20"
          rx="10"
          stroke="#fff"
          strokeWidth="4"
        />
        <rect
          x="28"
          y="22"
          width="32"
          height="20"
          rx="10"
          stroke="#ffd23f"
          strokeWidth="4"
        />
      </svg>
    ),
  },
  {
    k: "note",
    r: "10deg",
    svg: (
      <svg viewBox="0 0 64 64">
        <path
          d="M24 46V14l28-6v32"
          fill="none"
          stroke={INK}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="17"
          cy="47"
          r="8.5"
          fill="#fff"
          stroke={INK}
          strokeWidth="4"
        />
        <circle
          cx="45"
          cy="41"
          r="8.5"
          fill="#ffd23f"
          stroke={INK}
          strokeWidth="4"
        />
      </svg>
    ),
  },
];

// The list is repeated four times so the loop never shows a gap, even on
// very wide screens. The CSS moves the track by exactly half its width.
function Ribbon({ items, variant }) {
  const half = [...items, ...items];
  const row = [...half, ...half];
  return (
    <div className={`hero-ribbon hero-ribbon--${variant}`}>
      <div className="hero-ribbon-track">
        {row.map((text, i) => (
          <span className="hero-ribbon-item" key={i}>
            {text}
            <span className="hero-ribbon-star">&#10022;</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Hero({ onOpenAuth }) {
  const [line, setLine] = useState(0);

  /* Mlinky changes what he says every few seconds */
  useEffect(() => {
    const id = setInterval(() => setLine((l) => (l + 1) % LINES.length), 3600);
    return () => clearInterval(id);
  }, []);

  const text = line < LINES.length ? LINES[line] : "Boing!";

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-ring hero-ring--1" />
        <span className="hero-ring hero-ring--2" />
        <span className="hero-ring hero-ring--3" />
        <span className="hero-ring hero-ring--4" />
        <span className="hero-glow" />
      </div>

      {/* floating cartoon stickers */}
      {STICKERS.map((s, i) => (
        <span
          key={s.k}
          className={`hs hs--${s.k}`}
          style={{ "--r": s.r, "--d": `${i * 0.12}s`, "--f": `${-i * 0.9}s` }}
          aria-hidden="true"
        >
          {s.svg}
        </span>
      ))}

      <div className="hero-badge" aria-hidden="true">
        <svg className="hero-badge-svg" viewBox="0 0 200 200">
          <defs>
            <path
              id="hero-badge-circle"
              d="M 100,100 m -76,0 a 76,76 0 1,1 152,0 a 76,76 0 1,1 -152,0"
            />
          </defs>
          <text>
            <textPath
              href="#hero-badge-circle"
              textLength="468"
              lengthAdjust="spacing"
            >
              ONE LINK • EVERYTHING YOU CREATE •
            </textPath>
          </text>
        </svg>
        <span className="hero-badge-core">&#8599;</span>
      </div>

      <div className="hero-inner">
        <span className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          MLink
        </span>

        <h1 className="hero-title">
          One link for{" "}
          <em className="hero-wave">
            <span className="hero-sr">{WORD}</span>
            {Array.from(WORD).map((ch, i) => (
              <span key={i} aria-hidden="true" style={{ "--i": i }}>
                {ch}
              </span>
            ))}
          </em>{" "}
          you create
        </h1>

        <p className="hero-subtitle">
          Pages, profiles and products, all in a single beautifully simple
          place.
        </p>

        <div className="hero-actions">
          <button
            type="button"
            className="hero-btn hero-btn-primary"
            onClick={(e) => {
              popBurst(e);
              onOpenAuth("signup");
            }}
          >
            Get Started
            <span className="hero-btn-arrow" aria-hidden="true">
              &rarr;
            </span>
          </button>

          <a href="#how-it-works" className="hero-btn hero-btn-secondary">
            How It Works
          </a>
        </div>

        <div className="hero-url" aria-hidden="true">
          <span className="hero-url-base">mlink.com/</span>
          <span className="hero-url-name">yourname</span>
          <span className="hero-url-caret" />
        </div>
      </div>

      {/* Mlinky stands on the top ribbon and talks */}
      <div className="hero-pal" aria-hidden="true">
        <p className="hero-pal__bubble" key={line}>
          {text}
        </p>
        <Mascot onClick={() => setLine(LINES.length)} />
      </div>

      <div className="hero-ribbons" aria-hidden="true">
        <Ribbon items={RIBBON_A} variant="a" />
        <Ribbon items={RIBBON_B} variant="b" />
      </div>
    </section>
  );
}

export default Hero;
