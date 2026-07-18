"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES } from "./slides";
import Tach from "./Tach";
import styles from "./Landing.module.css";

const AUTOPLAY_MS = 7000;
const LOADER_MS = 1900;
const BLINK_MS = 760;
const SWAP_AT_MS = 300; // slide swaps at the bottom of the exposure dip

/** Hairline fan echoing the loader's fine diagonals, anchored bottom-left. */
function FanLines() {
  const lines = Array.from({ length: 22 }, (_, i) => {
    const angle = (14 + i * 2.6) * (Math.PI / 180);
    const x0 = -4;
    const y0 = 104;
    const len = 150;
    // fixed precision so SSR and client markup match exactly
    return {
      x1: String(x0),
      y1: String(y0),
      x2: (x0 + Math.cos(angle) * len).toFixed(2),
      y2: (y0 - Math.sin(angle) * len).toFixed(2),
    };
  });
  return (
    <svg
      className={styles.fan}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="0.12"
        />
      ))}
    </svg>
  );
}

const NAV_LEFT = [
  { label: "Services", href: "#services" },
  { label: "Our Work", href: "#work" },
  { label: "Restoration", href: "#restoration" },
  { label: "Wheels", href: "#wheels" },
];

const NAV_RIGHT = [
  { label: "Reviews", href: "#reviews" },
  { label: "Find Us", href: "#find-us" },
];

export default function Landing() {
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [blink, setBlink] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastAdvance = useRef(0);
  const changing = useRef(false);
  const wheelAccum = useRef(0);
  const dragX = useRef<number | null>(null);
  const indexRef = useRef(0);
  const reduceRef = useRef(false);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const changeStart = useRef(0);

  /** Film cut: the scene dips through black while the next car fades up. */
  const goTo = useCallback((i: number) => {
    const target = ((i % SLIDES.length) + SLIDES.length) % SLIDES.length;
    // watchdog: hidden tabs throttle timers, which can strand `changing`
    // mid-transition — never let a stale lock block navigation forever
    if (changing.current && Date.now() - changeStart.current < 2000) return;
    if (target === indexRef.current) return;
    lastAdvance.current = Date.now();
    if (reduceRef.current) {
      setPrevIndex(indexRef.current);
      setIndex(target);
      return;
    }
    changing.current = true;
    changeStart.current = Date.now();
    setBlink(true);
    window.setTimeout(() => {
      setPrevIndex(indexRef.current);
      setIndex(target);
    }, SWAP_AT_MS);
    window.setTimeout(() => {
      setBlink(false);
      changing.current = false;
    }, BLINK_MS);
  }, []);

  const advance = useCallback(
    (dir: number) => goTo(indexRef.current + dir),
    [goTo]
  );

  const restartAutoplay = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (reduceRef.current) return;
    lastAdvance.current = Date.now();
    timer.current = setInterval(() => {
      // browsers replay throttled background-tab intervals in a burst on
      // return — gate on wall time so a burst advances at most one slide
      const now = Date.now();
      if (now - lastAdvance.current < AUTOPLAY_MS - 200) return;
      advance(1);
    }, AUTOPLAY_MS);
  }, [advance]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reduceRef.current = reduce;
    setReduceMotion(reduce);
    const t = setTimeout(
      () => {
        setLoading(false);
        restartAutoplay();
      },
      reduce ? 250 : LOADER_MS
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") advance(1);
      if (e.key === "ArrowLeft") advance(-1);
    };
    const onWheel = (e: WheelEvent) => {
      if (changing.current) return;
      wheelAccum.current +=
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (wheelAccum.current > 140) {
        wheelAccum.current = 0;
        advance(1);
      } else if (wheelAccum.current < -140) {
        wheelAccum.current = 0;
        advance(-1);
      }
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [role="button"]'))
        return;
      dragX.current = e.clientX;
    };
    const onUp = (e: PointerEvent) => {
      if (dragX.current == null) return;
      const dx = e.clientX - dragX.current;
      dragX.current = null;
      if (Math.abs(dx) > 60) advance(dx < 0 ? 1 : -1);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      clearTimeout(t);
      if (timer.current) clearInterval(timer.current);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slide = SLIDES[index];

  return (
    <div className={styles.stage}>
      {/* slides */}
      {SLIDES.map((s, i) => (
        <div
          key={s.img}
          className={`${styles.slide} ${i === index ? styles.slideActive : ""}`}
          aria-hidden={i !== index}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.img}
            alt=""
            className={styles.slideImg}
            draggable={false}
          />
          <div className={styles.scrim} />
        </div>
      ))}

      {/* announce car changes to screen readers */}
      <div aria-live="polite" className={styles.srOnly}>
        {slide.title}
      </div>

      {/* headline block — keyed so it re-animates each slide change */}
      <div className={styles.copy} key={slide.title}>
        <h1 className={styles.title}>{slide.title}</h1>
        {slide.sub && <p className={styles.sub}>{slide.sub}</p>}
        <a className={styles.cta} href="#contact">
          {slide.cta}
        </a>
      </div>

      {/* nav */}
      <header className={styles.nav} aria-label="Main">
        <button className={styles.burger} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>
        <nav className={styles.navLeft}>
          {NAV_LEFT.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a href="/" className={styles.brand} aria-label="RT Performance — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/rt-performance.png" alt="RT Performance" />
        </a>
        <nav className={styles.navRight}>
          {NAV_RIGHT.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href="#contact" className={styles.navContact}>
            Contact Us
          </a>
        </nav>
      </header>

      {/* the instrument — rev-counter as odometer, selector and progress */}
      <div className={styles.tach}>
        <Tach
          count={SLIDES.length}
          index={index}
          autoplayMs={AUTOPLAY_MS}
          live={!loading}
          reduceMotion={reduceMotion}
          onSelect={(i) => {
            goTo(i);
            restartAutoplay();
          }}
        />
        <div className={styles.numWrap} aria-hidden="true">
          {prevIndex !== null && (
            <span key={`out-${prevIndex}`} className={styles.numOut}>
              {String(prevIndex + 1).padStart(2, "0")}
            </span>
          )}
          <span key={`in-${index}`} className={styles.numIn}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className={styles.tachName} key={slide.short}>
          {slide.short}
        </div>
      </div>

      {/* film-cut dip — animationend is the authoritative cleanup; the
          timeout in goTo is only a fallback for throttled tabs */}
      {blink && (
        <div
          className={styles.blink}
          aria-hidden="true"
          onAnimationEnd={() => {
            setBlink(false);
            changing.current = false;
          }}
        />
      )}

      {/* loader */}
      <div
        className={`${styles.loader} ${loading ? "" : styles.loaderDone}`}
        aria-hidden="true"
      >
        <FanLines />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/rt-performance.png"
          alt=""
          className={styles.loaderLogo}
        />
      </div>
    </div>
  );
}
