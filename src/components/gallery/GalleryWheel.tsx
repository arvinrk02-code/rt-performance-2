"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Lightbox from "../Lightbox";
import type { GalleryCategory } from "./manifest";
import styles from "./gallery.module.css";

/* The spinning service wheel — Arvin's gallery.
 *
 * One black stage. A 5-spoke wheel sits centred, one service category at the
 * end of each spoke (labels orbit with the wheel but counter-rotate to stay
 * level, Ferris-wheel style). A fixed ember pointer at 3 o'clock marks the
 * active category — casino-style. Interactions:
 *   · click a spoke label  → the wheel spins that category to the pointer
 *   · click the pointer    → the next category rotates in
 *   · drag the wheel       → direct 1:1 spin (no momentum), snaps on release
 *
 * Flanking the wheel, two columns of uniform 4:5 tiles drift endlessly in
 * opposite directions (left down, right up) showing the active category's
 * photos; spinning to a new category crossfades the columns to its set.
 *
 * All motion runs in ONE rAF loop with direct DOM writes (the services
 * follower pattern): the wheel angle lerps toward its target, labels
 * counter-rotate in the same frame, columns advance by dt. React state is
 * only touched when the ACTIVE category actually changes.
 *
 * The wheel artwork is a hairline SVG 5-spoke placeholder in the site's
 * instrument language — swap in Arvin's screenshot when it lands (same slot;
 * tune SPOKE_PHASE if his spokes aren't at 0°/72°/…). */

const STEP = 72; // degrees per spoke

/* Arvin's lane overrides (measured off his tuned browser, 2026-07-19).
 * The two LEFT lanes are a flush pair anchored by their INNER (right) edge:
 * a longer name growing into the lane expands OUTWARD (leftward) only —
 * never up/down, never toward the wheel. Coordinates are the inner-edge
 * point relative to the wheel centre, CSS px. Others stay on the auto ring. */
const LANE_OVERRIDES: ({ x: number; y: number } | null)[] = [
  null, // slot 0 — 3 o'clock (pointer)
  null, // slot 1 — bottom
  { x: -92.5, y: 60 }, // slot 2 — lower-left (inner-edge anchored)
  { x: -92.5, y: -60 }, // slot 3 — upper-left (inner-edge anchored)
  null, // slot 4 — top
];

/* ---- tuning dials (live-adjustable via /gallery?tune) -------------------
   The panel writes these as CSS vars on the stage + the labelGap ref; when
   Arvin locks his numbers in, they get baked into the CSS defaults. */
/* Arvin's locked layout — tuned live in his browser (2026-07-19) */
const TUNE_DEFAULTS = {
  labelSize: 12, // px — label font size
  labelGap: 0, // px — rim → label near edge
  wheelR: 96, // px — wheel radius
  lanePad: 76, // px — wheel lane side reserve (labels' room)
  trackW: 402, // px — photo column max width
  stagePad: 22, // px — outer indent either side of the page
  stageGap: 96, // px — gap between columns and the wheel lane
  tileGap: 48, // px — vertical gap between photos
};
type Tune = typeof TUNE_DEFAULTS;

const TUNE_META: { key: keyof Tune; label: string; min: number; max: number }[] = [
  { key: "labelSize", label: "Label size", min: 7, max: 18 },
  { key: "labelGap", label: "Label gap", min: 0, max: 48 },
  { key: "wheelR", label: "Wheel radius", min: 48, max: 180 },
  { key: "lanePad", label: "Wheel lane", min: 16, max: 220 },
  { key: "trackW", label: "Photo lane", min: 240, max: 900 },
  { key: "stagePad", label: "Outer indent", min: 0, max: 140 },
  { key: "stageGap", label: "Lane gap", min: 0, max: 96 },
  { key: "tileGap", label: "Photo gap", min: 4, max: 48 },
];

