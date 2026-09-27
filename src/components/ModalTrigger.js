"use client";

// Opens a Modal rendered elsewhere on the page (e.g. the scoring guide, which
// lives once in the footer) without mounting a second copy of it.
export default function ModalTrigger({ target, className = "btn btn--secondary", children }) {
  return (
    <button type="button" className={className} aria-haspopup="dialog" onClick={() => window.dispatchEvent(new CustomEvent("open-modal", { detail: target }))}>
      {children}
    </button>
  );
}
