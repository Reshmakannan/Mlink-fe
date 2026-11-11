import React, { useEffect, useState } from "react";
import "../Style/Toast.css";

// Shows `message` for `duration` ms, plays a short exit animation, then
// calls onDone so the parent can clear its state. Renders nothing when
// message is empty/null.
export default function Toast({ message, onDone, duration = 2200 }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!message) return undefined;
    setLeaving(false);
    const leaveTimer = setTimeout(() => setLeaving(true), duration);
    const doneTimer = setTimeout(() => onDone && onDone(), duration + 280);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, [message, duration, onDone]);

  if (!message) return null;

  return (
    <div
      className={`mlink-toast${leaving ? " mlink-toast--leaving" : ""}`}
      role="status"
      aria-live="polite"
    >
      <span className="mlink-toast-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {message}
    </div>
  );
}