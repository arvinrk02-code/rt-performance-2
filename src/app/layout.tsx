import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Noto_Serif_Display } from "next/font/google";
import "./globals.css";

const serif = Noto_Serif_Display({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

/* instrument numerals — stats, indices, hours, postcodes (design_1 §2) */
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "RT Performance | London's Premier Auto Body Repair Centre",
  description:
    "Bespoke accident repairs, resprays, wheel refurbishment and restorations for luxury and performance vehicles. Unit 10 Fourth Way, Wembley, London.",
};

export const viewport: Viewport = {
  themeColor: "#020204",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
