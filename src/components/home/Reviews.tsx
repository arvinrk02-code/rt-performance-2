"use client";

import { useEffect, useRef, useState } from "react";
import s from "./home.module.css";

/* Real-asset framing: 96% recommend / 20 reviews (Facebook + Google).
   Quotes are drafts pending client sign-off — not emitted as schema. */
const QUOTES = [
  {
    text: "They stripped my 570S back to the shell and gave it back better than the showroom.",
    who: "James · McLaren 570S",
    src: "Google",
  },
  {
    text: "Taras handled the insurer, kept me updated, and the car came back like it never happened.",
    who: "Priya · Range Rover Sport",
    src: "Google",
  },
  {
    text: "The carbon work is on another level. Bespoke kit, perfect fit.",
    who: "Deniz · Brabus G-Wagon",
    src: "Facebook",
  },
  {
    text: "Honest quote, no upsell — my Golf got the same care as the supercars in the unit.",
    who: "Tom · VW Golf",
    src: "Google",
  },
];

const DWELL_MS = 6000;

/** 03 · Word of mouth — a lowkey Pagani-style scene: one quote at a time,
 *  crossfading, with the aggregate as a quiet caps line. Reduced-motion or
 *  no-JS: the first quote stands still, nothing rotates. */
export default function Reviews() {
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => {
      setI((v) => (v + 1) % QUOTES.length);
    }, DWELL_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return (
    <section
      id="reviews"
      className={`${s.dark} ${s.reviewsStrip}`}
      data-theme="dark"
      data-chapter="Reviews"
      aria-label="What our clients say"
    >
      <div className={s.inner}>
        <p className={s.kicker} data-reveal="kicker">
          <span className={s.kickerIndex}>03</span>Word of mouth
        </p>

        <div className={s.quoteStage} data-reveal="rise">
          {QUOTES.map((q, idx) => (
            <blockquote
              key={q.who}
              className={`${s.quoteSlide} ${idx === i ? s.quoteActive : ""}`}
              aria-hidden={idx !== i}
            >
              <p className={s.quote}>&ldquo;{q.text}&rdquo;</p>
              <footer className={s.attribution}>
                {q.who} <span className={s.source}>· {q.src}</span>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className={s.quoteMeta} data-reveal="rise">
          <span className={s.aggregateSub}>
            96% would recommend · 20 verified reviews · Google &amp; Facebook
          </span>
          <span className={s.quoteDots} aria-hidden="true">
            {QUOTES.map((_, idx) => (
              <button
                key={idx}
                className={`${s.quoteDot} ${idx === i ? s.quoteDotOn : ""}`}
                onClick={() => setI(idx)}
                tabIndex={-1}
                aria-label={`Review ${idx + 1}`}
              />
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}
