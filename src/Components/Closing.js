import React, { useEffect, useRef, useState } from "react";
import "../Style/Closing.css";
import Login from "../Pages/Login";
import Mascot from "./Mascot";
import { popBurst } from "./Cartoon";

/* ------------------------------------------------------------------
   ADD YOUR PICTURES HERE
------------------------------------------------------------------- */
const DEFAULT_IMAGES = [];

/* ------------------------------------------------------------------
   ARC LAYOUT
------------------------------------------------------------------- */
const K = 1.6;
const SPACING = 0.585;
const T_END = (156 * Math.PI) / 180;

const TILES = (() => {
  const steps = 2400;
  const dt = (2 * T_END) / steps;

  const speed = (t) => Math.sqrt(K * K * Math.cos(t) ** 2 + Math.sin(t) ** 2);

  const cum = [0];

  for (let i = 1; i <= steps; i += 1) {
    const t = -T_END + (i - 0.5) * dt;
    cum.push(cum[i - 1] + speed(t) * dt);
  }

  const length = cum[steps];
  const count = Math.round(length / SPACING) + 1;

  const tiles = [];

  for (let j = 0; j < count; j += 1) {
    const target = (length * j) / (count - 1);

    let lo = 0;

    while (lo < steps - 1 && cum[lo + 1] < target) {
      lo += 1;
    }

    const span = cum[lo + 1] - cum[lo] || 1;

    const t = -T_END + (lo + (target - cum[lo]) / span) * dt;

    tiles.push({
      sx: Math.sin(t).toFixed(4),
      cy: Math.cos(t).toFixed(4),
      rot: `${(
        (Math.atan2(Math.sin(t), K * Math.cos(t)) * 180) /
        Math.PI
      ).toFixed(2)}deg`,
      delay: (0.1 + (Math.abs(t) / T_END) * 0.6).toFixed(2),
      low: Math.abs(t) > (100 * Math.PI) / 180,
    });
  }

  return tiles;
})();

export default function ClosingCtaSection({ images = DEFAULT_IMAGES }) {
  const sectionRef = useRef(null);

  const [inView, setInView] = useState(false);

  /* Login modal */
  const [showLogin, setShowLogin] = useState(false);

  /* ---------------------------------------------------------
     Section animation
  --------------------------------------------------------- */
  useEffect(() => {
    const el = sectionRef.current;

    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.2) {
          setInView(true);
        } else if (entry.intersectionRatio === 0) {
          setInView(false);
        }
      },
      {
        threshold: [0, 0.2],
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  /* ---------------------------------------------------------
     Open Login / Signup modal
  --------------------------------------------------------- */
  const handleExplorePlans = () => {
    setShowLogin(true);

    /* Prevent background scrolling */
    document.body.style.overflow = "hidden";
  };

  /* ---------------------------------------------------------
     Close Login / Signup modal
  --------------------------------------------------------- */
  const handleCloseLogin = () => {
    setShowLogin(false);

    /* Restore scrolling */
    document.body.style.overflow = "";
  };

  /* Restore body scroll when component unmounts */
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <section
        className={`mlink-closing${inView ? " mlink-closing--in" : ""}`}
        ref={sectionRef}
      >
        <div className="mlink-closing__glow" aria-hidden="true" />

        <div
          className="mlink-closing__wave mlink-closing__wave--top"
          aria-hidden="true"
        />

        <div
          className="mlink-closing__wave mlink-closing__wave--bottom"
          aria-hidden="true"
        />

        {/* ---------------------------------------------------
            IMAGE ARC
        --------------------------------------------------- */}
        <div className="mlink-closing__arc" aria-hidden="true">
          {TILES.map((tile, i) => (
            <div
              key={i}
              className={`mlink-tile mlink-tile--v${i % 4}${
                tile.low ? " mlink-tile--low" : ""
              }`}
              style={{
                "--sx": tile.sx,
                "--cy": tile.cy,
                "--rot": tile.rot,
                "--delay": `${tile.delay}s`,
              }}
            >
              {images[i] ? (
                <img src={images[i]} alt="" draggable="false" loading="lazy" />
              ) : (
                <span className="mlink-tile__ph" />
              )}
            </div>
          ))}
        </div>

        {/* ---------------------------------------------------
            CONTENT
        --------------------------------------------------- */}
        <div className="mlink-closing__inner">
          <Mascot className="mlink-closing__mascot" />
          <p className="mlink-closing__eyebrow">MLink</p>

          <span className="mlink-closing__rule" aria-hidden="true" />

          <h2 className="mlink-closing__headline">
            The fast, elegant way
            <br />
            to own your link in bio.
          </h2>

          {/* EXPLORE ALL PLANS */}
          <button
            type="button"
            className="mlink-closing__cta"
            onClick={(e) => {
              popBurst(e);
              handleExplorePlans();
            }}
          >
            Explore all plans
            <span className="mlink-closing__cta-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </section>

      {/* =====================================================
          LOGIN / SIGNUP MODAL
      ===================================================== */}
      {showLogin && (
        <div
          className="auth-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseLogin();
            }
          }}
        >
          <div className="auth-modal-box">
            <button
              type="button"
              className="auth-modal-close"
              onClick={handleCloseLogin}
              aria-label="Close login"
            >
              ×
            </button>

            <Login embedded initialMode="signup" onClose={handleCloseLogin} />
          </div>
        </div>
      )}
    </>
  );
}
