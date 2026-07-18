# Phase 0 — Scroll-feel report (2026-07-18)

Empirical probe of the three reference sites (live DOM/JS inspection via browser
tooling; the in-app pane backgrounds pages between calls, so timeline/FPS traces
were not reliable — library detection, live instance options, and structural
probes were, and are recorded here).

## Per-site findings

### shinkei.systems (the LIGHT reference)
- **Lenis confirmed** (`html.lenis` class). No global GSAP — motion is
  React-bundled (framer/motion-style), component reveals.
- 23 fixed/transform layers, page ≈ 12.4 viewports. Numbered-process reveals,
  one warm accent, no pinned scenes: the "light" feel is Lenis + short
  once-only reveals — not scroll choreography.

### scgroup.dk (the DARK reference)
- **Native scroll** — no Lenis, no smooth wrapper, zero sticky elements. Nuxt.
- 19 full-bleed videos, 46 transformed elements. Finding: the "unhurried
  organic luxury" is carried by cinematic *content* (video, slow transform
  reveals) on an untouched scrollbar. Dark luxury ≠ scroll-hijack.

### cayenneblackedition.com/porsche-co (the AUTOMOTIVE reference)
- **Lenis + GSAP 3.13 + ScrollTrigger** — exactly the stack §3 proposes.
- **Live Lenis options read from the page instance:**
  `lerp: 0.1 · duration: 1.5 · wheelMultiplier: 1 · smoothTouch: true ·`
  `easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))` (easeOutExpo).
- No pin-spacers at load; scrubbed transforms rather than heavy pinning.

## Synthesised target for RT (locked parameters)

| Param | Value | Source |
|---|---|---|
| `lerp` | **0.1** | measured on Cayenne (brief allowed 0.08–0.10; prefer measured) |
| `wheelMultiplier` | **1** | measured = brief |
| `smoothWheel` | true | brief |
| `smoothTouch` | **false** | brief guardrail — native OS momentum on mobile (Cayenne uses true; we keep the brief's mobile-native rule, it's the safer feel and cheaper) |
| anchor scroll easing | easeOutExpo `1.001-2^-10t`, duration 1.1 | measured easing curve, brief duration |
| choreography | scrubbed transforms > heavy pins; pin ONLY the reviews rail | SC Group + Cayenne structure |
| reveals | short (0.8–1.0s), once-only, transform/opacity | Shinkei pattern |

**Adaptation, not copy:** RT keeps the one Lenis instance driving ScrollTrigger
(single rAF), SC-style restraint in dark chapters (content does the drama),
Shinkei-style numbered reveals in the light chapter, and exactly one pinned
scene (reviews horizontal rail). Reduced-motion = Lenis never instantiated.
