import s from "./home.module.css";

const SERVICES = [
  { label: "Accident Repairs", href: "/services#accident-repairs" },
  { label: "Body Kits & Customisations", href: "/services#body-kits" },
  { label: "Restorations", href: "/services#restorations" },
  { label: "Tints, Sprays & Wraps", href: "/services#tints-sprays-wraps" },
  { label: "SMART Repairs", href: "/services#smart-repairs" },
];

/** 02 · Services — craft detail full-bleed, the five services as hairline
 *  rows floating on the darkened frame (SC Group video-chapter pattern). */
export default function AboutPart2() {
  return (
    <section
      className={s.chapter}
      data-theme="dark"
      data-chapter="Services"
      aria-labelledby="services-h"
    >
      <div className={s.bg} data-parallax>
        <img
          src="/photos/mulsanne-headlamp-detail.jpg"
          alt="Bentley Mulsanne headlamp and grille detail finished at RT Performance"
          loading="lazy"
        />
      </div>
      <div className={s.scrim} aria-hidden="true" />

      <div className={s.content}>
        <p className={s.tag} data-reveal="kicker">
          <span className={s.tagIndex}>02</span>What we do
        </p>
        <h2 id="services-h" className={s.headline} data-reveal="headline">
          Services.
        </h2>
        <nav className={s.svcRows} data-reveal="stagger" aria-label="Services">
          {SERVICES.map((svc) => (
            <a key={svc.label} href={svc.href} className={s.svcRow}>
              <span className={s.svcName}>{svc.label}</span>
              <span className={s.svcArrow} aria-hidden="true">→</span>
            </a>
          ))}
        </nav>
        <p className={s.pipes} data-reveal="rise">
          <a href="/services">Explore all services</a>
        </p>
      </div>
    </section>
  );
}
