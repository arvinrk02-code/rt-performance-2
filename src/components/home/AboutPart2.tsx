import s from "./home.module.css";

const SERVICES = [
  { label: "Accident Repairs", href: "/services#accident-repairs" },
  { label: "Body Kits & Customisations", href: "/services#body-kits" },
  { label: "Restorations", href: "/services#restorations" },
  { label: "Tints, Sprays & Wraps", href: "/services#tints-sprays-wraps" },
  { label: "SMART Repairs", href: "/services#smart-repairs" },
];

/** 02 · Services — plain title, interactive hairline rows (arrow slides in
 *  on hover), split with a craft detail photo. */
export default function AboutPart2() {
  return (
    <section
      className={s.light}
      data-theme="light"
      data-chapter="Services"
      aria-labelledby="services-h"
    >
      <div className={s.inner}>
        <p className={s.kicker} data-reveal="kicker">
          <span className={s.kickerIndex}>02</span>What we do
        </p>

        <div className={s.split}>
          <div>
            <h2 id="services-h" className={s.h2} data-reveal="headline">
              Services.
            </h2>
            <nav className={s.svcList} data-reveal="stagger" aria-label="Services">
              {SERVICES.map((svc) => (
                <a key={svc.label} href={svc.href} className={s.svcRow}>
                  <span className={s.svcLabel}>{svc.label}</span>
                  <span className={s.svcArrow} aria-hidden="true">→</span>
                </a>
              ))}
            </nav>
            <div className={s.svcTail} data-reveal="rise">
              <a href="/services" className={s.textLink}>
                Explore all services
              </a>
            </div>
          </div>

          <figure className={`${s.splitMedia} ${s.splitMediaTall}`} data-reveal="rise">
            <div className={s.mediaFrame}>
              <img
                src="/photos/mulsanne-headlamp-detail.jpg"
                alt="Bentley Mulsanne headlamp and grille detail, finished at RT Performance"
                loading="lazy"
                data-parallax
              />
            </div>
            <figcaption className={`${s.photoCaption} ${s.photoCaptionLight}`}>
              Bentley Mulsanne — paint and brightwork detail
            </figcaption>
          </figure>
        </div>

        <p className={s.credLine} data-reveal="rise">
          Since 2009 · VBRA-approved · 96% would recommend
        </p>
      </div>
    </section>
  );
}
