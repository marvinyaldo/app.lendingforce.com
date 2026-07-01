import { useState } from "react";
import { download, toInternalXML, toJSON, toMISMO } from "@lf/exporters";
import type { CallData } from "@lf/types";

interface ExportScreenProps {
  data: CallData;
  onClear: () => void;
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
