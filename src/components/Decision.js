"use client";
import { useRef } from "react";
import { getDecision } from "@/data/decisions";
import { openDialog, closeDialog, onDialogCancel } from "@/lib/motion";

// A marker for anything that is Harry's call. Click opens a plain-language
// popup listing the ways it can work. Rendered wherever the decision lands.
//
// Decided items don't show a marker inline — the page just does the thing.
// They stay visible on /decisions as a record, via showDecided.
export default function Decision({ id, label = "Decision", showDecided = false }) {
  const ref = useRef(null);
  const d = getDecision(id);
  if (!d) return null;

  const decided = d.status === "decided";
  const awaiting = d.status === "awaiting";
  if (decided && !showDecided) return null;

  const cls = decided ? " decision--decided" : awaiting ? " decision--awaiting" : "";
  const text = decided ? "Decided" : awaiting ? "Awaiting answer" : label;

  return (
    <>
      <button
        type="button"
        className={`decision${cls}`}
        onClick={() => openDialog(ref.current)}
        aria-haspopup="dialog"
        title={d.title}
      >
        <span className="decision__dot" aria-hidden="true" />
        {text}
      </button>
      <dialog ref={ref} className="decision-dialog" aria-labelledby={`decision-${id}-title`} onCancel={onDialogCancel} onClick={(e) => e.target === ref.current && closeDialog(ref.current)}>
        <div className="decision-dialog__body" data-stagger>
          <p className="eyebrow">{d.where}</p>
          <h2 id={`decision-${id}-title`}>{d.title}</h2>
          {decided ? (
            <>
              <p className="notice">
                <strong>Settled:</strong> {d.decided}
              </p>
              <p className="muted">The other ways it could have worked:</p>
            </>
          ) : (
            <>
              {d.context && <p className="muted">{d.context}</p>}
              <p>
                <strong>This can be set up to work any of the following ways:</strong>
              </p>
            </>
          )}
          <ul>
            {d.options.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
          {!decided && d.recommendation && (
            <p className="muted">
              <strong>Suggested:</strong> {d.recommendation}
            </p>
          )}
        </div>
        <div className="decision-dialog__foot">
          <span className="decision-dialog__status">
            {decided ? "Settled — no action needed" : awaiting ? "Asked — waiting on your answer" : "Open — your call"}
          </span>
          <button className="btn btn--secondary" type="button" onClick={() => closeDialog(ref.current)}>
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
