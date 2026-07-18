import type { Metadata } from "next";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Community | RT Performance",
  description:
    "RT Performance in the London supercar scene — features, meets, partnerships and the @rtperformance feed.",
};

export default function CommunityPage() {
  return (
    <>
      <header className={styles.head}>
        <span className={styles.eyebrow}>The Scene</span>
        <h1 className={styles.title}>Community</h1>
        <p className={styles.intro}>
          Our place in London&rsquo;s car culture — the meets we show up to, the
          features we&rsquo;re proud of and the partners we build alongside.
        </p>
      </header>
      <section className={styles.body}>
        <p className={styles.note}>Events, features &amp; feed — in build</p>
      </section>
    </>
  );
}
