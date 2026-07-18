"use client";

import { useEffect, useState } from "react";
import s from "./chapterdots.module.css";
import { scrollToAnchor, getLenis } from "@/lib/motion";

interface Chapter {
  id: string;
  label: string;
}

/** Pagani-style scene dots, adapted: fixed right edge, one dot per chapter,
 *  active state tracks scroll. Desktop only; decorative for pointer users
 *  (nav duplicates all destinations), so hidden from the tab order. */
export default function ChapterDots() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-chapter]")
    );
    const heroEl = document.querySelector<HTMLElement>("[data-hero]");
    const all = heroEl ? [heroEl, ...sections] : sections;
    setChapters(
      all.map((el, i) => ({
        id: el.id || `chapter-${i}`,
        label: el.dataset.chapter || "Home",
      }))
    );

    const probe = () => {
      const mid = window.innerHeight * 0.5;
      let idx = 0;
      all.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top <= mid) idx = i;
      });
      setActive(idx);
    };
    probe();
    window.addEventListener("scroll", probe, { passive: true });
    return () => window.removeEventListener("scroll", probe);
  }, []);

  if (chapters.length === 0) return null;

  const go = (i: number) => {
    if (i === 0) {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0, { duration: 1.1 });
      else window.scrollTo({ top: 0 });
    } else {
      scrollToAnchor(`#${chapters[i].id}`);
    }
  };

  return (
    <nav className={s.dots} aria-hidden="true">
      {chapters.map((c, i) => (
        <button
          key={c.id + i}
          className={`${s.dot} ${i === active ? s.on : ""}`}
          onClick={() => go(i)}
          tabIndex={-1}
        >
          <span className={s.tip}>{c.label}</span>
        </button>
      ))}
    </nav>
  );
}
