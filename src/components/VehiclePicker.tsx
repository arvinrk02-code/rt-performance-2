"use client";

import { useEffect, useRef, useState } from "react";
import { MARQUES, type Marque } from "./vehicles";
import { getLenis } from "@/lib/motion";
import styles from "./Picker.module.css";

interface VehiclePickerProps {
  onClose: () => void;
  /** Called with the assembled "Make Model" string when a choice is made. */
  onSelect: (vehicle: string) => void;
}

/* Two-step vehicle chooser shown as a modal dialog: a grid of marque logos,
 * then that marque's model list. "Other" (and every marque's free-text row)
 * lets the visitor type anything RT doesn't have a logo for. Modelled on the
 * Lightbox — Escape and the scrim close it, focus is trapped, body scroll is
 * locked and focus is restored to the trigger on close. */
export default function VehiclePicker({ onClose, onSelect }: VehiclePickerProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const [marque, setMarque] = useState<Marque | null>(null);
  const [custom, setCustom] = useState("");

  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    // The home one-pager runs Lenis smooth scroll, which ignores body overflow;
    // pause it so wheel/touch don't drive the page behind the modal.
    const lenis = getLenis();
    lenis?.stop();

    dialogRef.current?.querySelector<HTMLElement>("[data-vp-focus]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, input, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      lenis?.start();
      restoreRef.current?.focus?.();
    };
  }, [onClose]);

  function chooseModel(model: string) {
    const make = marque?.name ?? "";
    onSelect([make, model].filter(Boolean).join(" "));
  }

  function submitCustom() {
    const v = custom.trim();
    if (!v) return;
    // For a real marque, prefix its name; for "Other", the text stands alone.
    const make = marque && marque.id !== "other" ? marque.name : "";
    onSelect([make, v].filter(Boolean).join(" "));
  }

  const atModels = marque !== null;
  const isOther = marque?.id === "other";

  return (
    <div className={styles.scrim} onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Choose your vehicle"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <header className={styles.head}>
          {atModels ? (
            <button
              type="button"
              className={styles.back}
              onClick={() => {
                setMarque(null);
                setCustom("");
              }}
              data-vp-focus
            >
              <span aria-hidden="true">‹</span> All marques
            </button>
          ) : (
            <span className={styles.eyebrow} data-vp-focus tabIndex={-1}>
              Select your marque
            </span>
          )}
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {!atModels && (
          <ul className={styles.grid}>
            {MARQUES.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className={styles.tile}
                  onClick={() => setMarque(m)}
                >
                  {m.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className={styles.logo} src={m.logo} alt="" aria-hidden="true" />
                  ) : (
                    <span className={styles.otherMark} aria-hidden="true">
                      +
                    </span>
                  )}
                  <span className={styles.tileName}>{m.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {atModels && (
          <div className={styles.models}>
            <div className={styles.marqueHead}>
              {marque!.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.marqueLogo} src={marque!.logo} alt="" aria-hidden="true" />
              )}
              <span className={styles.marqueName}>{marque!.name}</span>
            </div>

            {!isOther && (
              <ul className={styles.modelList}>
                {marque!.models.map((model) => (
                  <li key={model}>
                    <button
                      type="button"
                      className={styles.model}
                      onClick={() => chooseModel(model)}
                    >
                      {model}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form
              className={styles.customRow}
              onSubmit={(e) => {
                e.preventDefault();
                submitCustom();
              }}
            >
              <input
                className={styles.customInput}
                type="text"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder={
                  isOther ? "Make and model" : `Another ${marque!.name}, or a variant`
                }
                aria-label="Vehicle make and model"
              />
              <button
                type="submit"
                className={styles.customBtn}
                disabled={!custom.trim()}
              >
                Use this
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
