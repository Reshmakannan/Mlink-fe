import React, { useEffect, useRef, useState } from "react";
import "../Style/Mascot.css";

/* "Mlinky" — the MLink mascot. A little red blob with a chain-link antenna.
   - eyes follow the cursor
   - blinks, hops (squash & stretch) and waves
   - click it and it boings and gasps

   Props
     mood       "happy" | "wow"
     wave       right arm waves (default true)
     hop        idle hop animation (default true)
     className  size it from CSS with  --mascot-size: 120px;
     onClick    optional extra handler
*/
const INK = "#120404";
const RED = "#d3141f";

const RINGS = [
  { x: 62, rot: -20, cx: 80 },
  { x: 102, rot: 20, cx: 120 },
];

export default function Mascot({
  mood = "happy",
  wave = true,
  hop = true,
  className = "",
  onClick,
}) {
  const rootRef = useRef(null);
  const timer = useRef(0);
  const [wow, setWow] = useState(false);

  /* eyes look at the pointer (desktop only) */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;

    let raf = 0;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height * 0.55);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 260);
        el.style.setProperty("--ex", `${(dx / d) * 7 * k}px`);
        el.style.setProperty("--ey", `${(dy / d) * 6 * k}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleClick = () => {
    setWow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setWow(false), 1000);
    if (onClick) onClick();
  };

  const face = wow ? "wow" : mood;

  return (
    <div
      ref={rootRef}
      className={`mascot${hop ? " mascot--hop" : ""}${wow ? " mascot--boing" : ""} ${className}`}
      onClick={handleClick}
      aria-hidden="true"
    >
      <svg className="mascot__svg" viewBox="0 0 200 230">
        <ellipse
          className="mascot__shadow"
          cx="100"
          cy="222"
          rx="56"
          ry="7"
          fill="rgba(18,4,4,0.28)"
        />

        <g className="mascot__bounce">
          {/* feet */}
          <ellipse
            cx="72"
            cy="205"
            rx="22"
            ry="10"
            fill="#fff"
            stroke={INK}
            strokeWidth="5"
          />
          <ellipse
            cx="128"
            cy="205"
            rx="22"
            ry="10"
            fill="#fff"
            stroke={INK}
            strokeWidth="5"
          />

          {/* left arm */}
          <path
            d="M32 152 Q6 160 10 186"
            fill="none"
            stroke={INK}
            strokeWidth="17"
            strokeLinecap="round"
          />
          <path
            d="M32 152 Q6 160 10 186"
            fill="none"
            stroke={RED}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle
            cx="10"
            cy="188"
            r="10"
            fill="#fff"
            stroke={INK}
            strokeWidth="5"
          />

          {/* right arm (waves) */}
          <g className={`mascot__arm${wave ? " mascot__arm--wave" : ""}`}>
            <path
              d="M168 146 Q197 140 190 112"
              fill="none"
              stroke={INK}
              strokeWidth="17"
              strokeLinecap="round"
            />
            <path
              d="M168 146 Q197 140 190 112"
              fill="none"
              stroke={RED}
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle
              cx="190"
              cy="108"
              r="10"
              fill="#fff"
              stroke={INK}
              strokeWidth="5"
            />
          </g>

          {/* chain-link antenna */}
          <g className="mascot__rings" fill="none">
            {RINGS.map((r) => (
              <React.Fragment key={r.x}>
                <rect
                  x={r.x}
                  y="8"
                  width="36"
                  height="62"
                  rx="18"
                  transform={`rotate(${r.rot} ${r.cx} 39)`}
                  stroke={INK}
                  strokeWidth="13"
                />
                <rect
                  x={r.x}
                  y="8"
                  width="36"
                  height="62"
                  rx="18"
                  transform={`rotate(${r.rot} ${r.cx} 39)`}
                  stroke="#ff6a73"
                  strokeWidth="6"
                />
              </React.Fragment>
            ))}
          </g>

          {/* body */}
          <path
            d="M100 40C150 40 175 85 172 135C170 180 140 202 100 202C60 202 30 180 28 135C25 85 50 40 100 40Z"
            fill={RED}
            stroke={INK}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path
            d="M56 104Q60 76 84 64"
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <ellipse
            cx="100"
            cy="172"
            rx="36"
            ry="24"
            fill="#f0414f"
            opacity="0.55"
          />
          <ellipse cx="52" cy="144" rx="10" ry="6" fill="#ff9aa2" />
          <ellipse cx="148" cy="144" rx="10" ry="6" fill="#ff9aa2" />

          {/* eyes */}
          {[78, 122].map((x) => (
            <g key={x} transform={`translate(${x} 118)`}>
              <g className="mascot__eye">
                <circle r="17" fill="#fff" stroke={INK} strokeWidth="5" />
                <g className="mascot__pupil">
                  <circle r="8.5" fill={INK} />
                  <circle cx="-3" cy="-3.5" r="2.8" fill="#fff" />
                </g>
              </g>
            </g>
          ))}

          {face === "wow" && (
            <g fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round">
              <path d="M60 94Q78 80 94 92" />
              <path d="M106 92Q122 80 140 94" />
            </g>
          )}

          {/* mouth */}
          {face === "wow" ? (
            <>
              <ellipse cx="100" cy="164" rx="11" ry="15" fill={INK} />
              <ellipse cx="100" cy="171" rx="6" ry="5" fill="#ff7a85" />
            </>
          ) : (
            <>
              <path
                d="M78 148Q100 186 122 148Z"
                fill={INK}
                stroke={INK}
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <path
                d="M90 165Q100 156 110 165Q100 177 90 165Z"
                fill="#ff7a85"
              />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
