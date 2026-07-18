import type { Metadata } from "next";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "About Us | RT Performance",
  description:
    "The story behind RT Performance: our Wembley bodyshop, our approvals and our booth, and what customers say about the work.",
};

export default function AboutPage() {
  return (
    <>
      <header className={styles.head}>
        <span className={styles.eyebrow}>Our Story</span>
        <h1 className={styles.title}>About Us</h1>
        <p className={styles.intro}>
          A Wembley workshop built on a simple standard: return every car looking
          as it should have left the factory. Meet the team, the booth and the
          approvals behind the work.
        </p>
      </header>
      <section className={styles.body}>
        <p className={styles.note}>Story, approvals &amp; reviews (in build)</p>
      </section>
    </>
  );
}
