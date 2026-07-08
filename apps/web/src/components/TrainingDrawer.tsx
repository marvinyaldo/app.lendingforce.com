import { trainingAreas } from "./trainingQuestions.js";

interface TrainingDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function TrainingDrawer({ open, onClose }: TrainingDrawerProps) {
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
          <p className="muted small">
            Discovery questions by area — Goals, Income, Property, Assets, Credit.
          </p>
        </div>
        <div className="drawer-body">
          {trainingAreas.map((area) => (
            <div key={area.area}>
              <p className="section-title">{area.area}</p>
              {area.scenarios.map((sc) => (
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
          ))}
        </div>
      </div>
    </>
  );
}
