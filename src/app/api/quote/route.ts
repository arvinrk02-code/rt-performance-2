import { NextResponse } from "next/server";

/**
 * Quote-form endpoint. Accepts the enquiry (fields + up to 8 photos) and
 * acknowledges receipt. Wiring to an email service (Resend/Formspree) needs
 * an API key + deploy — until then enquiries are logged server-side and the
 * UI keeps the WhatsApp/phone fallback so a lead is never dropped.
 */
export async function POST(request: Request) {
  const fd = await request.formData();
  const photos = fd.getAll("photos");
  console.log("[quote] enquiry", {
    name: fd.get("name"),
    email: fd.get("email"),
    phone: fd.get("phone"),
    vehicle: fd.get("vehicle"),
    service: fd.get("service"),
    insurance: fd.get("insurance") ? "yes" : "no",
    insurer: fd.get("insurer"),
    photoCount: photos.length,
  });
  return NextResponse.json({ ok: true });
}
