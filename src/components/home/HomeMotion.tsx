"use client";

import { useEffect } from "react";
import {
  initSmoothScroll,
  destroySmoothScroll,
  prefersReducedMotion,
  scrollToAnchor,
  gsap,
} from "@/lib/motion";
import home from "./home.module.css";

/**
 * Home motion — deliberately spare, matching the references: Lenis smoothing,
 * once-only quiet reveals, and the process steps igniting as they arrive.
 * No pins, no wipes, no parallax. Content is complete without JS (reveals are
 * gsap.from, so no-JS and reduced-motion visitors see the finished page).
 */
export default function HomeMotion() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = initSmoothScroll();
    if (!lenis) return;

    // anchor navigation through Lenis (header-height offset)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const hash = href.startsWith("#")
        ? href
        : href.startsWith("/#") && location.pathname === "/"
          ? href.slice(1)
          : null;
      if (!hash) return;
      e.preventDefault();
      scrollToAnchor(hash);
      history.pushState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const kind = el.dataset.reveal;
        const st = { trigger: el, start: "top 84%", once: true };
        if (kind === "kicker") {
          gsap.from(el, { opacity: 0, duration: 0.8, ease: "power2.out", scrollTrigger: st });
        } else if (kind === "headline") {
          gsap.from(el, {
            y: 36,
            opacity: 0,
            duration: 1.0,
            ease: "expo.out",
            scrollTrigger: st,
          });
        } else if (kind === "stagger") {
          gsap.from(el.children, {
            y: 14,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: st,
          });
        } else {
          gsap.from(el, {
            y: 28,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: st,
          });
        }
      });

      // process steps: the numeral ignites as each step arrives
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 62%",
            end: "bottom 30%",
            onToggle: (self) => el.classList.toggle(home.stepActive, self.isActive),
          },
        });
      });

      // Cayenne-style scrubbed parallax on imagery (±8%, transform only)
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -6, scale: 1.08 },
          {
            yPercent: 6,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    });

    return () => {
      document.removeEventListener("click", onClick);
      ctx.revert();
      destroySmoothScroll();
    };
  }, []);

  return null;
}
