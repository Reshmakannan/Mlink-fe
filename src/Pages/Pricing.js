import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMySubscription, verifyPayment } from '../Api/Subscriptionapi';
import PaymentModal from '../Components/PaymentModal';
import '../Style/Pricing.css';

const FLASH_KEY = 'mlink_flash';

const BILLING_TERMS = [
  { key: 'monthly', label: 'Monthly', cadence: '/ month', billingDetails: 'One-time payment for 1 month' },
  { key: '3_months', label: '3 Months', cadence: '/ 3 months', billingDetails: 'One-time payment for 3 months' },
  { key: '6_months', label: '6 Months', cadence: '/ 6 months', billingDetails: 'One-time payment for 6 months' },
  { key: '1_year', label: '12 Months', cadence: '/ 12 months', billingDetails: 'One-time payment for 12 months' },
];

const PLAN_DISPLAY = [
  {
    key: 'basic',
    label: 'Basic',
    prices: { monthly: 199, '3_months': 539, '6_months': 1079, '1_year': 2159 },
    features: [
      '2 profile links',
      '1 social media link',
      '5 templates per category',
      'Basic customization',
    ],
  },
  {
    key: 'standard',
    label: 'Standard',
    prices: { monthly: 379, '3_months': 1049, '6_months': 2099, '1_year': 4199 },
    popular: true,
    features: [
      '5 profile links',
      '3 social media links',
      '10 templates per category',
      'Basic customization',
    ],
  },
  {
    key: 'pro',
    label: 'Pro',
    prices: { monthly: 449, '3_months': 1199, '6_months': 2399, '1_year': 4799 },
    features: [
      'Unlimited profile links',
      'Unlimited social media links',
      '25 templates per category',
      'Basic customization',
    ],
  },
];

const PLAN_TYPE_LABELS = Object.fromEntries(
  PLAN_DISPLAY.flatMap((plan) =>
    BILLING_TERMS.map((term) => [
      `${plan.key}_${term.key}`,
      `${plan.label} · ${term.label}`,
    ])
  )
);

const LEGACY_PLAN_LABELS = {
  monthly: 'Basic · Monthly',
  '3_months': 'Standard · 3 Months',
  '6_months': 'Pro · 6 Months',
  '1_year': 'Pro · 12 Months',
};

const planTypeFor = (tier, term) => `${tier}_${term}`;
const planLabelFor = (planType) =>
  planType === 'free_trial'
    ? 'MLink Free Trial'
    : PLAN_TYPE_LABELS[planType] || LEGACY_PLAN_LABELS[planType] || planType;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const STORAGE_KEY = 'mlink_subscription';
// Set by Dashboard's "Change plan" button so this page doesn't auto-redirect
// back to the Dashboard while the user is choosing a new plan.
const CHANGE_FLAG = 'mlink_changing_plan';

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

function isChangingPlan() {
  try {
    return sessionStorage.getItem(CHANGE_FLAG) === '1';
  } catch {
    return false;
  }
}

