import { trainingDecks, decks } from "./trainingQuestions.js";

export { decks };

interface TrainingDrawerProps {
  open: boolean;
  activeDeck: string | null;
  onSelect: (deck: string) => void;
  onClose: () => void;
}

export function TrainingDrawer({ open, activeDeck, onSelect, onClose }: TrainingDrawerProps) {
  const active = trainingDecks.find((d) => d.key === activeDeck) ?? trainingDecks[0]!;
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
          <p className="muted small">Discovery questions to ask, by scenario.</p>
          <div className="rebuttal-grid">
            {decks.map((d) => (
              <button
                key={d.key}
                type="button"
                className={d.key === active.key ? "primary" : ""}
                onClick={() => onSelect(d.key)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div className="drawer-body">
          {active.areas.map((area) => (
            <div key={area.area}>
              <p className="section-title">{area.area} Discovery</p>
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
