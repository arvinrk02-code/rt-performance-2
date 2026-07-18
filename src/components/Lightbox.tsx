"use client";

import { useCallback, useEffect, useRef } from "react";
import type { WorkPhoto } from "./work";
import styles from "./OurWork.module.css";

interface LightboxProps {
  images: WorkPhoto[];
  index: number;
  /** Car name, for the dialog label and the header line. */
  carTitle: string;
  onClose: () => void;
  onIndex: (i: number) => void;
}

/* Expanded-photo overlay: dark scrim, the full frame + caption, step controls.
 * Behaves as a modal dialog — focus is trapped, Escape and the scrim close it,
 * body scroll is locked, and focus is restored to the trigger on close. */
export default function Lightbox({
  images,
  index,
  carTitle,
  onClose,
  onIndex,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const photo = images[index];
  const many = images.length > 1;

  const step = useCallback(
    (dir: number) => {
      const n = images.length;
      onIndex((index + dir + n) % n);
    },
    [images.length, index, onIndex]
  );

  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // move focus into the dialog
    const focusFirst = () => {
      const el = dialogRef.current?.querySelector<HTMLElement>("[data-lb-focus]");
      el?.focus();
    };
    focusFirst();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowRight" && many) {
        e.preventDefault();
        step(1);
        return;
      }
      if (e.key === "ArrowLeft" && many) {
        e.preventDefault();
        step(-1);
        return;
      }
      if (e.key === "Tab") {
        // simple focus trap across the dialog's focusable controls
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
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
      restoreRef.current?.focus?.();
    };
  }, [onClose, step, many]);

  return (
    <div
      className={styles.lbScrim}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={styles.lbDialog}
        role="dialog"
        aria-modal="true"
        aria-label={`${carTitle}, ${photo.caption}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.lbClose}
          onClick={onClose}
          aria-label="Close"
          data-lb-focus
        >
          <span aria-hidden="true">×</span>
        </button>

        <figure className={styles.lbFigure}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={`${carTitle}, ${photo.caption}`}
            className={styles.lbImg}
            draggable={false}
          />
          <figcaption className={styles.lbCaption}>
            <span className={styles.lbEyebrow}>
              {carTitle}
              {photo.stage ? ` · ${photo.stage}` : ""}
            </span>
            <span className={styles.lbText}>{photo.caption}</span>
          </figcaption>
        </figure>

        {many && (
          <>
            <button
              type="button"
              className={`${styles.lbNav} ${styles.lbPrev}`}
              onClick={() => step(-1)}
              aria-label="Previous photo"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              className={`${styles.lbNav} ${styles.lbNext}`}
              onClick={() => step(1)}
              aria-label="Next photo"
            >
              <span aria-hidden="true">›</span>
            </button>
            <div className={styles.lbCount} aria-hidden="true">
              {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
