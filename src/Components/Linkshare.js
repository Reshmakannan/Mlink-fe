import React, { useEffect, useRef } from "react";
import "../Style/Linkshare.css";

/* ------------------------------------------------------------------
   ADD YOUR PICTURES HERE
   Import three screenshots and drop them into DEFAULT_SCREENS.
   Best size: portrait, roughly 1080 x 2300 px (any phone screenshot works).

     import shotLeft from "../assets/phone-left.png";
     import shotCenter from "../assets/phone-center.png";
     import shotRight from "../assets/phone-right.png";
     const DEFAULT_SCREENS = { left: shotLeft, center: shotCenter, right: shotRight };

   Leave a slot as null to show the built-in placeholder screen.
   You can also pass them as a prop: <LinkShareSection screens={{ center: pic }} />
------------------------------------------------------------------- */
const DEFAULT_SCREENS = { left: null, center: null, right: null };

function Placeholder({ variant }) {
  return (
    <div className={`lksh-ph lksh-ph--${variant}`}>
      <span className="lksh-ph__avatar" />
      <span className="lksh-ph__line lksh-ph__line--a" />
      <span className="lksh-ph__line lksh-ph__line--b" />
      <span className="lksh-ph__btn lksh-ph__btn--solid" />
      <span className="lksh-ph__btn" />
      <span className="lksh-ph__btn" />
    </div>
  );
}

function Phone({ variant, src }) {
  return (
    <div className={`lksh-phone lksh-phone--${variant}`}>
      <span className="lksh-phone__btn lksh-phone__btn--l1" />
      <span className="lksh-phone__btn lksh-phone__btn--l2" />
      <span className="lksh-phone__btn lksh-phone__btn--r" />
      <div className="lksh-phone__screen">
        {src ? (
          <img src={src} alt="" draggable="false" loading="lazy" />
        ) : (
          <Placeholder variant={variant} />
        )}
        <span className="lksh-phone__island" />
        <span className="lksh-phone__glare" />
      </div>
    </div>
  );
}

// onOpenAuth: (mode: "signin" | "signup") => void — same shared handler
// used by Navbar, Hero, and CreateCustomize.
export default function LinkShareSection({
  onOpenAuth,
  screens = DEFAULT_SCREENS,
}) {
  const sectionRef = useRef(null);

  // Plays the entrance when the section scrolls into view and resets once it
  // has fully left the screen, so it replays on the next visit.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("lksh-in");
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.3) {
          node.classList.add("lksh-in");
        } else if (entry.intersectionRatio === 0) {
          node.classList.remove("lksh-in");
        }
      },
      { threshold: [0, 0.3] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const s = { ...DEFAULT_SCREENS, ...screens };

  return (
    <section className="lksh-section" ref={sectionRef}>
      <div className="lksh-section__inner">
        <div className="lksh-section__copy">
          <h2 className="lksh-section__headline">
            Share your MLink
            <br />
            anywhere you like!
          </h2>
          <p className="lksh-section__sub">
            Add your unique MLink URL to every platform and place you find your
            audience. Then use your QR code to bring your offline traffic back
            to your link in bio.
          </p>
          <button
            type="button"
            className="lksh-section__cta"
            onClick={() => onOpenAuth("signup")}
          >
            Get started for free
          </button>
        </div>

        <div className="lksh-section__stage" aria-hidden="true">
          <Phone variant="left" src={s.left} />
          <Phone variant="center" src={s.center} />
          <Phone variant="right" src={s.right} />
          <span className="ls-toast ls-toast--like" style={{ "--t": "1.9s" }}>
            <b>&hearts;</b> 2.4k likes
          </span>
          <span className="ls-toast ls-toast--follow" style={{ "--t": "2.3s" }}>
            <b>+1</b> new follower
          </span>
          <span className="ls-toast ls-toast--click" style={{ "--t": "2.7s" }}>
            <b>&#8599;</b> 12 clicks just now
          </span>
        </div>
      </div>
    </section>
  );
}