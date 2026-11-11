/* Cartoon confetti burst. Call it from any click handler:
     onClick={(e) => { popBurst(e); onOpenAuth("signup"); }}
   It spawns a few stars / hearts at the click point and removes them
   when their animation ends. Does nothing if the user prefers reduced motion. */
const COLORS = ["#ff4d5e", "#ffd23f", "#ffffff", "#120404", "#ff8a7a"];
const SHAPES = ["\u2605", "\u2726", "\u25CF", "\u2665"];

export function popBurst(e) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rect = e.currentTarget.getBoundingClientRect();
  /* keyboard "clicks" report 0,0 — fall back to the button centre */
  const x = e.clientX || rect.left + rect.width / 2;
  const y = e.clientY || rect.top + rect.height / 2;
  const count = 14;

  for (let i = 0; i < count; i += 1) {
    const el = document.createElement("span");
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist = 50 + Math.random() * 70;

    el.className = "cartoon-pop";
    el.textContent = SHAPES[i % SHAPES.length];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.color = COLORS[i % COLORS.length];
    el.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    el.style.setProperty("--dy", `${Math.sin(angle) * dist - 20}px`);
    el.style.setProperty("--rot", `${(Math.random() - 0.5) * 360}deg`);
    el.style.setProperty("--s", `${12 + Math.random() * 14}px`);
    el.addEventListener("animationend", () => el.remove());
    document.body.appendChild(el);
  }
}
