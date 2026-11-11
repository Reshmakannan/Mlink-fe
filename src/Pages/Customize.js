import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getMyProfile,
  getCustomizeAccess,
  saveCustomization,
  uploadBackgroundImage,
  photoSrc,
} from '../Api/Profileapi';
import { getTemplate } from '../Data/templates';
import TemplatePreview from '../Components/TemplatePreview';
import WorkflowProgress from '../Components/WorkflowProgress';
import '../Style/Customize.css';

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

const BACKGROUND_OPTIONS = [
  { key: 'default', label: 'Original' },
  { key: 'soft', label: 'Soft tint' },
  { key: 'dark', label: 'Dark' },
  { key: 'gradient', label: 'Gradient' },
];

const BUTTON_OPTIONS = [
  { key: 'pill', label: 'Pill' },
  { key: 'soft', label: 'Soft' },
  { key: 'square', label: 'Square' },
];

const FONT_OPTIONS = [
  { key: 'sans', label: 'Sans' },
  { key: 'serif', label: 'Serif' },
];

const ICON_STYLE_OPTIONS = [
  { key: 'circle', label: 'Circle' },
  { key: 'rounded', label: 'Rounded' },
  { key: 'square', label: 'Square' },
];

const LAYOUT_OPTIONS = [
  { key: 'center', label: 'Center' },
  { key: 'left', label: 'Left' },
  { key: 'banner', label: 'Banner' },
  { key: 'card', label: 'Card' },
];

const AVATAR_OPTIONS = [
  { key: 'circle', label: 'Circle' },
  { key: 'rounded', label: 'Rounded' },
  { key: 'square', label: 'Square' },
];

const SECTIONS = [
  {
    key: 'background',
    title: 'Background',
    type: 'choice',
    options: BACKGROUND_OPTIONS,
  },
  {
    key: 'buttonStyle',
    title: 'Button style',
    type: 'choice',
    options: BUTTON_OPTIONS,
  },
  {
    key: 'font',
    title: 'Font',
    type: 'choice',
    options: FONT_OPTIONS,
  },
  {
    key: 'iconStyle',
    title: 'Social icon style',
    type: 'choice',
    options: ICON_STYLE_OPTIONS,
  },
  {
    key: 'layout',
    title: 'Layout',
    type: 'choice',
    options: LAYOUT_OPTIONS,
  },
  {
    key: 'accentColor',
    title: 'Accent color',
    type: 'color',
  },
  {
    key: 'avatarShape',
    title: 'Avatar shape',
    type: 'choice',
    options: AVATAR_OPTIONS,
  },
  {
    key: 'backgroundImage',
    title: 'Link Background Image',
    type: 'image',
  },
];

const TIER_LABELS = { basic: 'Basic', standard: 'Standard', pro: 'Pro' };
const TERM_LABELS = {
  monthly: 'Monthly',
  '3_months': '3 Months',
  '6_months': '6 Months',
  '1_year': '12 Months',
};
const LEGACY_PLAN_LABELS = {
  monthly: 'Basic · Monthly',
  '3_months': 'Standard · 3 Months',
  '6_months': 'Pro · 6 Months',
  '1_year': 'Pro · 12 Months',
};

function planLabel(planType) {
    if (!planType) return "";
  for (const tier of Object.keys(TIER_LABELS)) {
    const prefix = `${tier}_`;
    const term = planType.startsWith(prefix) ? planType.slice(prefix.length) : '';
    if (TERM_LABELS[term]) return `${TIER_LABELS[tier]} · ${TERM_LABELS[term]}`;
  }
  return LEGACY_PLAN_LABELS[planType] || 'current';
}

