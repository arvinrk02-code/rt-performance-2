import s from "./home.module.css";
import q from "./quoteform.module.css";
import QuoteForm from "./QuoteForm";

/** Contact — the conversion hub. The calmest section on the page. */
export default function ContactSection() {
  return (
    <section
      id="contact"
      className={s.light}
      data-theme="light"
      aria-labelledby="contact-h"
    >
      <div className={s.inner}>
        <p className={s.kicker} data-reveal="kicker">
          <span className={s.kickerIndex}>05</span>Get a quote
        </p>
        <h2 id="contact-h" className={s.h2} data-reveal="headline">
          Send us the car. We&rsquo;ll send you a&nbsp;plan.
        </h2>
        <p className={s.lead} style={{ marginTop: 26, maxWidth: "48ch" }} data-reveal="rise">
          Had a prang or planning a project — snap a few photos and we&rsquo;ll
          come back with an honest assessment. No forms for the sake of forms,
          no pressure. Most quotes back within one working day.
        </p>

        <div className={q.grid}>
          <QuoteForm />

          <aside className={q.rail} aria-label="Reach us now">
            <div className={q.railItem}>
              <span className={q.railLabel}>WhatsApp</span>
              <a
                className={q.railLink}
                href="https://wa.me/447704155514"
                target="_blank"
                rel="noreferrer"
              >
                Message us on WhatsApp
              </a>
              <span className={q.railSub}>
                Fastest reply — send photos straight from your phone.
              </span>
            </div>
            <div className={q.railItem}>
              <span className={q.railLabel}>Phone</span>
              <a className={`${q.railLink} ${q.railMono}`} href="tel:+442089000014">
                020 8900 0014
              </a>
              <span className={q.railSub}>Mon–Fri, 8:30–18:00</span>
            </div>
            <div className={q.railItem}>
              <span className={q.railLabel}>Email</span>
              <a className={q.railLink} href="mailto:info@rt-performance.co.uk">
                info@rt-performance.co.uk
              </a>
            </div>
            <div className={q.railItem}>
              <span className={q.railLabel}>Address</span>
              <a className={q.railLink} href="#find-us">
                Unit 10, Fourth Way, Wembley HA9 0LH
              </a>
            </div>
            <div className={q.railItem}>
              <span className={q.railLabel}>Hours</span>
              <span className={`${q.railLink} ${q.railMono}`}>
                Mon–Fri 8:30–18:00 · Closed weekends
              </span>
            </div>
            <div className={q.railItem}>
              <p className={q.trust}>
                VBRA-approved accident repair centre. Insurance work welcome.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
