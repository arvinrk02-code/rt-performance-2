import type { Metadata } from "next";
import OurWork from "@/components/OurWork";

export const metadata: Metadata = {
  title: "Our Work | RT Performance",
  description:
    "Featured builds and case studies: stripped shells returned to showroom, accident repairs and transformations, told through the work itself.",
};

export default function OurWorkPage() {
  return <OurWork />;
}
