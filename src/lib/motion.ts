/**
 * Shared motion module — ONE Lenis instance drives GSAP ScrollTrigger
 * (single rAF loop), parameters locked by the Phase 0 scroll-feel report
 * (docs/scroll-feel-report.md): lerp 0.1 · wheelMultiplier 1 · easeOutExpo.
 *
 * Reduced motion: Lenis is never instantiated; sections render at final
 * state (all reveals are gsap.from(), so no-JS/no-motion shows the real DOM).
 */
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const easeOutExpo = (t: number) =>
  Math.min(1, 1.001 - Math.pow(2, -10 * t));

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;

/** Create the smooth-scroll + ScrollTrigger stack. No-op under reduced motion. */
export function initSmoothScroll(): Lenis | null {
  if (prefersReducedMotion() || lenis) return lenis;
  gsap.registerPlugin(ScrollTrigger);
  lenis = new Lenis({
    lerp: 0.1, // measured on cayenneblackedition (Phase 0)
    wheelMultiplier: 1, // never amplify wheel — amplified wheel = "heavy"
    smoothWheel: true,
    syncTouch: false, // native OS momentum on mobile
    touchMultiplier: 1.5,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(rafTick);
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.config({ ignoreMobileResize: true });
  return lenis;
}

function rafTick(time: number) {
  lenis?.raf(time * 1000);
}

export function destroySmoothScroll() {
  gsap.ticker.remove(rafTick);
  lenis?.destroy();
  lenis = null;
}

export function getLenis() {
  return lenis;
}

/** Anchor scroll with header offset; falls back to native scroll. */
export function scrollToAnchor(hash: string, headerHeight = 92) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, {
      offset: -headerHeight,
      duration: 1.1,
      easing: easeOutExpo,
    });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: "auto" });
  }
}

export { gsap, ScrollTrigger };
