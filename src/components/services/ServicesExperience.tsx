"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import RevBand, { SCALE, posOf } from "./RevBand";
import {
  initSmoothScroll,
  destroySmoothScroll,
  getLenis,
  easeOutExpo,
} from "@/lib/motion";
import styles from "./services-experience.module.css";

/* /services — the black instrument page.
 *
 * The intro's structure runs the WHOLE page: the labelled rev-band rail is a
 * fixed left column, present the whole way down; the wide right space — where
 * "Services" sits on the intro — carries each service's title, copy and photo.
 * The page scrolls FREELY (no snap): one flowing section. The rail's needle is
 * CONTINUOUS — scroll maps piecewise-linearly onto the scale, so it glides,
 * resting above graduation 1 on the intro, hitting 1 as the first service
 * arrives and running out toward the redline at the foot. The active service
 * name lights ember.
 *
 * Photos are the Porsche "detalles" treatment (measured off
 * cayenneblackedition.com): ONE flat frame per service — no border, no shadow —
 * overflow-hidden with an oversized image drifting vertically inside it as you
 * scroll (parallax). The frame enters as a slow pure fade; once on screen, a
 * slow carousel dissolves through the service's photos. Captions are bold
 * uppercase with a terminal period.
 *
 * The Porsche progressive-blur stack sits under the (chromeless) nav so content
 * dissolves into the bar as it scrolls out. */

export interface ServicePhoto {
  src: string;
  caption: string;
  alt: string;
}

export interface ServiceChapter {
  id: string;
  title: string;
  lede: string;
  facts: string[];
  photos: ServicePhoto[];
}

interface ServicesExperienceProps {
  services: ServiceChapter[];
}

/* The Porsche progressive-blur stack (measured off cayenneblackedition.com):
 * eight masked backdrop-filter layers, blur halving 64px → 0.5px down the
 * strip, each mask a band offset 12.5% from the last. Together they read as
 * one graded smear — content dissolves as it slides up under the nav. */
const MELT_LAYERS = [
  { b: 64, m: "linear-gradient(180deg,#000 0%,#000 12.5%,#000 25%,transparent 37.5%)" },
  { b: 32, m: "linear-gradient(180deg,transparent 12.5%,#000 25%,#000 37.5%,transparent 50%)" },
  { b: 16, m: "linear-gradient(180deg,transparent 25%,#000 37.5%,#000 50%,transparent 62.5%)" },
  { b: 8, m: "linear-gradient(180deg,transparent 37.5%,#000 50%,#000 62.5%,transparent 75%)" },
  { b: 4, m: "linear-gradient(180deg,transparent 50%,#000 62.5%,#000 75%,transparent 87.5%)" },
  { b: 2, m: "linear-gradient(180deg,transparent 62.5%,#000 75%,#000 87.5%,transparent 100%)" },
  { b: 1, m: "linear-gradient(180deg,transparent 75%,#000 87.5%,#000 100%)" },
  { b: 0.5, m: "linear-gradient(180deg,transparent 87.5%,#000 100%)" },
];

/* ------------------------------------------------- the Porsche photo frame */
/* One flat frame: enters as a slow fade, then a slow carousel dissolves
 * through the photos while the oversized image drifts with scroll. */

type EnterDir = "right" | "up" | "left" | "down";

/** entrance directions cycle per service — the reference uses all four */
const ENTER_DIRS: EnterDir[] = ["right", "up", "left", "down"];

function PhotoFrame({
  chapter,
  dir,
}: {
  chapter: ServiceChapter;
  dir: EnterDir;
}) {
  const [idx, setIdx] = useState(0);
  const [live, setLive] = useState(false);
  const hover = useRef(false);
  const itemRef = useRef<HTMLElement | null>(null);
  const n = chapter.photos.length;
  const photo = chapter.photos[idx];

  // only the frame on screen cycles
  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // warm every photo the moment the frame is on screen — no flashes mid-dissolve
  useEffect(() => {
    if (!live) return;
    chapter.photos.forEach((p) => {
      const img = new Image();
      img.src = p.src;
    });
  }, [live, chapter.photos]);

  // the slow carousel — paused under the cursor, off under reduced motion
  useEffect(() => {
    if (!live) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (!hover.current) setIdx((i) => (i + 1) % n);
    }, 5000);
    return () => clearInterval(t);
  }, [live, n]);

  const step = (dir: number) => setIdx((i) => (i + dir + n) % n);

  return (
    <figure
      ref={itemRef}
      className={`${styles.phItem} ${
        dir === "up"
          ? styles.phDirUp
          : dir === "left"
            ? styles.phDirLeft
            : dir === "down"
              ? styles.phDirDown
              : ""
      }`}
      data-ph
      onMouseEnter={() => {
        hover.current = true;
      }}
      onMouseLeave={() => {
        hover.current = false;
      }}
    >
      <button
        type="button"
        className={styles.phFrame}
        onClick={() => step(1)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
          }
        }}
        aria-label={`Next photo — showing ${photo.caption}`}
      >
        {/* the parallax scroller — oversized, drifts with scroll */}
        <div className={styles.phScroller} data-ph-img>
          {chapter.photos.map((p, i) => (
            /* the LEAD photo loads eagerly so it's ready before its entrance
               plays — a lazy image fades in empty (black on black), then pops */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.src}
              src={p.src}
              alt={i === idx ? p.alt : ""}
              className={`${styles.phImg} ${i === idx ? styles.phImgOn : ""}`}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
            />
          ))}
        </div>
      </button>

      <figcaption className={styles.phBar}>
        <span className={styles.phCap}>{photo.caption}.</span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------ experience */

