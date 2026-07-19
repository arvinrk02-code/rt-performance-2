import Link from "next/link";
import styles from "./SiteFooter.module.css";
import { PAGES } from "./pages";

/* Thin-stroke icons for the contact rail — painted in currentColor so they
 * track the link's resting/hover colour. */
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3" />
      <path d="M8.8 8.9c-.3 2.4 4 6.6 6.4 6.3l1-1.2-2.1-1.4-.9.7c-1-.5-1.9-1.4-2.4-2.4l.7-.9-1.4-2.1z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <path d="M17.4 6.6h.01" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function SiteFooter() {
  return (
    <footer className={styles.footer} aria-label="Footer">
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <Link href="/" className={styles.brand} aria-label="RT Performance home">
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
          <a className={`${styles.link} ${styles.iconLink}`} href="tel:+442089000014">
            <span className={styles.linkIcon}>
              <PhoneIcon />
            </span>
            020 8900 0014
          </a>
          <a
            className={`${styles.link} ${styles.iconLink}`}
            href="https://wa.me/447704155514"
          >
            <span className={styles.linkIcon}>
              <WhatsAppIcon />
            </span>
            WhatsApp +44 7704 155514
          </a>
          <a
            className={`${styles.link} ${styles.iconLink}`}
            href="mailto:info@rt-performance.co.uk"
          >
            <span className={styles.linkIcon}>
              <MailIcon />
            </span>
            info@rt-performance.co.uk
          </a>
          <a
            className={`${styles.link} ${styles.iconLink}`}
            href="https://www.instagram.com/rtperformance/"
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.linkIcon}>
              <InstagramIcon />
            </span>
            Instagram @rtperformance
          </a>
          <a
            className={`${styles.link} ${styles.iconLink}`}
            href="https://www.facebook.com/RTPerformanceUK"
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.linkIcon}>
              <FacebookIcon />
            </span>
            Facebook RTPerformanceUK
          </a>
        </div>
      </div>

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
