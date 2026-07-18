"use client";

import { useState } from "react";
import s from "./servicestabs.module.css";

const SERVICES = [
  {
    name: "Accident Repairs",
    href: "/services#accident-repairs",
    img: "/photos/workshop-detail-tech.jpg",
    alt: "Technician preparing a black vehicle for repair in the RT Performance workshop",
    note: "VBRA-approved insurance and private accident repair, handled end to end and returned to factory standard.",
  },
  {
    name: "Body Kits & Customisations",
    href: "/services#body-kits",
    img: "/photos/carbon-sian-workshop.jpg",
    alt: "Lamborghini with exposed carbon fibre bodywork in the booth",
    note: "Carbon fibre and fibreglass aero, widebody and trim — designed and made in-house since 2009.",
  },
  {
    name: "Restorations",
    href: "/services#restorations",
    img: "/photos/workshop-bentley-gwagon.jpg",
    alt: "Prestige cars in for work at the RT Performance workshop",
    note: "Stripped-shell rebuilds and full restorations, brought back panel by panel.",
  },
  {
    name: "Tints, Sprays & Wraps",
    href: "/services#tints-sprays-wraps",
    img: "/photos/mulsanne-headlamp-detail.jpg",
    alt: "Bentley Mulsanne headlamp and brightwork detail after refinishing",
    note: "Full and colour-change resprays, vinyl wraps and window tints, finished in a controlled booth.",
  },
  {
    name: "SMART Repairs",
    href: "/services#smart-repairs",
    img: "/photos/gwagon-matte-rear.jpg",
    alt: "Matte-finished Mercedes G-Wagon rear detail",
    note: "Scuffs, scratches, stone chips and kerbed wheels — precise, localised, same-day where possible.",
  },
];

/** Services — the Shinkei tab-switcher pattern, RT's content: a row of five
 *  service labels toggles a large panel that crossfades between real workshop
 *  photos, each with a short note and a link into the full services page. */
export default function ServicesTabs() {
  const [active, setActive] = useState(0);

  return (
    <section
      className={s.section}
      data-theme="light"
      data-chapter="Services"
      aria-labelledby="services-h"
    >
      <div className={s.inner}>
        <h2 id="services-h" className={s.headline} data-reveal="headline">
          Every finish, made in-house.
        </h2>

        <div className={s.tabs} role="tablist" aria-label="Services" data-reveal="rise">
          {SERVICES.map((svc, i) => (
            <button
              key={svc.name}
              role="tab"
              aria-selected={i === active}
              aria-controls="svc-panel"
              className={`${s.tab} ${i === active ? s.tabOn : ""}`}
              onClick={() => setActive(i)}
            >
              <span className={s.tabMark} aria-hidden="true" />
              {svc.name}
            </button>
          ))}
        </div>

        <div className={s.panel} id="svc-panel" role="tabpanel" data-reveal="rise">
          {SERVICES.map((svc, i) => (
            <div
              key={svc.name}
              className={`${s.slide} ${i === active ? s.slideOn : ""}`}
              aria-hidden={i !== active}
            >
              <img src={svc.img} alt={svc.alt} loading="lazy" />
            </div>
          ))}

          <div className={s.card} key={active}>
            <p className={s.cardNote}>{SERVICES[active].note}</p>
            <a href={SERVICES[active].href} className={s.cardLink}>
              View service
              <span aria-hidden="true"> →</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
