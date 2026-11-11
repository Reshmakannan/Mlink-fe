import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../Style/Footer.css";
import "../Style/FooterCartoon.css";
import Mascot from "./Mascot";
import { popBurst } from "./Cartoon";

const LOGO = "MLink";

/* drifting stars / dots / rings behind the content */
const BITS = [
  { k: "star", l: "5%", t: "12%", s: 20, f: 0 },
  { k: "dot", l: "22%", t: "78%", s: 10, f: -2 },
  { k: "ring", l: "47%", t: "9%", s: 18, f: -4 },
  { k: "star", l: "63%", t: "84%", s: 14, f: -1 },
  { k: "dot", l: "88%", t: "22%", s: 12, f: -3 },
  { k: "ring", l: "93%", t: "70%", s: 16, f: -5 },
];

const rv = (s) => ({ "--d": `${s}s` });

export default function Footer() {
  const footerRef = useRef(null);
  const timer = useRef(0);
  const [inView, setInView] = useState(false);
  const [done, setDone] = useState(false);

  /* play the entrance once, when the footer scrolls into view */
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    popBurst(e);
    e.currentTarget.reset();
    setDone(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 4000);
  };

  const backToTop = () => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className={`mlink-footer${inView ? " mlink-footer--in" : ""}`}
    >
      <div className="mlink-footer__bar">
        {/* background confetti */}
        {BITS.map((b, i) => (
          <span
            key={i}
            className={`ft-bit ft-bit--${b.k}`}
            style={{ left: b.l, top: b.t, "--s": `${b.s}px`, "--f": `${b.f}s` }}
            aria-hidden="true"
          />
        ))}

        {/* Mlinky sits on the top edge of the bar */}
        <div className="ft-pal" aria-hidden="true">
          <p className="ft-pal__bubble" key={done ? "thanks" : "bye"}>
            {done ? "Welcome aboard!" : "See you soon!"}
          </p>
          <Mascot mood={done ? "wow" : "happy"} />
        </div>

        <div className="mlink-footer__top">
          <div className="mlink-footer__brand ft-rv" style={rv(0.35)}>
            <Link to="/" className="mlink-footer__home" aria-label="MLink home">
              <p className="mlink-footer__logo">
                <span className="ft-sr">{LOGO}</span>
                {Array.from(LOGO).map((ch, i) => (
                  <span
                    key={i}
                    className="ft-letter"
                    aria-hidden="true"
                    style={{ "--i": i }}
                  >
                    {ch}
                  </span>
                ))}
              </p>
            </Link>
            <p className="mlink-footer__tagline">
              One link for everywhere you show up.
            </p>

            <div className="mlink-footer__social">
              <a
                href="#instagram"
                aria-label="MLink on Instagram"
                style={{ "--i": 0 }}
                onClick={popBurst}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.2"
                    cy="6.8"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>
              <a
                href="#tiktok"
                aria-label="MLink on TikTok"
                style={{ "--i": 1 }}
                onClick={popBurst}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M15 3c.4 2.4 2 4 4.5 4.2V10c-1.6 0-3.1-.5-4.5-1.4V15a5.5 5.5 0 1 1-4-5.3v2.7a2.8 2.8 0 1 0 2 2.7V3h2z" />
                </svg>
              </a>
              <a
                href="#x"
                aria-label="MLink on X"
                style={{ "--i": 2 }}
                onClick={popBurst}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M4 4l16 16M20 4L4 20" />
                </svg>
              </a>
            </div>
          </div>

          <nav className="mlink-footer__col ft-rv" style={rv(0.5)}>
            <p className="mlink-footer__heading">Explore</p>
            <Link to="/services">Services &amp; pricing</Link>
            <Link to="/pricing">Pricing</Link>
          </nav>

          <nav className="mlink-footer__col ft-rv" style={rv(0.65)}>
            <p className="mlink-footer__heading">Company</p>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact us</Link>
          </nav>

          <nav className="mlink-footer__col ft-rv" style={rv(0.72)}>
            <p className="mlink-footer__heading">Policies</p>
            <Link to="/terms">Terms and conditions</Link>
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/cancellation-refund">Cancellation &amp; refund</Link>
            <Link to="/shipping-delivery">Shipping &amp; delivery</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </nav>

          <div
            className="mlink-footer__col mlink-footer__newsletter ft-rv"
            style={rv(0.8)}
          >
            <p className="mlink-footer__heading">Stay in the loop</p>
            <form className="mlink-footer__form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="you@example.com"
                aria-label="Email address"
                required
              />
              <button type="submit" className={done ? "is-done" : ""}>
                {done ? "Subscribed!" : "Subscribe"}
              </button>
            </form>
            <p className="ft-thanks" role="status">
              {done ? "You're on the list." : ""}
            </p>
          </div>
        </div>

        {/* divider with a paper plane that flies across once */}
        <div className="mlink-footer__divider" aria-hidden="true">
          <span className="ft-plane">
            <svg viewBox="0 0 32 32">
              <path
                d="M3 15L29 4 22 27l-7-8z"
                fill="#fff"
                stroke="#120404"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path
                d="M15 19l14-15"
                fill="none"
                stroke="#120404"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path
                d="M15 19l-1 7 4-5"
                fill="#ffd23f"
                stroke="#120404"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <div className="mlink-footer__bottom ft-rv" style={rv(1)}>
          <p>&copy; {new Date().getFullYear()} MLink. All rights reserved.</p>
          <div className="ft-end">
            <div className="mlink-footer__legal">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/cancellation-refund">Refunds</Link>
            </div>
            <a
              href="https://mpeoples.in/"
              target="_blank"
              rel="noreferrer"
              className="ft-developed"
            >
              Developed by mpeoples.in
            </a>
            <button
              type="button"
              className="ft-top"
              onClick={backToTop}
              aria-label="Back to top"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
