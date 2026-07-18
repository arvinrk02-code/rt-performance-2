import s from "./home.module.css";
import QuoteForm from "./QuoteForm";

/** 05 · Contact — the cinematic close: back into the void, Pagani-minimal.
 *  Serif statement, pipe quick-links, hairline form. */
export default function ContactSection() {
  return (
    <section
      id="contact"
      className={s.dark}
      data-theme="dark"
      data-chapter="Contact"
      aria-labelledby="contact-h"
    >
      <div className={s.inner}>
        <p className={s.kicker} data-reveal="kicker">
          <span className={s.kickerIndex}>05</span>Contact
        </p>
        <h2 id="contact-h" className={s.h2} data-reveal="headline">
          Send us the car.
        </h2>
        <p className={s.lead} style={{ marginTop: 26 }} data-reveal="rise">
          Photos of the damage or the dream — an honest assessment back within
          one working day.
        </p>

        <p className={`${s.pipeLinks} ${s.pipeLinksDark}`} data-reveal="rise">
          <a href="tel:+442089000014">Call 020 8900 0014</a>
          <span aria-hidden="true">|</span>
          <a href="https://wa.me/447704155514">WhatsApp</a>
          <span aria-hidden="true">|</span>
          <a href="mailto:info@rt-performance.co.uk">Email</a>
        </p>

        <QuoteForm />
      </div>
    </section>
  );
}
