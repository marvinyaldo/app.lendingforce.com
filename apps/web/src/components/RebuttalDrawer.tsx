import { rebuttals } from "@lf/call-script";
import type { CallData, RebuttalKey } from "@lf/types";

interface RebuttalDrawerProps {
  open: boolean;
  activeKey: RebuttalKey | null;
  data: CallData;
  setField: (key: string, value: string) => void;
  onClose: () => void;
  onSelect: (key: RebuttalKey) => void;
}

const order: { key: RebuttalKey; label: string }[] = [
  { key: "notInterested", label: "Not Interested" },
  { key: "busy", label: "Busy" },
  { key: "sendInfo", label: "Send Info" },
  { key: "creditPull", label: "Credit Concern" },
  { key: "lowRate", label: "Low Rate" },
  { key: "closingCosts", label: "Closing Costs" },
  { key: "thinkAboutIt", label: "Think About It" },
  { key: "spouse", label: "Talk to Spouse" },
  { key: "paymentHigh", label: "Payment High" },
  { key: "bank", label: "Working With Bank" }
];

export function RebuttalDrawer({
  open,
  activeKey,
  data,
  setField,
  onClose,
  onSelect
}: RebuttalDrawerProps) {
  const active = activeKey ? rebuttals[activeKey] : null;
  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} />}
      <div className={`drawer${open ? " open" : ""}`}>
        <div className="drawer-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              alignItems: "center"
            }}
          >
            <h2>Rebuttal Drawer</h2>
            <button onClick={onClose}>Close</button>
          </div>
          <p className="muted small">
            Accessible anytime without leaving the current question.
          </p>
        </div>
        <div className="drawer-body">
          <p className="section-title">Client Response</p>
          <div className="rebuttal-grid">
            {order.map((o) => (
              <button key={o.key} onClick={() => onSelect(o.key)}>
                {o.label}
              </button>
            ))}
          </div>
          <h3>{active ? active[0] : "Select a rebuttal"}</h3>
          <div className="rebuttal-output">
            {active ? active[1] : "The selected rebuttal will appear here."}
          </div>
          <div className="coach">
            Use the control question at the end, then return to the current call path.
          </div>
          <div className="field">
            <label htmlFor="objection-notes">Objection Notes</label>
            <textarea
              id="objection-notes"
              value={data.objectionNotes ?? ""}
              onChange={(e) => setField("objectionNotes", e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
