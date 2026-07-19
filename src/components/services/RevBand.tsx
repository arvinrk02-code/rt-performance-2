"use client";

import styles from "./revband.module.css";

/* The Services instrument: the hero's rev-counter, unrolled.
 *
 * Same drawing language as the round hero tach (src/components/Tach.tsx) —
 * hairline spine, fine graduations, mono numerals, a single ember accent on the
 * needle — but straightened into one long linear gauge. Pure line: no fills, no
 * metal, no bulk.
 *
 * The needle is CONTINUOUS: the parent maps scroll progress to a percentage
 * along the scale (needlePct) and the needle glides with the page — it does not
 * jump graduation to graduation. The scale has a lead-in above graduation 1
 * (the needle rests there during the intro and "hits 1" as the first service
 * arrives) and a redline past 5 that it reaches at the foot of the page.
 *
 * Two states of ONE device:
 *   intro  — tall, labelled with the service names: the menu on the black screen
 *   docked — a slim scale pinned to the edge, tracking progress down the white
 *            chapters (flips horizontal along the top on narrow viewports)   */

export interface Stop {
  id: string;
  title: string;
}

/* scale geometry, % along the spine */
export const SCALE = {
  start: 4, // needle rest, above graduation 1
  g1: 14, // first graduation — "entering the first service is where it hits one"
  g5: 82, // last graduation
  red: 90, // redline nub / end of travel
};

/** % position along the spine for graduation i of n. */
export const posOf = (i: number, n: number) =>
  n <= 1 ? (SCALE.g1 + SCALE.g5) / 2 : SCALE.g1 + (i / (n - 1)) * (SCALE.g5 - SCALE.g1);

interface RevBandProps {
  stops: Stop[];
  /** index of the service the viewport is inside, or -1 before the first */
  active: number;
  /** continuous needle position, % along the scale (SCALE.start…SCALE.red) */
  needlePct: number;
  variant: "intro" | "docked";
  onSelect: (i: number) => void;
}

const pad = (i: number) => String(i).padStart(2, "0");

export default function RevBand({
  stops,
  active,
  needlePct,
  variant,
  onSelect,
}: RevBandProps) {
  const n = stops.length;

  // fine minor graduations between the majors, for gauge texture
  const minors: number[] = [];
  for (let p = SCALE.g1; p <= SCALE.g5 + 0.01; p += (SCALE.g5 - SCALE.g1) / ((n - 1) * 4)) {
    const nearMajor = stops.some((_, i) => Math.abs(posOf(i, n) - p) < 0.5);
    if (!nearMajor) minors.push(p);
  }

  const onKey = (e: React.KeyboardEvent) => {
    const prev = e.key === "ArrowUp" || e.key === "ArrowLeft";
    const next = e.key === "ArrowDown" || e.key === "ArrowRight";
    if (!prev && !next) return;
    e.preventDefault();
    onSelect(Math.min(n - 1, Math.max(0, active + (next ? 1 : -1))));
  };

  return (
    <nav
      className={`${styles.band} ${
        variant === "intro" ? styles.intro : styles.docked
      }`}
      aria-label="Service selector"
      onKeyDown={onKey}
    >
      {variant === "intro" && (
        <div className={styles.readout} aria-hidden="true">
          <span className={styles.readNum}>
            {active < 0 ? "00" : pad(active + 1)}
          </span>
        </div>
      )}

      <div className={styles.scale}>
        <span className={styles.spine} aria-hidden="true" />
        {/* ember progress, lead-in → needle */}
        <span
          className={styles.fill}
          style={{
            ["--from" as string]: `${SCALE.start}%`,
            ["--to" as string]: `${needlePct}%`,
          }}
          aria-hidden="true"
        />
        {/* redline nub, past the last graduation */}
        <span
          className={styles.redline}
          style={{ ["--at" as string]: `${SCALE.red}%` }}
          aria-hidden="true"
        />

        {minors.map((p) => (
          <span
            key={p.toFixed(2)}
            className={styles.minor}
            style={{ ["--pos" as string]: `${p}%` }}
            aria-hidden="true"
          />
        ))}

        {stops.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.id}
              type="button"
              className={`${styles.stop} ${isActive ? styles.stopActive : ""}`}
              style={{ ["--pos" as string]: `${posOf(i, n)}%` }}
              aria-label={`${s.title} — ${i + 1} of ${n}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => onSelect(i)}
            >
              <span className={styles.tick} aria-hidden="true" />
              <span className={styles.num} aria-hidden="true">
                {i + 1}
              </span>
              <span className={styles.name}>{s.title}</span>
            </button>
          );
        })}

        {/* the needle — thin pointer with an ember tip, gliding with scroll */}
        <span
          className={styles.needle}
          style={{ ["--pos" as string]: `${needlePct}%` }}
          aria-hidden="true"
        >
          <span className={styles.needleTip} />
        </span>
      </div>
    </nav>
  );
}
