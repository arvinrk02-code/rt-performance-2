"use client";

import { useEffect, useRef, useState } from "react";
import s from "./home.module.css";

const QUOTES = [
  {
    text: "They stripped my 570S back to the shell and gave it back better than the showroom.",
    who: "James · McLaren 570S · Google",
  },
  {
    text: "Taras handled the insurer, kept me updated, and the car came back like it never happened.",
    who: "Priya · Range Rover Sport · Google",
  },
  {
    text: "The carbon work is on another level. Bespoke kit, perfect fit.",
    who: "Deniz · Brabus G-Wagon · Facebook",
  },
  {
    text: "My Golf got the same care as the supercars in the unit. Can't fault them.",
    who: "Tom · VW Golf · Google",
  },
];

/** 03 · Reviews — a Pagani scene: one voice at a time, centred on the void. */
export default function Reviews() {
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => setI((v) => (v + 1) % QUOTES.length), 6500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return (
    <section
      id="reviews"
      className={`${s.chapter} ${s.chapterShort} ${s.orange}`}
      data-theme="dark"
      data-chapter="Reviews"
      aria-label="What our clients say"
    >
      <div className={`${s.content} ${s.contentCenter}`}>
        <p className={s.tag} data-reveal="kicker">
          <span className={s.tagIndex}>03</span>Word of mouth
        </p>

        <div className={s.quoteStage} data-reveal="rise">
          {QUOTES.map((q, idx) => (
            <blockquote
              key={q.who}
              className={`${s.quoteSlide} ${idx === i ? s.quoteActive : ""}`}
              aria-hidden={idx !== i}
            >
              <p className={s.quoteText}>&ldquo;{q.text}&rdquo;</p>
              <footer className={s.quoteWho}>{q.who}</footer>
            </blockquote>
          ))}
        </div>

        <div className={s.quoteDots} aria-hidden="true">
          {QUOTES.map((_, idx) => (
            <button
              key={idx}
              className={`${s.quoteDot} ${idx === i ? s.quoteDotOn : ""}`}
              onClick={() => setI(idx)}
              tabIndex={-1}
              aria-label={`Review ${idx + 1}`}
            />
          ))}
        </div>

        <p className={s.quoteMetaLine} data-reveal="rise">
          96% would recommend · Google &amp; Facebook
        </p>
      </div>
    </section>
  );
}
