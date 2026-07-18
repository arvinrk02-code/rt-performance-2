import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import styles from "./site.module.css";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader variant="solid" />
      <main className={styles.main}>{children}</main>
      <SiteFooter />
    </>
  );
}
