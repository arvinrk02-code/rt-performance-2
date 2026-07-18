"use client";

import { useState } from "react";
import s from "./servicestabs.module.css";

const SERVICES = [
  {
    name: "Accident Repairs",
    href: "/services#accident-repairs",
    img: "/photos/svc-accident.jpg",
    alt: "White Lamborghini Huracán stripped at the rear for accident repair at RT Performance",
    note: "VBRA-approved insurance and private accident repair, handled end to end and returned to factory standard.",
  },
  {
    name: "Body Kits & Customisations",
    href: "/services#body-kits",
    img: "/photos/svc-bodykits.jpg",
    alt: "Rolls-Royce Phantom in matte purple with custom wheels at RT Performance",
    note: "Carbon fibre and fibreglass aero, widebody and trim — designed and made in-house since 2009.",
  },
  {
    name: "Restorations",
    href: "/services#restorations",
    img: "/photos/svc-restoration.jpg",
    alt: "Classic Jaguar body shell in silver, freshly painted in the RT Performance booth",
    note: "Stripped-shell rebuilds and full restorations, brought back panel by panel.",
  },
  {
    name: "Tints, Sprays & Wraps",
    href: "/services#tints-sprays-wraps",
    img: "/photos/svc-sprays.jpg",
    alt: "Matte-black Lamborghini and red Porsche 911 GT2 RS refinished at RT Performance",
    note: "Full and colour-change resprays, vinyl wraps and window tints, finished in a controlled booth.",
  },
  {
    name: "SMART Repairs",
    href: "/services#smart-repairs",
    img: "/photos/svc-smart.jpg",
    alt: "Green Mercedes-AMG GT R showing a flawless finish after work at RT Performance",
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
