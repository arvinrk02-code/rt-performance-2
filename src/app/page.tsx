import Landing from "@/components/Landing";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AboutPart1 from "@/components/home/AboutPart1";
import AboutPart2 from "@/components/home/AboutPart2";
import Reviews from "@/components/home/Reviews";
import FindUs from "@/components/home/FindUs";
import ContactSection from "@/components/home/ContactSection";
import HomeMotion from "@/components/home/HomeMotion";

/* ---- shared schema graph (§6): one @id per entity, aggregateRating and
   Review nodes deliberately withheld until real values are verified ---- */
const SITE = "https://rt-performance.co.uk";
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["AutoBodyShop", "Organization"],
      "@id": `${SITE}/#organization`,
      name: "RT Performance",
      description:
        "Prestige auto body, respray and carbon fibre specialist and VBRA-approved accident repair centre in Wembley, London.",
      url: `${SITE}/`,
      telephone: "+442089000014",
      email: "info@rt-performance.co.uk",
      logo: `${SITE}/logo/rt-performance.png`,
      priceRange: "£££",
      foundingDate: "2009",
      founder: { "@id": `${SITE}/#taras` },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Unit 10, Fourth Way",
        addressLocality: "Wembley",
        addressRegion: "Greater London",
        postalCode: "HA9 0LH",
        addressCountry: "GB",
      },
      hasMap:
        "https://www.google.com/maps/dir/?api=1&destination=Unit+10+Fourth+Way+Wembley+HA9+0LH",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:30",
          closes: "18:00",
        },
      ],
      areaServed: [
        { "@type": "City", name: "Wembley" },
        { "@type": "AdministrativeArea", name: "Brent" },
        { "@type": "Place", name: "North West London" },
        { "@type": "City", name: "Harrow" },
        { "@type": "City", name: "Willesden" },
      ],
      hasCredential: "VBRA-approved accident repair centre",
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+442089000014",
          contactType: "customer service",
          areaServed: "GB",
          availableLanguage: "English",
        },
        {
          "@type": "ContactPoint",
          telephone: "+447704155514",
          contactType: "customer service",
          name: "WhatsApp",
        },
      ],
      sameAs: [
        "https://www.facebook.com/RTPerformanceUK",
        "https://www.instagram.com/rtperformance",
      ],
    },
    {
      "@type": "Person",
      "@id": `${SITE}/#taras`,
      name: "Taras",
      jobTitle: "Owner",
      worksFor: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "AboutPage",
      "@id": `${SITE}/#about-page`,
      mainEntity: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "ContactPage",
      "@id": `${SITE}/#contact-page`,
      mainEntity: { "@id": `${SITE}/#organization` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <SiteHeader variant="hero" />
      <main id="main">
        <h1 className="sr-only">
          RT Performance — prestige auto body, carbon fibre and VBRA-approved
          accident repair centre in Wembley, London
        </h1>
        <Landing />
        <AboutPart1 />
        <AboutPart2 />
        <Reviews />
        <FindUs />
        <ContactSection />
      </main>
      <SiteFooter />
      <HomeMotion />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
