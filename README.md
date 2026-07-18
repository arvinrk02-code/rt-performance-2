# RT Performance — Style 2 (Mansory direction)

Alternative home page for RT Performance: a Mansory-style full-screen
hero slider, built to A/B against the ember-finale page in ../rt-performance.

Inspected from mansory.com: loader (centred mark over hairline diagonal fan),
nav grid (burger + links · centred logo · links · divider · contact), light
Times-family serif headline (~5.6vw, w300), Inter details, steel-blue CTA
#829FB0, crossfade slider (theirs is Splide fade) with ken-burns zoom, dash
pagination, bottom-right next-slide preview.

Here: RT logo replaces the wordmark (loader + nav centre), Noto Serif
Display 300 stands in for Times MT Std Light, 7 slides — one per car in
../rt-performance/public/gallery/raw. Slide images in public/slides/ are
PLACEHOLDERS (dark-graded captures); swap each for the generated studio
render, config in src/components/slides.ts.

```bash
npm run dev   # port 3900 via ../.claude/launch.json (rt-performance-style2)
```
