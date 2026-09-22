import { formatDate } from "@/lib/content";

export default function Byline({ contributors = ["Harry"], publishedAt, extra }) {
  return (
    <p className="meta">
      <span>
        By <strong>{contributors.join(" & ")}</strong>
      </span>
      {publishedAt && <span>{formatDate(publishedAt)}</span>}
      {extra}
    </p>
  );
}
