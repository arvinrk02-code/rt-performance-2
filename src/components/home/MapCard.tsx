import s from "./mapcard.module.css";

const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Unit+10+Fourth+Way+Wembley+HA9+0LH";

/** Live, viewable map of the workshop, styled to sit on the light section. */
export default function MapCard() {
  return (
    <div className={s.card}>
      <iframe
        title="Map showing RT Performance, Unit 10 Fourth Way, Wembley HA9 0LH"
        src="https://www.google.com/maps?q=Unit+10+Fourth+Way+Wembley+HA9+0LH&z=15&output=embed"
        className={s.iframe}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
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
