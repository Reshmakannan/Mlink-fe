// Template library: 10 categories x 20 designs, generated from one style list.
// A template only changes the look. The profile data comes from the database.

const SANS = '"Inter", system-ui, sans-serif';
const SERIF = '"Fraunces", Georgia, serif';

// Keep keys in sync with CATEGORIES in backend/src/config/profileRules.js
export const CATEGORIES = [
  { key: 'fashion', label: 'Fashion', palette: { main: '#b83280', dark: '#4a1237', soft: '#fbe8f1', ink: '#2a0f20' } },
  { key: 'doctor', label: 'Doctor', palette: { main: '#0f8a8a', dark: '#06393d', soft: '#e2f4f4', ink: '#0b2b2e' } },
  { key: 'business', label: 'Business', palette: { main: '#1f3a8a', dark: '#0c1a47', soft: '#e6ebf8', ink: '#0d1633' } },
  { key: 'technology', label: 'Technology', palette: { main: '#5b3df5', dark: '#1a1250', soft: '#ece8ff', ink: '#140e3a' } },
  { key: 'education', label: 'Education', palette: { main: '#d97706', dark: '#5a2f05', soft: '#fdf1dc', ink: '#3a2004' } },
  { key: 'creator', label: 'Creator', palette: { main: '#9c1414', dark: '#2a0606', soft: '#fbe9e9', ink: '#2a0808' } },
  { key: 'photography', label: 'Photography', palette: { main: '#334155', dark: '#0b1220', soft: '#eceff3', ink: '#0f172a' } },
  { key: 'fitness', label: 'Fitness', palette: { main: '#16a34a', dark: '#06301a', soft: '#e4f6ea', ink: '#06240f' } },
  { key: 'music', label: 'Music', palette: { main: '#7e22ce', dark: '#260a3f', soft: '#f1e6fb', ink: '#1c0830' } },
  { key: 'other', label: 'Other', palette: { main: '#57534e', dark: '#1c1917', soft: '#f3f1ef', ink: '#1c1917' } },
];

export const CATEGORY_TABS = [
  { key: 'all', label: 'All Templates' },
  ...CATEGORIES.map(({ key, label }) => ({ key, label })),
];

const base = (p) => ({
  layout: 'center', // center | left | banner | card
  avatar: 'circle', // circle | rounded | square
  bg: '#ffffff',
  fg: p.ink,
  muted: 'rgba(0,0,0,.55)',
  banner: p.main,
  card: '#ffffff',
  btnBg: p.main,
  btnFg: '#ffffff',
  btnBorder: 'transparent',
  btnRadius: '999px',
  btnShadow: 'none',
  iconBg: p.soft,
  iconFg: p.dark,
  ring: '#ffffff',
  accent: p.main,
  accentFg: '#ffffff',
  font: SANS,
});

const LIGHT_ON_DARK = {
  fg: '#ffffff',
  muted: 'rgba(255,255,255,.72)',
  iconBg: 'rgba(255,255,255,.14)',
  iconFg: '#ffffff',
  ring: 'rgba(255,255,255,.3)',
};

