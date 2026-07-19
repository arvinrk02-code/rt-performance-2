"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { WORK_CARS, type WorkCar, type WorkPhoto } from "./work";
import Lightbox from "./Lightbox";
import styles from "./OurWork.module.css";

/* Our Work — an instrument for the seven featured builds.
 *
 * A marque rail on the left selects a car; the panels swipe across. Each car
 * is a serif title, a one-line overview, and a continuous filmstrip of its
 * photos — drag or arrow through it, click the centre frame to expand. A
 * stage thread beneath tracks the repair arc (Strip → Paint → Finish) and
 * the photo count. Deep-links by hash (/our-work#ferrari-458) so the home
 * slider's CTAs land on the right car. */

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
  // current photo per car for the filmstrip galleries
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
  // through the active car's photos (matching the horizontal filmstrip). The
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

      {/* the page header — the h1 reads "Our Work: Featured Builds" */}
      <header className={styles.pageHead}>
        <h1 className={styles.pageTitle}>
          <span className={styles.pageEyebrow}>Our Work</span>
          Featured Builds
        </h1>
      </header>

      {/* the marque rail — select a car */}
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
                <span className={styles.railMarker} aria-hidden="true" />
                <MarqueMark marque={c.marque} n={i + 1} />
                <span className={styles.railName}>{c.short}</span>
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
  isActive: boolean;
  photoIndex: number;
  onPhoto: (photoIndex: number) => void;
  onExpand: (photoIndex: number) => void;
}

function Panel({ car, isActive, photoIndex, onPhoto, onExpand }: PanelProps) {
  return (
    <section
      className={styles.panel}
      aria-hidden={!isActive}
      aria-roledescription="Featured build"
      aria-label={car.title}
    >
      <header className={styles.panelHead} key={car.slug}>
        <h2 className={styles.title}>{car.title}</h2>
        <p className={styles.overview}>{car.overview}</p>
      </header>

      <Filmstrip
        car={car}
        isActive={isActive}
        photoIndex={photoIndex}
        onPhoto={onPhoto}
        onExpand={onExpand}
      />
    </section>
  );
}

/* ----------------------------------------------- filmstrip photo gallery */

/* A continuous strip of full frames on one eased track: the active photo
 * sits centred while its neighbours peek in from the sides, dimmed; the
 * strip glides (transform-only) when the photo changes, follows the pointer
 * 1:1 during a drag, and snaps to the nearest frame on release. The centre
 * image carries a slow Ken-Burns drift so the gallery never sits still. */

interface FilmstripProps {
  car: WorkCar;
  isActive: boolean;
  photoIndex: number;
  onPhoto: (photoIndex: number) => void;
  onExpand: (photoIndex: number) => void;
}

