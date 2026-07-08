import { trainingAreas } from "./trainingQuestions.js";

/** Area names for launcher buttons, in order. */
export const areaNames = trainingAreas.map((a) => a.area);

interface TrainingDrawerProps {
  open: boolean;
  activeArea: string | null;
  onSelect: (area: string) => void;
  onClose: () => void;
}

export function TrainingDrawer({ open, activeArea, onSelect, onClose }: TrainingDrawerProps) {
  const active = trainingAreas.find((a) => a.area === activeArea) ?? trainingAreas[0]!;
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
            <h2>Digging Deep</h2>
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
          <p className="muted small">Discovery questions by area.</p>
          <div className="rebuttal-grid">
            {trainingAreas.map((a) => (
              <button
                key={a.area}
                type="button"
                className={a.area === active.area ? "primary" : ""}
                onClick={() => onSelect(a.area)}
              >
                {a.area}
              </button>
            ))}
          </div>
        </div>
        <div className="drawer-body">
          <p className="section-title">{active.area} Discovery</p>
          {active.scenarios.map((sc) => (
            <div key={sc.title} className="tq-card">
              <h3 className="tq-title">{sc.title}</h3>
              <p className="tq-why">{sc.why}</p>
              <ol className="tq-list">
                {sc.questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
