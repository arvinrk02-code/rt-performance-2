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
/* swing at constant angular speed: full dial (240°) ≈ 820ms, one step ≈ 300ms */
const SWING_MS_PER_DIAL = 820;
const SWING_MS_MIN = 260;
const SWING_MS_MAX = 860;

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
  const needleRef = useRef<SVGGElement | null>(null);
  const rotRef = useRef(rot);
  useEffect(() => {
    rotRef.current = rot;
  }, [rot]);

  /** The needle's true on-screen angle right now — mid-swing or mid-creep the
   *  CSS transition means the visual angle differs from the state target. */
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
    if (reduceMotion) {
      setTrans("none");
      setRot(toScreen(tickAngle(index)));
      return;
    }
    // swing to the new graduation at constant angular speed — a one-step hop
    // and a full-dial jump feel the same, measured from the needle's actual
    // current angle (it may be mid-creep between graduations)
    const target = toScreen(tickAngle(index));
    const delta = Math.abs(target - currentAngle());
    const swingMs = Math.round(
      Math.min(SWING_MS_MAX, Math.max(SWING_MS_MIN, (delta / 240) * SWING_MS_PER_DIAL))
    );
    setTrans(`transform ${swingMs}ms ${SWING_EASE}`);
    setRot(target);
    if (!live || index >= count - 1) return; // rest at redline on the last car
    // …then creep toward the next one for the rest of the dwell
    const t = setTimeout(() => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        raf.current = requestAnimationFrame(() => {
          setTrans(`transform ${Math.max(1000, autoplayMs - swingMs - 320)}ms linear`);
          setRot(toScreen(tickAngle(index + 1)));
        });
      });
    }, swingMs + 140);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf.current);
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