function Filmstrip({
  car,
  isActive,
  photoIndex,
  onPhoto,
  onExpand,
}: FilmstripProps) {
  const photos = car.gallery;
  const n = photos.length;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ x: 0, down: false, moved: false });

  const clampIdx = (i: number) => Math.max(0, Math.min(n - 1, i));

  // one frame-step of the strip in px, measured live so CSS clamp() rules it
  const stepPx = () => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    return first.offsetWidth + gap;
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    drag.current = { x: e.clientX, down: true, moved: false };
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!drag.current.down) return;
    const dx = e.clientX - drag.current.x;
    if (!drag.current.moved && Math.abs(dx) > 6) {
      drag.current.moved = true;
      trackRef.current?.classList.add(styles.fsDragging);
    }
    // --dragX lives outside React so the strip tracks the pointer at 60fps
    if (drag.current.moved) {
      trackRef.current?.style.setProperty("--dragX", `${dx}px`);
    }
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    if (!drag.current.down) return;
    drag.current.down = false;
    const dx = e.clientX - drag.current.x;
    const track = trackRef.current;
    track?.classList.remove(styles.fsDragging);
    track?.style.setProperty("--dragX", "0px");
    const step = stepPx();
    let shift = step ? Math.round(-dx / step) : 0;
    if (shift === 0 && Math.abs(dx) > 44) shift = dx < 0 ? 1 : -1; // short flick
    if (shift !== 0) onPhoto(clampIdx(photoIndex + shift));
  };

  return (
    <figure className={styles.fs}>
      <div
        className={styles.fsViewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          ref={trackRef}
          className={styles.fsTrack}
          style={{ ["--i" as string]: photoIndex }}
        >
          {photos.map((p, i) => {
            const a = Math.abs(i - photoIndex);
            const isCentre = i === photoIndex;
            return (
              <button
                key={p.src}
                type="button"
                className={`${styles.fsFrame} ${
                  isCentre ? styles.fsFrameActive : ""
                } ${a > 2 ? styles.fsFrameFar : ""}`}
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
                <span className={styles.fsInner}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.src}
                    alt={p.caption}
                    className={styles.fsImg}
                    loading={isCentre ? "eager" : "lazy"}
                    draggable={false}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <figcaption className={styles.fsCaption} key={photoIndex}>
        {photos[photoIndex].caption}
      </figcaption>

      <ProgressThread photos={photos} index={photoIndex} onSeek={onPhoto} />
    </figure>
  );
}

/* ------------------------------------------------------- the stage thread */

/* Replaces the old rev-counter dial (the hero owns the tachometer motif).
 * One hairline thread spans the gallery: a fine tick per photo, an ember
 * fill up to the current frame, and a travelling ember diamond as the
 * "you are here" mark. Photos tagged with a stage get a taller labelled
 * node (Strip → Paint → Finish) that can be clicked to jump there — the
 * current stage's label burns ember — with the photo count at the right. */

function ProgressThread({
  photos,
  index,
  onSeek,
}: {
  photos: WorkPhoto[];
  index: number;
  onSeek: (i: number) => void;
}) {
  const n = photos.length;
  const p = n > 1 ? index / (n - 1) : 0;
  const pct = (i: number) => (n > 1 ? (i / (n - 1)) * 100 : 50);

  const nodes = photos
    .map((ph, i) => ({ i, stage: ph.stage }))
    .filter((x): x is { i: number; stage: string } => Boolean(x.stage));

  // the stage the current photo sits in = the last tagged stage at or before it
  let current = "";
  for (const nd of nodes) if (nd.i <= index) current = nd.stage;

  // stage labels that would crowd their predecessor flip above the line
  const flipped = new Set<number>();
  let prevStagePct = -Infinity;
  photos.forEach((ph, i) => {
    if (!ph.stage) return;
    const at = pct(i);
    if (at - prevStagePct < 14) flipped.add(i);
    prevStagePct = at;
  });

  // width of one step's hit cell, so the cells tile the whole rail and any
  // point on the thread seeks its nearest photo (capped in CSS)
  const stepW = n > 1 ? `${100 / (n - 1)}%` : "100%";

  return (
    <div className={styles.thread}>
      <div className={styles.threadRail}>
        <span className={styles.threadLine} aria-hidden="true" />
        <span
          className={styles.threadFill}
          aria-hidden="true"
          style={{ ["--p" as string]: p }}
        />
        {/* one clickable step per photo — a plain tick, or a taller labelled
            node at the tagged stages — every one seeks straight to its photo */}
        {photos.map((ph, i) => {
          const at = pct(i);
          const staged = Boolean(ph.stage);
          const cls = [
            styles.threadStep,
            staged ? styles.threadStepStaged : "",
            i <= index ? styles.threadStepPassed : "",
            staged && current === ph.stage ? styles.threadStepCurrent : "",
            flipped.has(i) ? styles.threadStepFlip : "",
            at < 3 ? styles.threadStepStart : at > 97 ? styles.threadStepEnd : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={i}
              type="button"
              className={cls}
              style={{ left: `${at}%`, ["--stepw" as string]: stepW }}
              aria-current={i === index ? "true" : undefined}
              aria-label={`Go to photo ${i + 1} of ${n}${
                ph.stage ? `, ${ph.stage} stage` : ""
              }`}
              onClick={() => onSeek(i)}
            >
              <span className={styles.threadStepTick} aria-hidden="true" />
              {staged && (
                <span className={styles.threadStepLabel} aria-hidden="true">
                  {ph.stage}
                </span>
              )}
            </button>
          );
        })}
        <span
          className={styles.threadCarriage}
          aria-hidden="true"
          style={{ ["--p" as string]: p }}
        >
          <span className={styles.threadMarker} />
        </span>
      </div>

      <span className={styles.threadCount}>
        <span aria-hidden="true">
          {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        <span className={styles.srOnly}>
          {`Photo ${index + 1} of ${n}${current ? `, ${current} stage` : ""}`}
        </span>
      </span>
    </div>
  );
}
