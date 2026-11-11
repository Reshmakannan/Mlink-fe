import React, { useEffect, useState } from "react";
import { getMySubscription } from "../Api/Subscriptionapi";
import BrandLogo from "../Components/BrandLogo";
import "../Style/Dashboard.css";

const STORAGE_KEY = "mlink_subscription";
// Tells Pricing.js the user came here to change plan, so it must not
// auto-redirect back to the Dashboard.
const CHANGE_FLAG = "mlink_changing_plan";
const TIER_LABELS = { basic: "Basic", standard: "Standard", pro: "Pro" };
const TERM_LABELS = {
  monthly: "Monthly",
  "3_months": "3 Months",
  "6_months": "6 Months",
  "1_year": "12 Months",
};
const LEGACY_PLAN_LABELS = {
  monthly: "Basic · Monthly",
  "3_months": "Standard · 3 Months",
  "6_months": "Pro · 6 Months",
  "1_year": "Pro · 12 Months",
};

function planLabel(planType) {
  if (planType === "free_trial") return "MLink Free Trial";
  for (const tier of Object.keys(TIER_LABELS)) {
    const prefix = `${tier}_`;
    if (
      planType.startsWith(prefix) &&
      TERM_LABELS[planType.slice(prefix.length)]
    ) {
      return `${TIER_LABELS[tier]} · ${TERM_LABELS[planType.slice(prefix.length)]}`;
    }
  }
  return LEGACY_PLAN_LABELS[planType] || planType;
}

function periodLabel(planType) {
  for (const term of Object.keys(TERM_LABELS)) {
    if (planType === term || planType.endsWith(`_${term}`))
      return TERM_LABELS[term].toLowerCase();
  }
  return "period";
}

const STATUS_LABELS = {
  trialing: "Free trial",
  active: "Active",
  past_due: "Payment failed",
  cancelled: "Cancelled",
  expired: "Expired",
};

