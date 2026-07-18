/** Marques (with logos in public/logos/<id>.svg) and their model lines, for the
 *  Contact page vehicle picker. "Other" is the catch-all — RT works on more
 *  marques than are listed here, so the picker always allows a free-typed
 *  make/model too (and every marque has a free-text row for variants). */

export interface Marque {
  id: string;
  name: string;
  /** public path to the logo, or null for the free-text "Other" tile. */
  logo: string | null;
  models: string[];
}

export const MARQUES: Marque[] = [
  {
    id: "mclaren",
    name: "McLaren",
    logo: "/logos/mclaren.svg",
    models: ["540C", "570S", "600LT", "620R", "720S", "750S", "765LT", "Artura", "GT", "P1", "Senna", "Speedtail"],
  },
  {
    id: "ferrari",
    name: "Ferrari",
    logo: "/logos/ferrari.svg",
    models: ["296 GTB", "458 Italia", "488", "812 Superfast", "F8 Tributo", "Roma", "Portofino", "SF90 Stradale", "California", "LaFerrari"],
  },
  {
    id: "lamborghini",
    name: "Lamborghini",
    logo: "/logos/lamborghini.svg",
    models: ["Huracán", "Aventador", "Urus", "Revuelto", "Gallardo", "Murciélago", "Sián"],
  },
  {
    id: "mercedes",
    name: "Mercedes-Benz",
    logo: "/logos/mercedes.svg",
    models: ["A-Class", "C-Class", "E-Class", "S-Class", "G 63", "G 500", "G 500 4×4²", "AMG GT", "SL", "CLS", "GLE", "GLS", "EQS"],
  },
  {
    id: "bentley",
    name: "Bentley",
    logo: "/logos/bentley.svg",
    models: ["Continental GT", "Flying Spur", "Bentayga", "Mulsanne"],
  },
  {
    id: "rolls-royce",
    name: "Rolls-Royce",
    logo: "/logos/rolls-royce.svg",
    models: ["Ghost", "Phantom", "Cullinan", "Wraith", "Dawn", "Spectre"],
  },
  {
    id: "bmw",
    name: "BMW",
    logo: "/logos/bmw.svg",
    models: ["M2", "M3", "M4", "M5", "M8", "X5 M", "X6 M", "Z4", "i8", "8 Series", "M135i"],
  },
  {
    id: "audi",
    name: "Audi",
    logo: "/logos/audi.svg",
    models: ["R8", "RS 3", "RS 4", "RS 5", "RS 6", "RS 7", "RS Q8", "TT RS", "S3", "e-tron GT"],
  },
  {
    id: "porsche",
    name: "Porsche",
    logo: "/logos/porsche.svg",
    models: ["911", "718 Cayman", "718 Boxster", "Panamera", "Cayenne", "Macan", "Taycan", "918 Spyder", "Carrera GT"],
  },
  {
    id: "aston-martin",
    name: "Aston Martin",
    logo: "/logos/aston-martin.svg",
    models: ["DB11", "DB12", "DBS", "DBX", "Vantage", "Vanquish", "Rapide", "Valkyrie"],
  },
  {
    id: "maserati",
    name: "Maserati",
    logo: "/logos/maserati.svg",
    models: ["MC20", "GranTurismo", "GranCabrio", "Ghibli", "Quattroporte", "Levante"],
  },
  {
    id: "bugatti",
    name: "Bugatti",
    logo: "/logos/bugatti.svg",
    models: ["Chiron", "Veyron", "Divo", "Mistral", "Tourbillon"],
  },
  {
    id: "koenigsegg",
    name: "Koenigsegg",
    logo: "/logos/koenigsegg.svg",
    models: ["Jesko", "Regera", "Agera", "Gemera", "CC8S"],
  },
  {
    id: "nissan",
    name: "Nissan",
    logo: "/logos/nissan.svg",
    models: ["GT-R", "GT-R Nismo", "Skyline GT-R (R34)", "370Z", "Z"],
  },
  {
    id: "land-rover",
    name: "Land Rover",
    logo: "/logos/land-rover.svg",
    models: ["Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque", "Defender", "Discovery", "Discovery Sport"],
  },
  {
    id: "jaguar",
    name: "Jaguar",
    logo: "/logos/jaguar.svg",
    models: ["F-Type", "F-Pace", "XE", "XF", "XJ", "E-Pace", "I-Pace", "XK"],
  },
  {
    id: "lexus",
    name: "Lexus",
    logo: "/logos/lexus.svg",
    models: ["LC", "LS", "RC", "IS", "ES", "RX", "NX", "UX", "LX"],
  },
  {
    id: "other",
    name: "Other",
    logo: null,
    models: [],
  },
];