// 20 designs. Add or edit entries here to change the whole library.
const VARIANTS = [
  ['Clean', () => ({ btnRadius: '.9em' })],
  ['Soft tint', (p) => ({ bg: p.soft, btnBg: p.dark, iconBg: '#ffffff' })],
  ['Midnight', (p) => ({ ...LIGHT_ON_DARK, bg: p.dark, btnBg: '#ffffff', btnFg: p.dark })],
  ['Glow', (p) => ({ ...LIGHT_ON_DARK, bg: `linear-gradient(165deg, ${p.main}, ${p.dark})`, btnBg: 'rgba(255,255,255,.16)', btnBorder: 'rgba(255,255,255,.4)', btnRadius: '1.1em' })],
  ['Outline', (p) => ({ btnBg: 'transparent', btnFg: p.main, btnBorder: p.main })],
  ['Card stack', (p) => ({ layout: 'card', bg: `linear-gradient(180deg, ${p.main}, ${p.dark})`, brand: '#ffffff', btnRadius: '.9em' })],
  ['Banner', (p) => ({ layout: 'banner', banner: `linear-gradient(135deg, ${p.main}, ${p.dark})`, btnBg: p.dark })],
  ['Banner soft', (p) => ({ layout: 'banner', avatar: 'rounded', bg: p.soft, banner: p.dark, btnRadius: '.8em', ring: p.soft })],
  ['Left rounded', (p) => ({ layout: 'left', avatar: 'rounded', bg: p.soft, btnBg: '#ffffff', btnFg: p.dark, btnShadow: '0 .3em .9em rgba(0,0,0,.08)', btnRadius: '1em', iconBg: '#ffffff', ring: p.soft })],
  ['Minimal', () => ({ bg: '#fafafa', font: SERIF, fg: '#111111', btnBg: 'transparent', btnFg: '#111111', btnBorder: 'rgba(0,0,0,.18)', btnRadius: '.3em', iconBg: 'transparent', iconFg: '#111111', accent: '#111111', ring: '#fafafa' })],
  ['Editorial', () => ({ bg: '#fbf6ec', font: SERIF, fg: '#2b2118', muted: 'rgba(43,33,24,.65)', avatar: 'square', btnBg: '#2b2118', btnFg: '#fbf6ec', btnRadius: '0', iconBg: 'transparent', iconFg: '#2b2118', ring: '#fbf6ec', accent: '#2b2118' })],
  ['Bold block', (p) => ({ ...LIGHT_ON_DARK, bg: p.main, avatar: 'square', btnBg: '#111111', btnRadius: '0', iconBg: '#111111', ring: '#111111', accent: '#111111' })],
  ['Neon', (p) => ({ ...LIGHT_ON_DARK, bg: '#0a0a12', btnBg: 'transparent', btnBorder: p.main, btnShadow: `0 0 1em ${p.main}`, btnRadius: '.8em', iconBg: 'transparent', ring: p.main })],
  ['Glass', (p) => ({ ...LIGHT_ON_DARK, bg: `radial-gradient(circle at 20% 15%, ${p.main} 0, transparent 55%), radial-gradient(circle at 85% 85%, ${p.dark} 0, transparent 55%), #14141c`, btnBg: 'rgba(255,255,255,.14)', btnBorder: 'rgba(255,255,255,.28)', btnRadius: '1.2em' })],
  ['Sunset', (p) => ({ bg: `linear-gradient(180deg, ${p.soft}, #ffffff 65%)`, btnBg: `linear-gradient(90deg, ${p.main}, ${p.dark})`, btnShadow: `0 .5em 1.2em ${p.main}55` })],
  ['Paper', (p) => ({ btnBg: '#ffffff', btnFg: p.dark, btnBorder: `${p.main}88`, btnRadius: '.6em', iconBg: 'transparent', iconFg: p.main })],
  ['Left dark', (p) => ({ ...LIGHT_ON_DARK, layout: 'left', avatar: 'rounded', bg: p.dark, btnRadius: '.6em' })],
  ['Duo', (p) => ({ bg: p.soft, iconBg: p.main, iconFg: '#ffffff', ring: p.soft })],
  ['Dotted', (p) => ({ bg: `radial-gradient(${p.main}33 1.2px, transparent 1.2px) 0 0 / 14px 14px, ${p.soft}`, btnBg: '#ffffff', btnFg: p.dark, btnBorder: `${p.main}55`, btnRadius: '.9em', btnShadow: '0 .3em .8em rgba(0,0,0,.06)', iconBg: '#ffffff', ring: p.soft })],
  ['Luxe', () => ({ bg: '#14110d', font: SERIF, fg: '#f5e6c4', muted: 'rgba(245,230,196,.7)', btnBg: 'linear-gradient(90deg, #d4af37, #b8860b)', btnFg: '#1a1408', btnRadius: '.5em', iconBg: 'transparent', iconFg: '#d4af37', ring: '#d4af37', accent: '#d4af37', accentFg: '#1a1408' })],
  ['Monochrome', () => ({ bg: '#f4f4f5', fg: '#18181b', muted: '#52525b', btnBg: '#18181b', btnFg: '#ffffff', btnRadius: '.35em', iconBg: '#ffffff', iconFg: '#18181b', ring: '#ffffff', accent: '#18181b' })],
  ['Color wash', (p) => ({ bg: `linear-gradient(145deg, ${p.soft}, #ffffff 55%, ${p.main}33)`, btnBg: '#ffffff', btnFg: p.dark, btnBorder: `${p.main}55`, btnRadius: '1.1em', iconBg: '#ffffff', ring: p.soft })],
  ['Compact', (p) => ({ layout: 'left', avatar: 'rounded', bg: '#ffffff', btnBg: p.soft, btnFg: p.dark, btnRadius: '.55em', iconBg: '#ffffff', ring: p.soft })],
  ['Contrast', (p) => ({ bg: p.dark, fg: '#ffffff', muted: 'rgba(255,255,255,.72)', btnBg: p.main, btnFg: '#ffffff', btnBorder: 'rgba(255,255,255,.35)', btnRadius: '.2em', iconBg: 'rgba(255,255,255,.14)', iconFg: '#ffffff', ring: p.main, accent: '#ffffff' })],
  ['Soft frame', (p) => ({ bg: p.soft, card: '#ffffff', btnBg: '#ffffff', btnFg: p.dark, btnBorder: `${p.main}44`, btnRadius: '1em', btnShadow: '0 .3em .8em rgba(0,0,0,.06)', iconBg: p.main, iconFg: '#ffffff', ring: '#ffffff' })],
];

