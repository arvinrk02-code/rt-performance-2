"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES } from "./slides";
import Tach from "./Tach";
import SiteHeader from "./SiteHeader";
import styles from "./Landing.module.css";

const AUTOPLAY_MS = 7000;
const LOADER_MS = 2100;
const BLINK_MS = 760;
const SWAP_AT_MS = 300; // slide swaps at the bottom of the exposure dip

export default function Landing() {
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [blink, setBlink] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastAdvance = useRef(0);
  const changing = useRef(false);
  const indexRef = useRef(0);
  const reduceRef = useRef(false);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const changeStart = useRef(0);
  const pendingTarget = useRef<number | null>(null);
  const goToRef = useRef<(i: number) => void>(() => {});

  /** Cut finished: release the lock and honour any click made mid-cut. */
  const finishCut = useCallback(() => {
    setBlink(false);
    changing.current = false;
    const p = pendingTarget.current;
    pendingTarget.current = null;
    if (p != null && p !== indexRef.current) goToRef.current(p);
  }, []);

  /** Film cut: the scene dips through black while the next car fades up. */
  const goTo = useCallback(
    (i: number) => {
      const target = ((i % SLIDES.length) + SLIDES.length) % SLIDES.length;
      if (changing.current && Date.now() - changeStart.current < 2000) {
        // mid-cut clicks are queued, not dropped — every press counts
        if (target !== indexRef.current) pendingTarget.current = target;
        return;
      }
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
      window.setTimeout(finishCut, BLINK_MS);
    },
    [finishCut]
  );

  useEffect(() => {
    goToRef.current = goTo;
  }, [goTo]);

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

    // scroll/swipe deliberately do NOT change the car — vertical gestures
    // are reserved for page scrolling once further sections exist. The car
    // changes only via autoplay, clicking a dial number, or arrow keys.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") advance(1);
      if (e.key === "ArrowLeft") advance(-1);
    };

    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      if (timer.current) clearInterval(timer.current);
      window.removeEventListener("keydown", onKey);
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
            className={`${styles.slideImg} ${s.contain ? styles.slideContain : ""}`}
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
        <a className={styles.cta} href={`/our-work#${slide.slug}`}>
          {slide.cta}
        </a>
      </div>

      {/* shared nav — transparent, floating over the hero */}
      <SiteHeader variant="hero" />

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
          onAnimationEnd={finishCut}
        />
      )}

      {/* entry gate — the RT mark arrives the way RT's work does: a fresh
          respray curing from matte primer to a deep, clear-coated gloss. */}
      <div
        className={`${styles.gate} ${loading ? "" : styles.gateOpen}`}
        aria-hidden="true"
      >
        <div className={styles.gateVoid} />
        <span className={styles.gateMark}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/rt-performance.png"
            alt=""
            className={styles.gateLogo}
          />
          <span className={styles.gateGloss} />
        </span>
      </div>
    </div>
  );
}