export default function ServicesExperience({ services }: ServicesExperienceProps) {
  const [active, setActive] = useState(-1); // -1 while on the intro

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const activeRef = useRef(-1);

  const n = services.length;

  const reduceMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Lenis smooth scroll — the weightlessness. The scroll POSITION itself
   * glides (lerp 0.1, the config measured off cayenneblackedition), so the
   * needle, parallax and everything downstream ride an inertial signal
   * instead of raw wheel steps. No-op under reduced motion. */
  useEffect(() => {
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, []);

  /* the inertial follower — a CONTINUOUS rAF loop, no React in the path.
   * Each frame: read the (Lenis-smoothed) scroll, map it piecewise onto the
   * scale (service i arrives when its top crosses 35% of the viewport; lead-in
   * above graduation 1, run-out to the redline), then LERP the needle toward
   * that target and write it straight to the DOM as an inherited custom
   * property. The lerp is the float: it rounds the mapping's slope changes
   * into curves and soaks up any frame jitter — perfectly smooth motion.
   * Photo parallax rides the same loop from cached geometry (no layout
   * thrash). Active-service state only updates when it actually changes. */
  useEffect(() => {
    const prm = reduceMotion();

    let anchors: number[] = [];
    let frames: { el: HTMLElement; top: number; h: number }[] = [];
    let maxY = 1;
    let wrapBottomDoc = 0; // page-y of the CTA's foot — where the rail bows out

    const measure = () => {
      const y = window.scrollY;
      const refLine = window.innerHeight * 0.35;
      anchors = sectionRefs.current.map((el) =>
        el ? el.getBoundingClientRect().top + y - refLine : 0
      );
      frames = Array.from(
        document.querySelectorAll<HTMLElement>("[data-ph-img]")
      ).map((el) => {
        const r = el.parentElement!.getBoundingClientRect();
        return { el, top: r.top + y, h: r.height };
      });
      maxY = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const w = wrapRef.current;
      wrapBottomDoc = w ? w.offsetTop + w.offsetHeight : 0;
    };
    measure();
    const settle = setTimeout(measure, 700); // after fonts/images settle
    window.addEventListener("resize", measure);

    let cur = SCALE.start; // the needle's followed position
    let rafId = 0;

    const tick = () => {
      const vh = window.innerHeight;
      const y = window.scrollY;

      let pct: number;
      let a: number;
      if (y < anchors[0]) {
        const t = Math.min(1, Math.max(0, y / Math.max(1, anchors[0])));
        pct = SCALE.start + t * (posOf(0, n) - SCALE.start);
        a = -1;
      } else if (y >= anchors[n - 1]) {
        const t = Math.min(
          1,
          (y - anchors[n - 1]) / Math.max(1, maxY - anchors[n - 1])
        );
        pct = posOf(n - 1, n) + t * (SCALE.red - posOf(n - 1, n));
        a = n - 1;
      } else {
        a = 0;
        for (let i = 0; i < n - 1; i++) {
          if (y >= anchors[i] && y < anchors[i + 1]) {
            a = i;
            break;
          }
        }
        const t = (y - anchors[a]) / Math.max(1, anchors[a + 1] - anchors[a]);
        pct = posOf(a, n) + t * (posOf(a + 1, n) - posOf(a, n));
      }

      // the float: ease toward the target every frame
      cur += (pct - cur) * (prm ? 1 : 0.085);
      const rail = railRef.current;
      if (rail) {
        rail.style.setProperty("--needle-pos", `${cur.toFixed(3)}%`);
        // bow the rail out as the footer takes over — the CTA ("Let's talk
        // about your car") is its last scene; below it, the footer stands alone
        const wrapBottomVp = wrapBottomDoc - y;
        // full while the CTA rises in and AT its centred point (wrapBottomVp
        // = 1.0vh), then fade the INSTANT you scroll down past centre — gone
        // ~0.13vh (~110px) below it
        const op = Math.max(0, Math.min(1, (wrapBottomVp - vh * 0.87) / (vh * 0.13)));
        rail.style.opacity = op.toFixed(3);
        rail.style.pointerEvents = op < 0.05 ? "none" : "auto";
      }

      if (activeRef.current !== a) {
        activeRef.current = a;
        setActive(a);
      }

      // photo parallax — ±14% drift (the reference's measured range)
      if (!prm) {
        for (const f of frames) {
          const top = f.top - y;
          if (top + f.h < -80 || top > vh + 80) continue;
          const p = (top + f.h / 2 - vh / 2) / vh;
          const ty = Math.max(-14, Math.min(14, p * -18));
          f.el.style.transform = `translateY(${ty.toFixed(2)}%)`;
        }
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(settle);
      window.removeEventListener("resize", measure);
    };
  }, [n]);

  /* reveals — text rises softly; photos enter as a slow pure fade (Porsche) */
  useEffect(() => {
    const els = wrapRef.current?.querySelectorAll<HTMLElement>(
      "[data-reveal], [data-ph]"
    );
    if (!els || els.length === 0) return;
    if (reduceMotion()) {
      els.forEach((el) => el.classList.add(styles.revealIn));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add(styles.revealIn);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.22 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const select = useCallback(
    (i: number) => {
      const el = sectionRefs.current[i];
      if (!el) return;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(el, { duration: 1.1, easing: easeOutExpo });
      } else {
        el.scrollIntoView({
          behavior: reduceMotion() ? "auto" : "smooth",
          block: "start",
        });
      }
      history.replaceState(null, "", `#${services[i].id}`);
    },
    [services]
  );

  const stops = services.map((s) => ({ id: s.id, title: s.title }));

  return (
    <div ref={wrapRef} className={styles.wrap}>
      {/* the Porsche melt — content dissolves into the nav, all the way down */}
      <div className={styles.topMelt} aria-hidden="true">
        {MELT_LAYERS.map((l, i) => (
          <span
            key={l.b}
            style={{
              backdropFilter: `blur(${l.b}px)`,
              WebkitBackdropFilter: `blur(${l.b}px)`,
              maskImage: l.m,
              WebkitMaskImage: l.m,
              zIndex: i + 1,
            }}
          />
        ))}
      </div>

      {/* the rail — one fixed instrument, the constant down the whole page.
          The needle's real position is --needle-pos, written per-frame by the
          inertial follower; the prop is only the SSR resting state. */}
      <div className={styles.rail} ref={railRef}>
        <RevBand
          stops={stops}
          active={active}
          needlePct={SCALE.start}
          variant="intro"
          onSelect={select}
        />
      </div>

      {/* ------------------------------------------------ intro (unchanged) */}
      <section className={styles.intro} data-theme="dark" aria-label="Services">
        <div className={styles.railSpacer} aria-hidden="true" />
        <div className={styles.introCopy}>
          <p className={styles.eyebrow}>What we do</p>
          <h1 className={styles.title}>Services</h1>
          <p className={styles.lede}>
            From insurance-approved accident repair to concours-grade resprays
            and full restoration, every process carried out in-house to the
            standard London&rsquo;s finest cars deserve.
          </p>
          <p className={styles.hint} aria-hidden="true">
            Select a service &mdash; or scroll through all five
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ the five services */}
      {services.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          ref={(el) => {
            sectionRefs.current[i] = el;
          }}
          className={styles.chapter}
          aria-labelledby={`${s.id}-title`}
        >
          <div className={styles.railSpacer} aria-hidden="true" />
          <div className={styles.chRight}>
            <div className={styles.chText} data-reveal>
              <h2 id={`${s.id}-title`} className={styles.chTitle}>
                {s.title}
              </h2>
              <p className={styles.chLede}>{s.lede}</p>
              <p className={styles.chFacts}>
                {s.facts.map((f, fi) => (
                  <span key={f}>
                    {f}
                    {fi < s.facts.length - 1 && (
                      <span className={styles.factDot} aria-hidden="true">
                        {" "}
                        &middot;{" "}
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </div>

            <PhotoFrame chapter={s} dir={ENTER_DIRS[i % ENTER_DIRS.length]} />
          </div>
        </section>
      ))}

      {/* ------------------------------------------------ hand-off */}
      <section className={styles.cta} aria-label="Get a quote">
        <div className={styles.railSpacer} aria-hidden="true" />
        <div className={styles.ctaInner} data-reveal>
          <p className={styles.ctaEyebrow}>Next</p>
          <h2 className={styles.ctaTitle}>Let&rsquo;s talk about your car.</h2>
          <Link href="/#contact" className={styles.ctaLink}>
            Arrange a consultation <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
