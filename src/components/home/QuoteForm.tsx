"use client";

import { useRef, useState } from "react";
import s from "./quoteform.module.css";

const SERVICES = [
  "Accident / insurance repair",
  "Respray / paint",
  "Body kit / carbon work",
  "Restoration",
  "SMART repair",
  "Something else",
];

const MAX_FILES = 8;
const MAX_MB = 10;

/** Hairline-minimal quote form (Pagani input language: underline fields).
 *  Validates on submit; success replaces the form in place. */
export default function QuoteForm() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...files, ...Array.from(list)]
      .filter((f) => f.size <= MAX_MB * 1024 * 1024)
      .slice(0, MAX_FILES);
    setFiles(next);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const form = formRef.current!;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const contact = (form.elements.namedItem("contact") as HTMLInputElement).value.trim();
    if (!name || !contact) {
      setError("Add your name and an email or phone number so we can reply.");
      return;
    }
    setBusy(true);
    try {
      const data = new FormData(form);
      files.forEach((f) => data.append("photos", f));
      const res = await fetch("/api/quote", { method: "POST", body: data });
      if (!res.ok) throw new Error();
      setSent(name.split(" ")[0]);
    } catch {
      setError(
        "Something went wrong sending that — nothing's lost. Try again, or WhatsApp us on +44 7704 155514."
      );
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className={s.success} role="status">
        <p className={s.successHead}>Got it, {sent}.</p>
        <p className={s.successSub}>
          Taras and the team will come back to you within one working day.
          Sooner? Message us on{" "}
          <a href="https://wa.me/447704155514">WhatsApp</a>.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} className={s.form} onSubmit={submit} noValidate>
      <div className={s.row}>
        <label className={s.field}>
          <span className={s.label}>Your name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label className={s.field}>
          <span className={s.label}>Email or phone</span>
          <input name="contact" type="text" autoComplete="email" inputMode="email" required />
        </label>
      </div>

      <div className={s.row}>
        <label className={s.field}>
          <span className={s.label}>Vehicle</span>
          <input name="vehicle" type="text" placeholder="e.g. McLaren 570S" />
        </label>
        <label className={s.field}>
          <span className={s.label}>What do you need?</span>
          <select name="service" defaultValue={SERVICES[0]}>
            {SERVICES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>

      <label className={s.field}>
        <span className={s.label}>Tell us what happened</span>
        <textarea name="message" rows={3} placeholder="A sentence or two is plenty." />
      </label>

      <div className={s.fileRow}>
        <label className={s.fileBtn}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/heic,image/webp"
            multiple
            onChange={(e) => onFiles(e.target.files)}
          />
          Add photos
        </label>
        <span className={s.fileHint}>
          {files.length
            ? `${files.length} photo${files.length > 1 ? "s" : ""} added`
            : `Up to ${MAX_FILES} photos, ${MAX_MB} MB each`}
        </span>
      </div>

      {error && (
        <p className={s.error} role="alert">
          {error}
        </p>
      )}

      <div className={s.submitRow}>
        <button type="submit" className={s.submit} disabled={busy}>
          {busy ? "Sending…" : "Send & get a quote"}
        </button>
        <span className={s.submitNote}>No obligation · Mon–Fri reply</span>
      </div>
    </form>
  );
}
