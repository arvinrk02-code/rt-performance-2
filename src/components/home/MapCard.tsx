"use client";

import { useState } from "react";
import s from "./mapcard.module.css";

const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Unit+10+Fourth+Way+Wembley+HA9+0LH";

/** Privacy-friendly map: styled placeholder, interactive iframe only on click
 *  — no third-party requests or cookies until the visitor opts in. */
export default function MapCard() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={s.card}>
      {loaded ? (
        <iframe
          title="Map showing RT Performance, Unit 10 Fourth Way, Wembley HA9 0LH"
          src="https://www.google.com/maps?q=Unit+10+Fourth+Way+Wembley+HA9+0LH&output=embed"
          className={s.iframe}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className={s.placeholder}
          onClick={() => setLoaded(true)}
          aria-label="Load interactive map of Unit 10 Fourth Way, Wembley HA9 0LH"
        >
          <span className={s.pin} aria-hidden="true" />
          <span className={s.viewMap}>View map</span>
          <span className={s.addr}>Unit 10, Fourth Way · HA9 0LH</span>
        </button>
      )}
      <a
        href={DIRECTIONS_URL}
        target="_blank"
        rel="noreferrer"
        className={s.directions}
      >
        Get directions ↗
      </a>
    </div>
  );
}
