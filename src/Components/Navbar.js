import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Style/Navbar.css";

const LINKS = [
  { id: "features", label: "Features" },
  { id: "templates", label: "Templates" },
  { id: "pricing", label: "Pricing", needsLogin: true },
];

function initials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function Navbar({ onSignIn, onSignUp, activeButton, user = null, onProfileClick }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  /* tighter, stronger bar once the page has scrolled a little */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* highlight the link whose section is currently in the middle of the screen */
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
          else setActiveLink((cur) => (cur === entry.target.id ? "" : cur));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* close the mobile menu with Escape */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  /* Features and Templates glide to their landing-page sections.
     Pricing opens the Sign in popup when logged out, or the pricing
     screen for signed-in users. */
  const handleLinkClick = (e, link) => {
    setMenuOpen(false);

    if (link.needsLogin && !user) {
      e.preventDefault();
      onSignIn();
      return;
    }

    if (link.id === "pricing" && user) {
      e.preventDefault();
      navigate("/pricing");
      return;
    }

    const target = document.getElementById(link.id);
    if (!target) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = target.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(top, 0), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <nav className={`floating-nav${scrolled ? " floating-nav--scrolled" : ""}`}>
      <Link
        to="/"
        className="nav-home-btn"
        aria-label="Home"
        onClick={() => {
          setMenuOpen(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path
            d="M3 11L12 3L21 11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 10V20H19V10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <div
        id="nav-menu"
        className={`nav-links${menuOpen ? " nav-links--open" : ""}`}
      >
        {LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={activeLink === link.id ? "is-active" : ""}
            onClick={(e) => handleLinkClick(e, link)}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="nav-actions">
        {user ? (
          <button
            type="button"
            className="nav-profile"
            title={user.name || user.email || "Your account"}
            aria-label="Go to dashboard"
            onClick={onProfileClick}
          >
            <span className="nav-profile-avatar">{initials(user.name)}</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              className={`nav-signin-btn${activeButton === "signin" ? " active" : ""}`}
              aria-pressed={activeButton === "signin"}
              onClick={onSignIn}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`nav-signup-btn${activeButton === "signup" ? " active" : ""}`}
              aria-pressed={activeButton === "signup"}
              onClick={onSignUp}
            >
              Sign up
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        className={`nav-burger${menuOpen ? " nav-burger--open" : ""}`}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="nav-menu"
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span />
        <span />
      </button>
    </nav>
  );
}

export default Navbar;