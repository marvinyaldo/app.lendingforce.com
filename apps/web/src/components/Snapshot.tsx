import type { CallData } from "@lf/types";
import type { SavedApp } from "../hooks/useCallStore.js";

interface SnapshotProps {
  data: CallData;
  setField: (key: string, value: string) => void;
  onSave: () => void;
  onLoad: () => void;
  savedApps: SavedApp[];
  onSaveApp: () => void;
  onLoadApp: (id: string) => void;
}

export function Snapshot({
  data,
  setField,
  onSave,
  onLoad,
  savedApps,
  onSaveApp,
  onLoadApp
}: SnapshotProps) {
  const name = data.borrowerFullName || data.borrowerFirstName || "No borrower yet";
  return (
    <aside className="panel">
      <p className="section-title">Call Snapshot</p>
      <div>
        <p>
          <strong>{name}</strong>
        </p>
        <p className="small muted">{data.propertyAddress || "No property address"}</p>
        <p>
          <span className="badge blue">{data.primaryGoal || "No goal"}</span>
        </p>
        <table className="table">
          <tbody>
            <tr>
              <th>Value</th>
              <td>{data.estimatedValue || "-"}</td>
            </tr>
            <tr>
              <th>Income</th>
              <td>{data.grossMonthlyIncome || "-"}</td>
            </tr>
            <tr>
              <th>Assets</th>
              <td>{data.totalAssets || "-"}</td>
            </tr>
            <tr>
              <th>Product</th>
              <td>{data.productType || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr />
      <p className="section-title">Current Notes</p>
      <div className="field">
        <label htmlFor="snap-notes">Running Notes</label>
        <textarea
          id="snap-notes"
          placeholder="Type notes as the call progresses..."
          value={data.runningNotes ?? ""}
          onChange={(e) => setField("runningNotes", e.target.value)}
        />
      </div>
      <hr />
      <p className="section-title">Quick Data</p>
      <QuickField label="Borrower Name" k="borrowerFullName" data={data} setField={setField} />
      <QuickField label="Phone" k="preferredPhone" data={data} setField={setField} />
      <QuickField label="Property Address" k="propertyAddress" data={data} setField={setField} />
      <QuickField label="Primary Goal" k="primaryGoal" data={data} setField={setField} />
      <hr />
      <p className="section-title">Save</p>
      <button className="primary" onClick={onSave}>
        Save Progress
      </button>{" "}
      <button onClick={onLoad}>Load Saved</button>
      <hr />
      <p className="section-title">Recent Applications (last 2)</p>
      <button type="button" onClick={onSaveApp}>
        Save Current Application
      </button>
      {savedApps.length === 0 ? (
        <p className="small muted">No saved applications yet. Finished apps are saved automatically when you start a new client.</p>
      ) : (
        savedApps.map((app) => (
          <div key={app.id} className="saved-app">
            <div className="saved-app-info">
              <strong>{app.label}</strong>
              <span className="small muted">{new Date(app.savedAt).toLocaleString()}</span>
            </div>
            <button type="button" onClick={() => onLoadApp(app.id)}>
              Load
            </button>
          </div>
        ))
      )}
    </aside>
  );
}

interface QuickFieldProps {
  label: string;
  k: string;
  data: CallData;
  setField: (key: string, value: string) => void;
}

function QuickField({ label, k, data, setField }: QuickFieldProps) {
  return (
    <div className="field">
      <label htmlFor={`snap-${k}`}>{label}</label>
      <input
        id={`snap-${k}`}
        value={data[k] ?? ""}
        onChange={(e) => setField(k, e.target.value)}
      />
    </div>
  );
}
