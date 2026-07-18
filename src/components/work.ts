import { SLIDES, type CarSlug } from "./slides";

/* Narrative + gallery for the Our Work page. Car *identity* (title, short name,
 * hero image, contain) lives in slides.ts; this file adds the *story* — the
 * repair journey, told through a coverflow of captioned photos.
 *
 * Photos live in public/work/<slug>/. Where a job has genuine process shots
 * (McLaren, G 63) the gallery is ordered as a repair arc — arrival/damage →
 * strip → prep → paint → finish — and tagged with a `stage`. Detailing jobs
 * are ordered as a beauty gallery. */

export interface WorkPhoto {
  src: string;
  /** One line describing this moment. */
  caption: string;
  /** Short stage tag shown on the frame, e.g. "Strip", "Paint", "Finish". */
  stage?: string;
}

export interface CaseStudy {
  /** The lede under the title — the job in a sentence. */
  overview: string;
  gallery: WorkPhoto[];
}

/* Keyed by the same slug as the home slider. Record<CarSlug, …> means the build
 * fails if any of the seven cars is missing a case study. */
export const CASE_STUDIES: Record<CarSlug, CaseStudy> = {
  "mclaren-570s": {
    overview:
      "A front-end rebuild taken back to the standard it wore on the McLaren floor. Stripped, refinished and handed back showroom-fresh.",
    gallery: [
      { src: "/work/mclaren-570s/02.jpg", caption: "Front clip stripped back for the rebuild.", stage: "Strip" },
      { src: "/work/mclaren-570s/03.jpg", caption: "Refinished in the spray booth.", stage: "Paint" },
      { src: "/work/mclaren-570s/01.jpg", caption: "Back together, doors up in the studio.", stage: "Finish" },
      { src: "/work/mclaren-570s/06.jpg", caption: "Finished front three-quarter." },
      { src: "/work/mclaren-570s/04.jpg", caption: "Lines and seams realigned." },
      { src: "/work/mclaren-570s/05.jpg", caption: "Handed back, showroom-fresh." },
      { src: "/work/mclaren-570s/07.jpg", caption: "Detailed and gleaming." },
    ],
  },
  "rolls-royce-cullinan": {
    overview:
      "A flagship in for body-work correction, every panel brought back to the mirror-flat, deep-gloss finish a Cullinan is expected to carry.",
    gallery: [
      { src: "/work/rolls-royce-cullinan/01.jpg", caption: "Finished front, mirror-flat.", stage: "Finish" },
      { src: "/work/rolls-royce-cullinan/02.jpg", caption: "Wheel and arch detail." },
      { src: "/work/rolls-royce-cullinan/03.jpg", caption: "Corrected flanks, deep gloss." },
      { src: "/work/rolls-royce-cullinan/04.jpg", caption: "Pantheon grille, handed back." },
    ],
  },
  "ferrari-458": {
    overview:
      "Accident repair on a modern Ferrari icon, with a factory-match Rosso respray blended so the join is invisible.",
    gallery: [
      { src: "/work/ferrari-458/01.jpg", caption: "Factory-match Rosso, flatted and polished.", stage: "Finish" },
      { src: "/work/ferrari-458/02.jpg", caption: "Front three-quarter in the workshop." },
    ],
  },
  "mercedes-amg-g63": {
    overview:
      "A rear-end accident repair taken the full distance. Stripped to bare metal, re-panelled, refinished in its original green and detailed back to flawless.",
    gallery: [
      { src: "/work/mercedes-amg-g63/03.jpg", caption: "Rear-end impact, as it arrived.", stage: "Damage" },
      { src: "/work/mercedes-amg-g63/05.jpg", caption: "Crushed rear quarter and bumper." },
      { src: "/work/mercedes-amg-g63/04.jpg", caption: "Torn bumper and cracked lamp." },
      { src: "/work/mercedes-amg-g63/06.jpg", caption: "The damage up close." },
      { src: "/work/mercedes-amg-g63/02.jpg", caption: "Stripped to bare metal for panel work.", stage: "Strip" },
      { src: "/work/mercedes-amg-g63/07.jpg", caption: "Panel and structural work underway." },
      { src: "/work/mercedes-amg-g63/08.jpg", caption: "Masked and primed, ready for colour.", stage: "Prep" },
      { src: "/work/mercedes-amg-g63/09.jpg", caption: "Primed panels, booth-bound." },
      { src: "/work/mercedes-amg-g63/10.jpg", caption: "Refinished in the booth.", stage: "Paint" },
      { src: "/work/mercedes-amg-g63/11.jpg", caption: "Finished, AMG badge back on and handed over.", stage: "Finish" },
      { src: "/work/mercedes-amg-g63/01.jpg", caption: "Back to flawless green." },
      { src: "/work/mercedes-amg-g63/12.jpg", caption: "Ready for the road." },
    ],
  },
  "lamborghini-sian": {
    overview:
      "Carbon-body detailing for one of London's rarest cars. Precision work with no room for error, finished to jewellery standard.",
    gallery: [
      { src: "/work/lamborghini-sian/01.jpg", caption: "Finished front in carbon and red.", stage: "Detail" },
      { src: "/work/lamborghini-sian/02.jpg", caption: "Front three-quarter in the bay." },
      { src: "/work/lamborghini-sian/04.jpg", caption: "Exposed-carbon rear quarter." },
      { src: "/work/lamborghini-sian/10.jpg", caption: "Triple-hexagon tail lights." },
      { src: "/work/lamborghini-sian/09.jpg", caption: "V12 beneath the louvres." },
      { src: "/work/lamborghini-sian/11.jpg", caption: "Forged wheel, carbon-ceramic brakes." },
      { src: "/work/lamborghini-sian/08.jpg", caption: "Carbon filler cap, marked Benzina." },
      { src: "/work/lamborghini-sian/07.jpg", caption: "Carbon mirror detail." },
      { src: "/work/lamborghini-sian/03.jpg", caption: "Exposed-carbon bonnet." },
      { src: "/work/lamborghini-sian/05.jpg", caption: "Sián cockpit in red and Alcantara." },
      { src: "/work/lamborghini-sian/06.jpg", caption: "The driver's office." },
    ],
  },
  "bentley-continental-gt": {
    overview:
      "Paint correction and ceramic protection in racing green, restoring depth to the finish and locking it in for the long run.",
    gallery: [
      { src: "/work/bentley-continental-gt/02.jpg", caption: "Masked up for paint correction.", stage: "Prep" },
      { src: "/work/bentley-continental-gt/04.jpg", caption: "Front-end detail, corrected." },
      { src: "/work/bentley-continental-gt/03.jpg", caption: "Depth restored to the green." },
      { src: "/work/bentley-continental-gt/01.jpg", caption: "Ceramic-protected and gleaming.", stage: "Finish" },
    ],
  },
  "mercedes-g500-4x4": {
    overview:
      "Arch and panel work on the ultimate G-Wagen, heavy metal returned to a clean, uncompromising finish.",
    gallery: [
      { src: "/work/mercedes-g500-4x4/01.jpg", caption: "The finished Brabus-styled front.", stage: "Finish" },
      { src: "/work/mercedes-g500-4x4/02.jpg", caption: "Raised stance, side profile." },
    ],
  },
};

/** Canonical car order for Our Work = the home slider order. */
export const WORK_ORDER: CarSlug[] = SLIDES.map((s) => s.slug);

/** Identity (from slides) merged with narrative (from here) for one car. */
export function getCar(slug: CarSlug) {
  const slide = SLIDES.find((s) => s.slug === slug);
  return slide ? { ...slide, ...CASE_STUDIES[slug] } : null;
}

/** The full, ordered list a client component renders. */
export const WORK_CARS = WORK_ORDER.map((slug) => getCar(slug)!);

export type WorkCar = (typeof WORK_CARS)[number];
