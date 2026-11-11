import React, { useEffect, useRef, useState } from "react";
import "../Style/Analytic.css";
import Mascot from "./Mascot";

/* Counts a number up once the section is visible. */
function Count({ to, active, delay = 0, suffix = "" }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return undefined;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return undefined;
    }
    let raf = 0;
    const timer = setTimeout(() => {
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min((now - t0) / 1500, 1);
        setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [active, to, delay]);

  return (
    <>
      {value.toLocaleString("en-US")}
      {suffix}
    </>
  );
}

const features = [
  "Clicks, views and visits in one live dashboard",
  "Spot your top-performing links at a glance",
  "Edit your MLink anytime — changes go live instantly",
];

// onOpenAuth: (mode: "signin" | "signup") => void — same shared handler
// used by Navbar, Hero, CreateCustomize, and LinkShareSection.
export default function AnalyticsSection({ onOpenAuth }) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [leftIn, setLeftIn] = useState(false);
  const [rightIn, setRightIn] = useState(false);

  // Each side animates as it scrolls into view and resets once it has fully
  // left the screen, so the animation replays on every visit.
  useEffect(() => {
    const watch = (node, setter) => {
      if (!node) return () => {};
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.intersectionRatio >= 0.2) setter(true);
          else if (entry.intersectionRatio === 0) setter(false);
        },
        { threshold: [0, 0.2] },
      );
      observer.observe(node);
      return () => observer.disconnect();
    };
    const stopLeft = watch(leftRef.current, setLeftIn);
    const stopRight = watch(rightRef.current, setRightIn);
    return () => {
      stopLeft();
      stopRight();
    };
  }, []);

  return (
    <section className="mlink-analytics">
      <div className="mlink-analytics__inner">
        {/* ---------------- LEFT: stat cards ---------------- */}
        <div
          className={`mlink-analytics__left${leftIn ? " is-in" : ""}`}
          ref={leftRef}
        >
          <div className="mlink-analytics__cards">
            <div className="an-peek" aria-hidden="true">
              <Mascot mood="wow" hop={false} />
            </div>
            <div
              className="mlink-stat mlink-stat--clicks mlink-zoom"
              style={{ "--d": "0s" }}
            >
              <span className="mlink-stat__badge">&uarr; 18%</span>
              <svg
                className="mlink-stat__chart"
                viewBox="0 0 240 60"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="mlinkSpark" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0"
                      stopColor="currentColor"
                      stopOpacity="0.35"
                    />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  className="mlink-stat__area"
                  d="M0,45 L30,33 L60,39 L90,18 L120,27 L150,9 L180,21 L210,6 L240,15 L240,60 L0,60 Z"
                  fill="url(#mlinkSpark)"
                />
                <polyline
                  className="mlink-stat__line"
                  pathLength="1"
                  points="0,45 30,33 60,39 90,18 120,27 150,9 180,21 210,6 240,15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mlink-stat__figure">
                <Count to={12480} active={leftIn} delay={300} />
              </p>
              <p className="mlink-stat__label">Clicks</p>
            </div>

            <div
              className="mlink-stat mlink-stat--views mlink-zoom"
              style={{ "--d": "0.14s" }}
            >
              <svg
                className="mlink-stat__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <p className="mlink-stat__figure">
                <Count to={3120} active={leftIn} delay={440} />
              </p>
              <p className="mlink-stat__label">Profile views</p>
            </div>

            <div
              className="mlink-stat mlink-stat--links mlink-zoom"
              style={{ "--d": "0.28s" }}
            >
              <svg
                className="mlink-stat__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 15L15 9M10 6.5L11.2 5.3C12.6 3.9 14.9 3.9 16.3 5.3C17.7 6.7 17.7 9 16.3 10.4L15.1 11.6M14 17.5L12.8 18.7C11.4 20.1 9.1 20.1 7.7 18.7C6.3 17.3 6.3 15 7.7 13.6L8.9 12.4" />
              </svg>
              <p className="mlink-stat__figure">
                <Count to={12} active={leftIn} delay={580} />
              </p>
              <p className="mlink-stat__label">Active links</p>
            </div>

            <div
              className="mlink-stat mlink-stat--top mlink-zoom"
              style={{ "--d": "0.42s" }}
            >
              <p className="mlink-stat__place">Top link &middot; Portfolio</p>
              <p className="mlink-stat__figure">
                <Count to={42} active={leftIn} delay={720} suffix="%" />
              </p>
              <p className="mlink-stat__label">Of all clicks</p>
              <span className="mlink-stat__bar" aria-hidden="true">
                <i style={{ "--w": "42%" }} />
              </span>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT: copy ---------------- */}
        <div
          className={`mlink-analytics__right${rightIn ? " is-in" : ""}`}
          ref={rightRef}
        >
          <div className="mlink-analytics__copy">
            <span
              className="mlink-analytics__eyebrow mlink-zoom"
              style={{ "--d": "0.1s" }}
            >
              <i />
              Analytics
            </span>

            <h2
              className="mlink-analytics__headline mlink-zoom"
              style={{ "--d": "0.22s" }}
            >
              Track what&rsquo;s working
              <br />
              and do more of it
            </h2>

            <p
              className="mlink-analytics__sub mlink-zoom"
              style={{ "--d": "0.34s" }}
            >
              See every click, view and sale in one place. Watch which links
              convert, where your audience is, and update your MLink on the fly
              to keep them coming back.
            </p>

            <ul className="mlink-analytics__list">
              {features.map((text, i) => (
                <li
                  className="mlink-zoom"
                  style={{ "--d": `${0.46 + i * 0.12}s` }}
                  key={text}
                >
                  <span className="mlink-analytics__check" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12.5l4.5 4.5L19 7.5"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="mlink-analytics__cta mlink-zoom"
              style={{ "--d": "0.86s" }}
              onClick={() => onOpenAuth("signup")}
            >
              Get started for free
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
