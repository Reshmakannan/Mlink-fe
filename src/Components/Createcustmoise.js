import { useLayoutEffect, useRef } from "react";
import "../Style/Createcustomise.css";

const steps = [
  {
    label: "Claim your link",
    detail: "Pick a name, lock it in. No waiting, no approvals.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13.5 6.5L17.5 10.5M4 20L4.7 16.9C4.86 16.16 5.24 15.48 5.79 14.93L15.06 5.66C15.84 4.88 17.1 4.88 17.88 5.66L18.34 6.12C19.12 6.9 19.12 8.16 18.34 8.94L9.07 18.21C8.52 18.76 7.84 19.14 7.1 19.3L4 20Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Add your links",
    detail: "Drop in every profile, shop, and project you want found.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9 15L15 9M10 6.5L11.2 5.3C12.6 3.9 14.9 3.9 16.3 5.3C17.7 6.7 17.7 9 16.3 10.4L15.1 11.6M14 17.5L12.8 18.7C11.4 20.1 9.1 20.1 7.7 18.7C6.3 17.3 6.3 15 7.7 13.6L8.9 12.4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Make it yours",
    detail: "Colors, layout, and type that actually feel like you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 8V12L14.5 14.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

/* Soft blue leaf backdrop (pure SVG, no external image needed).
   To use a real photo instead, set --crcz-leaf-photo in the CSS file. */
function Leaves() {
  return (
    <svg
      className="crcz-leaves"
      viewBox="0 0 1200 420"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <g id="crcz-leaf">
          <path d="M0 0C30-70 150-95 260-25C160 55 50 70 0 0Z" />
          <path
            d="M0 0C90-6 170-14 250-25"
            fill="none"
            stroke="rgba(255,255,255,.4)"
            strokeWidth="2"
          />
        </g>
      </defs>
      <use href="#crcz-leaf" fill="#a9cdf5" transform="translate(-30 330) rotate(-40) scale(1.6)" />
      <use href="#crcz-leaf" fill="#8dbbef" transform="translate(150 -20) rotate(60) scale(1.4)" />
      <use href="#crcz-leaf" fill="#c4dcf8" transform="translate(420 410) rotate(-110) scale(1.7)" />
      <use href="#crcz-leaf" fill="#9fc5f2" transform="translate(610 -30) rotate(75) scale(1.8)" />
      <use href="#crcz-leaf" fill="#86b6ee" transform="translate(830 420) rotate(-70) scale(1.5)" />
      <use href="#crcz-leaf" fill="#b5d4f6" transform="translate(1000 -10) rotate(110) scale(1.6)" />
      <use href="#crcz-leaf" fill="#97c1f0" transform="translate(1230 360) rotate(-150) scale(1.7)" />
      <use
        href="#crcz-leaf"
        fill="#d2e5fa"
        opacity=".7"
        transform="translate(300 150) rotate(20) scale(1)"
      />
    </svg>
  );
}

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

// onOpenAuth: (mode: "signin" | "signup") => void — passed down from
// App.js via Homepage.js, same handler Navbar and Hero already use.
export default function CreateCustomize({ onOpenAuth }) {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  // Scroll-scrubbed progress (0 → 1) written to a CSS variable.
  // Order in CSS: title eases in → bars draw top-to-bottom →
  // circles rise bottom-to-top → text fades in.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      section.style.setProperty("--crcz-p", "1");
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = card.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const start = vh * 1.0; // card top here -> progress 0
      const end = vh * 0.22; // card top here -> progress 1
      const p = clamp((start - rect.top) / (start - end), 0, 1);
      section.style.setProperty("--crcz-p", p.toFixed(4));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="crcz-section" id="features" ref={sectionRef}>
      <div className="crcz-top">
        <h2 className="crcz-heading">
          Create and customize your link
          <span className="crcz-heading-accent"> in minutes</span>
        </h2>
        <p className="crcz-sub">
          One page for everything you make, sell, and share — built and
          styled faster than it takes to write a bio.
        </p>
      </div>

      <div className="crcz-card" ref={cardRef}>
        <div className="crcz-stage" aria-hidden="true">
          <Leaves />
          <div className="crcz-stage-shade" />
        </div>

        <div className="crcz-grid">
          {steps.map((step, i) => (
            <article className="crcz-col" style={{ "--i": i }} key={step.label}>
              <div className="crcz-bar-wrap">
                <span className="crcz-bar" aria-hidden="true" />
              </div>

              <span className="crcz-circle">{step.icon}</span>

              <h3 className="crcz-step-label">{step.label}</h3>
              <p className="crcz-step-detail">{step.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="crcz-cta-row">
        <button
          type="button"
          className="crcz-cta-primary"
          onClick={() => onOpenAuth("signup")}
        >
          Start building free
        </button>
      </div>
    </section>
  );
}