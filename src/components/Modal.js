"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { openDialog, closeDialog, onDialogCancel } from "@/lib/motion";

// A trigger button and a native <dialog>. Scrolls inside itself, closes on
// Escape, the close button, or a click on the backdrop. If `hash` is set:
// - the dialog opens when a page loads (or is navigated to) with that
//   #fragment, so links can point straight at it (e.g. /reviews#scoring);
// - a <ModalTrigger target={hash}> anywhere on the page opens it too.
export default function Modal({ label, title, eyebrow, buttonClass = "btn btn--secondary", buttonLabel, hash = null, wide = false, children }) {
  const ref = useRef(null);
  const titleId = `modal-${hash || title.toLowerCase().replace(/\W+/g, "-")}-title`;

  const path = usePathname();
  useEffect(() => {
    if (hash && window.location.hash === `#${hash}`) openDialog(ref.current);
  }, [hash, path]);

  useEffect(() => {
    if (!hash) return;
    const onOpen = (e) => e.detail === hash && openDialog(ref.current);
    window.addEventListener("open-modal", onOpen);
    return () => window.removeEventListener("open-modal", onOpen);
  }, [hash]);

  const onBackdrop = (e) => {
    if (e.target === ref.current) closeDialog(ref.current);
  };

  return (
    <>
      <button type="button" className={buttonClass} onClick={() => openDialog(ref.current)} aria-haspopup="dialog" aria-label={buttonLabel}>
        {label}
      </button>
      <dialog ref={ref} className={`modal${wide ? " modal--wide" : ""}`} aria-labelledby={titleId} onClick={onBackdrop} onCancel={onDialogCancel}>
        <div className="modal__head">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 id={titleId}>{title}</h2>
          </div>
          <button className="modal__close" type="button" aria-label="Close" onClick={() => closeDialog(ref.current)}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal__body" data-stagger>
          {children}
        </div>
      </dialog>
    </>
  );
}
