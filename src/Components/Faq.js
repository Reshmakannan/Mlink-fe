import React, { useEffect, useRef, useState } from "react";
import "../Style/Faq.css";
import Mascot from "./Mascot";

const CHEERS = [
  "Good one to start with!",
  "Yep, really free.",
  "Takes just a few minutes.",
  "Live, in real time.",
  "No strings attached.",
];

const FAQS = [
  {
    q: "What is MLink?",
    a: "MLink is a single, customizable link that houses every place your audience can find you — your shop, socials, latest release, and more — all behind one URL you can drop in your bio.",
  },
  {
    q: "Is MLink free to use?",
    a: "Yes. The free plan covers unlimited links and a basic MLink page. Paid plans add deeper analytics, custom domains, and priority support.",
  },
  {
    q: "Can I connect my own domain?",
    a: "Absolutely — point any domain you own to your MLink page from your account settings, and it goes live within minutes.",
  },
  {
    q: "How do I track clicks and visits?",
    a: "Every MLink page comes with a built-in analytics dashboard showing clicks, profile views, sales, and where your visitors are coming from in real time.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, there's no lock-in. Cancel from your billing settings whenever you like and keep access until the end of your billing period.",
  },
];

/* helper: sets the stagger delay used by the CSS reveal */
const delay = (s) => ({ "--d": `${s}s` });

/* Big "FAQ" lettering. Letters drop in from the top, then the black
   people drop in, then they keep a gentle idle animation. */
function FaqIllustration() {
  return (
    <svg
      className="mlink-faq__art"
      viewBox="0 0 480 350"
      role="img"
      aria-label="Illustration of people sitting and standing around the letters FAQ"
    >
      {/* ground */}
      <path
        className="mlink-faq__drop"
        style={delay(0.05)}
        d="M20 326 H460"
        stroke="#e9e9ec"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* ---------- letters ---------- */}
      <g
        fill="none"
        stroke="var(--mlink-red)"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g className="mlink-faq__drop" style={delay(0.1)}>
          <path d="M62 130 V300 M62 130 H138 M62 212 H122" />
        </g>
        <g className="mlink-faq__drop" style={delay(0.25)}>
          <path d="M180 300 L232 132 L284 300 M200 244 H264" />
        </g>
        <g className="mlink-faq__drop" style={delay(0.4)}>
          <ellipse cx="392" cy="214" rx="48" ry="82" />
          <path d="M404 262 L450 312" />
        </g>
      </g>

      {/* ---------- plant ---------- */}
      <g className="mlink-faq__drop" style={delay(1.15)}>
        <g className="mlink-faq__idle mlink-faq__idle--plant">
          <path
            d="M121 308 C104 298 104 276 121 266 C138 276 138 298 121 308z"
            fill="var(--mlink-red)"
          />
          <path
            d="M121 306 V278"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M108 306 H134 L131 326 H111z" fill="var(--mlink-black)" />
        </g>
      </g>

      {/* ---------- person 1: sitting on F, typing ---------- */}
      <g className="mlink-faq__drop" style={delay(0.7)}>
        <g className="mlink-faq__idle mlink-faq__idle--p1">
          <rect
            x="52"
            y="60"
            width="38"
            height="42"
            rx="12"
            fill="var(--mlink-black)"
          />
          <circle
            className="mlink-faq__head"
            cx="71"
            cy="44"
            r="13"
            fill="var(--mlink-black)"
          />
          <rect
            x="50"
            y="98"
            width="66"
            height="14"
            rx="7"
            fill="var(--mlink-black)"
          />
          <rect
            x="88"
            y="76"
            width="32"
            height="22"
            rx="3"
            fill="#fff"
            stroke="var(--mlink-black)"
            strokeWidth="3"
          />
        </g>
      </g>

      {/* chat bubble with typing dots */}
      <g className="mlink-faq__drop" style={delay(1.3)}>
        <g className="mlink-faq__idle mlink-faq__idle--bubble">
          <rect x="114" y="30" width="46" height="26" rx="8" fill="#ececef" />
          <path d="M126 56 l-5 9 l13 -9z" fill="#ececef" />
          <circle
            className="mlink-faq__dot mlink-faq__dot--1"
            cx="128"
            cy="43"
            r="3"
            fill="#a9a9b0"
          />
          <circle
            className="mlink-faq__dot mlink-faq__dot--2"
            cx="137"
            cy="43"
            r="3"
            fill="#a9a9b0"
          />
          <circle
            className="mlink-faq__dot mlink-faq__dot--3"
            cx="146"
            cy="43"
            r="3"
            fill="#a9a9b0"
          />
        </g>
      </g>

      {/* ---------- person 2: standing in front of A ---------- */}
      <g className="mlink-faq__drop" style={delay(0.85)}>
        <g className="mlink-faq__idle mlink-faq__idle--p2">
          <circle cx="236" cy="188" r="14" fill="var(--mlink-black)" />
          <rect
            x="214"
            y="206"
            width="44"
            height="66"
            rx="14"
            fill="var(--mlink-black)"
          />
          <rect
            x="220"
            y="268"
            width="14"
            height="58"
            rx="6"
            fill="var(--mlink-black)"
          />
          <rect
            x="238"
            y="268"
            width="14"
            height="58"
            rx="6"
            fill="var(--mlink-black)"
          />
          <rect
            x="250"
            y="226"
            width="11"
            height="17"
            rx="2.5"
            fill="#fff"
            stroke="var(--mlink-black)"
            strokeWidth="2"
          />
        </g>
      </g>

      {/* ---------- person 3: sitting inside Q ---------- */}
      <g className="mlink-faq__drop" style={delay(1.0)}>
        <g className="mlink-faq__idle mlink-faq__idle--p3">
          <circle cx="394" cy="190" r="13" fill="var(--mlink-black)" />
          <rect
            x="374"
            y="206"
            width="40"
            height="42"
            rx="13"
            fill="var(--mlink-black)"
          />
          <rect
            x="374"
            y="248"
            width="40"
            height="14"
            rx="7"
            fill="var(--mlink-black)"
          />
          <rect
            x="398"
            y="218"
            width="11"
            height="17"
            rx="2.5"
            fill="#fff"
            stroke="var(--mlink-black)"
            strokeWidth="2"
          />
        </g>
      </g>

      {/* ---------- person 4: sitting at the bottom of F, laptop ---------- */}
      <g className="mlink-faq__drop" style={delay(1.15)}>
        <g className="mlink-faq__idle mlink-faq__idle--p4">
          <circle
            className="mlink-faq__head"
            cx="54"
            cy="258"
            r="13"
            fill="var(--mlink-black)"
          />
          <rect
            x="36"
            y="274"
            width="38"
            height="40"
            rx="12"
            fill="var(--mlink-black)"
          />
          <rect
            x="34"
            y="312"
            width="58"
            height="14"
            rx="7"
            fill="var(--mlink-black)"
          />
          <rect
            x="68"
            y="288"
            width="32"
            height="22"
            rx="3"
            fill="#fff"
            stroke="var(--mlink-black)"
            strokeWidth="3"
          />
        </g>
      </g>

      {/* ---------- floating question mark ---------- */}
      <g className="mlink-faq__drop" style={delay(1.3)}>
        <text x="372" y="96" className="mlink-faq__qmark">
          ?
        </text>
      </g>
    </svg>
  );
}

