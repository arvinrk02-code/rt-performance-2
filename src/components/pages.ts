/** The site map, in nav order — shared by the header overlay and the footer.
 *  Kept in a plain (non-"use client") module so Server Components (the footer)
 *  can import the array itself rather than a client-reference proxy. */
export const PAGES = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Our Work", href: "/our-work" },
  { label: "Gallery", href: "/gallery" },
  { label: "Community", href: "/community" },
  { label: "Find Us", href: "/find-us" },
  { label: "Contact Us", href: "/contact" },
];

/** The Services dropdown — deep-links to the sections on the Services page. */
export const SERVICES_SUB = [
  { label: "Accident Repairs", href: "/services#accident-repairs" },
  { label: "Body Kits & Customisations", href: "/services#body-kits" },
  { label: "Restorations", href: "/services#restorations" },
  { label: "Tints, Sprays & Wraps", href: "/services#tints-sprays-wraps" },
  { label: "SMART Repairs", href: "/services#smart-repairs" },
];