export default function Customize({ onBack, onContinue, onUpgrade }) {
  const [profile, setProfile] = useState(null);
  const [fields, setFields] = useState([]);
  const [planType, setPlanType] = useState(null);
  const [saved, setSaved] = useState({});
  const [draft, setDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [bgUploading, setBgUploading] = useState(false);
  const [bgError, setBgError] = useState('');

  useEffect(() => {
    let off = false;

    (async () => {
      try {
        const [{ profile: p }, access] = await Promise.all([
          getMyProfile(),
          getCustomizeAccess(),
        ]);

        if (off) return;

        setProfile(p);
        setFields(access.fields || []);
        setPlanType(access.plan_type);
        setSaved(access.customization || {});
        setDraft(access.customization || {});
      } catch (err) {
        if (!off) {
          setError(err.message || 'Unable to load customization.');
        }
      } finally {
        if (!off) {
          setLoading(false);
        }
      }
    })();

    return () => {
      off = true;
    };
  }, []);

  const template = useMemo(
    () =>
      profile && profile.template_id
        ? getTemplate(profile.template_id)
        : null,
    [profile]
  );

  const allowed = useMemo(() => new Set(fields), [fields]);

  const unlockedCount = SECTIONS.filter((section) =>
    allowed.has(section.key)
  ).length;
  const availableSections = SECTIONS.filter((section) => allowed.has(section.key));

  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);

  function choose(key, value) {
    /*
      bgOverlay belongs to the background-image customization.
      It should be editable whenever backgroundImage is available,
      even if bgOverlay itself is not returned as a subscription field.
    */
    if (
      !allowed.has(key) &&
      !(key === 'bgOverlay' && allowed.has('backgroundImage'))
    ) {
      return;
    }

    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleBackgroundFile(e) {
    const file = e.target.files && e.target.files[0];

    e.target.value = '';

    if (!file || !allowed.has('backgroundImage')) {
      return;
    }

    setBgUploading(true);
    setBgError('');

    try {
      const { url } = await uploadBackgroundImage(file);

      setDraft((current) => ({
        ...current,
        backgroundImage: url,
        bgOverlay: current.bgOverlay ?? 35,
      }));
    } catch (err) {
      setBgError(err.message || 'Unable to upload background image.');
    } finally {
      setBgUploading(false);
    }
  }

  /*
    Sending an empty string tells the backend to clear the
    existing backgroundImage value.
  */
  function removeBackground() {
    setDraft((current) => ({
      ...current,
      backgroundImage: '',
      bgOverlay: 0,
    }));

    setBgError('');
  }

  async function handleSave() {
    setSaving(true);
    setError('');

    try {
      const res = await saveCustomization(draft);

      const customization = res?.customization || draft;

      setSaved(customization);
      setDraft(customization);
    } catch (err) {
      setError(err.message || 'Unable to save customization.');
    } finally {
      setSaving(false);
    }
  }

  async function handleContinue() {
    if (dirty) {
      await handleSave();
    }

    if (onContinue) {
      onContinue();
    }
  }

  if (loading) {
    return (
      <section className="cstm">
        <div className="cstm__inner">
          <WorkflowProgress activeStep={2} />
          <p className="cstm__loading">
            Loading your customization…
          </p>
        </div>
      </section>
    );
  }

  if (!profile || !template) {
    return (
      <section className="cstm">
        <div className="cstm__inner">
          <WorkflowProgress activeStep={2} />
          <div className="cstm__empty">
            <h2 className="cstm__title">
              Choose a template first
            </h2>

            <p className="cstm__lead">
              Customization applies to the template you selected.
            </p>

            <button
              type="button"
              className="cstm__btn"
              onClick={onBack}
            >
              Back
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cstm">
      <div className="cstm__inner">

        <div className="cstm__topbar">
          <button
            type="button"
            className="cstm__back"
            onClick={onBack}
          >
            &larr; Back
          </button>

          <Link to="/" className="cstm__brand" aria-label="MLink home">
            MLink
          </Link>
        </div>

        <WorkflowProgress activeStep={2} />

        <div className="cstm__head">
          <h1 className="cstm__title">
            Customize your page
          </h1>

          <p className="cstm__lead">
            {unlockedCount === 0 ? (
              <>
                Customization isn&rsquo;t included in the{' '}
                {planLabel(planType)} plan.{' '}

                <button
                  type="button"
                  className="cstm__link"
                  onClick={onUpgrade}
                >
                  Upgrade to unlock
                </button>
              </>
            ) : (
              <>
                Your {planLabel(planType)} plan includes basic customization for your page.
              </>
            )}
          </p>
        </div>

        {error && (
          <p className="cstm__error">
            {error}
          </p>
        )}

        <div className="cstm__layout">

          <div className="cstm__panel">

            {availableSections.map((section) => {
              const locked = !allowed.has(section.key);
              const value = draft[section.key];

              return (
                <div
                  key={section.key}
                  className={`cstm__section${
                    locked ? ' cstm__section--locked' : ''
                  }`}
                >

                  <div className="cstm__section-head">
                    <p className="cstm__section-title">
                      {section.title}
                    </p>

                    {locked && (
                      <span className="cstm__lockbadge">
                        <LockIcon />
                        Locked
                      </span>
                    )}
                  </div>

                  {section.type === 'color' && (
                    <div className="cstm__color-row">

                      <input
                        type="color"
                        disabled={locked}
                        value={
                          value ||
                          template.style.accent
                        }
                        onChange={(e) =>
                          choose(
                            section.key,
                            e.target.value
                          )
                        }
                        className="cstm__color-input"
                      />

                      <span className="cstm__color-value">
                        {value || 'Template default'}
                      </span>

                    </div>
                  )}

                  {section.type === 'choice' && (
                    <div className="cstm__options">

                      {section.options.map((opt) => (
                        <button
                          type="button"
                          key={opt.key}
                          disabled={locked}
                          className={`cstm__opt${
                            value === opt.key
                              ? ' cstm__opt--on'
                              : ''
                          }`}
                          onClick={() =>
                            choose(
                              section.key,
                              opt.key
                            )
                          }
                        >
                          {opt.label}
                        </button>
                      ))}

                    </div>
                  )}

                  {section.type === 'image' &&
                    (locked ? (
                      <p className="cstm__locked-msg">
                        Background images aren&rsquo;t included in your current plan.
                      </p>
                    ) : (
                      <div className="cstm__bgimage">

                        {draft.backgroundImage ? (
                          <div className="cstm__bgimage-preview">

                            <img
                              src={photoSrc(
                                draft.backgroundImage
                              )}
                              alt="Background preview"
                            />

                            <div className="cstm__bgimage-actions">

                              <label className="cstm__bgimage-change">

                                <svg
                                  viewBox="0 0 24 24"
                                  width="14"
                                  height="14"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                                  <polyline points="21 3 21 9 15 9" />
                                </svg>

                                {bgUploading
                                  ? 'Uploading…'
                                  : 'Change image'}

                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  onChange={handleBackgroundFile}
                                  disabled={bgUploading}
                                />

                              </label>

                              <button
                                type="button"
                                className="cstm__bgimage-remove"
                                onClick={removeBackground}
                                disabled={bgUploading}
                              >

                                <svg
                                  viewBox="0 0 24 24"
                                  width="14"
                                  height="14"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>

                                Remove

                              </button>

                            </div>

                            <div className="cstm__overlay-row">

                              <label htmlFor="cstm-overlay">
                                Background darkness
                              </label>

                              <input
                                id="cstm-overlay"
                                type="range"
                                min="0"
                                max="90"
                                value={
                                  draft.bgOverlay ?? 35
                                }
                                onChange={(e) =>
                                  choose(
                                    'bgOverlay',
                                    Number(e.target.value)
                                  )
                                }
                                style={{
                                  '--cstm-range-fill': `${
                                    ((draft.bgOverlay ?? 35) /
                                      90) *
                                    100
                                  }%`,
                                }}
                              />

                              <span>
                                {draft.bgOverlay ?? 35}%
                              </span>

                            </div>

                          </div>
                        ) : (
                          <label className="cstm__bgimage-upload">

                            <span
                              className="cstm__bgimage-upload-icon"
                              aria-hidden="true"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                width="22"
                                height="22"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line
                                  x1="12"
                                  y1="3"
                                  x2="12"
                                  y2="15"
                                />
                              </svg>
                            </span>

                            <span className="cstm__bgimage-upload-text">
                              {bgUploading
                                ? 'Uploading…'
                                : 'Upload Background Image'}
                            </span>

                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleBackgroundFile}
                              disabled={bgUploading}
                            />

                          </label>
                        )}

                        {bgError && (
                          <p className="cstm__field-error">
                            {bgError}
                          </p>
                        )}

                        <p className="cstm__hint">
                          JPG, PNG or WebP, up to 4 MB.
                        </p>

                      </div>
                    ))}

                  {locked && (
                    <button
                      type="button"
                      className="cstm__unlock"
                      onClick={onUpgrade}
                    >
                      Unlock this option
                    </button>
                  )}

                </div>
              );
            })}

          </div>

          <div className="cstm__preview-col">
            <div className="cstm__preview-sticky">

              <div className="cstm__phone">
                <TemplatePreview
                  template={template}
                  profile={profile}
                  customization={draft}
                />
              </div>

            </div>
          </div>

        </div>

        <div className="cstm__bottom">

          <button
            type="button"
            className="cstm__btn cstm__btn--ghost"
            disabled={!dirty || saving}
            onClick={handleSave}
          >
            {saving
              ? 'Saving…'
              : 'Save changes'}
          </button>

          <button
            type="button"
            className="cstm__btn"
            disabled={saving}
            onClick={handleContinue}
          >
            {saving
              ? 'Saving…'
              : 'Continue to Preview'}
          </button>

        </div>

      </div>
    </section>
  );
}