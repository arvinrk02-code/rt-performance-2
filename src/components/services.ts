/** The service lines offered on the Contact picker. Titles match SERVICES_SUB
 *  in pages.ts and the Services page; blurbs are trimmed for the picker. The
 *  final "General enquiry" row is the catch-all for anything else. */

export interface ServiceOption {
  title: string;
  blurb: string;
}

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    title: "Accident Repairs",
    blurb: "Insurance-approved and private repair, cosmetic to structural.",
  },
  {
    title: "Body Kits & Customisations",
    blurb: "Aftermarket and bespoke styling, aero and widebody, fitted in-house.",
  },
  {
    title: "Restorations",
    blurb: "Ground-up and classic restoration — bodywork, paint and interior.",
  },
  {
    title: "Tints, Sprays & Wraps",
    blurb: "Resprays, colour-change wraps, paint protection film and tints.",
  },
  {
    title: "SMART Repairs",
    blurb: "Localised fixes for scuffs, chips and kerbed wheels.",
  },
  {
    title: "General enquiry",
    blurb: "Not sure which — tell us about it and we'll advise.",
  },
];
