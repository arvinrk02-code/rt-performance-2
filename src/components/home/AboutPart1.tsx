import s from "./home.module.css";

/** 01 · About — plain and simple: who RT is, split with a real work photo
 *  (SC Group split pattern: text left, rounded photo right). */
export default function AboutPart1() {
  return (
    <section
      id="about"
      className={s.dark}
      data-theme="dark"
      data-chapter="About"
      aria-labelledby="about-h"
    >
      <div className={s.inner}>
        <p className={s.kicker} data-reveal="kicker">
          <span className={s.kickerIndex}>01</span>About
        </p>

        <div className={s.split}>
          <div>
            <h2 id="about-h" className={s.h2} data-reveal="headline">
              RT Performance.
            </h2>
            <p className={s.lead} style={{ marginTop: 28 }} data-reveal="rise">
              An independent prestige body and refinishing centre in Wembley,
              London. Carbon fibre and fibreglass made in-house since 2009.
              VBRA-approved accident repair.
            </p>
            <p className={s.body} style={{ marginTop: 22 }} data-reveal="rise">
              Supercars and daily drivers, insurance work and one-off builds —
              everything quoted honestly and finished under one roof.
            </p>
            <p className={s.pipeLinks} style={{ marginTop: 34 }} data-reveal="rise">
              <a href="/our-work">Our work</a>
              <span aria-hidden="true">|</span>
              <a href="/gallery">Gallery</a>
            </p>
          </div>

          <figure className={s.splitMedia} data-reveal="rise">
            <div className={s.mediaFrame}>
              <img
                src="/photos/workshop-detail-tech.jpg"
                alt="RT Performance technician working on a black SUV inside the Wembley workshop"
                loading="lazy"
                data-parallax
              />
            </div>
            <figcaption className={s.photoCaption}>
              In the workshop — Fourth Way, Wembley
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
