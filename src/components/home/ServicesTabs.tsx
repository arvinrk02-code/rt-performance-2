"use client";

import { useState } from "react";
import s from "./servicestabs.module.css";

/* Thin-stroke marker icons — one per service, painted in currentColor so
 * they dim and darken with the tab text. */
function WrenchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9-1.8-.5-4.5-1.1-4.5-1.1s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

function RestoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 2.64-6.36L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function SprayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3h.01M7 5h.01M3 7h.01M7 9h.01M3 11h.01" />
      <rect x="14" y="4" width="5" height="4" />
      <path d="m19.5 9.5 1.5 1.5v9c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1v-9l1.5-1.5" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M21 12h-3M6 12H3M12 6V3M12 21v-3" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

const SERVICES = [
  {
    name: "Accident Repairs",
    href: "/services#accident-repairs",
    img: "/photos/svc-accident.jpg",
    alt: "White Lamborghini Gallardo with its front bumper removed for accident repair at RT Performance",
    icon: <WrenchIcon />,
  },
  {
    name: "Body Kits & Customisations",
    href: "/services#body-kits",
    img: "/photos/svc-bodykits.jpg",
    alt: "Rolls-Royce Phantom in matte purple with custom wheels at RT Performance",
    icon: <CarIcon />,
  },
  {
    name: "Restorations",
    href: "/services#restorations",
    img: "/photos/svc-restoration.jpg",
    alt: "Classic Jaguar body shell in silver, freshly painted in the RT Performance booth",
    icon: <RestoreIcon />,
  },
  {
    name: "Tints, Sprays & Wraps",
    href: "/services#tints-sprays-wraps",
    img: "/photos/svc-sprays.jpg",
    alt: "Chevrolet Camaro masked up and refinished in bright orange at RT Performance",
    icon: <SprayIcon />,
  },
  {
    name: "SMART Repairs",
    href: "/services#smart-repairs",
    img: "/photos/svc-smart.jpg",
    alt: "RT Performance technician working on the front end of a white Range Rover Sport",
    icon: <TargetIcon />,
  },
];

/** Services — the Shinkei tab-switcher pattern, RT's content: a row of five
 *  service labels toggles a large panel that crossfades between real workshop
 *  photos, each with a link into the full services page. */
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
          Every service, under one roof.
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
              <span className={s.tabMark} aria-hidden="true">
                {svc.icon}
              </span>
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
