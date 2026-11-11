import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getMyProfile,
  getTemplateAccess,
  saveTemplate,
} from "../Api/Profileapi";
import TemplatePreview from "../Components/TemplatePreview";
import WorkflowProgress from "../Components/WorkflowProgress";
import BrandLogo from "../Components/BrandLogo";
import {
  CATEGORY_TABS,
  LIBRARY_SIZE,
  templateTier,
  isTemplateLocked,
  templatesFor,
  getTemplate,
  categoryLabel,
} from "../Data/templates";
import "../Style/Templates.css";

// import logoImg from '../Assets/mlink-logo.png';   // <- uncomment and pass src={logoImg} to use your real logo

const PAGE = 12;

const SORTS = [
  { key: "default", label: "Recommended" },
  { key: "az", label: "Name A–Z" },
  { key: "za", label: "Name Z–A" },
  { key: "style", label: "By style" },
];

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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}

function SkeletonGrid({ count = 8 }) {
  return (
    <div className="tpls__grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="tpls__skel" key={i}>
          <div className="tpls__skel-thumb" />
          <div className="tpls__skel-line" />
          <div className="tpls__skel-line tpls__skel-line--short" />
        </div>
      ))}
    </div>
  );
}

export default function Templates({ onBack, onContinue, onUpgrade }) {
  const [profile, setProfile] = useState(null);
  const [limit, setLimit] = useState(0);
  const [planTier, setPlanTier] = useState("starter");
  const [planStatus, setPlanStatus] = useState(null);
  const [planType, setPlanType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showLocked, setShowLocked] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [selectedId, setSelectedId] = useState("");
  const [openId, setOpenId] = useState("");
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const [{ profile: p }, access] = await Promise.all([
          getMyProfile(),
          getTemplateAccess(),
        ]);
        if (off) return;
        setProfile(p);
        setLimit(access.templates_per_category);
        setPlanTier(templateTier(access.plan_type, access.status));
        setPlanStatus(access.status);
        setPlanType(access.plan_type);
        if (p) {
          setSelectedId(p.template_id || "");
          // start on the category the user chose in the wizard
          if (p.category && CATEGORY_TABS.some((t) => t.key === p.category)) {
            setCategory(p.category);
          }
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

  const isLocked = useCallback(
    (template) => isTemplateLocked(template, planTier, limit),
    [planTier, limit],
  );

  // Templates of the current category + search, sorted
  const list = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let templates = templatesFor(category, planTier);
    if (query) {
      templates = templates.filter((template) =>
        `${template.name} ${template.styleName} ${categoryLabel(template.category)}`
          .toLowerCase()
          .includes(query),
      );
    }
    const copy = [...templates];
    if (sortBy === "az") copy.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "za") copy.sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === "style")
      copy.sort((a, b) => (a.styleName || "").localeCompare(b.styleName || ""));
    return copy;
  }, [category, planTier, searchQuery, sortBy]);

  const availableList = useMemo(
    () => list.filter((template) => !isLocked(template)),
    [list, isLocked],
  );
  const lockedCount = list.length - availableList.length;
  const displayList = showLocked ? list : availableList;
  const visible = displayList.slice(0, shown);

  // Number of usable designs per category (for the sidebar badges)
  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORY_TABS.forEach((c) => {
      counts[c.key] = templatesFor(c.key, planTier).filter(
        (t) => !isLocked(t),
      ).length;
    });
    return counts;
  }, [planTier, isLocked]);

  const openT = openId ? getTemplate(openId) : null;
  const selectedT = selectedId ? getTemplate(selectedId) : null;
  const selectedLocked = selectedT ? isLocked(selectedT) : false;
  const planName = planType
    ? planType
        .replace(/_(monthly|3_months|6_months|1_year)$/, "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : null;

  const isPaidActive = planStatus === "active" || planStatus === "trialing";
  const planChip = isPaidActive ? planName || "Active plan" : "Free access";

  function pickCategory(key) {
    setCategory(key);
    setShown(PAGE);
  }

  function searchTemplates(value) {
    setSearchQuery(value);
    setShown(PAGE);
  }

  function closeModal() {
    setOpenId("");
    setModalError("");
  }

  // prev / next inside the preview modal
  const openIndex = openId ? displayList.findIndex((t) => t.id === openId) : -1;
  const goRelative = useCallback(
    (step) => {
      if (openIndex < 0 || !displayList.length) return;
      const next = (openIndex + step + displayList.length) % displayList.length;
      setOpenId(displayList[next].id);
      setModalError("");
    },
    [openIndex, displayList],
  );

  // Esc closes, arrows navigate, and the page behind does not scroll.
  useEffect(() => {
    if (!openId) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") goRelative(1);
      if (e.key === "ArrowLeft") goRelative(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openId, goRelative]);

  async function applyTemplate(t) {
    setSaving(true);
    setModalError("");
    try {
      await saveTemplate(t.id);
      setSelectedId(t.id);
      closeModal();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="tpls">
        <div className="tpls__inner">
          <div className="tpls__topbar">
            <BrandLogo />
          </div>
          <WorkflowProgress activeStep={0} />
          <p className="tpls__loading">Loading templates…</p>
          <SkeletonGrid />
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="tpls">
        <div className="tpls__inner">
          <div className="tpls__topbar">
            <BrandLogo />
          </div>
          <WorkflowProgress activeStep={0} />
          <div className="tpls__empty">
            <BrandLogo
              size={52}
              withText={false}
              className="tpls__empty-logo"
            />
            <h2 className="tpls__title">Create your profile first</h2>
            <p className="tpls__lead">
              Templates use your saved details. Open Profile from the dashboard
              and finish the steps.
            </p>
            {error && <p className="tpls__error">{error}</p>}
            <button type="button" className="tpls__btn" onClick={onBack}>
              Back to dashboard
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tpls">
      <div className="tpls__inner">
        <div className="tpls__topbar">
          <button type="button" className="tpls__back" onClick={onBack}>
            &larr; Dashboard
          </button>
          <BrandLogo />
          <span
            className={`tpls__plan-chip${isPaidActive ? " tpls__plan-chip--on" : ""}`}
          >
            {planChip}
          </span>
        </div>

        <WorkflowProgress activeStep={0} />

        <header className="tpls__hero">
          <BrandLogo size={64} withText={false} className="tpls__hero-logo" />
          <div className="tpls__head">
            <p className="tpls__eyebrow">Step 1 · Design</p>
            <h1 className="tpls__title">Choose your template</h1>
            <p className="tpls__lead">
              Every design below already shows your own details. Pick the look
              you like.
              {limit < 25 ? (
                <>
                  {" "}
                  {limit === 3 &&
                  planStatus !== "active" &&
                  planStatus !== "trialing" ? (
                    <>
                      {planName
                        ? `${planName} subscription status: ${planStatus || "not found"}.`
                        : "No active subscription was found for this account."}{" "}
                      Paid templates become available after the subscription is
                      confirmed.
                    </>
                  ) : (
                    <>
                      Your plan includes {limit} templates per category.{" "}
                      <button
                        type="button"
                        className="tpls__link"
                        onClick={onUpgrade}
                      >
                        Upgrade for more templates
                      </button>
                    </>
                  )}
                </>
              ) : limit < LIBRARY_SIZE ? (
                <> Your plan includes 25 templates per category.</>
              ) : (
                <>
                  {" "}
                  Your trial includes all {LIBRARY_SIZE} templates per category.
                </>
              )}
            </p>
          </div>
        </header>

        {error && <p className="tpls__error">{error}</p>}

        <div className="tpls__layout">
          <aside className="tpls__side">
            <p className="tpls__side-title">Browse by category</p>
            <div className="tpls__cats">
              {CATEGORY_TABS.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  className={`tpls__cat${category === c.key ? " tpls__cat--on" : ""}`}
                  aria-pressed={category === c.key}
                  onClick={() => pickCategory(c.key)}
                >
                  <span>{c.label}</span>
                  <span className="tpls__cat-count">
                    {categoryCounts[c.key] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <div className="tpls__results">
            <div className="tpls__tools">
              <div className="tpls__search">
                <svg
                  viewBox="0 0 24 24"
                  width="19"
                  height="19"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4.2 4.2" />
                </svg>
                <label className="tpls__sr-only" htmlFor="template-search">
                  Search templates
                </label>
                <input
                  id="template-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => searchTemplates(event.target.value)}
                  placeholder="Search by style or category"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="tpls__search-clear"
                    aria-label="Clear search"
                    onClick={() => searchTemplates("")}
                  >
                    &times;
                  </button>
                )}
              </div>

              <div className="tpls__tools-row">
                <p className="tpls__result-count" aria-live="polite">
                  {displayList.length}{" "}
                  {displayList.length === 1 ? "design" : "designs"}
                  {searchQuery.trim() ? " found" : " available"}
                </p>

                <div className="tpls__tools-right">
                  {lockedCount > 0 && (
                    <label className="tpls__toggle">
                      <input
                        type="checkbox"
                        checked={showLocked}
                        onChange={(e) => {
                          setShowLocked(e.target.checked);
                          setShown(PAGE);
                        }}
                      />
                      <span className="tpls__toggle-track" aria-hidden="true" />
                      <span>Show locked ({lockedCount})</span>
                    </label>
                  )}

                  <label className="tpls__sort">
                    <span className="tpls__sr-only">Sort templates</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      {SORTS.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </div>

            <div className="tpls__grid">
              {visible.map((t, index) => {
                const locked = isLocked(t);
                const selected = selectedId === t.id;
                return (
                  <article
                    key={t.id}
                    style={{ animationDelay: `${Math.min(index, 11) * 40}ms` }}
                    className={`tpls__card${locked ? " tpls__card--locked" : ""}${
                      selected ? " tpls__card--sel" : ""
                    }`}
                  >
                    <div className="tpls__thumb">
                      {/* No customization here on purpose — the picker shows each
                          template's own look so categories/variants stay distinct.
                          Customization only applies once a template is selected. */}
                      <TemplatePreview
                        template={t}
                        profile={profile}
                        decorative
                      />
                      {locked && (
                        <span className="tpls__badge tpls__badge--lock">
                          <LockIcon /> Locked
                        </span>
                      )}
                      {selected && (
                        <span className="tpls__badge tpls__badge--sel">
                          <CheckIcon /> Selected
                        </span>
                      )}
                      <span className="tpls__thumb-cta" aria-hidden="true">
                        Preview
                      </span>
                    </div>
                    <div className="tpls__meta">
                      <span className="tpls__name">{t.name}</span>
                      <span className="tpls__style">{t.styleName}</span>
                    </div>
                    <button
                      type="button"
                      className="tpls__hit"
                      aria-label={`Preview ${t.name}${locked ? " (locked)" : ""}`}
                      onClick={() => setOpenId(t.id)}
                    />
                  </article>
                );
              })}
            </div>

            {displayList.length === 0 && (
              <div className="tpls__no-results">
                <span aria-hidden="true">⌕</span>
                <h2>No matching designs</h2>
                <p>Try a different style or category name.</p>
                <button
                  type="button"
                  className="tpls__btn tpls__btn--ghost"
                  onClick={() => searchTemplates("")}
                >
                  Clear search
                </button>
              </div>
            )}

            {shown < displayList.length && (
              <div className="tpls__more">
                <button
                  type="button"
                  className="tpls__btn tpls__btn--ghost"
                  onClick={() => setShown((n) => n + PAGE)}
                >
                  Show more templates ({displayList.length - shown} left)
                </button>
              </div>
            )}

            <footer className="tpls__footer">
              <BrandLogo size={26} tone="dark" />
              <span>Your profile, beautifully shared.</span>
            </footer>
          </div>
        </div>
      </div>

      {selectedT && (
        <div className="tpls__bar" role="status">
          <BrandLogo size={28} withText={false} />
          <span>
            {selectedLocked ? (
              <>
                <strong>{selectedT.name}</strong> isn&rsquo;t included in your
                current plan. Choose an included design or upgrade.
              </>
            ) : (
              <>
                Selected: <strong>{selectedT.name}</strong> &middot;{" "}
                {selectedT.styleName}
              </>
            )}
          </span>
          <button
            type="button"
            className="tpls__bar-btn"
            disabled={selectedLocked}
            onClick={() => onContinue && onContinue(selectedT.id)}
          >
            {selectedLocked ? "Plan locked" : "Continue"}
          </button>
        </div>
      )}

      {openT && (
        <div className="tpls__overlay" onClick={closeModal}>
          <div
            className="tpls__modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${openT.name} preview`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="tpls__x"
              aria-label="Close preview"
              onClick={closeModal}
            >
              &times;
            </button>

            <div className="tpls__modal-stage">
              <BrandLogo size={26} className="tpls__modal-logo" />

              {displayList.length > 1 && (
                <button
                  type="button"
                  className="tpls__nav tpls__nav--prev"
                  aria-label="Previous template"
                  onClick={() => goRelative(-1)}
                >
                  &lsaquo;
                </button>
              )}

              <div className="tpls__modal-phone">
                {/* Same reasoning as the grid: the preview modal shows the
                    template as-is, not whatever the user previously
                    customized on a different template. */}
                <TemplatePreview template={openT} profile={profile} />
              </div>

              {displayList.length > 1 && (
                <button
                  type="button"
                  className="tpls__nav tpls__nav--next"
                  aria-label="Next template"
                  onClick={() => goRelative(1)}
                >
                  &rsaquo;
                </button>
              )}

              {openIndex >= 0 && (
                <span className="tpls__counter">
                  {openIndex + 1} / {displayList.length}
                </span>
              )}
            </div>

            <div className="tpls__modal-info">
              <p className="tpls__eyebrow">{categoryLabel(openT.category)}</p>
              <h2 className="tpls__modal-title">{openT.name}</h2>
              <p className="tpls__modal-style">{openT.styleName} style</p>
              <p className="tpls__modal-text">
                This is your own profile inside the template. Your photo, bio,
                contact details and social links come from what you already
                saved.
              </p>

              {isLocked(openT) && (
                <p className="tpls__note">
                  <LockIcon /> This design is not included in your current plan.
                </p>
              )}
              {modalError && <p className="tpls__error">{modalError}</p>}

              <div className="tpls__modal-actions">
                {isLocked(openT) ? (
                  <button
                    type="button"
                    className="tpls__btn"
                    onClick={onUpgrade}
                  >
                    Upgrade to unlock
                  </button>
                ) : (
                  <button
                    type="button"
                    className="tpls__btn"
                    disabled={saving || selectedId === openT.id}
                    onClick={() => applyTemplate(openT)}
                  >
                    {selectedId === openT.id
                      ? "Selected"
                      : saving
                        ? "Saving…"
                        : "Use this template"}
                  </button>
                )}
                <button
                  type="button"
                  className="tpls__btn tpls__btn--ghost"
                  onClick={closeModal}
                >
                  Keep browsing
                </button>
              </div>

              <p className="tpls__hint">
                Tip: use the &larr; &rarr; keys to flip through designs, Esc to
                close.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
