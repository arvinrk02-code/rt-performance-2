import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact Us | RT Performance",
  description:
    "Get in touch with RT Performance. Call, WhatsApp or email, or send an enquiry. Unit 10 Fourth Way, Wembley, London.",
};

export default function ContactPage() {
  return <Contact />;
}
