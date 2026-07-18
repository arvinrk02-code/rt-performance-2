import s from "./home.module.css";

const MARQUES = [
  "McLaren",
  "Lamborghini",
  "Bentley",
  "Rolls-Royce",
  "Brabus",
  "Mercedes-AMG",
  "Ferrari",
];

/** About pt.1 — THE WORK. The hero's void carried on: pure typography,
 *  car-as-sculpture restraint (Pagani/SC Group — no imagery, no accent). */
export default function AboutPart1() {
  return (
    <section
      id="about"
      className={s.dark}
      data-theme="dark"
      aria-labelledby="about-pt1-h"
    >
      <div className={s.inner}>
        <div className={s.beatA}>
          <p className={s.kicker} data-reveal="kicker">
            <span className={s.kickerIndex}>01</span>What we do
          </p>
          <h2 id="about-pt1-h" className={s.h2} data-reveal="headline">
            Where cars become the&nbsp;point.
          </h2>
          <p className={s.about1Body} data-reveal="rise">
            Carbon widebody conversions. Full supercar resprays in colours
            that don&rsquo;t exist yet. Prestige restorations that take a
            stripped shell back to better-than-showroom. This is the work most
            bodyshops send away — and the work we&rsquo;ve built our name on
            since 2009.
          </p>

          <p className={s.statement} data-reveal="rise">
            If it&rsquo;s worth keeping, it&rsquo;s worth doing properly.
          </p>

          <div className={s.marques} data-reveal="stagger" aria-label="Marques we work with">
            {MARQUES.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
