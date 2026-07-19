"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { WORK_CARS, type WorkCar } from "./work";
import Lightbox from "./Lightbox";
import styles from "./OurWork.module.css";

/* Our Work — an instrument for the seven featured builds.
 *
 * A numbered rail on the side selects a car; the panels swipe across. Each car
 * is a title, a one-line overview, and a 3D coverflow of its photos with a
 * rev-counter dial beneath as the progress gauge — click the centre photo to
 * expand it, and its caption tells that stage of the repair. Deep-links by hash
 * (/our-work#ferrari-458) so the home slider's CTAs land on the right car. */

const OUT_MS = 280; // the current car dips to black
const IN_MS = 660; // the new panel rises from below in front of the receding black

function findBySlug(hash: string): number {
  const slug = hash.replace(/^#/, "");
  const i = WORK_CARS.findIndex((c) => c.slug === slug);
  return i;
}

export default function OurWork() {
  const [active, setActive] = useState(0); // rail highlight + target car
  const [shown, setShown] = useState(0); // car currently rendered in the panel
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [expanded, setExpanded] = useState<{ car: number; photo: number } | null>(
    null
  );
  // current photo per car for the coverflow galleries
  const [photoIdx, setPhotoIdx] = useState<number[]>(() =>
    WORK_CARS.map(() => 0)
  );

  const activeRef = useRef(0);
  const shownRef = useRef(0);
  const expandedRef = useRef(expanded);
  const photoIdxRef = useRef(photoIdx);
  const transitioning = useRef(false);
  const reduceRef = useRef(false);
  const runTransitionRef = useRef<() => void>(() => {});
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    shownRef.current = shown;
  }, [shown]);
  useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);
  useEffect(() => {
    photoIdxRef.current = photoIdx;
  }, [photoIdx]);

  const setPhoto = useCallback((car: number, idx: number) => {
    setPhotoIdx((prev) => {
      const len = WORK_CARS[car].gallery.length;
      const next = [...prev];
      next[car] = ((idx % len) + len) % len;
      return next;
    });
  }, []);

  // the car change itself: dip the panel to black, swap while hidden, then let
  // the new panel rise up from below in front of the receding black. Chases the
  // latest pick if the user selects again mid-transition.
  const runTransition = useCallback(() => {
    if (transitioning.current) return;
    if (activeRef.current === shownRef.current) return;
    transitioning.current = true;
    setPhase("out");
    window.setTimeout(() => {
      setShown(activeRef.current); // swap while the veil is fully black
      setPhase("in");
      window.setTimeout(() => {
        setPhase("idle");
        transitioning.current = false;
        if (activeRef.current !== shownRef.current) runTransitionRef.current();
      }, IN_MS);
    }, OUT_MS);
  }, []);
  useEffect(() => {
    runTransitionRef.current = runTransition;
  }, [runTransition]);

  const go = useCallback(
    (i: number) => {
      const n = WORK_CARS.length;
      const target = ((i % n) + n) % n;
      activeRef.current = target; // keep the ref in step so runTransition sees it now
      setActive(target);
      // reflect the car in the URL without scrolling or stacking history
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${WORK_CARS[target].slug}`);
      }
      if (reduceRef.current) {
        shownRef.current = target;
        setShown(target);
        return;
      }
      runTransition();
    },
    [runTransition]
  );

  // sync the active car with the URL hash so the home slider's CTAs deep-link
  // to a specific car (/our-work#ferrari-458). The initial car appears without a
  // transition; later hash changes animate via go().
  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const i = findBySlug(window.location.hash);
    if (i >= 0) {
      activeRef.current = i;
      shownRef.current = i;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the deep-link target on mount; the URL is an external system
      setActive(i);
      setShown(i);
    }

    const onHash = () => {
      const j = findBySlug(window.location.hash);
      if (j >= 0) go(j);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [go]);

  // keyboard: up/down change car (matching the vertical rail), left/right move
  // through the active car's photos (matching the horizontal coverflow). The
  // lightbox owns the keyboard while it is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (expandedRef.current) return;
      const a = activeRef.current;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          go(a + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          go(a - 1);
          break;
        case "ArrowRight":
          e.preventDefault();
          setPhoto(a, photoIdxRef.current[a] + 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          setPhoto(a, photoIdxRef.current[a] - 1);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, setPhoto]);

  const car = WORK_CARS[active];

  return (
    <div className={styles.stage}>
      {/* announce car changes to screen readers */}
      <div aria-live="polite" className={styles.srOnly}>
        {car.title}
      </div>

      {/* the numbered rail — select a car */}
      <nav className={styles.rail} aria-label="Featured cars">
        <ol className={styles.railList}>
          {WORK_CARS.map((c, i) => (
            <li key={c.slug}>
              <button
                type="button"
                className={`${styles.railBtn} ${
                  i === active ? styles.railBtnActive : ""
                }`}
                aria-current={i === active ? "true" : undefined}
                aria-label={`View ${c.title}`}
                onClick={() => go(i)}
              >
                <span className={styles.railName}>{c.short}</span>
                <MarqueMark marque={c.marque} n={i + 1} />
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* the panel — dips to black, then the next car rises up from below */}
      <div className={styles.viewport}>
        <div
          className={`${styles.veil} ${
            phase === "out"
              ? styles.veilOut
              : phase === "in"
                ? styles.veilIn
                : ""
          }`}
          aria-hidden="true"
        />
        <div
          key={shown}
          className={`${styles.panelWrap} ${
            phase === "in" ? styles.panelRise : ""
          }`}
          style={{ zIndex: phase === "in" ? 12 : 5 }}
        >
          <Panel
            car={WORK_CARS[shown]}
            n={shown + 1}
            isActive={phase !== "out"}
            photoIndex={photoIdx[shown]}
            onPhoto={(idx) => setPhoto(shown, idx)}
            onExpand={(photo) => setExpanded({ car: shown, photo })}
          />
        </div>
      </div>

      {expanded && (
        <Lightbox
          images={WORK_CARS[expanded.car].gallery}
          index={expanded.photo}
          carTitle={WORK_CARS[expanded.car].title}
          onClose={() => setExpanded(null)}
          onIndex={(photo) => setExpanded((s) => (s ? { ...s, photo } : s))}
        />
      )}
    </div>
  );
}

/* --------------------------------------------------- marque logo (rail) */

/* Most marques render as a monochrome line sketch: the SVG is applied as a
 * CSS mask and painted in the rail's current colour, so the file's own
 * colours are irrelevant. A few badges (e.g. Ferrari's shield) are full
 * colour and would just flatten into a solid blob under a mask, so those
 * render as true-colour images instead. Falls back to the zero-padded
 * number until a marque's file exists. */
const COLOR_LOGOS: Record<string, string> = {};

function MarqueMark({ marque, n }: { marque: string; n: number }) {
  const colorSrc = COLOR_LOGOS[marque];
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    if (colorSrc) return;
    let alive = true;
    const img = new Image();
    img.onload = () => {
      if (alive) setMissing(false);
    };
    img.onerror = () => {
      if (alive) setMissing(true);
    };
    img.src = `/logos/${marque}.svg`;
    return () => {
      alive = false;
    };
  }, [marque, colorSrc]);

  if (colorSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={colorSrc} alt="" className={styles.railLogoColor} draggable={false} />
    );
  }

  if (missing) {
    return <span className={styles.railNum}>{String(n).padStart(2, "0")}</span>;
  }
  return (
    <span
      className={styles.railLogo}
      style={{ ["--logo" as string]: `url(/logos/${marque}.svg)` }}
      aria-hidden="true"
    />
  );
}

/* ---------------------------------------------------------------- one car */

interface PanelProps {
  car: WorkCar;
  n: number;
  isActive: boolean;
  photoIndex: number;
  onPhoto: (photoIndex: number) => void;
  onExpand: (photoIndex: number) => void;
}

function Panel({
  car,
  n,
  isActive,
  photoIndex,
  onPhoto,
  onExpand,
}: PanelProps) {
  return (
    <section
      className={styles.panel}
      aria-hidden={!isActive}
      aria-roledescription="Featured build"
      aria-label={car.title}
    >
      <header className={styles.panelHead} key={car.slug}>
        <span className={styles.eyebrow}>Featured Build</span>
        <h2 className={styles.title}>{car.title}</h2>
        <p className={styles.overview}>{car.overview}</p>
      </header>

      <Coverflow
        car={car}
        isActive={isActive}
        photoIndex={photoIndex}
        onPhoto={onPhoto}
        onExpand={onExpand}
      />
    </section>
  );
}

/* ------------------------------------------------ coverflow photo gallery */

interface CoverflowProps {
  car: WorkCar;
  isActive: boolean;
  photoIndex: number;
  onPhoto: (photoIndex: number) => void;
  onExpand: (photoIndex: number) => void;
}

function Coverflow({
  car,
  isActive,
  photoIndex,
  onPhoto,
  onExpand,
}: CoverflowProps) {
  const photos = car.gallery;
  const n = photos.length;
  const drag = useRef({ x: 0, down: false, moved: false });

  const clamp = (i: number) => ((i % n) + n) % n;

  const onPointerDown = (e: ReactPointerEvent) => {
    drag.current = { x: e.clientX, down: true, moved: false };
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (drag.current.down && Math.abs(e.clientX - drag.current.x) > 6) {
      drag.current.moved = true;
    }
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    if (!drag.current.down) return;
    const dx = e.clientX - drag.current.x;
    drag.current.down = false;
    if (dx > 44) onPhoto(clamp(photoIndex - 1));
    else if (dx < -44) onPhoto(clamp(photoIndex + 1));
  };

  return (
    <div className={styles.cf}>
      <div
        className={styles.cfStage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {photos.map((p, i) => {
          const offset = i - photoIndex;
          const a = Math.abs(offset);
          const dir = Math.sign(offset);
          const scale = a === 0 ? 1 : Math.max(0.6, 1 - a * 0.16);
          const style: CSSProperties = {
            transform: `translate(-50%, -50%) translateX(${offset * 56}%) rotateY(${
              -dir * 42
            }deg) scale(${scale})`,
            opacity: a === 0 ? 1 : a === 1 ? 0.6 : a === 2 ? 0.26 : 0,
            zIndex: 30 - a,
            pointerEvents: a > 2 ? "none" : "auto",
          };
          const isCentre = offset === 0;
          return (
            <button
              key={p.src}
              type="button"
              className={styles.cfItem}
              style={style}
              aria-hidden={a > 2}
              tabIndex={isActive && a <= 2 ? 0 : -1}
              aria-label={
                isCentre ? `Expand: ${p.caption}` : `Show: ${p.caption}`
              }
              onClick={() => {
                if (drag.current.moved) {
                  drag.current.moved = false;
                  return;
                }
                if (isCentre) onExpand(i);
                else onPhoto(i);
              }}
            >
              <span className={styles.cfInner}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.caption}
                  className={styles.cfImg}
                  loading="lazy"
                  draggable={false}
                />
                {isCentre && p.stage && (
                  <span className={styles.cfStageTag}>{p.stage}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <figcaption className={styles.cfCaption} key={photoIndex}>
        {photos[photoIndex].caption}
      </figcaption>

      <ProgressDial count={n} index={photoIndex} />
    </div>
  );
}

/* ---------------------------- the rev-counter dial, now a progress gauge */

const P_CX = 70;
const P_CY = 58;
const P_R = 44;
const P_FROM = 210; // first photo — lower-left
const P_SPAN = 240; // sweeps clockwise to lower-right on the last photo
const P_END = P_FROM - P_SPAN; // -30, lower-right
const P_REDLINE = P_END + 42; // graduations past here glow RT orange (redline)

function pPt(angleDeg: number, r: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [P_CX + r * Math.cos(a), P_CY - r * Math.sin(a)];
}

function pArc(fromDeg: number, toDeg: number, r: number): string {
  const pts: string[] = [];
  const step = fromDeg > toDeg ? -2 : 2;
  for (let a = fromDeg; step < 0 ? a >= toDeg : a <= toDeg; a += step) {
    const [x, y] = pPt(a, r);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

function ProgressDial({ count, index }: { count: number; index: number }) {
  const angleAt = (i: number) =>
    count > 1 ? P_FROM - (i * P_SPAN) / (count - 1) : P_FROM - P_SPAN / 2;

  const needleAngle = angleAt(index);
  const rot = 90 - needleAngle; // rotate an up-pointing needle to the target

  // evenly-spaced minor graduations across the sweep
  const minors: number[] = [];
  for (let a = P_FROM; a >= P_END - 0.01; a -= 12) minors.push(a);

  return (
    <svg viewBox="0 0 140 84" className={styles.progSvg} aria-hidden="true">
      {/* base track */}
      <polyline
        points={pArc(P_FROM, P_END, P_R)}
        fill="none"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* redline — the last stretch of the sweep glows RT orange */}
      <polyline
        points={pArc(P_REDLINE, P_END, P_R)}
        fill="none"
        stroke="rgba(225,67,18,0.55)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* progress fill — first photo up to the current one */}
      {index > 0 && (
        <polyline
          points={pArc(P_FROM, needleAngle, P_R)}
          fill="none"
          stroke="rgba(225,67,18,0.85)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      )}
      {/* minor graduations */}
      {minors.map((a) => {
        const [x1, y1] = pPt(a, P_R - 4);
        const [x2, y2] = pPt(a, P_R);
        const red = a <= P_REDLINE + 0.01;
        return (
          <line
            key={`min${a.toFixed(0)}`}
            x1={x1.toFixed(1)}
            y1={y1.toFixed(1)}
            x2={x2.toFixed(1)}
            y2={y2.toFixed(1)}
            stroke={red ? "rgba(225,67,18,0.85)" : "rgba(255,255,255,0.22)"}
            strokeWidth={red ? 1.3 : 1}
          />
        );
      })}
      {/* major graduations — one per photo */}
      {Array.from({ length: count }, (_, i) => {
        const ang = angleAt(i);
        const [x1, y1] = pPt(ang, P_R - 8);
        const [x2, y2] = pPt(ang, P_R + 1);
        const on = i === index;
        return (
          <line
            key={`maj${i}`}
            x1={x1.toFixed(1)}
            y1={y1.toFixed(1)}
            x2={x2.toFixed(1)}
            y2={y2.toFixed(1)}
            stroke={on ? "#e14312" : "rgba(255,255,255,0.6)"}
            strokeWidth={on ? 2.4 : 1.5}
          />
        );
      })}
      {/* needle */}
      <g
        style={{
          transform: `rotate(${rot}deg)`,
          transformOrigin: `${P_CX}px ${P_CY}px`,
          transition: "transform 0.55s cubic-bezier(0.3, 1.4, 0.55, 1)",
        }}
      >
        <line
          x1={P_CX}
          y1={P_CY + 6}
          x2={P_CX}
          y2={P_CY - (P_R - 12)}
          stroke="rgba(245,245,245,0.92)"
          strokeWidth="1.8"
        />
        <line
          x1={P_CX}
          y1={P_CY - (P_R - 12)}
          x2={P_CX}
          y2={P_CY - (P_R - 4)}
          stroke="#e14312"
          strokeWidth="1.8"
        />
      </g>
      {/* hub */}
      <circle
        cx={P_CX}
        cy={P_CY}
        r="3.4"
        fill="#0b0b0c"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="1"
      />
      <circle cx={P_CX} cy={P_CY} r="0.9" fill="rgba(245,245,245,0.9)" />
    </svg>
  );
}
