"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Landing.module.css";

/* Hairline rev-counter: 240° dial, graduations 1–7 (one per car), a faint
 * redline past 6, and a weighted needle. During autoplay the needle creeps
 * linearly toward the next graduation — progress and position in a single
 * instrument — then swings with damped overshoot when the scene cuts. */

const CX = 100;
const CY = 100;
const R_ARC = 84;
const SWEEP_FROM = 210; // degrees, car 1
const STEP = 40; // per car, clockwise

const SWING_EASE = "cubic-bezier(0.3, 1.4, 0.55, 1)";
/* fixed-duration spring: the needle JUMPS to the target in one fast damped
   flick regardless of distance — never a clock-like sweep through the dial */
const SWING_MS = 620;

const tickAngle = (i: number) => SWEEP_FROM - i * STEP;
const toScreen = (aDeg: number) => 90 - aDeg; // CSS rotation for the needle

function pt(aDeg: number, r: number): [number, number] {
  const a = (aDeg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)];
}

function arcPoints(fromDeg: number, toDeg: number, r: number): string {
  const pts: string[] = [];
  const step = fromDeg > toDeg ? -2 : 2;
  for (let a = fromDeg; step < 0 ? a >= toDeg : a <= toDeg; a += step) {
    const [x, y] = pt(a, r);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(" ");
}

interface TachProps {
  count: number;
  index: number;
  autoplayMs: number;
  /** false while the loader is up or when reduced motion is requested */
  live: boolean;
  reduceMotion: boolean;
  onSelect: (i: number) => void;
}

export default function Tach({
  count,
  index,
  autoplayMs,
  live,
  reduceMotion,
  onSelect,
}: TachProps) {
  const [rot, setRot] = useState(toScreen(tickAngle(index)));
  const [trans, setTrans] = useState("none");
  const raf = useRef(0);
  const rafCreep = useRef(0);
  const needleRef = useRef<SVGGElement | null>(null);
  const prevIndexRef = useRef(index); // to recognise the last→first wrap
  const rotRef = useRef(rot);
  useEffect(() => {
    rotRef.current = rot;
  }, [rot]);

  /** The needle's true on-screen angle — mid-creep it differs from state. */
  const currentAngle = () => {
    const g = needleRef.current;
    if (g) {
      const t = getComputedStyle(g).transform;
      const m = t && t !== "none" && t.match(/matrix\(([^)]+)\)/);
      if (m) {
        const [a, b] = m[1].split(",").map(Number);
        return (Math.atan2(b, a) * 180) / Math.PI;
      }
    }
    return rotRef.current;
  };

  useEffect(() => {
    const from = prevIndexRef.current;
    prevIndexRef.current = index;
    if (reduceMotion) {
      setTrans("none");
      setRot(toScreen(tickAngle(index)));
      return;
    }
    const target = toScreen(tickAngle(index));
    cancelAnimationFrame(raf.current);
    cancelAnimationFrame(rafCreep.current);
    if (from === count - 1 && index === 0) {
      // Limiter reset (last car → first): the film dip is fully black when
      // this commit lands, so the needle goes home INSTANTLY under cover.
      // A 620ms spring here would still be sweeping backward — overshooting
      // off-scale past graduation 1 — as the first scene fades back in,
      // which read as the screen glitching. Snap = scene 1 opens with a
      // settled instrument, like every other autoplay cut.
      setTrans("none");
      setRot(target);
    } else {
      // Freeze at the true current angle first: if the needle was already
      // creeping toward this very graduation, the CSS target wouldn't change
      // and no transition would restart — the whip would be silently lost.
      // Freezing then springing guarantees the 620ms flick every time.
      setTrans("none");
      setRot(currentAngle());
      raf.current = requestAnimationFrame(() => {
        raf.current = requestAnimationFrame(() => {
          setTrans(`transform ${SWING_MS}ms ${SWING_EASE}`);
          setRot(target);
        });
      });
    }
    if (!live || index >= count - 1) return; // rest at redline on the last car
    // …then creep toward the next one for the rest of the dwell
    // (own rAF handle — must never cancel a whip that hasn't fired yet)
    const t = setTimeout(() => {
      rafCreep.current = requestAnimationFrame(() => {
        rafCreep.current = requestAnimationFrame(() => {
          setTrans(`transform ${autoplayMs - SWING_MS - 320}ms linear`);
          setRot(toScreen(tickAngle(index + 1)));
        });
      });
    }, SWING_MS + 180);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf.current);
      cancelAnimationFrame(rafCreep.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, live, reduceMotion, autoplayMs, count]);

  const minors: number[] = [];
  for (let a = SWEEP_FROM; a >= tickAngle(count - 1); a -= 10) {
    if ((SWEEP_FROM - a) % STEP !== 0) minors.push(a);
  }

  return (
    <svg
      className={styles.tachSvg}
      viewBox="10 6 180 148"
      aria-hidden="false"
      role="group"
      aria-label="Car selector"
    >
      {/* dial */}
      <polyline
        points={arcPoints(SWEEP_FROM, tickAngle(count - 1), R_ARC)}
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1"
      />
      {/* redline: the reach past the 6th graduation */}
      <polyline
        points={arcPoints(tickAngle(count - 2), tickAngle(count - 1), R_ARC)}
        fill="none"
        stroke="rgba(225,67,18,0.55)"
        strokeWidth="1.6"
      />
      {/* minor graduations */}
      {minors.map((a) => {
        const [x1, y1] = pt(a, 78.5);
        const [x2, y2] = pt(a, R_ARC);
        return (
          <line
            key={a}
            x1={x1.toFixed(2)}
            y1={y1.toFixed(2)}
            x2={x2.toFixed(2)}
            y2={y2.toFixed(2)}
            stroke="rgba(255,255,255,0.26)"
            strokeWidth="1"
          />
        );
      })}
      {/* major graduations + dial numbers + hit targets */}
      {Array.from({ length: count }, (_, i) => {
        const a = tickAngle(i);
        const [x1, y1] = pt(a, 73.5);
        const [x2, y2] = pt(a, R_ARC);
        const [nx, ny] = pt(a, 61);
        // generous invisible hit zone spanning the number AND its graduation
        // (the region the old focus box occupied) — nothing visible on press
        const [hx, hy] = pt(a, 70);
        const active = i === index;
        return (
          <g key={i}>
            <line
              x1={x1.toFixed(2)}
              y1={y1.toFixed(2)}
              x2={x2.toFixed(2)}
              y2={y2.toFixed(2)}
              stroke={active ? "#ffffff" : "rgba(255,255,255,0.55)"}
              strokeWidth={active ? 2 : 1.4}
            />
            <text
              x={nx.toFixed(2)}
              y={ny.toFixed(2)}
              textAnchor="middle"
              dominantBaseline="central"
              className={styles.tachNum}
              fill={active ? "#ffffff" : "rgba(255,255,255,0.45)"}
            >
              {i + 1}
            </text>
            <circle
              cx={hx.toFixed(2)}
              cy={hy.toFixed(2)}
              r="22"
              fill="transparent"
              role="button"
              tabIndex={0}
              aria-label={`Car ${i + 1}`}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(i);
                }
              }}
            />
          </g>
        );
      })}
      {/* needle */}
      <g
        ref={needleRef}
        style={{
          transform: `rotate(${rot}deg)`,
          transformOrigin: `${CX}px ${CY}px`,
          transition: trans,
        }}
      >
        <line
          x1={CX}
          y1={CY + 13}
          x2={CX}
          y2={CY - 58}
          stroke="rgba(245,245,245,0.95)"
          strokeWidth="1.6"
        />
        <line
          x1={CX}
          y1={CY - 58}
          x2={CX}
          y2={CY - 68}
          stroke="#e14312"
          strokeWidth="1.6"
        />
        <line
          x1={CX}
          y1={CY}
          x2={CX}
          y2={CY + 13}
          stroke="rgba(245,245,245,0.8)"
          strokeWidth="3"
        />
      </g>
      <circle
        cx={CX}
        cy={CY}
        r="3.2"
        fill="#0b0b0c"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="1"
      />
    </svg>
  );
}
