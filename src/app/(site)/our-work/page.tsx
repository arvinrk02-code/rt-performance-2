import type { Metadata } from "next";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Our Work | RT Performance",
  description:
    "Featured builds and case studies — stripped shells returned to showroom, accident repairs and transformations, told before and after.",
};

export default function OurWorkPage() {
  return (
    <>
      <header className={styles.head}>
        <span className={styles.eyebrow}>Featured Builds</span>
        <h1 className={styles.title}>Our Work</h1>
        <p className={styles.intro}>
          A handful of jobs told in full — the shell, the process and the finish.
          From accident repair to ground-up transformation, these are the cars we
          are proudest to have handed back.
        </p>
      </header>
      <section className={styles.body}>
        <p className={styles.note}>Case studies — in build</p>
      </section>
    </>
  );
}
