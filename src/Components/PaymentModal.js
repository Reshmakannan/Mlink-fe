import React, { useEffect, useState } from 'react';
import { getPaymentTerms, startCheckout } from '../Api/Subscriptionapi';
import '../Style/PaymentModal.css';

const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

export default function PaymentModal({ planKey, onClose }) {
  const [terms, setTerms] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [billing, setBilling] = useState({ phone: '', city: '', zip_code: '' });
  const [phase, setPhase] = useState('loading');
  const [error, setError] = useState('');
  const busy = phase === 'paying';

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const paymentTerms = await getPaymentTerms(planKey);
        if (off) return;
        setTerms(paymentTerms);
        setPhase('ready');
      } catch (err) {
        if (off) return;
        setError(err.message);
        setPhase('error');
      }
    })();
    return () => {
      off = true;
    };
  }, [planKey]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape' && !busy) onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [busy, onClose]);

  function updateBilling(event) {
    const { name, value } = event.target;
    setBilling((current) => ({ ...current, [name]: value }));
  }

  async function pay() {
    setError('');
    setPhase('paying');
    try {
      const checkout = await startCheckout(planKey, billing);
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = checkout.action;
      form.acceptCharset = 'UTF-8';
      form.hidden = true;

      Object.entries(checkout.fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError(err.message);
      setPhase('error');
    }
  }

  return (
    <div className="paym__overlay" onClick={() => !busy && onClose()}>
      <div
        className="paym"
        role="dialog"
        aria-modal="true"
        aria-label="Payment details"
        onClick={(event) => event.stopPropagation()}
      >
        {!busy && (
          <button type="button" className="paym__x" aria-label="Close" onClick={onClose}>
            &times;
          </button>
        )}

        {phase === 'loading' && <p className="paym__msg">Loading payment details…</p>}
        {busy && (
          <div className="paym__confirming">
            <span className="paym__spinner" aria-hidden="true" />
            <p className="paym__msg">Connecting to Federal Bank…</p>
            <p className="paym__small">Please don&rsquo;t close this window.</p>
          </div>
        )}

        {terms && !busy && (
          <>
            <p className="paym__eyebrow">{terms.label} plan</p>
            <h2 className="paym__title">One-time payment</h2>

            <dl className="paym__list">
              <div>
                <dt>Pay now</dt>
                <dd>{money(terms.price)}</dd>
              </div>
              <div>
                <dt>Access period</dt>
                <dd>{terms.billing}</dd>
              </div>
              <div>
                <dt>Auto-renewal</dt>
                <dd>No</dd>
              </div>
            </dl>

            <fieldset className="paym__fields">
              <legend>Billing details</legend>
              <label className="paym__field">
                Phone number
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  maxLength="30"
                  required
                  value={billing.phone}
                  onChange={updateBilling}
                />
              </label>
              <label className="paym__field">
                City
                <input
                  type="text"
                  name="city"
                  autoComplete="address-level2"
                  maxLength="255"
                  required
                  value={billing.city}
                  onChange={updateBilling}
                />
              </label>
              <label className="paym__field">
                Postal code
                <input
                  type="text"
                  name="zip_code"
                  autoComplete="postal-code"
                  maxLength="20"
                  required
                  value={billing.zip_code}
                  onChange={updateBilling}
                />
              </label>
            </fieldset>

            <p className="paym__small">
              Applicable payment gateway charges may be added by Federal Bank and shown during checkout.
              Test payments currently support net banking only.
            </p>

            <label className="paym__consent">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
              />
              <span>
                I agree to pay {money(terms.price)} as a one-time charge for {terms.billing}. This plan will not
                renew automatically.
              </span>
            </label>

            {error && <p className="paym__error" role="alert">{error}</p>}

            <button
              type="button"
              className="paym__btn"
              disabled={
                !agreed ||
                phase === 'paying' ||
                !billing.phone.trim() ||
                !billing.city.trim() ||
                !billing.zip_code.trim()
              }
              onClick={pay}
            >
              {phase === 'error' ? 'Try again' : 'Continue to Federal Bank'}
            </button>
          </>
        )}

        {!terms && phase === 'error' && (
          <>
            <p className="paym__error" role="alert">{error}</p>
            <button type="button" className="paym__btn paym__btn--ghost" onClick={onClose}>
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
