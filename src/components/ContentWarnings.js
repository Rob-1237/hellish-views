export default function ContentWarnings({ warnings = [], spoilerScope }) {
  if (!warnings.length && !spoilerScope) return null;
  return (
    <aside className="notice" aria-label="Content warnings and spoilers">
      <h2>Before you read</h2>
      {warnings.length > 0 && (
        <ul>
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
      {spoilerScope && <p style={{ marginTop: warnings.length ? "var(--space-2)" : 0 }}>{spoilerScope}</p>}
    </aside>
  );
}
