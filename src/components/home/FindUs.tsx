import s from "./home.module.css";
import MapCard from "./MapCard";

/** 04 · Find us — quiet logistics on the void: serif details, dark map. */
export default function FindUs() {
  return (
    <section
      id="find-us"
      className={`${s.chapter} ${s.chapterShort} ${s.findWhite}`}
      data-theme="dark"
      data-chapter="Find us"
      aria-labelledby="findus-h"
    >
      <div className={s.content}>
        <p className={s.tag} data-reveal="kicker">
          <span className={s.tagIndex}>04</span>Find us
        </p>
        <h2 id="findus-h" className={s.headline} data-reveal="headline">
          Wembley, London.
        </h2>

        <div className={s.findCols}>
          <div data-reveal="stagger">
            <span className={s.findLabel}>Address</span>
            <address className={s.findValue}>
              Unit 10, Fourth Way
              <br />
              Wembley HA9 0LH
            </address>

            <span className={s.findLabel}>Hours</span>
            <p className={s.findValue}>Mon – Fri, 8:30 – 18:00</p>
            <p className={s.findSmall}>
              Collection &amp; delivery across North West London — enclosed
              transport for the special ones.
            </p>

            <span className={s.findLabel}>Contact</span>
            <p className={s.pipes} style={{ margin: 0 }}>
              <a href="tel:+442089000014">020 8900 0014</a>
              <span aria-hidden="true">|</span>
              <a href="https://wa.me/447704155514">WhatsApp</a>
              <span aria-hidden="true">|</span>
              <a href="mailto:info@rt-performance.co.uk">Email</a>
            </p>
          </div>

          <div data-reveal="rise">
            <MapCard />
          </div>
        </div>
      </div>
    </section>
  );
}
