"use client";
import { useRef } from "react";
import { getDecision } from "@/data/decisions";

// A marker for anything that is Harry's call. Click opens a plain-language
// popup listing the ways it can work. Rendered wherever the decision lands.
export default function Decision({ id, label = "Decision" }) {
  const ref = useRef(null);
  const d = getDecision(id);
  if (!d) return null;
  const awaiting = d.status === "awaiting";
  return (
    <>
      <button
        type="button"
        className={`decision${awaiting ? " decision--awaiting" : ""}`}
        onClick={() => ref.current?.showModal()}
        aria-haspopup="dialog"
        title={d.title}
      >
        <span className="decision__dot" aria-hidden="true" />
        {awaiting ? "Awaiting answer" : label}
      </button>
      <dialog ref={ref} className="decision-dialog" aria-labelledby={`decision-${id}-title`}>
        <div className="decision-dialog__body">
          <p className="eyebrow">{d.where}</p>
          <h2 id={`decision-${id}-title`}>{d.title}</h2>
          {d.context && <p className="muted">{d.context}</p>}
          <p>
            <strong>This can be set up to work any of the following ways:</strong>
          </p>
          <ul>
            {d.options.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
          {d.recommendation && (
            <p className="muted">
              <strong>Suggested:</strong> {d.recommendation}
            </p>
          )}
        </div>
        <div className="decision-dialog__foot">
          <span className="decision-dialog__status">
            {awaiting ? "Asked — waiting on your answer" : "Open — your call"}
          </span>
          <form method="dialog">
            <button className="btn btn--secondary" type="submit">
              Close
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
