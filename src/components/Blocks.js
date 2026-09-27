import RubricChart from "./RubricChart";

// The block library renderer. Inline formatting arrives as a sanitised HTML
// subset (em, strong, a, br) produced by the converter, so authored italics
// and bold survive exactly: Darkling's formatting carries meaning.
const Html = ({ as: Tag = "span", html, ...rest }) => <Tag {...rest} dangerouslySetInnerHTML={{ __html: html }} />;

export default function Blocks({ blocks = [] }) {
  return blocks.map((b, i) => {
    switch (b.type) {
      case "paragraph":
        return b.html != null ? <Html key={i} as="p" html={b.html} /> : <p key={i}>{b.text}</p>;
      case "heading":
        return <Html key={i} as={b.level === 2 ? "h2" : "h3"} className="prose__heading" html={b.html} />;
      case "divider":
        return <hr key={i} className="divider" />;
      case "pullQuote":
        return b.html != null ? <Html key={i} as="blockquote" html={b.html} /> : <blockquote key={i}>{b.text}</blockquote>;
      case "image":
        return (
          <figure key={i}>
            {b.src ? <img src={b.src} alt={b.alt || ""} loading="lazy" /> : <div className="img-placeholder">Image</div>}
            {(b.caption || b.credit) && (
              <figcaption>
                {b.caption && <Html html={b.caption} />} {b.credit && <span className="muted">· {b.credit}</span>}
              </figcaption>
            )}
          </figure>
        );
      case "list": {
        const Tag = b.ordered ? "ol" : "ul";
        return (
          <Tag key={i}>
            {b.items.map((it, j) => (
              <Html key={j} as="li" html={it} />
            ))}
          </Tag>
        );
      }
      case "score":
        return <RubricChart key={i} rubricId={b.rubric} scores={b.scores} showDecisions={false} />;
      default:
        return null;
    }
  });
}
