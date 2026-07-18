"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PAGES } from "./pages";
import styles from "./SiteHeader.module.css";

/** Inline links in the slim bar; the burger overlay still holds all 8 pages. */
const NAV_LEFT = [
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/our-work" },
  { label: "Gallery", href: "/gallery" },
];

const NAV_RIGHT = [
  { label: "Community", href: "/community" },
  { label: "Find Us", href: "/find-us" },
];

type Variant = "hero" | "solid";

export default function SiteHeader({ variant = "solid" }: { variant?: Variant }) {
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <header
        className={`${styles.nav} ${variant === "solid" ? styles.solid : styles.hero}`}
        aria-label="Main"
      >
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
          {NAV_LEFT.map((l) => (
            <Link key={l.label} href={l.href}>
              {l.label}
            </Link>
          ))}
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
          <Link href="/contact" className={styles.navContact}>
            Contact Us
          </Link>
        </nav>
      </header>

      {/* full-screen menu overlay — holds all eight pages */}
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
            <Link
              key={p.href}
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
          ))}
        </nav>
      </div>
    </>
  );
}
