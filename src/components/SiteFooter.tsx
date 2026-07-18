import Link from "next/link";
import styles from "./SiteFooter.module.css";
import { PAGES } from "./pages";

export default function SiteFooter() {
  return (
    <footer className={styles.footer} aria-label="Footer">
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <Link href="/" className={styles.brand} aria-label="RT Performance — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/rt-performance.png" alt="RT Performance" />
          </Link>
          <p className={styles.tag}>
            London&rsquo;s premier centre for bespoke accident repair, resprays,
            wheel refurbishment and restoration.
          </p>
        </div>

        <nav className={styles.linksCol} aria-label="Footer">
          <span className={styles.colHead}>Explore</span>
          {PAGES.map((p) => (
            <Link key={p.href} href={p.href} className={styles.link}>
              {p.label}
            </Link>
          ))}
        </nav>

        <div className={styles.contactCol}>
          <span className={styles.colHead}>Visit</span>
          <address className={styles.address}>
            Unit 10 Fourth Way
            <br />
            Wembley, London HA9 0LH
          </address>
          <p className={styles.hours}>Mon&ndash;Fri 8:30&ndash;18:00 · Sat&ndash;Sun closed</p>

          <span className={`${styles.colHead} ${styles.colHeadGap}`}>Contact</span>
          <a className={styles.link} href="tel:+442089000014">
            020 8900 0014
          </a>
          <a className={styles.link} href="https://wa.me/447704155514">
            WhatsApp +44 7704 155514
          </a>
          <a className={styles.link} href="mailto:info@rt-performance.co.uk">
            info@rt-performance.co.uk
          </a>
          <a
            className={styles.link}
            href="https://www.instagram.com/rtperformance/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram @rtperformance
          </a>
          <a
            className={styles.link}
            href="https://www.facebook.com/RTPerformanceUK"
            target="_blank"
            rel="noreferrer"
          >
            Facebook RTPerformanceUK
          </a>
        </div>
      </div>

      <p className={styles.close} aria-hidden="true">
        Climb over the competition<span className={styles.closeDot}>.</span>
      </p>

      <div className={styles.legal}>
        <span>&copy; {new Date().getFullYear()} RT Performance. All rights reserved.</span>
        <span className={styles.legalDim}>
          VBRA-approved accident repair centre · Carbon &amp; fibreglass
          in-house since 2009 · Wembley, London
        </span>
      </div>
    </footer>
  );
}
