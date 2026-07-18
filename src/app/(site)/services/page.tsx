import type { Metadata } from "next";
import styles from "../page.module.css";
import svc from "./services.module.css";

export const metadata: Metadata = {
  title: "Services | RT Performance",
  description:
    "Accident repairs, body kits and customisations, restorations, tints, sprays and wraps, and SMART repairs, all carried out in-house for luxury and performance vehicles.",
};

const SERVICES = [
  {
    id: "accident-repairs",
    title: "Accident Repairs",
    text: "Insurance-approved and private accident repair, from cosmetic knocks to structural work, returning every panel, line and finish to the standard it left the factory with.",
  },
  {
    id: "body-kits",
    title: "Body Kits & Customisations",
    text: "Aftermarket and bespoke styling fitted and finished in-house: full body kits, aero, widebody conversions and one-off details that make a car unmistakably yours.",
  },
  {
    id: "restorations",
    title: "Restorations",
    text: "Ground-up and classic restoration covering bodywork, paint and interior refurbishment, bringing tired and historic cars back to their best, panel by panel.",
  },
  {
    id: "tints-sprays-wraps",
    title: "Tints, Sprays & Wraps",
    text: "Full and partial resprays, colour-change vinyl wraps, paint protection film and window tints, for a flawless new finish, whether permanent or reversible.",
  },
  {
    id: "smart-repairs",
    title: "SMART Repairs",
    text: "Fast, localised repair for scuffs, scratches, stone chips and kerbed wheels, a precise, cost-effective fix without respraying the whole panel.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <header className={styles.head}>
        <span className={styles.eyebrow}>What We Do</span>
        <h1 className={styles.title}>Services</h1>
        <p className={styles.intro}>
          From insurance-approved accident repair to concours-grade resprays and
          full restoration, every process carried out in-house to the standard
          London&rsquo;s finest cars deserve.
        </p>
      </header>

      <section className={svc.body} aria-label="Our services">
        <ol className={svc.list}>
          {SERVICES.map((s, i) => (
            <li key={s.id} id={s.id} className={svc.item}>
              <span className={svc.index} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={svc.itemBody}>
                <h2 className={svc.itemTitle}>{s.title}</h2>
                <p className={svc.itemText}>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
