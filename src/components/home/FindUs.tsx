import s from "./home.module.css";
import MapCard from "./MapCard";

const POSTCODES = ["HA9", "HA0", "HA3", "HA1", "NW9", "NW10", "NW2", "NW6"];

/** Find Us — light, calm, locally rich (LocalBusiness schema lives on the page). */
export default function FindUs() {
  return (
    <section
      id="find-us"
      className={s.light}
      data-theme="light"
      aria-labelledby="find-us-h"
    >
      <div className={s.inner}>
        <p className={s.kicker} data-reveal="kicker">
          <span className={s.kickerIndex}>04</span>Find us
        </p>
        <h2 id="find-us-h" className={s.h2} data-reveal="headline">
          Wembley&rsquo;s workshop for the cars that don&rsquo;t forgive
          mistakes.
        </h2>
        <p className={s.lead} style={{ marginTop: 30 }} data-reveal="rise">
          We&rsquo;re on Fourth Way in Wembley — a five-minute run from the
          North Circular (A406) and Wembley Park, with the Stadium Industrial
          Estate on our doorstep. It&rsquo;s where McLarens, Bentleys and
          G-Wagons come for carbon, paint and accident repair, and where a
          first insurance claim gets handled without the panic. Prestige or
          prang, you&rsquo;ll find the same workshop behind both.
        </p>

        <div className={s.findGrid}>
          <div data-reveal="stagger">
            <span className={s.findLabel}>Address</span>
            <address className={s.address}>
              RT Performance
              <br />
              Unit 10, Fourth Way
              <br />
              Wembley, Middlesex
              <br />
              HA9 0LH
            </address>

            <span className={s.findLabel}>Opening hours</span>
            <p className={s.hours}>
              MON – FRI&nbsp;&nbsp;08:30 – 18:00
              <br />
              SAT – SUN&nbsp;&nbsp;CLOSED
            </p>
            <p className={s.hoursSub}>
              Drop-offs and collections by arrangement — call ahead and
              we&rsquo;ll have someone waiting.
            </p>

            <div className={s.ctaRow}>
              <a href="tel:+442089000014" className={s.ghost}>
                Call 020 8900 0014
              </a>
              <a
                href="https://wa.me/447704155514"
                className={s.ghost}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp +44 7704 155514
              </a>
            </div>
            <p style={{ marginTop: 14 }}>
              <a href="mailto:info@rt-performance.co.uk" className={s.emailLink}>
                info@rt-performance.co.uk
              </a>
            </p>

            <span className={s.findLabel}>Getting here</span>
            <p className={s.body}>
              Head for Fourth Way off Great Central Way — we&rsquo;re in the
              row of units backing onto the Stadium Industrial Estate, RT
              signage on the unit. Free parking directly outside for drop-offs.
              Nearest stations: Wembley Stadium (Chiltern) and Wembley Park
              (Jubilee/Metropolitan), both a short taxi or ten-minute walk.
            </p>

            <span className={s.findLabel}>Collection &amp; delivery</span>
            <p className={s.body}>
              Can&rsquo;t get to us? We collect and deliver across Wembley and
              North West London, and arrange enclosed transport for high-value
              and non-drivable cars — nationwide when needed. Insurance jobs:
              we&rsquo;ll liaise with your insurer and can arrange recovery
              straight to the workshop.
            </p>
          </div>

          <div data-reveal="rise">
            <MapCard />
          </div>
        </div>

        <span className={s.findLabel} style={{ marginTop: 48 }}>
          Where we work
        </span>
        <p className={s.body} data-reveal="rise">
          Serving Wembley, Brent and North West London — including Harrow,
          Stanmore, Kingsbury, Willesden, Neasden, Hendon and the HA and NW
          postcodes. VBRA-approved accident repair; carbon and fibreglass
          produced in-house since 2009.
        </p>
        <div className={s.postcodes} data-reveal="stagger">
          {POSTCODES.map((pc) => (
            <span key={pc} className={s.postcode}>
              {pc}
            </span>
          ))}
        </div>

        <div className={s.quoteBand}>
          <p className={s.quoteBandLine}>Bringing something special in?</p>
          <a href="#contact" className={s.ghost}>
            Get a quote
          </a>
        </div>
      </div>
    </section>
  );
}
