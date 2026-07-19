import type { Metadata } from "next";
import ServicesExperience, {
  type ServiceChapter,
} from "@/components/services/ServicesExperience";

export const metadata: Metadata = {
  title: "Services | RT Performance",
  description:
    "Accident repairs, body kits and customisations, restorations, tints, sprays and wraps, and SMART repairs, all carried out in-house for luxury and performance vehicles.",
};

/* The five services. Ledes are the site's rewritten copy; the facts lines are
 * drawn from the live-site claims captured in ~/DanDan/rt-performance-scrape
 * (VBRA approval, the 2009 in-house composites facility, spray-bake oven,
 * collection/delivery, warranty). Photos are genuine workshop shots from the
 * same scrape, served from /public/services/<id>/. */
const SERVICES: ServiceChapter[] = [
  {
    id: "accident-repairs",
    title: "Accident Repairs",
    lede: "Insurance-approved and private accident repair, from cosmetic knocks to structural work, returning every panel, line and finish to the standard it left the factory with.",
    facts: [
      "VBRA-approved repair centre",
      "Insurance or private — claim handled end to end",
      "Free collection & delivery across London",
      "Warranty on all bodywork",
    ],
    photos: [
      {
        src: "/services/accident-repairs/ferrari-strip-down.jpg",
        caption: "Ferrari · front end stripped for repair",
        alt: "Ferrari with its front bodywork stripped back on a ramp in the RT Performance workshop",
      },
      {
        src: "/services/accident-repairs/porsche-repair.jpg",
        caption: "Porsche · accident repair",
        alt: "Porsche in the RT Performance body shop for accident repair",
      },
      {
        src: "/services/accident-repairs/lamborghini-repair.jpg",
        caption: "Lamborghini · accident repair",
        alt: "Lamborghini undergoing accident repair at RT Performance",
      },
      {
        src: "/services/accident-repairs/bmw-repair.jpg",
        caption: "BMW · accident repair",
        alt: "BMW undergoing accident repair at RT Performance",
      },
      {
        src: "/services/accident-repairs/350z-rear-quarter.jpg",
        caption: "350Z · rear-quarter damage, as arrived",
        alt: "Nissan 350Z with a dented rear quarter panel, photographed on arrival",
      },
      {
        src: "/services/accident-repairs/350z-impact.jpg",
        caption: "350Z · impact damage, as arrived",
        alt: "Nissan 350Z with impact damage to the sill and rear arch, photographed on arrival",
      },
    ],
  },
  {
    id: "body-kits",
    title: "Body Kits & Customisations",
    lede: "Aftermarket and bespoke styling fitted and finished in-house: full body kits, aero, widebody conversions and one-off details that make a car unmistakably yours.",
    facts: [
      "In-house fibreglass & carbon facility since 2009",
      "Install · align · modify · repair",
      "Prepared and sprayed on site",
    ],
    photos: [
      {
        src: "/services/body-kits/350z-kit.jpg",
        caption: "350Z · aftermarket kit fitted",
        alt: "Nissan 350Z with a full aftermarket body kit fitted by RT Performance",
      },
      {
        src: "/services/body-kits/350z-nismo-front.jpg",
        caption: "350Z · Nismo front bumper and canards",
        alt: "Nissan 350Z Nismo front bumper with canards, fitted and aligned",
      },
      {
        src: "/services/body-kits/range-rover.jpg",
        caption: "Range Rover · styling package",
        alt: "Range Rover with a bespoke styling package at RT Performance",
      },
      {
        src: "/services/body-kits/bmw-x6.jpg",
        caption: "BMW X6 · body styling",
        alt: "BMW X6 with body styling work at RT Performance",
      },
      {
        src: "/services/body-kits/mercedes.jpg",
        caption: "Mercedes · body styling",
        alt: "Black Mercedes with body styling work at RT Performance",
      },
      {
        src: "/services/body-kits/350z-matte-white.jpg",
        caption: "350Z · matte-white exterior",
        alt: "Nissan 350Z finished in matte white after exterior tuning",
      },
    ],
  },
  {
    id: "restorations",
    title: "Restorations",
    lede: "Ground-up and classic restoration covering bodywork, paint and interior refurbishment, bringing tired and historic cars back to their best, panel by panel.",
    facts: [
      "Ground-up and panel-by-panel",
      "Full-strip, windows-out resprays",
      "Every trim removed — never masked",
    ],
    photos: [
      {
        src: "/services/restorations/masked-for-primer.jpg",
        caption: "Masked up for primer in the booth",
        alt: "Vehicle fully masked in the spray booth with panels in primer",
      },
      {
        src: "/services/restorations/door-in-primer.jpg",
        caption: "Door skin in primer, panel by panel",
        alt: "Car door with primer patches during panel-by-panel repair",
      },
      {
        src: "/services/restorations/m3-in-the-booth.jpg",
        caption: "BMW M3 · fresh wing in the booth",
        alt: "Masked BMW M3 convertible in the booth with a freshly refinished wing",
      },
      {
        src: "/services/restorations/prepared-for-paint.jpg",
        caption: "BMW · prepared for paint",
        alt: "BMW 1 Series prepared for paint in the spray booth",
      },
      {
        src: "/services/restorations/porsche-respray.jpg",
        caption: "Porsche · full respray under way",
        alt: "Porsche mid-way through a full respray at RT Performance",
      },
    ],
  },
  {
    id: "tints-sprays-wraps",
    title: "Tints, Sprays & Wraps",
    lede: "Full and partial resprays, colour-change vinyl wraps, paint protection film and window tints, for a flawless new finish, whether permanent or reversible.",
    facts: [
      "Spray-bake oven on site",
      "Two-tone, candy, flip & chrome finishes",
      "Exact colour match, dust-free finish",
      "Polished and waxed on hand-back",
    ],
    photos: [
      {
        src: "/services/tints-sprays-wraps/porsche-fresh.jpg",
        caption: "Porsche · fresh out of the booth",
        alt: "Porsche with a fresh respray at RT Performance",
      },
      {
        src: "/services/tints-sprays-wraps/mini-candy-gold.jpg",
        caption: "Mini · candy gold custom finish",
        alt: "Mini Countryman in a custom candy gold finish",
      },
      {
        src: "/services/tints-sprays-wraps/porsche-booth.jpg",
        caption: "Porsche · in the spray booth",
        alt: "Porsche being sprayed in the RT Performance booth",
      },
      {
        src: "/services/tints-sprays-wraps/lamborghini-booth.jpg",
        caption: "Lamborghini · in the spray booth",
        alt: "Lamborghini being sprayed in the RT Performance booth",
      },
      {
        src: "/services/tints-sprays-wraps/porsche-refinished.jpg",
        caption: "Porsche · refinished",
        alt: "Porsche after refinishing at RT Performance",
      },
      {
        src: "/services/tints-sprays-wraps/bmw-booth.jpg",
        caption: "BMW · in the spray booth",
        alt: "BMW being sprayed in the RT Performance booth",
      },
    ],
  },
  {
    id: "smart-repairs",
    title: "SMART Repairs",
    lede: "Fast, localised repair for scuffs, scratches, stone chips and kerbed wheels, a precise, cost-effective fix without respraying the whole panel.",
    facts: [
      "Same-day scratch, dent & chip repair",
      "Alloy refurbishment to factory finish",
      "Exact colour match, dust-free finish",
    ],
    photos: [
      {
        src: "/services/smart-repairs/ferrari-fender.jpg",
        caption: "Ferrari · fender repair",
        alt: "Ferrari fender during a localised SMART repair",
      },
      {
        src: "/services/smart-repairs/lamborghini-smart.jpg",
        caption: "Lamborghini · SMART repair",
        alt: "Lamborghini receiving a SMART repair at RT Performance",
      },
      {
        src: "/services/smart-repairs/range-rover-smart.jpg",
        caption: "Range Rover · SMART repair",
        alt: "Range Rover receiving a SMART repair at RT Performance",
      },
      {
        src: "/services/smart-repairs/bumper-smart.jpg",
        caption: "Front bumper · localised repair",
        alt: "Front bumper during a localised SMART repair",
      },
      {
        src: "/services/smart-repairs/alloy-paint.jpg",
        caption: "Alloy wheel · refinished",
        alt: "Alloy wheel freshly painted during refurbishment",
      },
      {
        src: "/services/smart-repairs/alloy-refurb.jpg",
        caption: "Alloy wheel · factory refurbishment",
        alt: "Alloy wheel restored to a factory finish",
      },
    ],
  },
];

export default function ServicesPage() {
  return <ServicesExperience services={SERVICES} />;
}
