"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES } from "./slides";
import styles from "./Landing.module.css";

const AUTOPLAY_MS = 6000;
const LOADER_MS = 1900;

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
  const reduceMotion = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastAdvance = useRef(0);

  const restartAutoplay = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (reduceMotion.current) return;
    lastAdvance.current = Date.now();
    timer.current = setInterval(() => {
      // browsers replay throttled background-tab intervals in a burst on
      // return — gate on wall time so a burst advances at most one slide
      const now = Date.now();
      if (now - lastAdvance.current < AUTOPLAY_MS - 200) return;
      lastAdvance.current = now;
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
      restartAutoplay();
    },
    [restartAutoplay]
  );

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const t = setTimeout(
      () => {
        setLoading(false);
        restartAutoplay();
      },
      reduceMotion.current ? 250 : LOADER_MS
    );
    return () => {
      clearTimeout(t);
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, goTo]);

  const slide = SLIDES[index];
  const next = SLIDES[(index + 1) % SLIDES.length];

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

      {/* dash pagination */}
      <div className={styles.dashes} role="tablist" aria-label="Slides">
        {SLIDES.map((s, i) => (
          <button
            key={s.img}
            role="tab"
            aria-selected={i === index}
            aria-label={s.title}
            className={`${styles.dash} ${i === index ? styles.dashActive : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* next-slide preview */}
      <button
        className={styles.preview}
        onClick={() => goTo(index + 1)}
        aria-label={`Next: ${next.title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={next.img} alt="" draggable={false} />
        <span className={styles.previewLabel}>{next.title}</span>
      </button>

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
