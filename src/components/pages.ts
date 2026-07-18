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