const PRO_VARIANTS = [
  ['Terracotta Portfolio', (p) => ({
    layout: 'banner',
    bg: `linear-gradient(180deg, ${p.dark}, ${p.main})`,
    banner: `linear-gradient(135deg, ${p.main}, ${p.dark})`,
    font: SERIF,
    fg: '#ffffff',
    muted: 'rgba(255,255,255,.75)',
    btnBg: 'rgba(255,255,255,.14)',
    btnBorder: 'rgba(255,255,255,.3)',
    btnRadius: '1.2em',
    linkLayout: 'grid',
    ring: 'rgba(255,255,255,.55)',
  })],
  ['Atelier Editorial', (p) => ({
    bg: p.soft,
    font: SERIF,
    avatar: 'square',
    btnBg: 'transparent',
    btnFg: p.dark,
    btnBorder: `${p.dark}55`,
    btnRadius: '0',
    iconBg: 'transparent',
    iconFg: p.dark,
    nameStyle: 'editorial',
    ring: p.soft,
  })],
  ['Spotlight', (p) => ({
    bg: p.dark,
    fg: '#ffffff',
    muted: 'rgba(255,255,255,.72)',
    btnBg: `linear-gradient(90deg, ${p.main}, ${p.dark})`,
    btnFg: '#ffffff',
    btnRadius: '1.2em',
    iconBg: 'rgba(255,255,255,.12)',
    iconFg: '#ffffff',
    ring: p.main,
  })],
  ['Soft Arch', (p) => ({
    layout: 'card',
    bg: p.soft,
    card: '#ffffff',
    font: SERIF,
    avatar: 'rounded',
    btnBg: p.dark,
    btnRadius: '.7em',
    ring: p.soft,
  })],
];

