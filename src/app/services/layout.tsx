import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import styles from "../(site)/site.module.css";

/* /services runs the HERO header (fixed overlay, blur field on scroll,
 * inverts over [data-theme="light"] sections) instead of the solid bar —
 * the Porsche mechanic: every section melts into the nav as it scrolls
 * out, the whole way down. That's why this route lives outside (site). */
export default function ServicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader variant="hero" bare />
      <main className={styles.main}>{children}</main>
      <SiteFooter />
    </>
  );
}