interface GalleryWheelProps {
  categories: GalleryCategory[];
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** normalise an angle to (−180, 180] */
const wrap180 = (a: number) => {
  let x = ((a % 360) + 540) % 360;
  return x - 180;
};

export default function GalleryWheel({ categories }: GalleryWheelProps) {
  const n = categories.length;
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const rotRef = useRef<HTMLDivElement | null>(null);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const leftTrackRef = useRef<HTMLDivElement | null>(null);
  const rightTrackRef = useRef<HTMLDivElement | null>(null);
  const colsRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // live tuning (open /gallery?tune) — the rAF loop reads labelGap from here
  const labelGapRef = useRef(TUNE_DEFAULTS.labelGap);
  const [tuneOpen, setTuneOpen] = useState(false);
  const [tune, setTune] = useState<Tune>(TUNE_DEFAULTS);

  // LABEL LANES — five fixed slots (Arvin's layout); the slots never move.
  // The category NAMES rotate through them: slot 0 (3 o'clock) always shows
  // the selected category. While the wheel is in motion the labels fade out;
  // on settle they fade back in, reassigned. displayActive = the assignment
  // currently on screen (synced at each reveal, never mid-fade).
  const [displayActive, setDisplayActive] = useState(0);
  const [labelsHidden, setLabelsHidden] = useState(false);
  const labelsHiddenRef = useRef(false);

  // drag-to-place label SLOTS (tune mode). Raw offsets from the wheel centre;
  // slots are screen-fixed so no rotation maths. null = auto ring.
  const [dragLabels, setDragLabels] = useState(false);
  const labelPosRef = useRef<({ x: number; y: number } | null)[]>(
    Array.from({ length: n }, () => null)
  );
  const labelDrag = useRef<{ i: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [, forceTick] = useState(0); // nudge the panel's Copy readout

  // reassign the lane texts only when the labels are (re)visible — the swap
  // happens under the fade, never in front of the user
  useEffect(() => {
    if (!labelsHidden) setDisplayActive(activeRef.current < 0 ? 0 : activeRef.current);
  }, [labelsHidden]);

  useEffect(() => {
    setTuneOpen(new URLSearchParams(window.location.search).has("tune"));
  }, []);

  useEffect(() => {
    if (!tuneOpen) return; // normal visitors keep the responsive CSS defaults
    labelGapRef.current = tune.labelGap;
    const s = stageRef.current;
    if (!s) return;
    s.style.setProperty("--label-size", `${tune.labelSize}px`);
    s.style.setProperty("--wheel-r", `${tune.wheelR}px`);
    s.style.setProperty("--lane-pad", `${tune.lanePad}px`);
    s.style.setProperty("--track-w", `${tune.trackW}px`);
    s.style.setProperty("--stage-pad", `${tune.stagePad}px`);
    s.style.setProperty("--stage-gap", `${tune.stageGap}px`);
    s.style.setProperty("--tile-gap", `${tune.tileGap}px`);
  }, [tune, tuneOpen]);

  // motion state lives in refs — the rAF loop owns it, React never sees it
  const angle = useRef(0); // current, follows target
  const target = useRef(0);
  const dragging = useRef(false);
  const dragStart = useRef({ pointer: 0, angle: 0 });
  const activeRef = useRef(0);
  const driftL = useRef(0);
  const driftR = useRef(0);
  const hoverL = useRef(false);
  const hoverR = useRef(false);

  /** the category whose spoke sits at the 3-o'clock pointer for angle a */
  const activeFor = (a: number) => ((Math.round(-a / STEP) % n) + n) % n;

  /* one loop: wheel follow + label counter-rotation + column drift */
  useEffect(() => {
    const prm = prefersReducedMotion();
    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // wheel: 1:1 while dragging, eased follower otherwise
      if (!dragging.current) {
        const d = target.current - angle.current;
        angle.current += Math.abs(d) < 0.01 ? d : d * (prm ? 1 : 0.085);
      }
      const a = angle.current;
      if (rotRef.current) {
        rotRef.current.style.transform = `rotate(${a.toFixed(3)}deg)`;
      }
      // labels fade out while the wheel is in motion, back in once it settles
      const moving =
        dragging.current ||
        Math.abs(wrap180(target.current - angle.current)) > 0.6;
      if (labelsHiddenRef.current !== moving) {
        labelsHiddenRef.current = moving;
        setLabelsHidden(moving);
      }

      // LABEL LANES — fixed slots, screen-anchored; they never rotate with
      // the wheel. Each slot's arm length D is solved so its point NEAREST
      // the hub sits exactly labelGap off the rim (the level box's nearest
      // point is a corner on diagonals; nearest-distance grows monotonically
      // with D → binary search).
      const wheelR = (boxRef.current?.offsetWidth ?? 0) / 2;
      labelRefs.current.forEach((btn, i) => {
        if (!btn || wheelR <= 0) return;
        // manual slot placement (dragged in tune mode) — raw screen offset
        const manual = labelPosRef.current[i];
        if (manual) {
          btn.style.transform = `translate(-50%, -50%) translate(${manual.x.toFixed(1)}px, ${manual.y.toFixed(1)}px)`;
          return;
        }
        // Arvin's baked lanes — inner-edge anchored, expand outward only
        const over = LANE_OVERRIDES[i];
        if (over) {
          btn.style.transform = `translate(-100%, -50%) translate(${over.x}px, ${over.y}px)`;
          return;
        }
        const sa = (i * STEP * Math.PI) / 180;
        const ux = Math.cos(sa);
        const uy = Math.sin(sa);
        const hw = btn.offsetWidth / 2;
        const hh = btn.offsetHeight / 2;
        const T = wheelR + labelGapRef.current;
        let lo = wheelR;
        let hi = wheelR + hw + hh + 40;
        for (let k = 0; k < 16; k++) {
          const D = (lo + hi) / 2;
          const ax = Math.abs(D * ux) - hw;
          const ay = Math.abs(D * uy) - hh;
          const dist = Math.hypot(Math.max(0, ax), Math.max(0, ay));
          if (dist > T) hi = D;
          else lo = D;
        }
        const D = (lo + hi) / 2;
        btn.style.transform = `translate(-50%, -50%) translate(${(D * ux).toFixed(1)}px, ${(D * uy).toFixed(1)}px)`;
      });

      // active category flips when a spoke crosses the pointer
      const cur = activeFor(dragging.current ? a : target.current);
      if (activeRef.current !== cur) {
        activeRef.current = cur;
        setActive(cur);
      }

      // columns: endless opposite drift — each side pauses INDEPENDENTLY
      // under the cursor (hovering one column never freezes the other)
      if (!prm) {
        const l = leftTrackRef.current;
        const r = rightTrackRef.current;
        if (!hoverL.current && l && l.offsetHeight > 0) {
          driftL.current += dt * 26; // px/s
          const half = l.offsetHeight / 2;
          const off = driftL.current % half;
          // keep the CSS horizontal centring (translateX(-50%)) — writing a
          // bare translateY here would clobber it and shove the columns off-axis
          // left column moves DOWN: start pulled up by half, ease forward
          l.style.transform = `translate(-50%, ${(-half + off).toFixed(2)}px)`;
        }
        if (!hoverR.current && r && r.offsetHeight > 0) {
          driftR.current += dt * 26;
          const half2 = r.offsetHeight / 2;
          const off2 = driftR.current % half2;
          // right column moves UP
          r.style.transform = `translate(-50%, ${(-off2).toFixed(2)}px)`;
        }
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [n]);

  /* spin helpers — programmatic spins always travel CLOCKWISE (casino
     wheel); only a manual drag can turn it the other way */
  const spinTo = useCallback((i: number) => {
    const want = -i * STEP;
    const delta = (((want - target.current) % 360) + 360) % 360;
    if (delta === 0) return;
    target.current = target.current + delta;
  }, []);

  const next = useCallback(() => {
    spinTo((activeRef.current + 1) % n);
  }, [n, spinTo]);

  /* drag-to-place a label (tune mode only) — moves it freely; the drop point
     is stored in the wheel's angle-0 frame so it still travels with its spoke */
  const onLabelPointerDown = (i: number, e: React.PointerEvent) => {
    if (!dragLabels) {
      e.stopPropagation(); // normal mode: don't start a wheel-drag from a label
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* pointer may already be gone — dragging still tracks via state */
    }
    target.current = angle.current; // freeze any spin while placing
    labelDrag.current = { i, moved: false };
  };
  const onLabelPointerMove = (i: number, e: React.PointerEvent) => {
    const d = labelDrag.current;
    if (!d || d.i !== i) return;
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    // slots are screen-fixed — store the raw offset from the wheel centre
    labelPosRef.current[i] = {
      x: e.clientX - (box.left + box.width / 2),
      y: e.clientY - (box.top + box.height / 2),
    };
    d.moved = true;
    forceTick((v) => v + 1);
  };
  const onLabelPointerUp = (i: number) => {
    const d = labelDrag.current;
    if (d && d.i === i && d.moved) suppressClick.current = true;
    labelDrag.current = null;
  };
  const onLabelClick = (slot: number) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (dragLabels) return;
    // slot k currently shows category (displayActive + k) — spin THAT in
    spinTo((displayActive + slot) % n);
  };
  const resetLabels = () => {
    labelPosRef.current = Array.from({ length: n }, () => null);
    forceTick((v) => v + 1);
  };

  /* drag-spin: direct 1:1 from the pointer's polar angle, snap on release */
  const onPointerDown = (e: React.PointerEvent) => {
    const box = rotRef.current?.parentElement;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    dragging.current = true;
    dragStart.current = {
      pointer: (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI,
      angle: angle.current,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const box = rotRef.current?.parentElement;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const p = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
    angle.current = dragStart.current.angle + (p - dragStart.current.pointer);
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    // settle on the nearest spoke — no momentum
    target.current = Math.round(angle.current / STEP) * STEP;
  };

  /* keyboard */
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      target.current += STEP;
    }
  };

  /* column photo split — odd/even between left and right */
  const photos = categories[active].photos;
  const left = photos.filter((_, i) => i % 2 === 0);
  const right = photos.filter((_, i) => i % 2 === 1);

  /* crossfade the columns when the category changes */
  const [colsShown, setColsShown] = useState(true);
  const shownFor = useRef(0);
  useEffect(() => {
    if (shownFor.current === active) return;
    setColsShown(false);
    const t = setTimeout(() => {
      shownFor.current = active;
      driftL.current = 0;
      driftR.current = 0;
      setColsShown(true);
    }, 320);
    return () => clearTimeout(t);
  }, [active]);

  const lb = lightbox !== null;

  return (
    <div className={styles.stage} onKeyDown={onKey} ref={stageRef}>
      {/* the page title — the Our Work page's treatment (ember eyebrow + bold
          grotesk + hairline), centred at top, a touch larger */}
      <header className={styles.stageTitle}>
        <span className={styles.stageEyebrow}>The Collection</span>
        <h1 className={styles.stageHeading}>Gallery</h1>
      </header>

      {/* ---------------------------------------------- left column (down) */}
      <div
        ref={colsRef}
        className={`${styles.col} ${styles.colLeft} ${
          colsShown ? styles.colOn : ""
        }`}
        onMouseEnter={() => {
          hoverL.current = true;
        }}
        onMouseLeave={() => {
          hoverL.current = false;
        }}
      >
        <div className={styles.colTrack} ref={leftTrackRef}>
          {[...left, ...left].map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              className={styles.tile}
              tabIndex={i < left.length ? 0 : -1}
              aria-hidden={i >= left.length ? "true" : undefined}
              aria-label={`Expand photo — ${categories[active].title}`}
              onClick={() => setLightbox(photos.indexOf(src))}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------- the wheel */}
      <div className={styles.wheelZone}>
        <div
          ref={boxRef}
          className={styles.wheelBox}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className={styles.wheelRot} ref={rotRef}>
            {/* the twin-blade five-spoke, drawn in the site's instrument
                language — hairline strokes only; depth is edge lines,
                creases and return ticks, never fills */}
            <svg viewBox="0 0 200 200" className={styles.wheelSvg} aria-hidden="true">
              {/* rim: outer edge · face lip · bead where the spokes land */}
              <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(245,245,245,0.24)" strokeWidth="1" />
              <circle cx="100" cy="100" r="91.5" fill="none" stroke="rgba(245,245,245,0.34)" strokeWidth="1" />
              <circle cx="100" cy="100" r="87" fill="none" stroke="rgba(245,245,245,0.13)" strokeWidth="1" />
              {/* barrel wells glimpsed between the spokes (depth) */}
              {Array.from({ length: 5 }, (_, i) => {
                const mid = ((i * STEP + 36) * Math.PI) / 180;
                const sweep = (20 * Math.PI) / 180;
                const r = 82;
                const x1 = 100 + r * Math.cos(mid - sweep);
                const y1 = 100 + r * Math.sin(mid - sweep);
                const x2 = 100 + r * Math.cos(mid + sweep);
                const y2 = 100 + r * Math.sin(mid + sweep);
                return (
                  <path
                    key={`well-${i}`}
                    d={`M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`}
                    fill="none"
                    stroke="rgba(245,245,245,0.1)"
                    strokeWidth="1"
                  />
                );
              })}
              {/* five twin-blade spokes */}
              {Array.from({ length: 5 }, (_, i) => (
                <g key={`spoke-${i}`} transform={`rotate(${i * STEP} 100 100)`}>
                  {/* upper blade: outline + ridge crease + rim return ticks */}
                  <path
                    d="M 117 95.4 L 186 84.5 L 186 92 L 117 98.6"
                    fill="none"
                    stroke="rgba(245,245,245,0.32)"
                    strokeWidth="1"
                  />
                  <path d="M 117 97 L 186 88.4" fill="none" stroke="rgba(245,245,245,0.14)" strokeWidth="0.8" />
                  <path d="M 186 84.5 L 190.5 83.9" fill="none" stroke="rgba(245,245,245,0.22)" strokeWidth="0.9" />
                  <path d="M 186 92 L 190.5 91.6" fill="none" stroke="rgba(245,245,245,0.22)" strokeWidth="0.9" />
                  {/* lower blade, mirrored */}
                  <path
                    d="M 117 104.6 L 186 115.5 L 186 108 L 117 101.4"
                    fill="none"
                    stroke="rgba(245,245,245,0.32)"
                    strokeWidth="1"
                  />
                  <path d="M 117 103 L 186 111.6" fill="none" stroke="rgba(245,245,245,0.14)" strokeWidth="0.8" />
                  <path d="M 186 115.5 L 190.5 116.1" fill="none" stroke="rgba(245,245,245,0.22)" strokeWidth="0.9" />
                  <path d="M 186 108 L 190.5 108.4" fill="none" stroke="rgba(245,245,245,0.22)" strokeWidth="0.9" />
                  {/* the slot between the pair, tapering out from the hub */}
                  <path d="M 117 98.6 L 186 92" fill="none" stroke="rgba(245,245,245,0.09)" strokeWidth="0.8" />
                  <path d="M 117 101.4 L 186 108" fill="none" stroke="rgba(245,245,245,0.09)" strokeWidth="0.8" />
                </g>
              ))}
              {/* hub: spoke root · cap ring · five lugs · ember centre */}
              <circle cx="100" cy="100" r="17" fill="none" stroke="rgba(245,245,245,0.36)" strokeWidth="1" />
              <circle cx="100" cy="100" r="10.5" fill="none" stroke="rgba(245,245,245,0.24)" strokeWidth="1" />
              {Array.from({ length: 5 }, (_, i) => {
                const a = ((i * STEP + 36) * Math.PI) / 180;
                const x = 100 + 13.6 * Math.cos(a);
                const y = 100 + 13.6 * Math.sin(a);
                return (
                  <circle
                    key={`lug-${i}`}
                    cx={x.toFixed(1)}
                    cy={y.toFixed(1)}
                    r="2.2"
                    fill="none"
                    stroke="rgba(245,245,245,0.3)"
                    strokeWidth="0.9"
                  />
                );
              })}
              <circle cx="100" cy="100" r="2.4" fill="#e14312" />
            </svg>
          </div>

          {/* spoke labels — orbit the wheel staying level; each is moved to
              its point per-frame by the rAF loop, near edge a constant gap
              off the rim. They sit in the (non-rotating) box, above the SVG. */}
          {/* the label lanes — five fixed slots; slot 0 (3 o'clock, ember) is
              always the selected category, the rest follow in wheel order.
              Texts reassign under the fade whenever the wheel moves. */}
          {Array.from({ length: n }, (_, slot) => {
            const c = categories[(displayActive + slot) % n];
            return (
              <button
                key={slot}
                type="button"
                ref={(el) => {
                  labelRefs.current[slot] = el;
                }}
                className={`${styles.labelBtn} ${
                  slot === 0 ? styles.labelActive : ""
                } ${labelsHidden ? styles.labelFaded : ""} ${
                  dragLabels ? styles.labelDraggable : ""
                }`}
                aria-current={slot === 0 ? "true" : undefined}
                onPointerDown={(e) => onLabelPointerDown(slot, e)}
                onPointerMove={(e) => onLabelPointerMove(slot, e)}
                onPointerUp={() => onLabelPointerUp(slot)}
                onClick={() => onLabelClick(slot)}
              >
                {c.title}
              </button>
            );
          })}

          {/* 3-o'clock rim index — a small ember tick on the rim marking the
              active category; click advances to the next */}
          <button
            type="button"
            className={styles.rimIndex}
            aria-label="Next category"
            onClick={next}
          >
            <span className={styles.rimTick} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ---------------------------------------------- right column (up) */}
      <div
        className={`${styles.col} ${styles.colRight} ${
          colsShown ? styles.colOn : ""
        }`}
        onMouseEnter={() => {
          hoverR.current = true;
        }}
        onMouseLeave={() => {
          hoverR.current = false;
        }}
      >
        <div className={styles.colTrack} ref={rightTrackRef}>
          {[...right, ...right].map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              className={styles.tile}
              tabIndex={i < right.length ? 0 : -1}
              aria-hidden={i >= right.length ? "true" : undefined}
              aria-label={`Expand photo — ${categories[active].title}`}
              onClick={() => setLightbox(photos.indexOf(src))}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
            </button>
          ))}
        </div>
      </div>

      {lb && (
        <Lightbox
          images={photos.map((src) => ({
            src,
            caption: categories[active].title,
          }))}
          index={lightbox!}
          carTitle={categories[active].title}
          onClose={() => setLightbox(null)}
          onIndex={(i) => setLightbox(i)}
        />
      )}

      {/* live tuning panel — /gallery?tune. Drag, eyeball, Copy values,
          paste the numbers back and they get baked into the CSS. */}
      {tuneOpen && (
        <div className={styles.tune}>
          <div className={styles.tuneHead}>
            <span>TUNE</span>
            <button
              type="button"
              className={styles.tuneCopy}
              onClick={() => {
                const dials = TUNE_META.map(
                  (m) => `${m.label}: ${tune[m.key]}px`
                );
                const pos = labelPosRef.current
                  .map((p, i) =>
                    p
                      ? `  ${categories[i].title}: ${Math.round(p.x)}, ${Math.round(p.y)}`
                      : null
                  )
                  .filter(Boolean);
                const out =
                  dials.join("\n") +
                  (pos.length
                    ? `\n\nLabel positions (x,y, wheel frame):\n${pos.join("\n")}`
                    : "");
                navigator.clipboard?.writeText(out);
              }}
            >
              Copy values
            </button>
          </div>

          {/* drag-place labels */}
          <label className={styles.tuneToggle}>
            <input
              type="checkbox"
              checked={dragLabels}
              onChange={(e) => setDragLabels(e.target.checked)}
            />
            <span>Drag labels</span>
            <button
              type="button"
              className={styles.tuneReset}
              onClick={resetLabels}
            >
              Reset
            </button>
          </label>

          {TUNE_META.map((m) => (
            <label key={m.key} className={styles.tuneRow}>
              <span className={styles.tuneLabel}>{m.label}</span>
              <input
                type="range"
                min={m.min}
                max={m.max}
                step={1}
                value={tune[m.key]}
                onChange={(e) =>
                  setTune((t) => ({ ...t, [m.key]: Number(e.target.value) }))
                }
              />
              <span className={styles.tuneVal}>{tune[m.key]}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
