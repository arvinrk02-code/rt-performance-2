"use client";

import { useRef, useState } from "react";
import s from "./quoteform.module.css";

const MAX_FILES = 8;
const MAX_FILE_MB = 10;
const MAX_TOTAL_MB = 25;
const ACCEPT = ["image/jpeg", "image/png", "image/heic", "image/webp"];

const SERVICES = [
  "Accident / insurance repair",
  "Respray / paint",
  "Carbon or bodywork / body kit",
  "Full restoration",
  "Something else",
];

interface Errors {
  name?: string;
  contact?: string;
  service?: string;
  consent?: string;
}

export default function QuoteForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [summary, setSummary] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileNote, setFileNote] = useState("");
  const [insurance, setInsurance] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ name: string; photos: number } | null>(null);
  const [failed, setFailed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = [...files];
    let note = "";
    for (const f of Array.from(list)) {
      if (next.length >= MAX_FILES) {
        note = `That's the limit — up to ${MAX_FILES} photos.`;
        break;
      }
      if (!ACCEPT.includes(f.type) && !/\.heic$/i.test(f.name)) {
        note = `${f.name} isn't a photo format we can read — JPG, PNG, HEIC or WebP.`;
        continue;
      }
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        note = `HEIC is fine — ${f.name} is just over ${MAX_FILE_MB} MB. Try a smaller version.`;
        continue;
      }
      const total = next.reduce((t, x) => t + x.size, 0) + f.size;
      if (total > MAX_TOTAL_MB * 1024 * 1024) {
        note = `That takes the total over ${MAX_TOTAL_MB} MB — drop one and try again.`;
        continue;
      }
      next.push(f);
    }
    setFiles(next);
    setFileNote(note);
  }

  function removeFile(i: number) {
    setFiles(files.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const service = fd.get("service");
    const consent = fd.get("consent");

    const errs: Errors = {};
    if (!name) errs.name = "We need a name to reply to.";
    if (!email && !phone)
      errs.contact = "We need an email or phone number so we can get back to you.";
    if (!service) errs.service = "Pick the closest option — it helps us route your enquiry.";
    if (!consent) errs.consent = "Please tick the box so we can reply to you.";

    setErrors(errs);
    const count = Object.keys(errs).length;
    if (count > 0) {
      setSummary(
        count === 1 ? "1 thing needs a quick fix." : `${count} things need a quick fix.`
      );
      const firstInvalid = formRef.current?.querySelector<HTMLElement>(
        '[aria-invalid="true"], input:not([type="hidden"])'
      );
      formRef.current
        ?.querySelector<HTMLElement>('[data-err="1"]')
        ?.focus();
      void firstInvalid;
      return;
    }
    setSummary("");
    setSending(true);
    setFailed(false);
    try {
      files.forEach((f) => fd.append("photos", f, f.name));
      const res = await fetch("/api/quote", { method: "POST", body: fd });
      if (!res.ok) throw new Error(String(res.status));
      setSent({ name: name.split(" ")[0], photos: files.length });
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className={s.success} aria-live="polite">
        <h3 className={s.successH} tabIndex={-1} ref={successRef}>
          Got it. Your photos are with us.
        </h3>
        <p className={s.successBody}>
          Thanks {sent.name} — we&rsquo;ve received your enquiry
          {sent.photos > 0 &&
            ` and ${sent.photos} photo${sent.photos === 1 ? "" : "s"}`}
          . Taras and the team will review and get back to you within one
          working day. Need us sooner? Message us on WhatsApp and we&rsquo;ll
          pick it up.
        </p>
        <div className={s.successRow}>
          <a
            className={s.submit}
            style={{ textDecoration: "none" }}
            href="https://wa.me/447704155514"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp us
          </a>
          <button
            type="button"
            className={s.submit}
            style={{ background: "transparent", color: "var(--carbon)", borderColor: "var(--hairline-dark)" }}
            onClick={() => {
              setSent(null);
              setFiles([]);
            }}
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} className={s.form} onSubmit={onSubmit} noValidate>
      {summary && (
        <p className={s.summary} role="alert" aria-live="assertive">
          {summary}
        </p>
      )}
      {failed && (
        <p className={s.summary} role="alert">
          Something went wrong sending that — nothing&rsquo;s lost. Try again,
          or WhatsApp us on{" "}
          <a href="https://wa.me/447704155514">+44 7704 155514</a>.
        </p>
      )}

      <div className={s.field}>
        <label className={s.label} htmlFor="q-name">
          Your name
        </label>
        <input
          id="q-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="First and last"
          className={s.input}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "q-name-err" : undefined}
          data-err={errors.name ? "1" : undefined}
        />
        {errors.name && (
          <span id="q-name-err" className={s.error}>
            ⚠ {errors.name}
          </span>
        )}
      </div>

      <div className={s.field}>
        <label className={s.label} htmlFor="q-email">
          Email
        </label>
        <input
          id="q-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          className={s.input}
          aria-invalid={errors.contact ? true : undefined}
          aria-describedby={errors.contact ? "q-contact-err" : undefined}
        />
      </div>

      <div className={s.field}>
        <label className={s.label} htmlFor="q-phone">
          Phone or WhatsApp
        </label>
        <input
          id="q-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="So we can text you the quote"
          className={s.input}
          aria-invalid={errors.contact ? true : undefined}
          aria-describedby={errors.contact ? "q-contact-err" : undefined}
        />
        {errors.contact && (
          <span id="q-contact-err" className={s.error}>
            ⚠ {errors.contact}
          </span>
        )}
      </div>

      <div className={s.field}>
        <label className={s.label} htmlFor="q-vehicle">
          Your vehicle
        </label>
        <input
          id="q-vehicle"
          name="vehicle"
          type="text"
          placeholder="e.g. McLaren 570S / BMW M3 / Range Rover Sport"
          className={s.input}
        />
      </div>

      <fieldset className={s.fieldset}>
        <legend className={s.legend}>What do you need?</legend>
        {SERVICES.map((svc) => (
          <label key={svc} className={s.radio}>
            <input type="radio" name="service" value={svc} />
            {svc}
          </label>
        ))}
        {errors.service && (
          <span className={s.error}>⚠ {errors.service}</span>
        )}
      </fieldset>

      <div className={s.field}>
        <label className={s.label} htmlFor="q-message">
          Tell us what happened
        </label>
        <textarea
          id="q-message"
          name="message"
          rows={4}
          placeholder="A parking scrape, a full respray, a project you've been sitting on — whatever it is, a sentence or two is plenty."
          className={s.textarea}
        />
      </div>

      <div className={s.field}>
        <label className={s.label} htmlFor="q-photos">
          Add photos
        </label>
        <span className={s.hint}>
          Add up to 8 photos (JPG, PNG or HEIC, 10 MB each). A wide shot of the
          whole car plus close-ups of the damage or area help most.
        </span>
        <input
          id="q-photos"
          type="file"
          accept="image/jpeg,image/png,image/heic,image/webp"
          multiple
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {fileNote && <span className={s.error}>⚠ {fileNote}</span>}
        {files.length > 0 && (
          <>
            <div className={s.thumbs}>
              {files.map((f, i) => (
                <span key={`${f.name}-${i}`} className={s.thumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(f)} alt="" />
                  <button
                    type="button"
                    className={s.remove}
                    onClick={() => removeFile(i)}
                    aria-label={`Remove ${f.name}`}
                  >
                    ×
                  </button>
                  <span className={s.thumbName}>{f.name}</span>
                </span>
              ))}
            </div>
            <span className={s.hint} aria-live="polite">
              {files.length} photo{files.length === 1 ? "" : "s"} added.
            </span>
          </>
        )}
      </div>

      <label className={s.check}>
        <input
          type="checkbox"
          name="insurance"
          checked={insurance}
          onChange={(e) => setInsurance(e.target.checked)}
        />
        This is an insurance claim
      </label>
      {insurance && (
        <div className={s.field}>
          <label className={s.label} htmlFor="q-insurer">
            Insurer &amp; claim reference (optional)
          </label>
          <input id="q-insurer" name="insurer" type="text" className={s.input} />
        </div>
      )}

      <label className={s.check}>
        <input
          type="checkbox"
          name="consent"
          aria-invalid={errors.consent ? true : undefined}
        />
        <span>
          I&rsquo;m happy for RT Performance to contact me about this enquiry.
          We&rsquo;ll only use your details to reply — never shared, never
          spammed.
        </span>
      </label>
      {errors.consent && <span className={s.error}>⚠ {errors.consent}</span>}

      <button type="submit" className={s.submit} disabled={sending}>
        {sending ? "Sending…" : "Send my photos & get a quote"}
      </button>
      <span className={s.subNote}>
        No obligation. We&rsquo;ll reply within one working day, Mon–Fri.
      </span>
    </form>
  );
}
