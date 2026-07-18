export interface Slide {
  img: string;
  title: string;
  /** Short name shown under the gauge. */
  short: string;
  sub?: string;
  cta: string;
  /** Long cars that get cropped by full-bleed cover — show the whole car
   *  (letterboxed) on desktop instead. */
  contain?: boolean;
}

/* All seven studio heroes generated (facing left, RT plates). Sequenced for
 * colour rhythm: black cars separated (2/5/7), greens separated (4/6),
 * vibrant opener, clean monochrome close. */
export const SLIDES: Slide[] = [
  {
    img: "/slides/hero-mclaren-570s.jpg",
    title: "McLaren 570S",
    short: "570S",
    sub: "From stripped shell to showroom — a complete rebuild",
    cta: "View the work",
  },
  {
    img: "/slides/hero-rolls-royce-cullinan.jpg",
    title: "Rolls-Royce Cullinan",
    short: "Cullinan",
    sub: "Body-work correction finished to concours standard",
    cta: "View the work",
    contain: true,
  },
  {
    img: "/slides/hero-ferrari-458.jpg",
    title: "Ferrari 458 Italia",
    short: "458 Italia",
    sub: "Accident repair with a factory-match Rosso respray",
    cta: "View the work",
  },
  {
    img: "/slides/hero-mercedes-amg-g63.jpg",
    title: "Mercedes-AMG G 63",
    short: "AMG G 63",
    sub: "Panel repair, respray and full exterior detail",
    cta: "View the work",
  },
  {
    img: "/slides/hero-lamborghini-sian.jpg",
    title: "Lamborghini Sián FKP 37",
    short: "Sián FKP 37",
    sub: "Carbon-body repair and bespoke detailing for London's rarest metal",
    cta: "View the work",
  },
  {
    img: "/slides/hero-bentley-continental-gt.jpg",
    title: "Bentley Continental GT",
    short: "Continental GT",
    sub: "Paint correction and ceramic protection in racing green",
    cta: "View the work",
    contain: true,
  },
  {
    img: "/slides/hero-mercedes-g500-4x4.jpg",
    title: "Mercedes G 500 4×4²",
    short: "G 500 4×4²",
    sub: "Arch and panel work on the ultimate G-Wagen",
    cta: "View the work",
  },
];
