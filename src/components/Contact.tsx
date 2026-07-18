"use client";

import { useState } from "react";
import Link from "next/link";
import VehiclePicker from "./VehiclePicker";
import ServicePicker from "./ServicePicker";
import styles from "./Contact.module.css";

/* Real contact details — mirrored from SiteFooter. */
const PHONE_DISPLAY = "+44 (0)20 8900 0014";
const PHONE_TEL = "tel:+442089000014";
const WHATSAPP_URL = "https://wa.me/447704155514";
const EMAIL = "info@rt-performance.com";

/* Photo upload limits — kept in step with the /api/quote endpoint. */
const MAX_FILES = 6;
const MAX_MB = 5;
const ACCEPT = "image/jpeg,image/png,image/heic,image/webp";

/* Thin-stroke ember icons for the contact rail. */
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3" />
      <path d="M8.8 8.9c-.3 2.4 4 6.6 6.4 6.3l1-1.2-2.1-1.4-.9.7c-1-.5-1.9-1.4-2.4-2.4l.7-.9-1.4-2.1z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export default function Contact() {
  const [vehicle, setVehicle] = useState("");
  const [service, setService] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileNote, setFileNote] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [servicePickerOpen, setServicePickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentName, setSentName] = useState<string | null>(null);

  /* Merge new selections with existing, dropping anything over the size limit
     or beyond the count cap, and explain what was skipped. */
  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const tooBig = incoming.filter((f) => f.size > MAX_MB * 1024 * 1024);
    let next = [...files, ...incoming.filter((f) => f.size <= MAX_MB * 1024 * 1024)];
    let note: string | null = null;
    if (tooBig.length) {
      note = `${tooBig.length} photo${tooBig.length > 1 ? "s were" : " was"} over ${MAX_MB} MB and skipped.`;
    }
    if (next.length > MAX_FILES) {
      next = next.slice(0, MAX_FILES);
      note = `Up to ${MAX_FILES} photos — extras were left off.`;
    }
    setFiles(next);
    setFileNote(note);
  }

  function removeFile(i: number) {
    setFiles((f) => f.filter((_, idx) => idx !== i));
    setFileNote(null);
  }

  /* Post the enquiry (fields + photos) to the shared /api/quote endpoint. */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    files.forEach((f) => data.append("photos", f));
    setBusy(true);
    try {
      const res = await fetch("/api/quote", { method: "POST", body: data });
      if (!res.ok) throw new Error();
      const name = String(data.get("name") ?? "").trim();
      setSentName(name.split(" ")[0] || "there");
    } catch {
      setError(
        "Something went wrong sending that — nothing's lost. Try again, or WhatsApp us on +44 (0)770 415 5514."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="contact" data-chapter="Contact" className={styles.stage}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.photo}
        src="/work/rolls-royce-cullinan/01.jpg"
        alt=""
        aria-hidden="true"
      />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.left}>
            <h1 className={styles.title} data-reveal="headline">
              Let&rsquo;s discuss
              <br />
              your vehicle.
            </h1>
            <p className={styles.lede} data-reveal="rise">
              Every project begins
              <br />
              with a conversation.
            </p>

            <ul className={styles.methods} data-reveal="stagger">
              <li>
                <a className={styles.method} href={PHONE_TEL}>
                  <span className={styles.icon}>
                    <PhoneIcon />
                  </span>
                  <span>
                    <span className={styles.methodMain}>{PHONE_DISPLAY}</span>
                    <span className={styles.methodSub}>Speak to our team</span>
                  </span>
                </a>
              </li>
              <li>
                <a className={styles.method} href={`mailto:${EMAIL}`}>
                  <span className={styles.icon}>
                    <MailIcon />
                  </span>
                  <span>
                    <span className={styles.methodMain}>{EMAIL}</span>
                    <span className={styles.methodSub}>Email us anytime</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  className={styles.method}
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.icon}>
                    <WhatsAppIcon />
                  </span>
                  <span>
                    <span className={styles.methodMain}>WhatsApp</span>
                    <span className={styles.methodSub}>Message us directly</span>
                  </span>
                </a>
              </li>
              <li>
                <Link className={styles.method} href="/find-us">
                  <span className={styles.icon}>
                    <PinIcon />
                  </span>
                  <span>
                    <span className={styles.methodMain}>The Workshop</span>
                    <span className={styles.methodSub}>
                      Unit 10 Fourth Way,
                      <br />
                      Wembley, London HA9 0LH
                    </span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {sentName ? (
            <div className={`${styles.form} ${styles.success}`} role="status">
              <p className={styles.successHead}>Got it, {sentName}.</p>
              <p className={styles.successSub}>
                Taras and the team will reply within one working day. Sooner?{" "}
                <a href={WHATSAPP_URL}>WhatsApp us</a>.
              </p>
            </div>
          ) : (
          <form className={styles.form} onSubmit={handleSubmit} aria-label="Enquiry" data-reveal="rise">
            <div className={styles.field}>
              <label className={styles.label} htmlFor="c-name">
                Your name
              </label>
              <input
                className={styles.input}
                id="c-name"
                name="name"
                type="text"
                autoComplete="name"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="c-email">
                Email address
              </label>
              <input
                className={styles.input}
                id="c-email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="c-phone">
                Phone number
              </label>
              <input
                className={styles.input}
                id="c-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="c-vehicle">
                  Vehicle
                </label>
                <button
                  type="button"
                  id="c-vehicle"
                  className={`${styles.input} ${styles.picker} ${
                    vehicle ? "" : styles.pickerEmpty
                  }`}
                  onClick={() => setPickerOpen(true)}
                >
                  <span>{vehicle || "Select vehicle"}</span>
                </button>
                <input type="hidden" name="vehicle" value={vehicle} />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="c-service">
                  Service required
                </label>
                <button
                  type="button"
                  id="c-service"
                  className={`${styles.input} ${styles.picker} ${
                    service ? "" : styles.pickerEmpty
                  }`}
                  onClick={() => setServicePickerOpen(true)}
                >
                  <span>{service || "Select service"}</span>
                </button>
                <input type="hidden" name="service" value={service} />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="c-message">
                Tell us about your project
              </label>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                id="c-message"
                name="message"
                rows={4}
                required
              />
            </div>

            <div className={styles.field}>
              <span className={styles.label}>
                Photos of the vehicle{" "}
                <span className={styles.labelOpt}>· up to {MAX_FILES}, {MAX_MB} MB each</span>
              </span>
              <label className={styles.fileDrop}>
                <input
                  className={styles.fileInput}
                  type="file"
                  accept={ACCEPT}
                  multiple
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
                <span className={styles.fileCta}>Add photos</span>
                <span className={styles.fileHint}>
                  {files.length
                    ? `${files.length} of ${MAX_FILES} added`
                    : "JPG, PNG, HEIC or WebP"}
                </span>
              </label>

              {files.length > 0 && (
                <ul className={styles.fileList}>
                  {files.map((f, i) => (
                    <li key={f.name + f.size + i} className={styles.fileItem}>
                      <span className={styles.fileName}>{f.name}</span>
                      <span className={styles.fileSize}>
                        {(f.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                      <button
                        type="button"
                        className={styles.fileRemove}
                        onClick={() => removeFile(i)}
                        aria-label={`Remove ${f.name}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {fileNote && (
                <p className={styles.fileNote} role="alert">
                  {fileNote}
                </p>
              )}
            </div>

            <button className={styles.submit} type="submit" disabled={busy}>
              {busy ? (
                "Sending…"
              ) : (
                <>
                  Arrange Consultation <span aria-hidden="true">&rarr;</span>
                </>
              )}
            </button>

            {error && (
              <p className={styles.hint} role="alert">
                {error}
              </p>
            )}
          </form>
          )}
        </div>
      </div>

      {pickerOpen && (
        <VehiclePicker
          onClose={() => setPickerOpen(false)}
          onSelect={(v) => {
            setVehicle(v);
            setPickerOpen(false);
          }}
        />
      )}

      {servicePickerOpen && (
        <ServicePicker
          onClose={() => setServicePickerOpen(false)}
          onSelect={(s) => {
            setService(s);
            setServicePickerOpen(false);
          }}
        />
      )}
    </section>
  );
}
