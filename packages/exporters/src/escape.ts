/** XML-escape a value (treating null/undefined as ""). */
export function xml(v: unknown): string {
  return String(v ?? "").replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c] as string)
  );
}

/** Strip everything but digits and a single decimal point. */
export function num(v: unknown): string {
  return String(v ?? "").replace(/[^0-9.]/g, "");
}

/** HTML-escape for safe rendering in attributes/text. */
export function esc(v: unknown): string {
  return String(v ?? "").replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&#039;", '"': "&quot;" }[c] as string)
  );
}
