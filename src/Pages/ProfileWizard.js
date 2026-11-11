import React, { useEffect, useState } from "react";
import {
  getMyProfile,
  getTemplateAccess,
  checkUsername,
  saveDetails,
  saveSocialLinks,
  saveCategory,
  uploadPhoto,
  uploadGalleryPhotos,
  deleteGalleryPhoto,
  uploadCoverPhoto,
  deleteCoverPhoto,
  photoSrc,
} from "../Api/Profileapi";
import BrandLogo from "../Components/BrandLogo";
import "../Style/ProfileWizard.css";

/* ------------------------------------------------------------------ */
/* Validation rules                                                    */
/* ------------------------------------------------------------------ */

// Letters (any language) and single spaces only — no digits or symbols.
const NAME_RE = /^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const PHONE_RE = /^[0-9]{10,15}$/;
const TELEGRAM_RE = /^[A-Za-z0-9_]{5,32}$/;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PHOTO = 2 * 1024 * 1024;

const STEPS = ["Personal details", "Social links", "Professional", "Category"];

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

// Official brand glyphs (Simple Icons, 24x24 viewBox).
const BRAND_PATHS = {
  instagram:
    "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  facebook:
    "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  tiktok:
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  whatsapp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  telegram:
    "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
};

const SOCIAL_FIELDS = [
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "instagram.com/yourname",
    kind: "url",
    hosts: ["instagram.com"],
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholder: "linkedin.com/in/yourname",
    kind: "url",
    hosts: ["linkedin.com"],
  },
  {
    key: "facebook",
    label: "Facebook",
    placeholder: "facebook.com/yourname",
    kind: "url",
    hosts: ["facebook.com", "fb.com"],
  },
  {
    key: "youtube",
    label: "YouTube",
    placeholder: "youtube.com/@yourchannel",
    kind: "url",
    hosts: ["youtube.com", "youtu.be"],
  },
  {
    key: "x",
    label: "X / Twitter",
    placeholder: "x.com/yourname",
    kind: "url",
    hosts: ["x.com", "twitter.com"],
  },
  {
    key: "github",
    label: "GitHub",
    placeholder: "github.com/yourname",
    kind: "url",
    hosts: ["github.com"],
  },
  {
    key: "tiktok",
    label: "TikTok",
    placeholder: "tiktok.com/@yourname",
    kind: "url",
    hosts: ["tiktok.com"],
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    placeholder: "919876543210",
    kind: "phone",
    hint: "Digits only, with country code.",
  },
  {
    key: "telegram",
    label: "Telegram",
    placeholder: "@yourusername",
    kind: "handle",
    hint: "Your Telegram username or t.me link.",
  },
];

// Keep in sync with CATEGORIES in backend/src/config/profileRules.js
const CATEGORIES = [
  { key: "fashion", label: "Fashion", hint: "Designers, stylists, models" },
  { key: "doctor", label: "Doctor", hint: "Clinics and health professionals" },
  { key: "business", label: "Business", hint: "Brands, shops and services" },
  { key: "technology", label: "Technology", hint: "Developers, startups, IT" },
  { key: "education", label: "Education", hint: "Teachers and coaches" },
  { key: "creator", label: "Creator", hint: "Influencers and artists" },
  {
    key: "photography",
    label: "Photography",
    hint: "Photographers and studios",
  },
  { key: "fitness", label: "Fitness", hint: "Trainers, gyms, wellness" },
  { key: "music", label: "Music", hint: "Artists, bands, DJs" },
  { key: "other", label: "Other", hint: "Anything else" },
];

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Education",
  "Finance",
  "Marketing & Advertising",
  "Design & Creative",
  "Media & Entertainment",
  "Retail & E-commerce",
  "Real Estate",
  "Hospitality",
  "Manufacturing",
  "Consulting",
  "Legal",
  "Non-profit",
];

const EMPTY_DETAILS = {
  full_name: "",
  username: "",
  bio: "",
  location: "",
  email: "",
  phone: "",
  website: "",
  job_title: "",
  company: "",
  industry: "",
  professional_description: "",
};

const EMPTY_SOCIALS = {
  instagram: "",
  linkedin: "",
  facebook: "",
  youtube: "",
  x: "",
  github: "",
  tiktok: "",
  whatsapp: "",
  telegram: "",
  other_label: "",
  other_url: "",
};