const PREMIUM_VARIANTS = [
  ['Maison', (p) => ({
    bg: `linear-gradient(160deg, ${p.dark}, ${p.main})`,
    font: SERIF,
    fg: '#fff7ec',
    muted: 'rgba(255,247,236,.72)',
    btnBg: '#fff7ec',
    btnFg: p.dark,
    btnRadius: '.4em',
    iconBg: 'rgba(255,255,255,.14)',
    iconFg: '#fff7ec',
    ring: '#fff7ec',
    nameStyle: 'editorial',
  })],
  ['Gallery', (p) => ({
    bg: '#fbf7f0',
    font: SERIF,
    fg: '#25211d',
    muted: 'rgba(37,33,29,.62)',
    avatar: 'square',
    btnBg: '#ffffff',
    btnFg: p.dark,
    btnBorder: `${p.main}55`,
    btnRadius: '.3em',
    iconBg: 'transparent',
    iconFg: p.dark,
    ring: '#fbf7f0',
    nameStyle: 'editorial',
  })],
  ['After Hours', (p) => ({
    bg: `radial-gradient(circle at 50% 0, ${p.main}, ${p.dark} 70%)`,
    fg: '#ffffff',
    muted: 'rgba(255,255,255,.74)',
    btnBg: 'rgba(255,255,255,.12)',
    btnFg: '#ffffff',
    btnBorder: 'rgba(255,255,255,.3)',
    btnRadius: '999px',
    iconBg: 'rgba(255,255,255,.14)',
    iconFg: '#ffffff',
    ring: p.main,
  })],
  ['Signature', (p) => ({
    layout: 'banner',
    bg: '#eee4db',
    banner: `linear-gradient(135deg, ${p.dark}, ${p.main})`,
    font: SERIF,
    fg: '#2b2118',
    muted: 'rgba(43,33,24,.65)',
    btnBg: 'transparent',
    btnFg: p.dark,
    btnBorder: `${p.dark}66`,
    btnRadius: '.6em',
    iconBg: '#ffffff',
    iconFg: p.dark,
    ring: '#eee4db',
  })],
];

const pad = (n) => String(n).padStart(2, '0');

const makeTemplates = (variants, tier, idPart = '') =>
  CATEGORIES.flatMap((cat) =>
    variants.map(([styleName, make], i) => {
      const style = { ...base(cat.palette), ...make(cat.palette) };
      if (!style.brand) style.brand = style.muted;
      return {
        id: `${cat.key}-${idPart}${pad(i + 1)}`,
        category: cat.key,
        index: i + 1,
        tier,
        name: tier === 'starter' ? `${cat.label} ${pad(i + 1)}` : `${cat.label} ${styleName}`,
        styleName,
        style,
      };
    })
  );

export const STARTER_TEMPLATES = makeTemplates(VARIANTS, 'starter');
export const PRO_TEMPLATES = makeTemplates(PRO_VARIANTS, 'pro', 'pro-');
export const PREMIUM_TEMPLATES = makeTemplates(PREMIUM_VARIANTS, 'premium', 'premium-');
export const TEMPLATES = [...STARTER_TEMPLATES, ...PRO_TEMPLATES, ...PREMIUM_TEMPLATES];
const TEMPLATE_COUNTS = {
  starter: VARIANTS.length,
  pro: PRO_VARIANTS.length,
  premium: PREMIUM_VARIANTS.length,
};
export const LIBRARY_SIZE = Object.values(TEMPLATE_COUNTS).reduce((total, count) => total + count, 0);

const ORDER = CATEGORIES.map((c) => c.key);
const TIER_ORDER = {
  starter: ['starter', 'pro', 'premium'],
  pro: ['pro', 'starter', 'premium'],
  premium: ['premium', 'pro', 'starter'],
};

export function templatesFor(category, planTier = 'starter') {
  const list = category === 'all' ? [...TEMPLATES] : TEMPLATES.filter((t) => t.category === category);
  const tierOrder = TIER_ORDER[planTier] || TIER_ORDER.starter;
  return list.sort(
    (a, b) =>
      tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier) ||
      a.index - b.index ||
      ORDER.indexOf(a.category) - ORDER.indexOf(b.category)
  );
}

export function templateTier(planType, status) {
  if (status === 'trialing') return 'premium';
  if (status && status !== 'active') return 'starter';
  const plan = String(planType || '').toLowerCase();
  if (plan.startsWith('pro_') || ['premium', '1_year'].includes(plan)) return 'premium';
  if (plan.startsWith('standard_') || ['pro', '6_months', '3_months'].includes(plan)) return 'pro';
  return 'starter';
}

