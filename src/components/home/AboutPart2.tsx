import s from "./home.module.css";

const SERVICES = [
  {
    label: "Accident & insurance repair",
    text: "VBRA-approved repairs handled end-to-end, insurer paperwork included, your car back to factory-straight.",
    href: "/services#accident-repairs",
  },
  {
    label: "Resprays & refinishing",
    text: "Full and colour-change resprays in a controlled booth, matched and finished to a standard you can see your reflection in.",
    href: "/services#tints-sprays-wraps",
  },
  {
    label: "Carbon & body kits",
    text: "Bespoke carbon fibre and fibreglass aero, widebody and trim, designed and made on-site since 2009.",
    href: "/services#body-kits",
  },
  {
    label: "Prestige restoration",
    text: "Stripped-shell rebuilds and full restorations for supercars and classics worth doing once, properly.",
    href: "/services#restorations",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Assessment & honest quote",
    text: "Bring the car in or send photos and we’ll tell you exactly what it needs — and what it doesn’t. Clear, itemised, no surprises later.",
  },
  {
    num: "02",
    title: "In-house craft",
    text: "Every stage happens under our roof: strip-down, panel and carbon work, colour-matched refinishing in a controlled booth. One team, one standard, start to finish.",
  },
  {
    num: "03",
    title: "Final check & handover",
    text: "We inspect every job against our own standard before you see it, hand it back protected and detailed, and back the workmanship with our warranty.",
  },
];

/** About pt.2 — WHO WE ARE. Light chapter, SC Group editorial pattern. */
export default function AboutPart2() {
  return (
    <section className={s.light} data-theme="light" aria-labelledby="about-pt2-h">
      <div className={s.inner}>
        <p className={s.kicker} data-reveal="kicker">
          <span className={s.kickerIndex}>02</span>Who we are
        </p>

        <div className={s.block2a}>
          <div>
            <h2 id="about-pt2-h" className={s.h2} data-reveal="headline">
              Run by people who actually build these&nbsp;cars.
            </h2>
            <p className={s.body} style={{ marginTop: 30 }} data-reveal="rise">
              RT Performance is an independent body and prestige refinishing
              centre in Wembley, led by owner Taras. We&rsquo;ve been designing
              and making our own carbon fibre and fibreglass in-house since 2009
              — bodywork, aero and trim built under our own roof, not outsourced
              and marked up. That&rsquo;s rare, and it&rsquo;s why the cars
              other shops won&rsquo;t touch end up here.
            </p>
            <p className={s.body} style={{ marginTop: 18 }} data-reveal="rise">
              We&rsquo;re a VBRA-approved accident repair centre, so insurers
              and manufacturers trust our repairs to standard — and you get the
              same obsessive finish whether you&rsquo;ve brought us a McLaren
              for a full respray or a Range Rover after a bad week on the North
              Circular. Every job is quoted honestly, done in-house, and backed
              by our workmanship warranty.
            </p>
          </div>

          <div className={s.statCol} data-reveal="stagger">
            <div className={s.stat}>
              <span className={s.statNum}>Since 2009</span>
              <span className={s.statLabel}>In-house carbon &amp; fibreglass</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>VBRA</span>
              <span className={s.statLabel}>Approved repair centre</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>96%</span>
              <span className={s.statLabel}>Would recommend</span>
            </div>
          </div>
        </div>

        {/* services orientation — editorial hairline rows */}
        <div className={s.processBlock}>
          <h3 className={s.h3} data-reveal="rise">
            Our services
          </h3>
          <p className={s.processIntro} data-reveal="rise">
            Four things we do better than anyone local. Everything in-house.
          </p>
          <div className={s.svcList} data-reveal="stagger">
            {SERVICES.map((svc) => (
              <a key={svc.label} href={svc.href} className={s.svcRow}>
                <span className={s.svcLabel}>{svc.label}</span>
                <p>{svc.text}</p>
              </a>
            ))}
          </div>
          <div className={s.svcTail} data-reveal="rise">
            <a href="/services" className={s.textLink}>
              Explore all services
            </a>
          </div>
        </div>

        {/* the process */}
        <div className={s.processBlock}>
          <h3 className={s.h3} data-reveal="rise">
            How the work happens
          </h3>
          <p className={s.processIntro} data-reveal="rise">
            No mystery, no runaround. Three steps from first call to keys back.
          </p>
          <div>
            {STEPS.map((step) => (
              <div key={step.num} className={s.step} data-step>
                <span className={s.stepNum} aria-hidden="true">
                  {step.num}
                </span>
                <div>
                  <h4 className={s.stepTitle}>
                    <span className="sr-only">{step.num} — </span>
                    {step.title}
                  </h4>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
