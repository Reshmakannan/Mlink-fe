import React, { useEffect, useState } from 'react';
import { getMySubscription } from '../Api/Subscriptionapi';
import '../Style/TrialCountdown.css';

function getTrialEnd(subscription) {
  if (!subscription || subscription.status !== 'trialing') return null;
  const timestamp = new Date(subscription.access_until || subscription.trial_end_date).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function formatRemaining(milliseconds) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  const clock = [hours, minutes, remainder]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
  return days > 0 ? `${days}d ${clock}` : clock;
}

export default function TrialCountdown({ user, pathname, onChoosePlan }) {
  const [trialEndsAt, setTrialEndsAt] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let active = true;
    if (!user) {
      setTrialEndsAt(null);
      return () => {
        active = false;
      };
    }

    getMySubscription()
      .then((subscription) => {
        if (active) setTrialEndsAt(getTrialEnd(subscription));
      })
      .catch((error) => {
        console.error('Could not load trial countdown:', error.message);
        if (active) setTrialEndsAt(null);
      });

    return () => {
      active = false;
    };
  }, [user, pathname]);

  useEffect(() => {
    if (!trialEndsAt) return undefined;
    const timerId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, [trialEndsAt]);

  const remaining = trialEndsAt === null ? null : trialEndsAt - now;
  if (!user || remaining === null || remaining <= 0) return null;

  return (
    <aside className="mlink-trial-countdown" aria-label="Free trial countdown">
      <span className="mlink-trial-countdown__copy">Your free trial ends in</span>
      <time
        className="mlink-trial-countdown__time"
        dateTime={new Date(trialEndsAt).toISOString()}
        aria-label={`${formatRemaining(remaining)} remaining`}
      >
        {formatRemaining(remaining)}
      </time>
      <button
        type="button"
        className="mlink-trial-countdown__action"
        onClick={onChoosePlan}
      >
        Choose a plan
      </button>
    </aside>
  );
}
