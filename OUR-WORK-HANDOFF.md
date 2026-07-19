# HANDOFF — Our Work page redesign

**Repo:** `~/DanDan/rt-performance-style2` (GitHub `rt-performance-2`, branch `main`, origin wired).
**Dev:** launch.json has `dev` (port 3000) and `dev-3011`. Route: **`/our-work`**. Read `node_modules/next/dist/docs/` before writing Next code — this is Next 16, not training-data Next.

## What this page is (as it stands)
The Our Work page was built by a collaborator (**Haza1410**, commit `b874590`) and is already merged to `main`. It presents the **7 hero cars as featured builds**.

**Files:**
- `src/app/(site)/our-work/page.tsx` — thin route, just `<OurWork/>` + metadata.
- `src/components/OurWork.tsx` (579 lines) — the whole experience. Sub-components inside: `OurWork` (state), `MarqueMark` (rail logo), `Panel` (one car), `Coverflow` (photo gallery), `ProgressDial` (the rev-counter — **to be replaced**).
- `src/components/OurWork.module.css` — all styles.
- `src/components/work.ts` — `CASE_STUDIES: Record<CarSlug, {overview, gallery: {src, caption, stage?}[]}>`. Car *identity* (title/short/slug/marque) comes from `slides.ts`; work.ts adds the story. Photos in `public/work/<slug>/`.
- `src/components/Lightbox.tsx` — full-screen photo expand (leave as-is unless asked).
- Marque SVGs in `public/logos/` (bentley, ferrari, lamborghini, mclaren, mercedes, rolls-royce, porsche, etc.) — rendered as a CSS `mask` painted in the current colour (`.railLogo`), so file colour is irrelevant. `MarqueMark` falls back to a zero-padded number only if the svg 404s.

**How it works now:**
- Left/side `nav.rail` = vertical `<ol>` of buttons, one per car; each button = `.railName` (short name) + `<MarqueMark>` (marque logo). Clicking `go(i)` selects a car.
- `go()` runs `runTransition()`: panel dips to black (`veilOut`, 280ms), swaps the shown car, then the new `.panelWrap` rises up (`panelRise`/`veilIn`, 660ms). Deep-links by hash (`/our-work#ferrari-458`) — the home slider CTAs land here. Reduced-motion = instant swap.
- Each `Panel` = header (`Featured Build` eyebrow + serif car title + `overview`) then `<Coverflow>`: a 3D coverflow of the car's photos (drag / arrow-keys / click centre to expand), a caption line, and `<ProgressDial>` beneath.
- Keyboard: ↑/↓ change car, ←/→ move photos. `aria-live` announces car changes.

## THE CHANGES REQUESTED (do these)

### 1. Page title → "Our Work: Featured Builds"
Right now there is **no page-level heading** — each panel just has a small `Featured Build` eyebrow (`.eyebrow`) above the car name. Add a proper page header: **"Our Work"** with **"Featured Builds"** as the subtitle/lede (match the other standalone-page header pattern — see `(site)/page.module.css` `.eyebrow`/`.title`, but this page is dark). Keep it from fighting the per-car title. Likely: a fixed/top page header `Our Work — Featured Builds`, and drop or demote the per-panel `Featured Build` eyebrow so it isn't said twice.

### 2. Photo presentation → much more seamless
The current `Coverflow` (3D rotateY coverflow, `.cf`/`.cfStage`/`.cfItem` in OurWork.tsx ~344–441 and CSS ~258–336) feels steppy. Rebuild it as something **more seamless** — a smooth continuous gallery. Ideas in-keeping: a soft crossfade/slide gallery, a draggable filmstrip that eases, or a Ken-Burns cross-dissolve between stages. Keep: drag + arrow-keys + click-to-expand (Lightbox), the caption line, lazy-loaded imgs, reduced-motion fallback. The stage tag (`Strip`/`Paint`/`Finish`, `.cfStageTag`) is a nice touch — keep or re-home it.

### 3. Replace the rev-counter with something new + creative (still on-brand)
Remove `<ProgressDial>` (OurWork.tsx ~443–579 + `.progSvg` CSS) — it's the tachometer gauge showing photo progress. **The hero already owns the rev-counter motif; Our Work should NOT reuse it.** Invent a *different* progress/stage indicator that fits the aesthetic (void bg, `--ember` #e14312 single accent, hairline strokes, bold-grotesk/serif type). Think: a stage-labelled progress thread, a filmstrip scrubber, a vertical timeline of stages, numbered dots with the stage word — anything but a dial. It must still show "photo X of N" and ideally the stage names.

### 4. Marque rail → vertical on the LEFT, visually separated
The rail (`nav.rail` / `.rail` CSS ~33–150) is already a vertical column of car symbols but reads as "just a column of logos." Keep it **vertical, pinned left**, but **separate/differentiate the items** so it's not a plain stack — e.g. hairline dividers between them, generous rhythm, the car's short name paired with each logo, an active-state marker (ember tick / filled state), or boxed cells. Active item = `.railBtnActive`. Must stay keyboard-accessible and drive `go(i)`.

## Style constraints (match the rest of the site)
- **Fonts (via CSS vars):** `--font-serif` (Noto Serif Display, also has italic now), `--font-sans` (Inter incl. 700), `--font-mono` (IBM Plex Mono). Site-wide, **display headings are bold grotesk Inter 700** — EXCEPT the hero car-name and this page's car titles, which stay serif to echo the hero. Keep the car titles serif here.
- **Tokens:** `--void #020204`, `--ink #f5f5f5`, `--ember #e14312` (the ONLY accent), `--hairline rgba(255,255,255,.14)`. This is a dark page.
- **Motion:** Lenis + GSAP already wired globally (`src/lib/motion.ts`, mounted by `HomeMotion` on `/` only — this standalone page has its own transitions in OurWork.tsx). Respect `prefers-reduced-motion`. Transform/opacity only; no layout-property animation.
- Every image needs descriptive `alt`. Keep the WhatsApp FAB / header / footer chrome intact.

## Already done this session (don't redo)
- Site-wide "remove section numbers": this page's eyebrow was changed from `01 · Featured Build` → `Featured Build`, and the nav overlay / services numbers were stripped. If the new page title needs a number, that's a fresh decision.

## Verify before commit
1. `npm run build` clean (12 static pages).
2. Dev on the launch.json port; open `/our-work`. Click each rail item — car swaps, title/overview/gallery update, hash updates (`#<slug>`).
3. New gallery: drag, ←/→, click-to-expand (Lightbox) all work; caption tracks the photo.
4. New progress indicator shows correct photo N-of-count + stage; no rev-counter remains.
5. Rail reads as separated items, vertical-left, active state clear.
6. Reduced-motion pass + keyboard pass (↑/↓ car, ←/→ photo). AA contrast on ember/ink.
7. Deep-link works: `/our-work#bentley-continental` opens that car.
8. Commit + push `main`.

## Open questions to confirm with Arvin at review
- Exact wording/hierarchy of "Our Work: Featured Builds" (one line vs eyebrow+title).
- Which new gallery pattern he prefers (offer 1–2, don't over-build blind).
- Whether the stage arc (Strip→Paint→Finish) should be foregrounded in the new progress device.
