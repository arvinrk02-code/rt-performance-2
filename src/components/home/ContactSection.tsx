import s from "./home.module.css";
import QuoteForm from "./QuoteForm";

/** 05 · Contact — the close: centred statement, hairline form beneath. */
export default function ContactSection() {
  return (
    <section
      id="contact"
      className={s.chapter}
      data-theme="dark"
      data-chapter="Contact"
      aria-labelledby="contact-h"
    >
      <div className={`${s.content} ${s.contentCenter}`}>
        <p className={s.tag} data-reveal="kicker">
          <span className={s.tagIndex}>05</span>Contact
        </p>
        <h2 id="contact-h" className={s.headline} data-reveal="headline">
          Send us the car.
        </h2>
        <p className={s.sub} data-reveal="rise">
          Photos of the damage or the dream — an honest reply within one
          working day.
        </p>
        <p className={s.pipes} data-reveal="rise">
          <a href="tel:+442089000014">Call</a>
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
