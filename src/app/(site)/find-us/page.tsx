import type { Metadata } from "next";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Find Us | RT Performance",
  description:
    "RT Performance, Unit 10 Fourth Way, Wembley, London HA9 0LH. Directions, opening hours and free collection & delivery.",
};

export default function FindUsPage() {
  return (
    <>
      <header className={styles.head}>
        <span className={styles.eyebrow}>Wembley, London</span>
        <h1 className={styles.title}>Find Us</h1>
        <p className={styles.intro}>
          Unit 10 Fourth Way, Wembley, London HA9 0LH. Open Monday to Friday,
          8:30 to 18:00. Free collection and delivery across London.
        </p>
      </header>
      <section className={styles.body}>
        <p className={styles.note}>Map &amp; directions — in build</p>
      </section>
    </>
  );
}
