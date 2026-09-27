import { animate, stagger } from "motion";

// One easing for the whole site: a long, soft ease-out, so things arrive
// quickly and then settle rather than stopping dead.
export const EASE = [0.22, 1, 0.36, 1];

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Open a <dialog> and bring its content in: the panel rises and sharpens,
// then its sections follow one after another.
export function openDialog(dialog) {
  if (!dialog || dialog.open) return;
  dialog.showModal();
  if (reduced()) return;
  animate(dialog, { opacity: [0, 1], y: [24, 0], scale: [0.98, 1], filter: ["blur(6px)", "blur(0px)"] }, { duration: 0.55, ease: EASE });
  const parts = dialog.querySelectorAll("[data-stagger] > *");
  if (parts.length) {
    animate(parts, { opacity: [0, 1], y: [14, 0] }, { duration: 0.6, ease: EASE, delay: stagger(0.07, { startDelay: 0.12 }) });
  }
}

export function closeDialog(dialog) {
  if (!dialog?.open) return;
  if (reduced()) return dialog.close();
  animate(dialog, { opacity: 0, y: 12, scale: 0.985 }, { duration: 0.28, ease: EASE }).then(() => {
    dialog.close();
    dialog.style.opacity = dialog.style.transform = "";
  });
}

// Escape should get the same exit as the close button.
export function onDialogCancel(e) {
  e.preventDefault();
  closeDialog(e.currentTarget);
}
