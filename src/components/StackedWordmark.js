// The stacked HELLISH / VIEWS / by Harry / Evans lockup. Spacing and case are
// deliberate. Size comes from the caller's class: huge on Home, small in the
// footer.
export default function StackedWordmark({ as: Tag = "p", className = "" }) {
  return (
    <Tag className={`wordmark wordmark-stack ${className}`} aria-label="Hellish Views, by Harry Evans">
      <span aria-hidden="true">
        <span className="wordmark-stack__line">HELLISH</span>
        <span className="wordmark-stack__line">{"  "}VIEWS</span>
        <span className="wordmark-stack__line wordmark-stack__by wordmark-stack__by--first">by Harry</span>
        <span className="wordmark-stack__line wordmark-stack__by">{" "}Evans</span>
      </span>
    </Tag>
  );
}
