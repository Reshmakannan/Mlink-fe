import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyProfile, setPublished } from '../Api/Profileapi';
import { getMySubscription } from '../Api/Subscriptionapi';
import { getTemplate } from '../Data/templates';
import TemplatePreview from '../Components/TemplatePreview';
import WorkflowProgress from '../Components/WorkflowProgress';
import '../Style/Preview.css';

/* ---------- Share icons (inline SVG, no extra packages) ---------- */
const ICONS = {
  share: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" /><path d="M9 9.5c0 3 2.500 5.500 5.500 5.500l1.200-1.500-2-1-.8.800c-1-.4-1.800-1.200-2.200-2.200l.8-.8-1-2z" /></svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" />
      <circle cx="17.500" cy="6.500" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.700 16H20L8.300 4z" /><path d="M4 20l6.800-6.800M13.200 10.800L20 4" /></svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 7l9 6 9-6" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1" /><path d="M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" />
    </svg>
  ),
};

export default function Preview({ onBack, onEditLinks, onEditCustomize, onUpgrade }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [note, setNote] = useState('');
  // true only for a paid plan. The free trial ('trialing') cannot publish.
  const [hasPlan, setHasPlan] = useState(false);

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const [{ profile: p }, sub] = await Promise.all([
          getMyProfile(),
          getMySubscription().catch(() => null),
        ]);
        if (!off) {
          setProfile(p);
          setHasPlan(!!sub && sub.status === 'active');
        }
      } catch (err) {
        if (!off) setError(err.message);
      } finally {
        if (!off) setLoading(false);
      }
    })();
    return () => {
      off = true;
    };
  }, []);

  const template = useMemo(
    () => (profile && profile.template_id ? getTemplate(profile.template_id) : null),
    [profile]
  );

  const liveUrl = profile ? `${window.location.origin}/${profile.username}` : '';
  const shareText = profile ? `Check out my MLink: ${liveUrl}` : '';

  async function togglePublish() {
    // Free trial / no paid plan: send the user to Pricing instead of publishing.
    if (!profile.is_published && !hasPlan) {
      if (onUpgrade) onUpgrade();
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await setPublished(!profile.is_published);
      setProfile(res.profile);
      setShareOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function flash(msg) {
    setNote(msg);
    setTimeout(() => setNote(''), 2200);
  }

  function copyLink() {
    navigator.clipboard.writeText(liveUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  /* Share button: native share sheet on phones (shows WhatsApp, Instagram,
     Telegram… whatever is installed). Falls back to our own icon panel. */
  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.username} on MLink`,
          text: 'Check out my MLink',
          url: liveUrl,
        });
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return; // user closed the sheet
      }
    }
    setShareOpen((v) => !v);
  }

  function openShare(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function shareInstagram() {
    // Instagram has no web share link, so copy the link and open Instagram.
    try {
      await navigator.clipboard.writeText(liveUrl);
      flash('Link copied. Paste it in Instagram.');
    } catch (e) {
      flash('Copy the link and paste it in Instagram.');
    }
    openShare('https://www.instagram.com/');
  }

  const enc = encodeURIComponent;
  const targets = [
    { id: 'whatsapp', label: 'WhatsApp', icon: ICONS.whatsapp, onClick: () => openShare(`https://wa.me/?text=${enc(shareText)}`) },
    { id: 'instagram', label: 'Instagram', icon: ICONS.instagram, onClick: shareInstagram },
    { id: 'telegram', label: 'Telegram', icon: ICONS.telegram, onClick: () => openShare(`https://t.me/share/url?url=${enc(liveUrl)}&text=${enc('Check out my MLink')}`) },
    { id: 'x', label: 'X', icon: ICONS.x, onClick: () => openShare(`https://twitter.com/intent/tweet?text=${enc('Check out my MLink')}&url=${enc(liveUrl)}`) },
    { id: 'facebook', label: 'Facebook', icon: ICONS.facebook, onClick: () => openShare(`https://www.facebook.com/sharer/sharer.php?u=${enc(liveUrl)}`) },
    { id: 'linkedin', label: 'LinkedIn', icon: ICONS.linkedin, onClick: () => openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${enc(liveUrl)}`) },
    { id: 'mail', label: 'Email', icon: ICONS.mail, onClick: () => { window.location.href = `mailto:?subject=${enc('My MLink')}&body=${enc(shareText)}`; } },
    { id: 'link', label: copied ? 'Copied' : 'Copy link', icon: ICONS.link, onClick: copyLink },
  ];

  if (loading) {
    return (
      <section className="prev">
        <div className="prev__inner">
          <WorkflowProgress activeStep={3} />
          <p className="prev__loading">Loading your page…</p>
        </div>
      </section>
    );
  }

  if (!profile || !template) {
    return (
      <section className="prev">
        <div className="prev__inner">
          <WorkflowProgress activeStep={3} />
          <div className="prev__empty">
            <h2 className="prev__title">Choose a template first</h2>
            <p className="prev__lead">You need a template before you can preview or publish.</p>
            <button type="button" className="prev__btn" onClick={onBack}>
              Back
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="prev">
      <div className="prev__inner">
        <div className="prev__topbar">
          <button type="button" className="prev__back" onClick={onBack}>
            &larr; Back
          </button>
          <Link to="/" className="prev__brand" aria-label="MLink home">
            MLink
          </Link>
        </div>

        <WorkflowProgress activeStep={profile.is_published && hasPlan ? 4 : 3} />

        <div className="prev__head">
          <h1 className="prev__title">Preview &amp; publish</h1>
          <p className="prev__lead">
            This is exactly how your page will look. Publish it to make{' '}
            <strong>mlink.com/{profile.username}</strong> live.
          </p>
        </div>

        {error && <p className="prev__error">{error}</p>}

        <div className="prev__layout">
          <div className="prev__workspace">
            <div className="prev__toolbar">
              <div className="prev__toolbar-copy">
                <p className="prev__toolbar-label">Preview</p>
                <p className="prev__toolbar-text">Everything is looking polished. Share it or keep refining.</p>
              </div>
              <div className="prev__toolbar-actions">
                {profile.is_published && hasPlan && (
                  <button type="button" className="prev__toolbar-btn prev__toolbar-btn--share" onClick={handleShare}>
                    <span className="prev__share-ico">{ICONS.share}</span>
                    Share
                  </button>
                )}
                <button type="button" className="prev__toolbar-btn prev__toolbar-btn--secondary" onClick={onEditLinks}>
                  Edit links
                </button>
                <button type="button" className="prev__toolbar-btn prev__toolbar-btn--secondary" onClick={onEditCustomize}>
                  Edit customization
                </button>
              </div>
            </div>

            {profile.is_published && hasPlan && shareOpen && (
              <div className="prev__sheet prev__sheet--toolbar">
                <p className="prev__sheet-title">Share your MLink</p>
                <div className="prev__sheet-grid">
                  {targets.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`prev__target prev__target--${t.id}`}
                      onClick={t.onClick}
                    >
                      <span className="prev__target-ico">{t.icon}</span>
                      <span className="prev__target-label">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="prev__stage">
              <div className="prev__phone">
                <TemplatePreview template={template} profile={profile} customization={profile.customization} live />
              </div>
            </div>
          </div>

          <aside className="prev__side">
            <div className="prev__card">
              <p className="prev__card-title">Status</p>
              <p className={`prev__status prev__status--${profile.is_published && hasPlan ? 'live' : 'draft'}`}>
                {profile.is_published && hasPlan ? 'Published — live now' : 'Draft — not visible yet'}
              </p>

              {profile.is_published && hasPlan && (
                <div className="prev__link-row">
                  <span className="prev__link">mlink.com/{profile.username}</span>
                  <button type="button" className="prev__copy" onClick={copyLink}>
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}

              <button
                type="button"
                className={`prev__btn${profile.is_published ? ' prev__btn--ghost' : ''}`}
                disabled={busy}
                onClick={togglePublish}
              >
                {busy
                  ? 'Saving…'
                  : profile.is_published
                  ? 'Unpublish'
                  : hasPlan
                  ? 'Publish MLink'
                  : 'Explore plans to publish'}
              </button>

              {!hasPlan && (
                <p className="prev__note">
                  You&rsquo;re on the free trial. Choose a plan and pay to make this page live.
                </p>
              )}
              {note && <p className="prev__note">{note}</p>}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}