function readCachedSubscription() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function cacheSubscription(subscription) {
  if (subscription) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function markChangingPlan() {
  try {
    sessionStorage.setItem(CHANGE_FLAG, "1");
  } catch {
    /* ignore */
  }
}

function readUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function timeLeft(value, now) {
  if (!value) return "";
  const ms = new Date(value).getTime() - now;
  if (ms <= 0) return "ending now";
  const mins = Math.floor(ms / 60000);
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

function initials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

const TERM_DAYS = {
  monthly: 30,
  "3_months": 90,
  "6_months": 180,
  "1_year": 365,
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function termDays(planType) {
  for (const term of Object.keys(TERM_DAYS)) {
    if (planType === term || planType.endsWith(`_${term}`))
      return TERM_DAYS[term];
  }
  return null;
}

// Share of the current billing period (or trial) already used, 0-100.
// Returns null when the dates needed to work it out are not available.
function periodProgress(sub, now) {
  if (!sub) return null;
  let start = null;
  let end = null;
  if (sub.status === "trialing") {
    start = sub.trial_start_date
      ? new Date(sub.trial_start_date).getTime()
      : null;
    end = sub.trial_end_date ? new Date(sub.trial_end_date).getTime() : null;
  } else if (sub.status === "active") {
    end = sub.subscription_end_date
      ? new Date(sub.subscription_end_date).getTime()
      : null;
    const days = termDays(sub.plan_type || "");
    start = end && days ? end - days * 86400000 : null;
  }
  if (!start || !end || end <= start) return null;
  return Math.max(
    0,
    Math.min(100, Math.round(((now - start) / (end - start)) * 100)),
  );
}

export default function Dashboard({ onChangePlan, onLogout, onOpenProfile }) {
  const [user] = useState(readUser);
  const [subscription, setSubscription] = useState(readCachedSubscription);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const sub = await getMySubscription();
        setSubscription(sub);
        cacheSubscription(sub);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChangePlan() {
    markChangingPlan();
    onChangePlan();
  }

  function handleOpenProfile() {
    if (onOpenProfile) onOpenProfile();
  }

  if (loading) {
    return (
      <section className="mlink-dashboard">
        <div className="mlink-dashboard__inner">
          <div className="mlink-dashboard__topbar">
            <BrandLogo />
          </div>
          <div className="mlink-dashboard__skeleton" aria-hidden="true">
            <div className="mlink-dashboard__skeleton-block mlink-dashboard__skeleton-block--sm" />
            <div className="mlink-dashboard__skeleton-block mlink-dashboard__skeleton-block--lg" />
          </div>
          <p className="mlink-dashboard__loading">Loading your account…</p>
        </div>
      </section>
    );
  }

  if (!subscription || !["trialing", "active"].includes(subscription.status)) {
    const exploreName = ((user && user.name) || "").trim().split(/\s+/)[0];
    const ended = !!subscription && ["cancelled", "expired"].includes(subscription.status);
    return (
      <section className="mlink-dashboard">
        <div className="mlink-dashboard__inner">
          <div className="mlink-dashboard__topbar">
            <BrandLogo />
            <button type="button" className="mlink-dashboard__logout" onClick={onLogout}>
              Log out
            </button>
          </div>

          <div className="mlink-dashboard__welcome">
            <p className="mlink-dashboard__eyebrow">ACCOUNT OVERVIEW</p>
            <h1>
              {greeting()}
              {exploreName ? `, ${exploreName}` : ""}
            </h1>
            <p>
              {ended
                ? "Your access has ended. Choose a plan to continue building and publish your page."
                : "Build your page and explore every feature before choosing a plan."}
            </p>
          </div>

          <div className="mlink-dashboard__profile">
            <div className="mlink-dashboard__avatar">{initials(user?.name)}</div>
            <div className="mlink-dashboard__profile-info">
              <p className="mlink-dashboard__name">{user?.name || "Your account"}</p>
              <p className="mlink-dashboard__email">{user?.email || "—"}</p>
            </div>
            {!ended && (
              <button type="button" className="mlink-dashboard__profile-btn" onClick={handleOpenProfile}>
                Edit profile
              </button>
            )}
          </div>

          {error && <p className="mlink-dashboard__error">{error}</p>}
          {subscription && subscription.status === "past_due" && (
            <div className="mlink-dashboard__alert" role="alert">
              <div>
                <strong>Your last payment failed.</strong>
                <span>Choose a plan again to keep your page live.</span>
              </div>
              <button type="button" onClick={handleChangePlan}>
                Fix now
              </button>
            </div>
          )}

          <div className="mlink-dashboard__explore">
            <span className="mlink-dashboard__explore-badge">Exploring</span>
            <h2 className="mlink-dashboard__explore-title">
              {ended ? "Your plan has ended" : "You're exploring MLink"}
            </h2>
            <p className="mlink-dashboard__explore-text">
              {ended
                ? "Choose a plan to restore access to your page and its features. Your saved profile details are kept."
                : "Build your profile, pick any template, add links and customize your page for free. Choose a one-time plan for the access period you need when you are ready to publish."}
            </p>
            {!ended && (
              <ul className="mlink-dashboard__explore-list">
                <li>All templates and customization</li>
                <li>Live preview of your page</li>
                <li>Your work is saved</li>
              </ul>
            )}
            <div className="mlink-dashboard__explore-actions">
              {!ended && (
                <button type="button" className="mlink-dashboard__profile-btn" onClick={handleOpenProfile}>
                  Build my page
                </button>
              )}
              <button type="button" className="mlink-dashboard__change" onClick={handleChangePlan}>
                Choose a plan
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const isTrialing = subscription.status === "trialing";
  const isLive =
    subscription.status === "trialing" || subscription.status === "active";
  const oneTimePurchase = subscription.payment_provider === "omniware";
  const cancelRequested = !!subscription.cancelled_at;
  const accessUntil =
    subscription.access_until ||
    (isTrialing
      ? subscription.trial_end_date
      : subscription.subscription_end_date);

  const firstName = ((user && user.name) || "").trim().split(/\s+/)[0];
  const progress = periodProgress(subscription, now);
  const remaining = timeLeft(accessUntil, now);

  const statusText = oneTimePurchase
    ? "One-time purchase · no automatic renewal"
    : isTrialing
    ? cancelRequested
      ? "Free trial · cancelled"
      : `Free trial · ${timeLeft(subscription.trial_end_date, now)}`
    : subscription.status === "active" && cancelRequested
      ? "Active · cancelling"
      : STATUS_LABELS[subscription.status] || subscription.status;

  return (
    <section className="mlink-dashboard">
      <div className="mlink-dashboard__inner">
        <div className="mlink-dashboard__topbar">
          <BrandLogo />
          <button
            type="button"
            className="mlink-dashboard__logout"
            onClick={onLogout}
          >
            Log out
          </button>
        </div>

        <div className="mlink-dashboard__welcome">
          <p className="mlink-dashboard__eyebrow">ACCOUNT OVERVIEW</p>
          <h1>
            {greeting()}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p>Manage your page and plan access in one place.</p>
        </div>

        <div className="mlink-dashboard__profile">
          <div className="mlink-dashboard__avatar">{initials(user?.name)}</div>
          <div className="mlink-dashboard__profile-info">
            <p className="mlink-dashboard__name">
              {user?.name || "Your account"}
            </p>
            <p className="mlink-dashboard__email">{user?.email || "—"}</p>
          </div>
          <button
            type="button"
            className="mlink-dashboard__profile-btn"
            onClick={handleOpenProfile}
          >
            <svg
              className="mlink-dashboard__profile-icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            Edit profile
          </button>
        </div>

        {error && <p className="mlink-dashboard__error">{error}</p>}
        {subscription.status === "past_due" && (
          <div className="mlink-dashboard__alert" role="alert">
            <div>
              <strong>Your last payment failed.</strong>
              <span>Choose a plan again to keep your page live.</span>
            </div>
            <button type="button" onClick={handleChangePlan}>
              Fix now
            </button>
          </div>
        )}

        <div
          className={`mlink-dashboard__card mlink-dashboard__card--${subscription.status}`}
        >
          <div className="mlink-dashboard__card-header">
            <p className="mlink-dashboard__plan-name">
              {planLabel(subscription.plan_type)}
            </p>
            <span
              className={`mlink-dashboard__badge mlink-dashboard__badge--${subscription.status}`}
            >
              {STATUS_LABELS[subscription.status] || subscription.status}
            </span>
          </div>

          <p className="mlink-dashboard__price">
            &#8377;{subscription.price}
            {!isTrialing && subscription.status === "active" && (
              <span> · {periodLabel(subscription.plan_type)} access</span>
            )}
          </p>

          {isLive && progress !== null && (
            <div className="mlink-dashboard__progress">
              <div
                className="mlink-dashboard__progress-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-label={
                  isTrialing ? "Trial progress" : "Access period progress"
                }
              >
                <span style={{ width: `${progress}%` }} />
              </div>
              <p>
                {progress}% of your {isTrialing ? "trial" : "access period"}{" "}
                used
                {remaining ? ` · ${remaining}` : ""}
              </p>
            </div>
          )}

          <dl className="mlink-dashboard__meta">
            <div>
              <dt>{isTrialing ? "Trial ends" : "Access ends"}</dt>
              <dd>
                {isTrialing
                  ? formatDateTime(subscription.trial_end_date)
                  : formatDateTime(subscription.subscription_end_date)}
              </dd>
            </div>
            <div>
              <dt>Purchase type</dt>
              <dd>
                {isTrialing
                  ? "Free trial · no payment"
                  : oneTimePurchase
                  ? "One-time · no renewal"
                  : "Legacy plan"}
              </dd>
            </div>
            <div>
              <dt>Time left</dt>
              <dd>
                {isLive && remaining ? remaining.replace(" left", "") : "—"}
              </dd>
            </div>
            <div>
              <dt>Automatic payments</dt>
              <dd>
                {oneTimePurchase || !subscription.auto_renewal || cancelRequested
                  ? "None"
                  : "Managed by the previous payment provider"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mlink-dashboard__manage">
          <p className="mlink-dashboard__manage-title">Plan access</p>

          <dl className="mlink-dashboard__manage-list">
            <div>
              <dt>Plan</dt>
              <dd>{planLabel(subscription.plan_type)}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{statusText}</dd>
            </div>
            <div>
              <dt>Access ends</dt>
              <dd>{formatDateTime(accessUntil)}</dd>
            </div>
            <div>
              <dt>Renewal</dt>
              <dd>{oneTimePurchase ? "No automatic renewal" : "Legacy plan"}</dd>
            </div>
          </dl>
          {oneTimePurchase ? (
            <p className="mlink-dashboard__manage-note">
              This payment covers the access period shown above. Choose another plan after it ends.
            </p>
          ) : subscription.auto_renewal && !cancelRequested ? (
            <p className="mlink-dashboard__alert" role="alert">
              This is a legacy recurring plan. Automatic payments may continue; manage or cancel the mandate with
              the provider that created it.
            </p>
          ) : null}
        </div>

        <footer className="mlink-dashboard__footer">
          <BrandLogo size={24} />
          <span>Your profile, beautifully shared.</span>
        </footer>
      </div>

    </section>
  );
}