function clearChangingPlan() {
  try {
    sessionStorage.removeItem(CHANGE_FLAG);
  } catch {
    /* ignore */
  }
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function Pricing({ onBack, onLogout, onPlanActivated }) {
  const [subscription, setSubscription] = useState(readCachedSubscription);
  const [loading, setLoading] = useState(true);
  const [previewKey, setPreviewKey] = useState(null);
  const [billingTerm, setBillingTerm] = useState('monthly');
  const [payPlan, setPayPlan] = useState(null);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');
  const planActivatedRef = useRef(onPlanActivated);

  useEffect(() => {
    planActivatedRef.current = onPlanActivated;
  }, [onPlanActivated]);

  // One-time message left by the Dashboard (for example after cancelling).
  useEffect(() => {
    try {
      const msg = sessionStorage.getItem(FLASH_KEY);
      if (msg) {
        sessionStorage.removeItem(FLASH_KEY);
        setFlash(msg);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    refreshFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('omniware_payment');
    const orderId = params.get('order_id');
    const paymentReason = params.get('reason');
    if (!paymentStatus) return undefined;

    params.delete('omniware_payment');
    params.delete('order_id');
    params.delete('reason');
    const query = params.toString();
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`,
    );

    if (paymentStatus === 'failed') {
      setFlash(
        paymentReason
          ? `Payment verification failed: ${paymentReason}`
          : 'The payment was not completed. You have not been given access.',
      );
      return undefined;
    }
    if (!orderId || !['success', 'pending'].includes(paymentStatus)) {
      setFlash('We could not confirm the payment. Please check your plan status or contact support.');
      return undefined;
    }

    let off = false;
    (async () => {
      setFlash('Confirming your payment with Federal Bank…');
      try {
        for (let attempt = 0; attempt < 5; attempt += 1) {
          const result = await verifyPayment({ order_id: orderId });
          if (off) return;
          if (result.subscription) {
            setSubscription(result.subscription);
            cacheSubscription(result.subscription);
            setFlash('Your payment is confirmed and your plan is active.');
            if (planActivatedRef.current) planActivatedRef.current(result.subscription);
            return;
          }
          if (!result.pending) {
            setFlash(result.message || 'The payment was not completed.');
            return;
          }
          if (attempt < 4) await wait(2000);
        }
        if (!off) setFlash('Your payment is still being confirmed. Please refresh your dashboard shortly.');
      } catch (err) {
        if (!off) setFlash(err.message);
      }
    })();

    return () => {
      off = true;
    };
  }, []);

  function applySubscription(sub) {
    setSubscription(sub);
    cacheSubscription(sub);
  }

  async function refreshFromServer() {
    try {
      const sub = await getMySubscription();
      applySubscription(sub);
      // Skip the auto-redirect when the user came here to change their plan.
      if (
        sub &&
        ['trialing', 'active'].includes(sub.status) &&
        onPlanActivated &&
        !isChangingPlan()
      ) {
        onPlanActivated(sub);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // The server creates a pending order before redirecting to Federal Bank.
  function handleSelectPlan(planKey) {
    setError('');
    if (hasLiveSubscription && subscription.plan_type === planKey) return;
    if (hasLiveSubscription) {
      setError('Choose a new plan after your current access period ends.');
      return;
    }
    setPayPlan(planKey);
  }

  function handleBack() {
    clearChangingPlan();
    if (onBack) onBack();
  }

  function handleLogout() {
    clearChangingPlan();
    if (onLogout) onLogout();
  }

  function openFeatures(planKey) {
    setPreviewKey(planKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeFeatures() {
    setPreviewKey(null);
  }

  const hasLiveSubscription =
    subscription && ['trialing', 'active'].includes(subscription.status);

  function buttonLabel(planType) {
    if (hasLiveSubscription && subscription.plan_type === planType) {
      return 'Current plan';
    }
    if (hasLiveSubscription) {
      return 'Available after current plan ends';
    }
    return 'Choose plan';
  }

  const previewPlan = previewKey
    ? PLAN_DISPLAY.find((p) => p.key === previewKey)
    : null;
  const previewPlanType = previewPlan ? planTypeFor(previewPlan.key, billingTerm) : null;

  const previewIsCurrent =
    previewPlan &&
    hasLiveSubscription &&
    subscription.plan_type === previewPlanType;

  return (
    <section className="mlink-pricing">
      <div className="mlink-pricing__inner">
        <div className="mlink-pricing__topbar">
          <button type="button" className="mlink-pricing__back" onClick={handleBack}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>

          <button type="button" className="mlink-pricing__logout" onClick={handleLogout}>
            Log out
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>

        <div className="mlink-pricing__intro">
          <Link to="/" className="mlink-pricing__eyebrow" aria-label="MLink home">
            MLink
          </Link>
          <h1 className="mlink-pricing__headline">Choose your plan</h1>
          <p className="mlink-pricing__sub">
            Choose a plan and access period. Each plan is a one-time payment in Indian rupees and does not renew
            automatically.
          </p>
        </div>

        <div className="mlink-pricing__terms" role="group" aria-label="Billing period">
          {BILLING_TERMS.map((term) => (
            <button
              type="button"
              key={term.key}
              className={`mlink-pricing__term${billingTerm === term.key ? ' mlink-pricing__term--active' : ''}`}
              aria-pressed={billingTerm === term.key}
              onClick={() => setBillingTerm(term.key)}
            >
              {term.label}
            </button>
          ))}
        </div>

        {subscription && (
          <div className={`mlink-pricing__status mlink-pricing__status--${subscription.status}`}>
            <div>
              <p className="mlink-pricing__status-label">
                {subscription.status === 'trialing' && 'Free trial active'}
                {subscription.status === 'active' && 'Subscription active'}
                {subscription.status === 'past_due' && 'Payment failed'}
                {subscription.status === 'cancelled' && 'Subscription cancelled'}
                {subscription.status === 'expired' && 'Subscription expired'}
              </p>
              <p className="mlink-pricing__status-detail">
                {planLabelFor(subscription.plan_type)}{' '}
                &middot;{' '}
                {subscription.status === 'trialing'
                  ? `Trial ends ${formatDate(subscription.trial_end_date)}`
                  : subscription.status === 'past_due'
                  ? 'Choose a plan to try again'
                  : subscription.status === 'cancelled' || subscription.status === 'expired'
                  ? 'Choose a plan to start again'
                  : `Access ends ${formatDate(subscription.subscription_end_date)}`}
              </p>
            </div>
          </div>
        )}

        {flash && <p className="mlink-pricing__notice">{flash}</p>}
        {error && <p className="mlink-pricing__error">{error}</p>}

        {previewPlan ? (
          <div className="mlink-selected">
            <div className="mlink-selected__header">
              <p className="mlink-selected__eyebrow">Your Selected Plan</p>
              {previewPlan.popular && <span className="mlink-selected__badge">Most popular</span>}
              <h2 className="mlink-selected__name">{previewPlan.label}</h2>
              <p className="mlink-selected__price">
                &#8377;{previewPlan.prices[billingTerm]}
                <span>{BILLING_TERMS.find((term) => term.key === billingTerm)?.cadence}</span>
              </p>
              <p className="mlink-selected__billing">
                {BILLING_TERMS.find((term) => term.key === billingTerm)?.billingDetails}
              </p>
              <span className="mlink-selected__trial">One-time payment · No automatic renewal</span>
            </div>

            <div className="mlink-selected__body">
              <p className="mlink-selected__heading">What&rsquo;s included</p>

              <ul className="mlink-selected__features">
                {previewPlan.features.map((feature) => (
                  <li key={feature}>
                    <span className="mlink-selected__check" aria-hidden="true">
                      &#10003;
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <p className="mlink-selected__note">
                Applicable payment gateway charges may be added at checkout. Access is for the selected period only.
              </p>

              <div className="mlink-selected__actions">
                <button type="button" className="mlink-selected__change" onClick={closeFeatures}>
                  Change Plan
                </button>
                <button
                  type="button"
                  className="mlink-selected__continue"
                  disabled={loading || previewIsCurrent || hasLiveSubscription}
                  onClick={() => handleSelectPlan(previewPlanType)}
                >
                  {previewIsCurrent
                    ? 'Current plan'
                    : hasLiveSubscription
                    ? 'Available after current plan ends'
                    : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mlink-pricing__grid">
            {PLAN_DISPLAY.map((plan) => {
              const planType = planTypeFor(plan.key, billingTerm);
              const isCurrent = hasLiveSubscription && subscription.plan_type === planType;
              return (
                <div
                  className={`mlink-plan${isCurrent ? ' mlink-plan--current' : ''}${plan.popular ? ' mlink-plan--popular' : ''}`}
                  key={plan.key}
                >
                  {plan.popular && <span className="mlink-plan__ribbon">Most Popular</span>}
                  <p className="mlink-plan__name">{plan.label}</p>
                  <p className="mlink-plan__price">
                    &#8377;{plan.prices[billingTerm]}
                    <span>{BILLING_TERMS.find((term) => term.key === billingTerm)?.cadence}</span>
                  </p>
                  <p className="mlink-plan__billing">
                    {BILLING_TERMS.find((term) => term.key === billingTerm)?.billingDetails}
                  </p>
                  <p className="mlink-plan__trial">One-time payment · No automatic renewal</p>

                  <div className="mlink-plan__actions">
                    <button
                      type="button"
                      className="mlink-plan__features-btn"
                      onClick={() => openFeatures(plan.key)}
                    >
                      View Features
                    </button>
                    <button
                      type="button"
                      className="mlink-plan__cta"
                      disabled={isCurrent || loading || hasLiveSubscription}
                      onClick={() => handleSelectPlan(planType)}
                    >
                      {buttonLabel(planType)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {payPlan && (
        <PaymentModal
          planKey={payPlan}
          onClose={() => setPayPlan(null)}
        />
      )}
    </section>
  );
}