/**
 * bg-fx.js — interactive background controller
 *
 * Effects:
 *  1. Cursor spotlight  – warm radial glow follows the mouse with smooth lerp
 *  2. Dot-grid parallax – background-position shifts subtly against cursor
 *  3. Scroll aurora     – gradient band rises as the user scrolls down
 *  4. Scroll dot-drift  – dots shift slightly on the Y axis while scrolling
 *  5. Cursor trail      – tiny fading sparks that follow fast mouse moves
 */

const ROOT  = document.documentElement;
const BODY  = document.body;

// ── state ──────────────────────────────────────────────────────────────────
const mouse  = { x: window.innerWidth / 2,  y: window.innerHeight / 2 };
const target = { x: mouse.x, y: mouse.y };
let scrollY  = window.scrollY;
let ticking  = false;

// lerp factor — lower = smoother / slower
const LERP = 0.065;

// max parallax offset in px for the dot grid
const MAX_OX = 14;
const MAX_OY = 10;

// ── cursor tracking ─────────────────────────────────────────────────────────
window.addEventListener('mousemove', (e) => {
  target.x = e.clientX;
  target.y = e.clientY;
  spawnTrail(e.clientX, e.clientY);
});

// touch support
window.addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  target.x = t.clientX;
  target.y = t.clientY;
}, { passive: true });

// ── scroll tracking ─────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
}, { passive: true });

// ── rAF loop ────────────────────────────────────────────────────────────────
function tick() {
  // smooth cursor position with lerp
  mouse.x += (target.x - mouse.x) * LERP;
  mouse.y += (target.y - mouse.y) * LERP;

  // percentage across viewport
  const px = mouse.x / window.innerWidth;
  const py = mouse.y / window.innerHeight;

  // spotlight follows the actual cursor (no lerp needed — CSS handles it via property)
  ROOT.style.setProperty('--mouse-x', `${target.x}px`);
  ROOT.style.setProperty('--mouse-y', `${target.y}px`);

  // dot-grid parallax — shift opposite to cursor for depth illusion
  const ox = ((px - 0.5) * -MAX_OX * 2).toFixed(2);
  const oy = ((py - 0.5) * -MAX_OY * 2).toFixed(2);
  ROOT.style.setProperty('--dot-ox', `${ox}px`);
  ROOT.style.setProperty('--dot-oy', `${oy}px`);

  // scroll progress 0–1 clamped
  const maxScroll = Math.max(1, BODY.scrollHeight - window.innerHeight);
  const sp = Math.min(1, scrollY / maxScroll);
  ROOT.style.setProperty('--scroll-p', sp.toFixed(4));

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

// ── cursor trail sparks ─────────────────────────────────────────────────────
let lastTrail = 0;
const TRAIL_THROTTLE = 32; // ms between sparks

function spawnTrail(x, y) {
  const now = Date.now();
  if (now - lastTrail < TRAIL_THROTTLE) return;
  lastTrail = now;

  const spark = document.createElement('span');
  spark.className = 'bg-spark';

  // random offset so sparks scatter
  const dx = (Math.random() - 0.5) * 22;
  const dy = (Math.random() - 0.5) * 22;

  spark.style.cssText = `
    left: ${x + dx}px;
    top:  ${y + dy + window.scrollY}px;
    --sz: ${Math.random() * 4 + 3}px;
  `;

  BODY.appendChild(spark);

  // remove after animation
  spark.addEventListener('animationend', () => spark.remove(), { once: true });
}
