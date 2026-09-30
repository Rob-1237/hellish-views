// The stacked Hellish / Views / by Harry / Evans logo, drawn in Figma and
// exported to public/Harry-Logo.svg. Its fills are already the site's colours
// (#F2F2F0 and the accent #D2E3FC), so it's used as an image: re-export over
// the same file and every instance updates. Size comes from the caller's
// class: large in the Home hero, small in the footer.
export default function StackedWordmark({ as: Tag = "p", className = "" }) {
  return (
    <Tag className={`wordmark-logo ${className}`}>
      <img src="/Harry-Logo.svg" alt="Hellish Views, by Harry Evans" width={2585} height={2550} />
    </Tag>
  );
}
