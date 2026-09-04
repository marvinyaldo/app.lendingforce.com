import { useState } from "react";
import { download, esc, toInternalXML, toJSON, toMISMO } from "@lf/exporters";
import { flow, labelSection, sectionOrder } from "@lf/call-script";
import type { CallData } from "@lf/types";

interface ExportScreenProps {
  data: CallData;
  onClear: () => void;
}

// Never print a full SSN on a saved PDF — mask to the last 4 digits.
const SSN_KEYS = new Set(["borrowerSsn", "coBorrowerSsn"]);
function maskForPdf(key: string, value: string): string {
  if (!SSN_KEYS.has(key)) return value;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 4 ? `***-**-${digits.slice(-4)}` : "***";
}

/** Build a clean, labeled HTML summary of the captured call for printing to PDF. */
function buildSummaryHtml(data: CallData): string {
  const seen = new Set<string>();
  let sections = "";
  for (const sec of sectionOrder) {
    const rows: string[] = [];
    for (const step of flow[sec] ?? []) {
      for (const f of step.fields ?? []) {
        const key = f[0];
        const label = f[1];
        if (seen.has(key)) continue;
        const val = data[key];
        if (val) {
          seen.add(key);
          rows.push(
            `<tr><th>${esc(label)}</th><td>${esc(maskForPdf(key, val)).replace(/\n/g, "<br>")}</td></tr>`
          );
        }
      }
    }
    if (rows.length) {
      sections += `<h2>${esc(labelSection(sec))}</h2><table>${rows.join("")}</table>`;
    }
  }
  const name = data.borrowerFullName || data.borrowerFirstName || "Call Summary";
  const when = new Date().toLocaleString();
  return (
    `<!doctype html><html><head><meta charset="utf-8"><title>${esc(name)} — Lending Force</title>` +
    `<style>` +
    `*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#141414;margin:0;padding:0}` +
    `.hdr{background:#0b0b0b;color:#fff;padding:18px 24px;border-bottom:4px solid #ff1218}` +
    `.hdr .k{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#ff5a5f;font-weight:700}` +
    `.hdr h1{margin:4px 0 0;font-size:20px}` +
    `.hdr .sub{font-size:12px;color:#cfcfcf;margin-top:4px}` +
    `.body{padding:20px 24px}` +
    `h2{font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#ff1218;border-bottom:1px solid #e2e2e2;padding-bottom:4px;margin:20px 0 8px}` +
    `table{width:100%;border-collapse:collapse;margin-bottom:6px}` +
    `th{text-align:left;width:34%;vertical-align:top;padding:5px 8px 5px 0;font-size:12px;color:#555;font-weight:600}` +
    `td{padding:5px 0;font-size:13px;vertical-align:top}` +
    `tr{border-bottom:1px solid #f0f0f0}` +
    `@media print{.hdr{-webkit-print-color-adjust:exact;print-color-adjust:exact}}` +
    `</style></head><body>` +
    `<div class="hdr"><div class="k">Lending Force</div><h1>${esc(name)}</h1>` +
    `<div class="sub">Guided Call Summary · ${esc(when)}</div></div>` +
    `<div class="body">${sections || "<p>No call data captured yet.</p>"}</div>` +
    `</body></html>`
  );
}

/** Open the summary in a new window and trigger the print dialog (Save as PDF). */
function exportPdf(data: CallData): void {
  const w = window.open("", "_blank");
  if (!w) {
    alert("Please allow pop-ups to export the PDF.");
    return;
  }
  w.document.write(buildSummaryHtml(data));
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 350);
}

export function ExportScreen({ data, onClear }: ExportScreenProps) {
  const [preview, setPreview] = useState("Click Preview.");

  return (
    <section>
      <div className="card">
        <p className="section-title">Export Center</p>
        <h2>Export Captured Call Data</h2>
        <p className="muted">
          The MISMO-style XML is still a prototype mapping. It should be validated
          against the destination LOS/POS before production use.
        </p>
        <div className="path-row">
          <button
            className="success"
            onClick={() => download("lending-force-call-data.json", toJSON(data), "application/json")}
          >
            Download JSON
          </button>
          <button
            className="success"
            onClick={() =>
              download("lending-force-internal-export.xml", toInternalXML(data), "application/xml")
            }
          >
            Download Internal XML
          </button>
          <button
            className="warning"
            onClick={() =>
              download("lending-force-mismo-3.4.xml", toMISMO(data), "application/xml")
            }
          >
            Download MISMO 3.4 (Arive)
          </button>
          <button className="primary" onClick={() => exportPdf(data)}>
            Export as PDF
          </button>
          <button onClick={() => setPreview(toJSON(data))}>Preview</button>
          <button className="danger" onClick={onClear}>
            Clear All
          </button>
        </div>
      </div>
      <div className="card">
        <h3>Preview</h3>
        <pre>{preview}</pre>
      </div>
    </section>
  );
}
