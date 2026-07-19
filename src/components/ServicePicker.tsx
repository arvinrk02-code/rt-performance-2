"use client";

import { useEffect, useRef } from "react";
import { SERVICE_OPTIONS } from "./services";
import { getLenis } from "@/lib/motion";
import styles from "./Picker.module.css";

interface ServicePickerProps {
  onClose: () => void;
  onSelect: (service: string) => void;
}

/* Service chooser shown as a modal dialog — numbered rows echoing the Services
 * page. Same modal shell as the VehiclePicker: Escape and the scrim close it,
 * focus is trapped, body scroll is locked, focus restored to the trigger. */
export default function ServicePicker({ onClose, onSelect }: ServicePickerProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

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

  return (
    <div className={styles.scrim} onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Choose a service"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <header className={styles.head}>
          <span className={styles.eyebrow} data-vp-focus tabIndex={-1}>
            Select a service
          </span>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <ul className={styles.serviceList}>
          {SERVICE_OPTIONS.map((s) => (
            <li key={s.title}>
              <button
                type="button"
                className={styles.service}
                onClick={() => onSelect(s.title)}
              >
                <span>
                  <span className={styles.svcTitle}>{s.title}</span>
                  <span className={styles.svcText}>{s.blurb}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
