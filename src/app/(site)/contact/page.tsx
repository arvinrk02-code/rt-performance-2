import type { Metadata } from "next";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Contact Us | RT Performance",
  description:
    "Get in touch with RT Performance — call, WhatsApp or email, or send an enquiry. Unit 10 Fourth Way, Wembley, London.",
};

export default function ContactPage() {
  return (
    <>
      <header className={styles.head}>
        <span className={styles.eyebrow}>Get In Touch</span>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.intro}>
          Call <a href="tel:+442089000014">+44 (0)20 8900 0014</a>, WhatsApp{" "}
          <a href="https://wa.me/447704155514">+44 (0)770 415 5514</a> or email{" "}
          <a href="mailto:info@rt-performance.com">info@rt-performance.com</a>.
          An enquiry form is on the way.
        </p>
      </header>
      <section className={styles.body}>
        <p className={styles.note}>Enquiry form — in build</p>
      </section>
    </>
  );
}
