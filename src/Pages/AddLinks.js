import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getMyProfile,
  getLinks,
  createLink,
  updateLink,
  deleteLink, 
  reorderLinks,
} from '../Api/Profileapi';
import { getTemplate } from '../Data/templates';
import TemplatePreview from '../Components/TemplatePreview';
import LinkIcon, { LINK_ICONS, SOCIAL_ICON_KEYS } from '../Components/LinkIcon';
import WorkflowProgress from '../Components/WorkflowProgress';
import '../Style/AddLinks.css';

const EMPTY_FORM = { icon: 'website', label: '', url: '' };

export default function AddLinks({ onBack, onContinue }) {
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [linkLimit, setLinkLimit] = useState(null);
  const [trialLimited, setTrialLimited] = useState(false);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const [{ profile: p }, linkData] = await Promise.all([getMyProfile(), getLinks()]);
        if (off) return;
        setProfile(p);
        setLinks(linkData.links);
        setLinkLimit(linkData.limit);
        setTrialLimited(!!linkData.trial);
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
  const atLimit = linkLimit !== null && links.length >= linkLimit && !editingId;
  const previewProfile = profile ? { ...profile, links } : null;

  const usedIcons = useMemo(() => new Set(links.map((l) => l.icon)), [links]);
  const pickerIcons = LINK_ICONS.filter((i) => !SOCIAL_ICON_KEYS.includes(i.key));

  // "Suggested" chips: prefill from saved profile details, only if not already added.
  const suggestions = [
    profile && profile.website && !usedIcons.has('website') && { icon: 'website', label: 'Website', url: profile.website },
    profile && profile.email && !usedIcons.has('email') && { icon: 'email', label: 'Email me', url: `mailto:${profile.email}` },
    profile && profile.phone && !usedIcons.has('phone') && { icon: 'phone', label: 'Call me', url: `tel:${profile.phone}` },
    profile && profile.location && !usedIcons.has('location') && { icon: 'location', label: profile.location, url: '' },
  ].filter(Boolean);

  function resetForm() {
    setForm(EMPTY_FORM);
    setFieldErrors({});
    setEditingId(null);
  }

  function applySuggestion(s) {
    setForm({ icon: s.icon, label: s.label, url: s.url });
    setFieldErrors({});
    setEditingId(null);
  }

  function startEdit(l) {
    setForm({ icon: l.icon, label: l.label, url: l.url });
    setFieldErrors({});
    setEditingId(l.id);
  }

  async function submitForm(e) {
    e.preventDefault();
    if (!form.label.trim() || !form.url.trim()) {
      setFieldErrors({
        label: !form.label.trim() ? 'Enter a label.' : undefined,
        url: !form.url.trim() ? 'Enter a link.' : undefined,
      });
      return;
    }
    setSaving(true);
    setError('');
    try {
      const body = { icon: form.icon, label: form.label.trim(), url: form.url.trim() };
      const res = editingId ? await updateLink(editingId, body) : await createLink(body);
      setLinks(res.links);
      resetForm();
    } catch (err) {
      setFieldErrors(err.fieldErrors || {});
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(l) {
    setBusyId(l.id);
    setError('');
    try {
      const res = await updateLink(l.id, { is_active: !l.is_active });
      setLinks(res.links);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function removeLink(l) {
    setBusyId(l.id);
    setError('');
    try {
      const res = await deleteLink(l.id);
      setLinks(res.links);
      if (editingId === l.id) resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function move(index, dir) {
    const next = index + dir;
    if (next < 0 || next >= links.length) return;
    const reordered = [...links];
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    setLinks(reordered); // update instantly, then confirm with the server
    try {
      const res = await reorderLinks(reordered.map((l) => l.id));
      setLinks(res.links);
    } catch (err) {
      setError(err.message);
      setLinks(links); // put the old order back if it failed
    }
  }

  if (loading) {
    return (
      <section className="alinks">
        <div className="alinks__inner">
          <WorkflowProgress activeStep={1} />
          <p className="alinks__loading">Loading your links…</p>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="alinks">
        <div className="alinks__inner">
          <WorkflowProgress activeStep={1} />
          <div className="alinks__empty">
            <h2 className="alinks__title">Create your profile first</h2>
            <p className="alinks__lead">Finish the profile steps before adding links.</p>
            <button type="button" className="alinks__btn" onClick={onBack}>
              Back to dashboard
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="alinks">
      <div className="alinks__inner">
        <div className="alinks__topbar">
          <button type="button" className="alinks__back" onClick={onBack}>
            &larr; Back
          </button>
          <Link to="/" className="alinks__brand" aria-label="MLink home">
            MLink
          </Link>
        </div>

        <WorkflowProgress activeStep={1} />

        <div className="alinks__head">
          <h1 className="alinks__title">Add your links</h1>
          <p className="alinks__lead">
            These show as buttons on your page. Your saved social icons and details already appear
            automatically &mdash; add anything else here.
          </p>
        </div>

        {error && <p className="alinks__error">{error}</p>}

        <div className="alinks__layout">
          <div className="alinks__form-col">
            {suggestions.length > 0 && (
              <div className="alinks__suggest">
                <p className="alinks__suggest-title">Suggested, from your profile</p>
                <div className="alinks__suggest-row">
                  {suggestions.map((s) => (
                    <button
                      type="button"
                      key={s.icon}
                      className="alinks__chip"
                      onClick={() => applySuggestion(s)}
                    >
                      <LinkIcon icon={s.icon} width="15" height="15" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {trialLimited && (
              <p className="alinks__trial-note">
                Your free trial includes unlimited profile links and access to all plan features.
              </p>
            )}
            {!trialLimited && (
              <p className="alinks__trial-note">
                Your plan includes{' '}
                {linkLimit === null ? 'unlimited links.' : `up to ${linkLimit} links (${links.length} of ${linkLimit} used).`}
              </p>
            )}

            <form className="alinks__card" onSubmit={submitForm}>
              <p className="alinks__card-title">{editingId ? 'Edit link' : 'Add a link'}</p>

              <p className="alinks__label">Icon</p>
              <div className="alinks__icons">
                {pickerIcons.map((i) => (
                  <button
                    type="button"
                    key={i.key}
                    className={`alinks__icon-btn${form.icon === i.key ? ' alinks__icon-btn--on' : ''}`}
                    aria-pressed={form.icon === i.key}
                    title={i.label}
                    onClick={() => setForm((f) => ({ ...f, icon: i.key }))}
                  >
                    <LinkIcon icon={i.key} width="17" height="17" />
                  </button>
                ))}
              </div>

              <div className="alinks__field">
                <label htmlFor="al-label">Label</label>
                <input
                  id="al-label"
                  type="text"
                  maxLength={60}
                  placeholder="e.g. Book a call"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  aria-invalid={!!fieldErrors.label}
                />
                {fieldErrors.label && <p className="alinks__field-error">{fieldErrors.label}</p>}
              </div>

              <div className="alinks__field">
                <label htmlFor="al-url">Link</label>
                <input
                  id="al-url"
                  type="text"
                  maxLength={255}
                  placeholder="https://…"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  aria-invalid={!!fieldErrors.url}
                />
                {fieldErrors.url && <p className="alinks__field-error">{fieldErrors.url}</p>}
              </div>

              <div className="alinks__card-actions">
                {editingId && (
                  <button type="button" className="alinks__btn alinks__btn--ghost" onClick={resetForm}>
                    Cancel
                  </button>
                )}
                <button type="submit" className="alinks__btn" disabled={saving || atLimit}>
                  {saving ? 'Saving…' : editingId ? 'Save changes' : atLimit ? 'Link limit reached' : 'Add link'}
                </button>
              </div>
            </form>

            {links.length > 0 && (
              <div className="alinks__list">
                {links.map((l, i) => (
                  <div className={`alinks__row${l.is_active ? '' : ' alinks__row--off'}`} key={l.id}>
                    <span className="alinks__row-icon">
                      <LinkIcon icon={l.icon} width="16" height="16" />
                    </span>
                    <div className="alinks__row-text">
                      <p className="alinks__row-label">{l.label}</p>
                      <p className="alinks__row-url">{l.url}</p>
                    </div>
                    <div className="alinks__row-actions">
                      <button
                        type="button"
                        className="alinks__row-btn"
                        aria-label="Move up"
                        disabled={i === 0}
                        onClick={() => move(i, -1)}
                      >
                        &uarr;
                      </button>
                      <button
                        type="button"
                        className="alinks__row-btn"
                        aria-label="Move down"
                        disabled={i === links.length - 1}
                        onClick={() => move(i, 1)}
                      >
                        &darr;
                      </button>
                      <label className="alinks__row-toggle">
                        <input
                          type="checkbox"
                          checked={!!l.is_active}
                          disabled={busyId === l.id}
                          onChange={() => toggleActive(l)}
                        />
                        {l.is_active ? 'On' : 'Off'}
                      </label>
                      <button type="button" className="alinks__row-btn" onClick={() => startEdit(l)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="alinks__row-btn alinks__row-btn--danger"
                        disabled={busyId === l.id}
                        onClick={() => removeLink(l)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="alinks__preview-col">
            <div className="alinks__preview-sticky">
              {template ? (
                <div className="alinks__phone">
                  <TemplatePreview template={template} profile={previewProfile} />
                </div>
              ) : (
                <p className="alinks__no-template">Choose a template to see a live preview here.</p>
              )}
            </div>
          </div>
        </div>

        <div className="alinks__bottom">
          <button type="button" className="alinks__btn" onClick={() => onContinue && onContinue()}>
            Continue to Customize
          </button>
        </div>
      </div>
    </section>
  );
}