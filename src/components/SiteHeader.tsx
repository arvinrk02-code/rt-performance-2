"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PAGES, SERVICES_SUB } from "./pages";
import styles from "./SiteHeader.module.css";

/** Inline links in the slim bar; the burger overlay still holds all 8 items.
 *  Services carries a dropdown of its five sub-sections. */
const NAV_LEFT = [
  { label: "About Us", href: "/#about" },
  { label: "Services", href: "/services", sub: SERVICES_SUB },
  { label: "Our Work", href: "/our-work" },
  { label: "Gallery", href: "/gallery" },
];

const NAV_RIGHT = [
  { label: "Community", href: "/#reviews" },
  { label: "Find Us", href: "/#find-us" },
];

type Variant = "hero" | "solid";

/** hero = fixed overlay for the home one-pager, inverts with the section
 *  beneath it; solid = sticky dark bar for standalone pages. */
export default function SiteHeader({ variant = "solid" }: { variant?: Variant }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const raf = useRef(0);

  // lock the page scroll behind the full-screen menu, and close on Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // home one-pager: track which themed section sits under the bar. Plain
  // state, not animation — so it also runs under prefers-reduced-motion.
  useEffect(() => {
    if (variant !== "hero") return;
    const probe = () => {
      setScrolled(window.scrollY > 40);
      const probeY = 46; // the bar's midline
      const sections = document.querySelectorAll<HTMLElement>("[data-theme]");
      let light = false;
      sections.forEach((sec) => {
        const r = sec.getBoundingClientRect();
        if (r.top <= probeY && r.bottom >= probeY) {
          light = sec.dataset.theme === "light";
        }
      });
      setOnLight(light);
    };
    probe();
    window.addEventListener("scroll", probe, { passive: true });
    return () => {
      window.removeEventListener("scroll", probe);
      cancelAnimationFrame(raf.current);
    };
  }, [variant]);

  const barClass = [
    styles.nav,
    variant === "solid" ? styles.solid : styles.hero,
    variant === "hero" && scrolled ? styles.scrolled : "",
    variant === "hero" && onLight ? styles.onLight : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={barClass} aria-label="Main" id="site-header">
        <button
          className={styles.burger}
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={styles.navLeft}>
          {NAV_LEFT.map((l) =>
            l.sub ? (
              <div key={l.label} className={styles.navGroup}>
                <Link href={l.href} className={styles.navGroupLink} aria-haspopup="true">
                  {l.label}
                </Link>
                <div className={styles.dropdown} role="menu">
                  {l.sub.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className={styles.dropLink}
                      role="menuitem"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={l.label} href={l.href}>
                {l.label}
              </Link>
            )
          )}
        </nav>

        <Link href="/" className={styles.brand} aria-label="RT Performance — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/rt-performance.png" alt="RT Performance" />
        </Link>

        <nav className={styles.navRight}>
          {NAV_RIGHT.map((l) => (
            <Link key={l.label} href={l.href}>
              {l.label}
            </Link>
          ))}
          <Link href="/#contact" className={styles.navContact}>
            Contact Us
          </Link>
        </nav>
      </header>

      {/* full-screen menu overlay — holds every destination */}
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
      >
        <button
          className={styles.close}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <span />
          <span />
        </button>
        <nav className={styles.overlayNav}>
          {PAGES.map((p, i) => (
            <div key={p.href} className={styles.overlayItem}>
              <Link
                href={p.href}
                className={styles.overlayLink}
                style={{ transitionDelay: open ? `${0.06 * i + 0.1}s` : "0s" }}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                <span className={styles.overlayIndex}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {p.label}
              </Link>
              {p.label === "Services" && (
                <div className={styles.overlaySub}>
                  {SERVICES_SUB.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className={styles.overlaySubLink}
                      tabIndex={open ? 0 : -1}
                      onClick={() => setOpen(false)}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
