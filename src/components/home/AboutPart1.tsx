import s from "./home.module.css";

/** About — Cayenne Black Edition grammar: bold uppercase statement lower-left,
 *  dimmed media right (black placeholder until the real shot is chosen),
 *  then the 3-up gallery band with corner "+" buttons. */
export default function AboutPart1() {
  return (
    <section id="about" data-theme="dark" data-chapter="About" aria-labelledby="about-h">
      <div className={s.stmt}>
        <div className={s.stmtMedia} aria-hidden="true">
          {/* [PHOTO PLACEHOLDER — tell me the shot and it drops in here] */}
          <div className={s.ph} data-parallax />
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

      <div className={s.triptych} data-reveal="stagger" aria-label="Workshop gallery">
        {[0, 1, 2].map((i) => (
          <a
            key={i}
            href="/gallery"
            className={s.tripCard}
            aria-label="Open the gallery"
          >
            {/* [PHOTO PLACEHOLDER {i+1} — black until chosen] */}
            <span className={s.plus} aria-hidden="true">
              +
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