export function isTemplateLocked(template, planTier, limit) {
  const tierOrder = TIER_ORDER[planTier] || TIER_ORDER.starter;
  const templateTierIndex = tierOrder.indexOf(template.tier);
  if (templateTierIndex < 0) return true;

  const position = tierOrder
    .slice(0, templateTierIndex)
    .reduce((total, tier) => total + TEMPLATE_COUNTS[tier], 0) + template.index;
  return position > limit;
}

export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) || null;

export const categoryLabel = (key) => {
  const c = CATEGORY_TABS.find((t) => t.key === key);
  return c ? c.label : key;
};


// ---------------------------------------------------------------------
// Customize step: turns a template + the user's saved choices into a
// style object. Locked/unlocked fields are enforced by the server; this
// only draws whatever customization object it's given.
// ---------------------------------------------------------------------

function hexToRgb(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return null;
  const int = parseInt(m[1], 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

function rgba(hex, a) {
  const c = hexToRgb(hex);
  return c ? `rgba(${c.r}, ${c.g}, ${c.b}, ${a})` : hex;
}

function darken(hex, amount) {
  const c = hexToRgb(hex);
  if (!c) return hex;
  const d = (v) => Math.max(0, Math.round(v * (1 - amount)));
  return `rgb(${d(c.r)}, ${d(c.g)}, ${d(c.b)})`;
}

function textOn(hex) {
  const c = hexToRgb(hex);
  if (!c) return '#ffffff';
  const lum = (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255;
  return lum > 0.6 ? '#111111' : '#ffffff';
}

const BUTTON_RADIUS = { pill: '999px', soft: '.8em', square: '0' };
const CUSTOM_FONTS = { sans: SANS, serif: SERIF };

export function applyCustomization(template, customization = {}) {
  const base = template.style;
  const accentSrc = customization.accentColor || base.accent;
  let style = { ...base };

  if (customization.background === 'soft') {
    style = {
      ...style,
      bg: `linear-gradient(180deg, ${rgba(accentSrc, 0.12)}, #ffffff 70%)`,
      fg: '#141414',
      muted: 'rgba(0,0,0,.55)',
    };
  } else if (customization.background === 'dark') {
    style = {
      ...style,
      bg: darken(accentSrc, 0.75),
      fg: '#ffffff',
      muted: 'rgba(255,255,255,.7)',
      iconBg: 'rgba(255,255,255,.14)',
      iconFg: '#ffffff',
      ring: 'rgba(255,255,255,.3)',
    };
  } else if (customization.background === 'gradient') {
    style = {
      ...style,
      bg: `linear-gradient(160deg, ${accentSrc}, ${darken(accentSrc, 0.45)})`,
      fg: '#ffffff',
      muted: 'rgba(255,255,255,.72)',
      iconBg: 'rgba(255,255,255,.14)',
      iconFg: '#ffffff',
      ring: 'rgba(255,255,255,.3)',
    };
  }

  if (customization.buttonStyle && BUTTON_RADIUS[customization.buttonStyle]) {
    style.btnRadius = BUTTON_RADIUS[customization.buttonStyle];
  }
  if (customization.font && CUSTOM_FONTS[customization.font]) {
    style.font = CUSTOM_FONTS[customization.font];
  }
  if (customization.accentColor) {
    style.accent = customization.accentColor;
    style.accentFg = textOn(customization.accentColor);
  }
  if (customization.layout) style.layout = customization.layout;
  if (customization.avatarShape) style.avatar = customization.avatarShape;

  if (customization.backgroundImage) {
    style.bgImageUrl = customization.backgroundImage;
    style.bgOverlay = typeof customization.bgOverlay === 'number' ? customization.bgOverlay : 35;
  } else {
    style.bgImageUrl = null;
  }

  return { style, iconStyle: customization.iconStyle || 'circle' };
}