import s from "./home.module.css";
import MapCard from "./MapCard";

/** 04 · Find Us — light chapter, logistics-calm. Tracked labels + serif
 *  details on the left, the styled map card on the right. */
export default function FindUs() {
  return (
    <section
      id="find-us"
      className={s.light}
      data-theme="light"
      data-chapter="Find us"
      aria-labelledby="findus-h"
    >
      <div className={s.inner}>
        <p className={s.kicker} data-reveal="kicker">
          <span className={s.kickerIndex}>04</span>Find us
        </p>
        <h2 id="findus-h" className={s.h2} data-reveal="headline">
          Fourth Way, Wembley.
        </h2>
        <p className={s.body} style={{ marginTop: 26 }} data-reveal="rise">
          Five minutes from the North Circular and Wembley Park — where
          McLarens, Bentleys and G-Wagons come for carbon, paint and accident
          repair across Wembley, Brent and North West London.
        </p>

        <div className={s.findGrid}>
          <div data-reveal="stagger">
            <div>
              <span className={s.findLabel}>Address</span>
              <address className={s.address}>
                Unit 10, Fourth Way
                <br />
                Wembley HA9 0LH
              </address>
            </div>
            <div>
              <span className={s.findLabel}>Hours</span>
              <p className={s.hours}>
                Mon – Fri&ensp;08:30 – 18:00
                <br />
                Sat – Sun&ensp;Closed
              </p>
            </div>
            <div>
              <span className={s.findLabel}>Contact</span>
              <p className={s.pipeLinks}>
                <a href="tel:+442089000014">Call</a>
                <span aria-hidden="true">|</span>
                <a href="https://wa.me/447704155514">WhatsApp</a>
                <span aria-hidden="true">|</span>
                <a href="mailto:info@rt-performance.co.uk">Email</a>
              </p>
            </div>
            <div>
              <span className={s.findLabel}>Collection &amp; delivery</span>
              <p className={s.findNote}>
                Across North West London — enclosed transport arranged for the
                special ones.
              </p>
            </div>
          </div>

          <div data-reveal="rise">
            <MapCard />
            {/* [PLACEHOLDER — Unit 10 exterior with RT signage: supply via chat
                and it drops in here as a rounded photo card] */}
          </div>
        </div>
      </div>
    </section>
  );
}
