import type { Metadata } from "next";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Services | RT Performance",
  description:
    "Accident repair, full and partial resprays, alloy wheel refurbishment, body kits, detailing, ceramic coatings and full restoration for luxury and performance vehicles.",
};

export default function ServicesPage() {
  return (
    <>
      <header className={styles.head}>
        <span className={styles.eyebrow}>What We Do</span>
        <h1 className={styles.title}>Services</h1>
        <p className={styles.intro}>
          From insurance-approved accident repair to concours-grade resprays,
          wheel refurbishment and full restoration — every process carried out
          in-house to the standard London&rsquo;s finest cars deserve.
        </p>
      </header>
      <section className={styles.body}>
        <p className={styles.note}>Full services page — in build</p>
      </section>
    </>
  );
}
