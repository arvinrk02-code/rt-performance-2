import s from "./home.module.css";

/* the three square detail shots, in order across the band */
const TRIPTYCH = [
  { src: "/photos/about-detail-1.jpg", alt: "Forged wheel with red-lipped rim on a black car" },
  { src: "/photos/about-detail-2.jpg", alt: "Gloss-black wing mirror detail" },
  { src: "/photos/about-detail-3.jpg", alt: "Overhead view of a black coupe on the studio floor" },
];

/** About — Cayenne Black Edition grammar: bold uppercase statement lower-left,
 *  dimmed media right, then the 3-up gallery band with quiet corner arrows. */
export default function AboutPart1() {
  return (
    <section id="about" data-theme="dark" data-chapter="About" aria-labelledby="about-h">
      <div className={s.stmt}>
        <div className={s.stmtMedia} aria-hidden="true">
          {/* black ground stays behind so there's no flash before decode */}
          <div className={s.ph} />
          <img
            className={s.stmtImg}
            src="/photos/about-statement.jpg"
            alt=""
            loading="lazy"
            data-parallax
          />
        </div>
        <div className={s.stmtContent}>
          <h2 id="about-h" className={s.stmtHead} data-reveal="headline">
            An independent body and paint centre in Wembley, London.
          </h2>
          <p className={s.stmtBody} data-reveal="rise">
            RT Performance repairs, resprays and restores cars from Unit 10,
            Fourth Way. Carbon fibre and fibreglass are made in-house.
            VBRA-approved for accident and insurance repair. Established 2009.
          </p>
        </div>
      </div>

      <div className={s.triptych} data-reveal="stagger" aria-label="Recent work">
        {TRIPTYCH.map((t) => (
          <a
            key={t.src}
            href="/gallery"
            className={s.tripCard}
            aria-label={`${t.alt} — open the gallery`}
          >
            <img src={t.src} alt={t.alt} loading="lazy" />
            <span className={s.tripArrow} aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
