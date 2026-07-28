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
  a.rel = "noopener";
  a.style.display = "none";
  // The anchor must be in the DOM for some browsers, and the object URL must
  // stay alive until the download starts — revoking immediately can cancel it
  // (especially for larger files like the MISMO XML).
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 1500);
}
