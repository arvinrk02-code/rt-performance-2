import type { Metadata } from "next";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Gallery | RT Performance",
  description:
    "The full collection of customer cars through the RT Performance booth: supercars, SUVs and classics, finished in-house.",
};

export default function GalleryPage() {
  return (
    <>
      <header className={styles.head}>
        <span className={styles.eyebrow}>The Collection</span>
        <h1 className={styles.title}>Gallery</h1>
        <p className={styles.intro}>
          Every car that has passed through the booth, in its finished state. A
          browsable record of the work, grouped by build.
        </p>
      </header>
      <section className={styles.body}>
        <p className={styles.note}>Photo collection (in build)</p>
      </section>
    </>
  );
}