// These platforms are not in the backend's allowed list, so they are saved
// as "other" links with a fixed label and recognised again by that label.
const OTHER_BACKED = {
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function readUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function initials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

// Input filters: invalid characters never make it into the field.
const cleanName = (v) =>
  v
    .replace(/[^\p{L}\p{M} ]/gu, "")
    .replace(/^ +/, "")
    .replace(/ {2,}/g, " ");
const cleanDigits = (v) => v.replace(/\D/g, "").slice(0, 15);
const cleanUsername = (v) => v.replace(/\s/g, "");

const isUsernameValid = (u) => u.length >= 3 && u.length <= 30 && !/\s/.test(u);

function parseUrl(raw) {
  const value = (raw || "").trim();
  if (!value || /\s/.test(value)) return null;
  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`,
    );
    return /\.[A-Za-z]{2,}$/.test(url.hostname) ? url : null;
  } catch {
    return null;
  }
}

function hostMatches(url, hosts) {
  const h = url.hostname.replace(/^www\./i, "").toLowerCase();
  return hosts.some((x) => h === x || h.endsWith(`.${x}`));
}

function stripTelegram(v) {
  return v
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?(t\.me|telegram\.me)\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "");
}

// Client-side checks are for friendly feedback only; the server re-validates everything.
function validateBasics(d) {
  const e = {};
  const name = d.full_name.trim();
  if (name.length < 2 || name.length > 60) {
    e.full_name = "Enter your name (2–60 letters).";
  } else if (!NAME_RE.test(name)) {
    e.full_name = "Name can only contain letters and spaces.";
  }
  if (!isUsernameValid(d.username.trim())) {
    e.username = "Use 3–30 characters with no spaces.";
  }
  if (d.bio.length > 300) e.bio = "Bio must be 300 characters or fewer.";
  if (d.email.trim() && !EMAIL_RE.test(d.email.trim())) {
    e.email = "Enter a valid email address, e.g. name@example.com.";
  }
  if (d.phone.trim() && !PHONE_RE.test(d.phone.trim())) {
    e.phone = "Enter 10–15 digits, numbers only.";
  }
  if (d.website.trim() && !parseUrl(d.website)) {
    e.website = "Enter a valid website, e.g. yourwebsite.com.";
  }
  return e;
}

function validateProfessional(d) {
  const e = {};
  if (d.professional_description.length > 300) {
    e.professional_description = "Description must be 300 characters or fewer.";
  }
  return e;
}

function validateSocial(field, raw) {
  const v = raw.trim();
  if (!v) return "";
  if (field.kind === "phone") {
    return PHONE_RE.test(v)
      ? ""
      : "Enter 10–15 digits including the country code.";
  }
  if (field.kind === "handle") {
    return TELEGRAM_RE.test(stripTelegram(v))
      ? ""
      : "Enter a valid Telegram username (5–32 letters, numbers or underscores).";
  }
  const url = parseUrl(v);
  return url && hostMatches(url, field.hosts)
    ? ""
    : `Enter a valid ${field.label} link.`;
}

function buildDetailsPayload(d) {
  const trimmed = Object.fromEntries(
    Object.entries(d).map(([k, v]) => [k, v.trim()]),
  );
  return { ...trimmed, full_name: trimmed.full_name.replace(/\s+/g, " ") };
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const UI_ICONS = {
  user: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  at: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
    </>
  ),
  mail: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  briefcase: (
    <>
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  ),
  building: (
    <>
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </>
  ),
  tag: (
    <>
      <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.42 0l8.58-8.58a1 1 0 0 0 0-1.42L12 2Z" />
      <path d="M7 7h.01" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),
  grid: (
    <>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </>
  ),
  image: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </>
  ),
  chevron: <polyline points="15 18 9 12 15 6" />,
};

function Icon({ name, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {UI_ICONS[name]}
    </svg>
  );
}

function BrandIcon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={BRAND_PATHS[name]} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Small UI building blocks                                            */
/* ------------------------------------------------------------------ */

function Section({ icon, title, children }) {
  return (
    <div className="mlink-wizard__section">
      <h3 className="mlink-wizard__section-title">
        <span className="mlink-wizard__section-icon">
          <Icon name={icon} />
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({
  id,
  label,
  optional,
  icon,
  error,
  hint,
  counter,
  full,
  multiline,
  children,
}) {
  return (
    <div
      className={`mlink-wizard__field${full ? " mlink-wizard__field--full" : ""}`}
    >
      <label htmlFor={id}>
        {label}
        {optional && <em>Optional</em>}
      </label>
      <div
        className={`mlink-wizard__control${multiline ? " mlink-wizard__control--multi" : ""}${
          error ? " mlink-wizard__control--error" : ""
        }`}
      >
        {icon && <Icon name={icon} className="mlink-wizard__control-icon" />}
        {children}
      </div>
      <div className="mlink-wizard__meta">
        {error ? (
          <p className="mlink-wizard__field-error" role="alert">
            {error}
          </p>
        ) : (
          <p className="mlink-wizard__hint">{hint}</p>
        )}
        {counter && <p className="mlink-wizard__counter">{counter}</p>}
      </div>
    </div>
  );
}

function SocialField({ field, value, error, onChange }) {
  const id = `pw-${field.key}`;
  return (
    <div className="mlink-wizard__field">
      <label htmlFor={id}>{field.label}</label>
      <div className="mlink-wizard__social">
        <span
          className={`mlink-wizard__tile mlink-wizard__tile--${field.key}`}
          aria-hidden="true"
        >
          <BrandIcon name={field.key} />
        </span>
        <div
          className={`mlink-wizard__control${error ? " mlink-wizard__control--error" : ""}`}
        >
          <input
            id={id}
            type={field.kind === "phone" ? "tel" : "text"}
            inputMode={field.kind === "phone" ? "numeric" : undefined}
            maxLength={field.kind === "phone" ? 15 : 255}
            placeholder={field.placeholder}
            autoComplete="off"
            spellCheck="false"
            value={value}
            onChange={(e) =>
              onChange(
                field.kind === "phone"
                  ? cleanDigits(e.target.value)
                  : e.target.value,
              )
            }
            aria-invalid={!!error}
          />
        </div>
      </div>
      <div className="mlink-wizard__meta">
        {error ? (
          <p className="mlink-wizard__field-error" role="alert">
            {error}
          </p>
        ) : (
          <p className="mlink-wizard__hint">{field.hint}</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Wizard                                                              */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Completion checklist + live preview                                 */
/* ------------------------------------------------------------------ */

function completionItems({
  details,
  hasPhoto,
  socials,
  category,
  galleryCount,
}) {
  const hasSocial =
    SOCIAL_FIELDS.some((f) => (socials[f.key] || "").trim()) ||
    !!socials.other_url.trim();
  return [
    { label: "Add your name", done: details.full_name.trim().length >= 2 },
    {
      label: "Pick a username",
      done: isUsernameValid(details.username.trim()),
    },
    { label: "Upload a photo", done: hasPhoto },
    { label: "Write a short bio", done: details.bio.trim().length > 0 },
    {
      label: "Add a way to contact you",
      done: !!(details.email.trim() || details.phone.trim()),
    },
    { label: "Add a social link", done: hasSocial },
    { label: "Add your job title", done: !!details.job_title.trim() },
    { label: "Choose a category", done: !!category },
    { label: "Add gallery photos", done: galleryCount > 0 },
  ];
}

function LivePreview({ details, avatar, socials, categoryLabel, items }) {
  const done = items.filter((i) => i.done).length;
  const percent = Math.round((done / items.length) * 100);
  const next = items.find((i) => !i.done);
  const activeSocials = SOCIAL_FIELDS.filter((f) =>
    (socials[f.key] || "").trim(),
  );
  const subtitle = [details.job_title.trim(), details.company.trim()]
    .filter(Boolean)
    .join(" · ");

  return (
    <aside className="mlink-wizard__aside" aria-label="Live preview">
      <p className="mlink-wizard__aside-eyebrow">Live preview</p>

      <div className="mlink-wizard__preview">
        <div className="mlink-wizard__preview-banner" />
        <div className="mlink-wizard__preview-avatar">
          {avatar ? (
            <img src={avatar} alt="" />
          ) : (
            <span>{initials(details.full_name)}</span>
          )}
        </div>
        <p className="mlink-wizard__preview-name">
          {details.full_name.trim() || "Your name"}
        </p>
        <p className="mlink-wizard__preview-user">
          mlink.com/{details.username.trim() || "username"}
        </p>
        {categoryLabel && (
          <span className="mlink-wizard__preview-chip">{categoryLabel}</span>
        )}
        {subtitle && <p className="mlink-wizard__preview-role">{subtitle}</p>}
        {details.bio.trim() && (
          <p className="mlink-wizard__preview-bio">{details.bio.trim()}</p>
        )}
        {details.location.trim() && (
          <p className="mlink-wizard__preview-loc">{details.location.trim()}</p>
        )}
        {activeSocials.length > 0 && (
          <div className="mlink-wizard__preview-icons">
            {activeSocials.map((f) => (
              <span
                key={f.key}
                className={`mlink-wizard__tile mlink-wizard__tile--${f.key} mlink-wizard__tile--mini`}
                aria-hidden="true"
              >
                <BrandIcon name={f.key} />
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mlink-wizard__complete">
        <div className="mlink-wizard__complete-head">
          <span>Profile strength</span>
          <strong>{percent}%</strong>
        </div>
        <div
          className="mlink-wizard__complete-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label="Profile completion"
        >
          <span style={{ width: `${percent}%` }} />
        </div>
        <p className="mlink-wizard__complete-next">
          {next
            ? `Next: ${next.label}`
            : "Looking great. Your profile is complete."}
        </p>
      </div>
    </aside>
  );
}

export default function ProfileWizard({ onBack, onFinish }) {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [socialErrors, setSocialErrors] = useState({});

  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoLoadError, setPhotoLoadError] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [gallery, setGallery] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [removingGalleryId, setRemovingGalleryId] = useState(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [planTier, setPlanTier] = useState("free");
  const [removingCover, setRemovingCover] = useState(false);
  const [usernameState, setUsernameState] = useState("idle");
  const [socials, setSocials] = useState(EMPTY_SOCIALS);
  const [socialLimit, setSocialLimit] = useState(10);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const urls = galleryFiles.map((file) => URL.createObjectURL(file));
    setGalleryPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [galleryFiles]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview("");
      return undefined;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  // Load an existing profile (or prefill from the logged-in account).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [{ profile }, access] = await Promise.all([
          getMyProfile(),
          getTemplateAccess(),
        ]);
        if (cancelled) return;
        setSocialLimit(access.social_links_limit);
        setPlanTier(access.plan_tier || "free");
        if (profile) {
          setDetails({
            full_name: cleanName(profile.full_name || ""),
            username: profile.username || "",
            bio: profile.bio || "",
            location: profile.location || "",
            email: profile.email || "",
            phone: cleanDigits(profile.phone || ""),
            website: profile.website || "",
            job_title: profile.job_title || "",
            company: profile.company || "",
            industry: profile.industry || "",
            professional_description: profile.professional_description || "",
          });
          setPhotoUrl(profile.photo_url || "");
          setPhotoLoadError(false);
          setGallery(Array.isArray(profile.gallery) ? profile.gallery : []);
          setCoverUrl(profile.cover_url || "");
          setCategory(profile.category || "");
          const s = { ...EMPTY_SOCIALS };
          (profile.socials || []).forEach((l) => {
            const label = (l.label || "").trim().toLowerCase();
            const backedKey = Object.keys(OTHER_BACKED).find(
              (k) => OTHER_BACKED[k].toLowerCase() === label,
            );
            if (l.platform === "other" && backedKey) {
              if (backedKey === "whatsapp")
                s.whatsapp = cleanDigits(l.url || "");
              else if (backedKey === "telegram")
                s.telegram = stripTelegram(l.url || "");
              else s[backedKey] = l.url;
            } else if (l.platform === "other") {
              if (!s.other_url) {
                s.other_label = l.label || "";
                s.other_url = l.url;
              }
            } else if (l.platform === "whatsapp") {
              s.whatsapp = cleanDigits(l.url || "");
            } else if (l.platform === "telegram") {
              s.telegram = stripTelegram(l.url || "");
            } else if (l.platform in s) {
              s[l.platform] = l.url;
            }
          });
          setSocials(s);
        } else {
          const user = readUser();
          setDetails((d) => ({
            ...d,
            full_name: cleanName((user && user.name) || ""),
            email: (user && user.email) || "",
          }));
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Local preview for a newly chosen photo.
  useEffect(() => {
    if (!photoFile) {
      setPreview("");
      return undefined;
    }
    const url = URL.createObjectURL(photoFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  // Debounced live username check.
  useEffect(() => {
    const u = details.username.trim();
    if (!u) {
      setUsernameState("idle");
      return undefined;
    }
    if (!isUsernameValid(u)) {
      setUsernameState("invalid");
      return undefined;
    }
    setUsernameState("checking");
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const r = await checkUsername(u);
        if (!cancelled) setUsernameState(r.available ? "available" : "taken");
      } catch {
        if (!cancelled) setUsernameState("idle");
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [details.username]);

  function setField(name, value) {
    setDetails((d) => ({ ...d, [name]: value }));
    setFieldErrors((e) => ({ ...e, [name]: undefined }));
  }

  function setSocial(name, value) {
    setSocials((s) => ({ ...s, [name]: value }));
    setSocialErrors((e) => ({ ...e, [name]: undefined }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) {
      setFieldErrors((fe) => ({
        ...fe,
        photo: "Use a JPG, PNG or WebP image.",
      }));
      return;
    }
    if (file.size > MAX_PHOTO) {
      setFieldErrors((fe) => ({
        ...fe,
        photo: "Photo must be 2 MB or smaller.",
      }));
      return;
    }
    setFieldErrors((fe) => ({ ...fe, photo: undefined }));
    setPhotoLoadError(false);
    setPhotoFile(file);
  }

  async function submitDetails() {
    const errs = validateBasics(details);
    if (!errs.username && usernameState === "taken")
      errs.username = "That username is already taken.";
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await saveDetails(buildDetailsPayload(details));
      if (photoFile) {
        const r = await uploadPhoto(photoFile);
        setPhotoUrl(r.photo_url);
        setPhotoLoadError(false);
        setPhotoFile(null);
      }
      setStep(2);
    } catch (err) {
      setFieldErrors(err.fieldErrors || {});
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function submitSocials() {
    const errs = {};
    SOCIAL_FIELDS.forEach((f) => {
      const msg = validateSocial(f, socials[f.key]);
      if (msg) errs[f.key] = msg;
    });
    const otherUrl = socials.other_url.trim();
    if (otherUrl && !parseUrl(otherUrl))
      errs.other_url = "Enter a valid link, e.g. example.com/me.";
    if (!otherUrl && socials.other_label.trim())
      errs.other_url = "Add a link for this entry.";
    if (Object.keys(errs).length) {
      setSocialErrors(errs);
      return;
    }

    const links = SOCIAL_FIELDS.filter((f) => socials[f.key].trim()).map(
      (f) => {
        const v = socials[f.key].trim();
        if (f.key === "whatsapp")
          return {
            platform: "other",
            label: OTHER_BACKED.whatsapp,
            url: `https://wa.me/${v}`,
          };
        if (f.key === "telegram")
          return {
            platform: "other",
            label: OTHER_BACKED.telegram,
            url: `https://t.me/${stripTelegram(v)}`,
          };
        if (f.key === "tiktok")
          return { platform: "other", label: OTHER_BACKED.tiktok, url: v };
        return { platform: f.key, url: v };
      },
    );
    if (otherUrl) {
      links.push({
        platform: "other",
        label: socials.other_label.trim(),
        url: otherUrl,
      });
    }
    if (socialLimit !== null && links.length > socialLimit) {
      setError(`Your plan allows up to ${socialLimit} social media links.`);
      return;
    }

    setSaving(true);
    setError("");
    try {
      await saveSocialLinks(links);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function submitProfessional() {
    const errs = validateProfessional(details);
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await saveDetails(buildDetailsPayload(details));
      if (coverFile) {
        const result = await uploadCoverPhoto(coverFile);
        setCoverUrl(result.cover_url || "");
        setCoverFile(null);
      }
      if (galleryFiles.length) {
        const result = await uploadGalleryPhotos(galleryFiles);
        setGallery(result.gallery || []);
        setGalleryFiles([]);
      }
      setStep(4);
    } catch (err) {
      setFieldErrors(err.fieldErrors || {});
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleGalleryChange(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    const invalidType = files.find((file) => !PHOTO_TYPES.includes(file.type));
    if (invalidType) {
      setError("Use JPG, PNG or WebP gallery photos.");
      return;
    }
    if (files.some((file) => file.size > 4 * 1024 * 1024)) {
      setError("Each gallery photo must be 4 MB or smaller.");
      return;
    }
    if (gallery.length + galleryFiles.length + files.length > 6) {
      setError("Your gallery can have up to 6 photos.");
      return;
    }
    setError("");
    setGalleryFiles((current) => [...current, ...files]);
  }

  async function removeGalleryPhoto(id) {
    setRemovingGalleryId(id);
    setError("");
    try {
      const result = await deleteGalleryPhoto(id);
      setGallery(result.gallery || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingGalleryId(null);
    }
  }

  function handleCoverChange(event) {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) {
      setError("Use a JPG, PNG or WebP cover image.");
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setError("Cover image must be 6 MB or smaller.");
      return;
    }
    setError("");
    setCoverFile(file);
  }

  async function removeCoverImage() {
    setRemovingCover(true);
    setError("");
    try {
      await deleteCoverPhoto();
      setCoverUrl("");
      setCoverFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingCover(false);
    }
  }

  async function submitCategory() {
    if (!category) {
      setError("Choose a category to continue.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await saveCategory(category);
      if (onFinish) onFinish();
      else setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function goBack() {
    setError("");
    if (step === 1) onBack();
    else setStep(step - 1);
  }

  if (loading) {
    return (
      <section className="mlink-wizard">
        <div className="mlink-wizard__inner">
          <div className="mlink-wizard__topbar mlink-wizard__topbar--center">
            <BrandLogo />
          </div>
          <p className="mlink-wizard__loading">Loading your profile…</p>
        </div>
      </section>
    );
  }

  const avatarSrc = preview || photoSrc(photoUrl);

  if (done) {
    return (
      <section className="mlink-wizard">
        <div className="mlink-wizard__inner">
          <div className="mlink-wizard__card mlink-wizard__done">
            <BrandLogo className="mlink-wizard__done-logo" />
            <div className="mlink-wizard__done-icon" aria-hidden="true">
              &#10003;
            </div>
            <h2 className="mlink-wizard__title">Profile saved</h2>
            <p className="mlink-wizard__lead">
              Your link will be <strong>mlink.com/{details.username}</strong>.
              Templates come next.
            </p>
            <div className="mlink-wizard__actions">
              <button
                type="button"
                className="mlink-wizard__btn mlink-wizard__btn--ghost"
                onClick={() => {
                  setDone(false);
                  setStep(1);
                }}
              >
                Edit profile
              </button>
              <button
                type="button"
                className="mlink-wizard__btn"
                onClick={onBack}
              >
                Back to dashboard
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const usernameHint = {
    idle: "This becomes your public link.",
    checking: "Checking availability…",
    available: "Username is available",
    taken: "That username is taken",
    invalid: "3–30 characters, no spaces",
  }[usernameState];

  return (
    <section className="mlink-wizard">
      <div className="mlink-wizard__inner">
        <div className="mlink-wizard__topbar">
          <button type="button" className="mlink-wizard__back" onClick={goBack}>
            <span className="mlink-wizard__back-icon">
              <Icon name={step === 1 ? "grid" : "chevron"} />
            </span>
            {step === 1 ? "Dashboard" : "Back"}
          </button>
          <BrandLogo />
        </div>

        <ol className="mlink-wizard__steps" aria-label="Progress">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const state = n < step ? "done" : n === step ? "current" : "todo";
            return (
              <li
                key={label}
                className={`mlink-wizard__step mlink-wizard__step--${state}`}
                aria-current={state === "current" ? "step" : undefined}
              >
                <span className="mlink-wizard__step-dot">
                  {state === "done" ? "✓" : n}
                </span>
                <span className="mlink-wizard__step-label">{label}</span>
              </li>
            );
          })}
        </ol>

        <div className="mlink-wizard__meter" aria-hidden="true">
          <span style={{ width: `${(step / STEPS.length) * 100}%` }} />
        </div>

        <div className="mlink-wizard__layout">
          <div className="mlink-wizard__card">
            {error && (
              <p className="mlink-wizard__error" role="alert">
                {error}
              </p>
            )}

            <div className="mlink-wizard__panel" key={step}>
              {step === 1 && (
                <>
                  <h2 className="mlink-wizard__title">Personal details</h2>
                  <p className="mlink-wizard__lead">
                    This is what visitors see on your MLink page.
                  </p>

                  <Section icon="user" title="Basic info">
                    <div className="mlink-wizard__photo">
                      <div className="mlink-wizard__avatar">
                        {avatarSrc && !photoLoadError ? (
                          <img
                            src={avatarSrc}
                            alt="Your profile"
                            onError={() => setPhotoLoadError(true)}
                          />
                        ) : (
                          <span>{initials(details.full_name)}</span>
                        )}
                      </div>
                      <div>
                        <label className="mlink-wizard__upload">
                          {avatarSrc ? "Change photo" : "Upload photo"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handlePhotoChange}
                          />
                        </label>
                        <p className="mlink-wizard__hint">
                          JPG, PNG or WebP, up to 2 MB.
                        </p>
                        {photoLoadError && !preview && (
                          <p
                            className="mlink-wizard__field-error"
                            role="status"
                          >
                            Your saved photo could not be loaded. Upload it
                            again to replace it.
                          </p>
                        )}
                        {fieldErrors.photo && (
                          <p className="mlink-wizard__field-error">
                            {fieldErrors.photo}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mlink-wizard__grid">
                      <Field
                        id="pw-name"
                        label="Full name"
                        icon="user"
                        error={fieldErrors.full_name}
                        hint="Letters and spaces only."
                      >
                        <input
                          id="pw-name"
                          type="text"
                          maxLength={60}
                          autoComplete="name"
                          placeholder="Your full name"
                          value={details.full_name}
                          onChange={(e) =>
                            setField("full_name", cleanName(e.target.value))
                          }
                          aria-invalid={!!fieldErrors.full_name}
                        />
                      </Field>

                      <Field
                        id="pw-username"
                        label="Username"
                        error={fieldErrors.username}
                        hint={
                          <span
                            className={`mlink-wizard__status mlink-wizard__status--${usernameState}`}
                            aria-live="polite"
                          >
                            {usernameHint}
                          </span>
                        }
                      >
                        <span className="mlink-wizard__prefix">mlink.com/</span>
                        <input
                          id="pw-username"
                          type="text"
                          maxLength={30}
                          autoCapitalize="none"
                          autoComplete="off"
                          spellCheck="false"
                          placeholder="username"
                          value={details.username}
                          onChange={(e) =>
                            setField("username", cleanUsername(e.target.value))
                          }
                          aria-invalid={
                            !!fieldErrors.username || usernameState === "taken"
                          }
                        />
                      </Field>

                      <Field
                        full
                        multiline
                        id="pw-bio"
                        label="Bio / About"
                        optional
                        error={fieldErrors.bio}
                        counter={`${details.bio.length}/300`}
                      >
                        <textarea
                          id="pw-bio"
                          rows={3}
                          maxLength={300}
                          placeholder="Tell visitors a little about yourself"
                          value={details.bio}
                          onChange={(e) => setField("bio", e.target.value)}
                        />
                      </Field>

                      <Field
                        full
                        id="pw-location"
                        label="Location"
                        optional
                        icon="pin"
                      >
                        <input
                          id="pw-location"
                          type="text"
                          maxLength={100}
                          autoComplete="address-level2"
                          placeholder="City, Country"
                          value={details.location}
                          onChange={(e) => setField("location", e.target.value)}
                        />
                      </Field>
                    </div>
                  </Section>

                  <Section icon="phone" title="Contact details">
                    <div className="mlink-wizard__grid">
                      <Field
                        id="pw-email"
                        label="Email"
                        optional
                        icon="mail"
                        error={fieldErrors.email}
                      >
                        <input
                          id="pw-email"
                          type="email"
                          maxLength={254}
                          autoComplete="email"
                          placeholder="name@example.com"
                          value={details.email}
                          onChange={(e) =>
                            setField("email", e.target.value.replace(/\s/g, ""))
                          }
                          aria-invalid={!!fieldErrors.email}
                        />
                      </Field>

                      <Field
                        id="pw-phone"
                        label="Phone number"
                        optional
                        icon="phone"
                        error={fieldErrors.phone}
                        hint="Numbers only, with country code."
                      >
                        <input
                          id="pw-phone"
                          type="tel"
                          inputMode="numeric"
                          maxLength={15}
                          autoComplete="tel"
                          placeholder="919876543210"
                          value={details.phone}
                          onChange={(e) =>
                            setField("phone", cleanDigits(e.target.value))
                          }
                          aria-invalid={!!fieldErrors.phone}
                        />
                      </Field>

                      <Field
                        full
                        id="pw-website"
                        label="Website / Portfolio URL"
                        optional
                        icon="globe"
                        error={fieldErrors.website}
                      >
                        <input
                          id="pw-website"
                          type="text"
                          maxLength={255}
                          autoComplete="url"
                          spellCheck="false"
                          placeholder="yourwebsite.com"
                          value={details.website}
                          onChange={(e) =>
                            setField(
                              "website",
                              e.target.value.replace(/\s/g, ""),
                            )
                          }
                          aria-invalid={!!fieldErrors.website}
                        />
                      </Field>
                    </div>
                  </Section>

                  <div className="mlink-wizard__actions mlink-wizard__actions--end">
                    <button
                      type="button"
                      className="mlink-wizard__btn"
                      disabled={saving}
                      onClick={submitDetails}
                    >
                      {saving ? "Saving…" : "Save & continue"}
                    </button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="mlink-wizard__title">Social links</h2>
                  <p className="mlink-wizard__lead">
                    Add the accounts you want on your page. All optional.{" "}
                    {socialLimit === null
                      ? "Your plan includes unlimited social media links."
                      : `Your plan includes up to ${socialLimit} social media link${socialLimit === 1 ? "" : "s"}.`}
                  </p>

                  <Section icon="link" title="Social media">
                    <div className="mlink-wizard__grid">
                      {SOCIAL_FIELDS.map((f) => (
                        <SocialField
                          key={f.key}
                          field={f}
                          value={socials[f.key]}
                          error={socialErrors[f.key]}
                          onChange={(v) => setSocial(f.key, v)}
                        />
                      ))}
                    </div>
                  </Section>

                  <Section icon="globe" title="Other social links">
                    <div className="mlink-wizard__grid">
                      <Field
                        id="pw-other-label"
                        label="Name"
                        optional
                        icon="tag"
                      >
                        <input
                          id="pw-other-label"
                          type="text"
                          maxLength={40}
                          placeholder="Portfolio"
                          value={socials.other_label}
                          onChange={(e) =>
                            setSocial("other_label", e.target.value)
                          }
                        />
                      </Field>
                      <Field
                        id="pw-other-url"
                        label="Link"
                        optional
                        icon="link"
                        error={socialErrors.other_url}
                      >
                        <input
                          id="pw-other-url"
                          type="text"
                          maxLength={255}
                          spellCheck="false"
                          placeholder="example.com/me"
                          value={socials.other_url}
                          onChange={(e) =>
                            setSocial(
                              "other_url",
                              e.target.value.replace(/\s/g, ""),
                            )
                          }
                          aria-invalid={!!socialErrors.other_url}
                        />
                      </Field>
                    </div>
                  </Section>

                  <div className="mlink-wizard__actions mlink-wizard__actions--end">
                    <button
                      type="button"
                      className="mlink-wizard__btn mlink-wizard__btn--ghost"
                      disabled={saving}
                      onClick={() => {
                        setError("");
                        setStep(3);
                      }}
                    >
                      Skip for now
                    </button>
                    <button
                      type="button"
                      className="mlink-wizard__btn"
                      disabled={saving}
                      onClick={submitSocials}
                    >
                      {saving ? "Saving…" : "Save & continue"}
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="mlink-wizard__title">Professional details</h2>
                  <p className="mlink-wizard__lead">
                    Tell visitors what you do. All optional.
                  </p>

                  <Section icon="briefcase" title="Professional details">
                    <div className="mlink-wizard__grid">
                      <Field
                        id="pw-job"
                        label="Job title / Role"
                        optional
                        icon="briefcase"
                      >
                        <input
                          id="pw-job"
                          type="text"
                          maxLength={80}
                          autoComplete="organization-title"
                          placeholder="Frontend Developer"
                          value={details.job_title}
                          onChange={(e) =>
                            setField("job_title", e.target.value)
                          }
                        />
                      </Field>

                      <Field
                        id="pw-company"
                        label="Company / Organization"
                        optional
                        icon="building"
                      >
                        <input
                          id="pw-company"
                          type="text"
                          maxLength={100}
                          autoComplete="organization"
                          placeholder="Company name"
                          value={details.company}
                          onChange={(e) => setField("company", e.target.value)}
                        />
                      </Field>

                      <Field
                        full
                        id="pw-industry"
                        label="Profession / Industry"
                        optional
                        icon="tag"
                      >
                        <input
                          id="pw-industry"
                          type="text"
                          list="pw-industry-list"
                          maxLength={80}
                          placeholder="Choose or type your industry"
                          value={details.industry}
                          onChange={(e) => setField("industry", e.target.value)}
                        />
                        <datalist id="pw-industry-list">
                          {INDUSTRIES.map((i) => (
                            <option key={i} value={i} />
                          ))}
                        </datalist>
                      </Field>

                      <Field
                        full
                        multiline
                        id="pw-pro-desc"
                        label="Short professional description"
                        optional
                        error={fieldErrors.professional_description}
                        counter={`${details.professional_description.length}/300`}
                      >
                        <textarea
                          id="pw-pro-desc"
                          rows={4}
                          maxLength={300}
                          placeholder="What you do, who you help and what makes you different"
                          value={details.professional_description}
                          onChange={(e) =>
                            setField("professional_description", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                  </Section>

                  {(planTier === "standard" || planTier === "pro") && (
                    <Section icon="image" title="Profile cover image">
                      <p className="mlink-wizard__hint mlink-wizard__gallery-intro">
                        This wide image appears behind your profile photo on
                        your published Standard/Pro page. JPG, PNG or WebP, up
                        to 6 MB.
                      </p>
                      {(coverPreview || coverUrl) && (
                        <div className="mlink-wizard__cover-preview">
                          <img
                            src={coverPreview || photoSrc(coverUrl)}
                            alt="Profile cover preview"
                          />
                          <button
                            type="button"
                            aria-label="Remove profile cover"
                            disabled={removingCover}
                            onClick={
                              coverFile
                                ? () => setCoverFile(null)
                                : removeCoverImage
                            }
                          >
                            {removingCover ? "…" : "×"}
                          </button>
                        </div>
                      )}
                      <label className="mlink-wizard__upload mlink-wizard__gallery-upload">
                        {coverUrl || coverFile
                          ? "Choose another cover"
                          : "Upload cover image"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleCoverChange}
                        />
                      </label>
                    </Section>
                  )}

                  <Section icon="image" title="Gallery photos">
                    <p className="mlink-wizard__hint mlink-wizard__gallery-intro">
                      Add up to 6 photos to your published Gallery tab. JPG, PNG
                      or WebP, up to 4 MB each.
                    </p>
                    <div className="mlink-wizard__gallery">
                      {gallery.map((image) => (
                        <div
                          className="mlink-wizard__gallery-item"
                          key={image.id}
                        >
                          <img
                            src={photoSrc(image.image_url)}
                            alt="Gallery upload"
                          />
                          <button
                            type="button"
                            aria-label="Remove gallery photo"
                            disabled={removingGalleryId === image.id}
                            onClick={() => removeGalleryPhoto(image.id)}
                          >
                            {removingGalleryId === image.id ? "…" : "×"}
                          </button>
                        </div>
                      ))}
                      {galleryFiles.map((file, index) => (
                        <div
                          className="mlink-wizard__gallery-item mlink-wizard__gallery-item--pending"
                          key={`${file.name}-${index}`}
                        >
                          <img
                            src={galleryPreviews[index]}
                            alt={`Preview of ${file.name}`}
                          />
                          <button
                            type="button"
                            aria-label={`Remove ${file.name}`}
                            onClick={() =>
                              setGalleryFiles((current) =>
                                current.filter((_, i) => i !== index),
                              )
                            }
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    {gallery.length + galleryFiles.length < 6 && (
                      <label className="mlink-wizard__upload mlink-wizard__gallery-upload">
                        Add photos
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={handleGalleryChange}
                        />
                      </label>
                    )}
                  </Section>

                  <div className="mlink-wizard__actions mlink-wizard__actions--end">
                    <button
                      type="button"
                      className="mlink-wizard__btn mlink-wizard__btn--ghost"
                      disabled={saving}
                      onClick={() => {
                        setError("");
                        setStep(4);
                      }}
                    >
                      Skip for now
                    </button>
                    <button
                      type="button"
                      className="mlink-wizard__btn"
                      disabled={saving}
                      onClick={submitProfessional}
                    >
                      {saving ? "Saving…" : "Save & continue"}
                    </button>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="mlink-wizard__title">Choose your category</h2>
                  <p className="mlink-wizard__lead">
                    We&rsquo;ll show templates that suit it.
                  </p>

                  <div
                    className="mlink-wizard__categories"
                    role="radiogroup"
                    aria-label="Category"
                  >
                    {CATEGORIES.map((c) => (
                      <button
                        type="button"
                        key={c.key}
                        role="radio"
                        aria-checked={category === c.key}
                        className={`mlink-wizard__cat${category === c.key ? " mlink-wizard__cat--on" : ""}`}
                        onClick={() => {
                          setCategory(c.key);
                          setError("");
                        }}
                      >
                        <span className="mlink-wizard__cat-name">
                          {c.label}
                        </span>
                        <span className="mlink-wizard__cat-hint">{c.hint}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mlink-wizard__actions mlink-wizard__actions--end">
                    <button
                      type="button"
                      className="mlink-wizard__btn"
                      disabled={saving}
                      onClick={submitCategory}
                    >
                      {saving ? "Saving…" : "Choose template"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <LivePreview
            details={details}
            avatar={avatarSrc && !photoLoadError ? avatarSrc : ""}
            socials={socials}
            categoryLabel={
              (CATEGORIES.find((c) => c.key === category) || {}).label
            }
            items={completionItems({
              details,
              hasPhoto: !!(avatarSrc && !photoLoadError),
              socials,
              category,
              galleryCount: gallery.length + galleryFiles.length,
            })}
          />
        </div>
      </div>
    </section>
  );
} 