export default function FaqSection() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section
      className={`mlink-faq${inView ? " mlink-faq--in" : ""}`}
      ref={sectionRef}
    >
      {/* soft background decoration */}
      <span
        className="mlink-faq__fade mlink-faq__glow mlink-faq__glow--left"
        style={delay(0.2)}
        aria-hidden="true"
      />
      <span
        className="mlink-faq__fade mlink-faq__glow mlink-faq__glow--right"
        style={delay(0.3)}
        aria-hidden="true"
      />
      <span
        className="mlink-faq__fade mlink-faq__dots mlink-faq__dots--tr"
        style={delay(0.6)}
        aria-hidden="true"
      />
      <span
        className="mlink-faq__fade mlink-faq__dots mlink-faq__dots--bl"
        style={delay(0.7)}
        aria-hidden="true"
      />
      <span
        className="mlink-faq__fade mlink-faq__shape mlink-faq__shape--ring"
        style={delay(0.9)}
        aria-hidden="true"
      />
      <span
        className="mlink-faq__fade mlink-faq__shape mlink-faq__shape--plus"
        style={delay(1.0)}
        aria-hidden="true"
      />
      <span
        className="mlink-faq__fade mlink-faq__shape mlink-faq__shape--dot"
        style={delay(1.1)}
        aria-hidden="true"
      />
      <span
        className="mlink-faq__fade mlink-faq__shape mlink-faq__shape--dot-black"
        style={delay(1.2)}
        aria-hidden="true"
      />

      <div className="mlink-faq__inner">
        <div className="mlink-faq__visual">
          <FaqIllustration />
        </div>

        <div className="mlink-faq__content">
          <h2 className="mlink-faq__headline mlink-faq__rv" style={delay(0.2)}>
            Frequently asked questions
          </h2>
          <p className="mlink-faq__sub mlink-faq__rv" style={delay(0.35)}>
            Everything you need to know before you bring your links home to one
            page.
          </p>

          <div className="mlink-faq__list">
            {FAQS.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  className={`mlink-faq__item mlink-faq__rv${isOpen ? " mlink-faq__item--open" : ""}`}
                  style={delay(0.5 + index * 0.12)}
                  key={item.q}
                >
                  <button
                    type="button"
                    className="mlink-faq__question"
                    aria-expanded={isOpen}
                    aria-controls={`mlink-faq-panel-${index}`}
                    onClick={() => toggle(index)}
                  >
                    <span>{item.q}</span>
                    <span
                      className={`mlink-faq__icon${isOpen ? " mlink-faq__icon--open" : ""}`}
                      aria-hidden="true"
                    >
                      <span className="mlink-faq__icon-bar mlink-faq__icon-bar--v" />
                      <span className="mlink-faq__icon-bar mlink-faq__icon-bar--h" />
                    </span>
                  </button>

                  <div
                    className={`mlink-faq__panel${isOpen ? " mlink-faq__panel--open" : ""}`}
                    id={`mlink-faq-panel-${index}`}
                    role="region"
                  >
                    <div className="mlink-faq__panel-inner">
                      <p className="mlink-faq__answer">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mlink-faq__helper mlink-faq__rv" style={delay(1.2)}>
            <Mascot
              className="mlink-faq__mascot"
              mood={openIndex === -1 ? "wow" : "happy"}
            />
            <p className="mlink-faq__bubble" key={openIndex}>
              {openIndex === -1
                ? "Pick a question and I'll cheer you on!"
                : CHEERS[openIndex]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
