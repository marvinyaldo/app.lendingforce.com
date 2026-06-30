export { toJSON } from "./json.js";
export { toInternalXML } from "./internalXml.js";
export { toMISMO } from "./mismo.js";
export { esc, xml, num } from "./escape.js";

/** Trigger a browser download of `content` as `filename`. */
export function download(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
