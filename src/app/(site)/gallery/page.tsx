import type { Metadata } from "next";
import GalleryWheel from "@/components/gallery/GalleryWheel";
import { GALLERY } from "@/components/gallery/manifest";

export const metadata: Metadata = {
  title: "Gallery | RT Performance",
  description:
    "The full collection of customer cars through the RT Performance booth: supercars, SUVs and classics, finished in-house. Spin the wheel to browse by service.",
};

export default function GalleryPage() {
  return <GalleryWheel categories={GALLERY} />;
}
