import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Style/BrandLogo.css";

let logoCount = 0;

/**
 * MLink logo.
 *
 * Default: built-in SVG mark, so nothing breaks if you have no file yet.
 * To use your real logo file:
 *     import logoImg from '../Assets/mlink-logo.png';
 *     <BrandLogo src={logoImg} />
 *
 * Props:
 *   src       optional image URL / import
 *   size      mark height in px (default 36)
 *   withText  show the "MLink" wordmark next to the mark (default true)
 *   tone      "dark" | "light"  (wordmark colour)
 */
export default function BrandLogo({
  src,
  size = 36,
  withText = true,
  tone = "dark",
  className = "",
}) {
  // every instance gets its own gradient id, so a hidden logo can never break a visible one
  const [gradId] = useState(() => `mlinkGrad${++logoCount}`);

  return (
    <Link
      to="/"
      className={`brand-logo brand-logo--${tone} ${className}`.trim()}
      aria-label="MLink home"
      title="Go to home"
    >
      {src ? (
        <img
          className="brand-logo__img"
          src={src}
          alt="MLink logo"
          style={{ height: size }}
        />
      ) : (
        <svg
          className="brand-logo__mark"
          viewBox="0 0 48 48"
          width={size}
          height={size}
          role="img"
          aria-label="MLink logo"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#b01818" />
              <stop offset="1" stopColor="#5e0808" />
            </linearGradient>
          </defs>
          <rect width="48" height="48" rx="14" fill={`url(#${gradId})`} />
          <path
            d="M11 33V15l6.5 9 6.5-9v18"
            fill="none"
            stroke="#fff"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30 19h4a5 5 0 0 1 0 10h-4"
            fill="none"
            stroke="#fff"
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>
      )}
      {withText && <span className="brand-logo__text">MLink</span>}
    </Link>
  );
}
