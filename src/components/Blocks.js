// The block library renderer. Inline marks: *italic* and **bold**, kept
// because Darkling's formatting carries meaning.
function Inline({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("*")) return <em key={i}>{p.slice(1, -1)}</em>;
    return <span key={i}>{p}</span>;
  });
}

export default function Blocks({ blocks = [] }) {
  return blocks.map((b, i) => {
    switch (b.type) {
      case "paragraph":
        return (
          <p key={i}>
            <Inline text={b.text} />
          </p>
        );
      case "pullQuote":
        return <blockquote key={i}>{b.text}</blockquote>;
      case "image":
        return (
          <figure key={i}>
            {b.src ? <img src={b.src} alt={b.alt || ""} /> : <div className="img-placeholder">Image</div>}
            <figcaption>
              {b.caption} {b.credit && <span className="muted">· {b.credit}</span>}
            </figcaption>
          </figure>
        );
      case "notes":
      case "rankedList":
        return (
          <ol key={i}>
            {b.items.map((it, j) => (
              <li key={j}>{it}</li>
            ))}
          </ol>
        );
      default:
        return null;
    }
  });
}
