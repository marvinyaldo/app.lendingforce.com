interface TrainingDrawerProps {
  open: boolean;
  activeDeck: string | null;
  onSelect: (deck: string) => void;
  onClose: () => void;
}

/** The "Digging Deep" training decks, served as static files from /public. */
export const decks: { key: string; label: string; src: string }[] = [
  {
    key: "goals",
    label: "Goals & Income",
    src: "/training/digging-deep-goals-income.html"
  },
  {
    key: "assets",
    label: "Assets & Property",
    src: "/training/digging-deep-assets-property.html"
  }
];

export function TrainingDrawer({ open, activeDeck, onSelect, onClose }: TrainingDrawerProps) {
  const active = decks.find((d) => d.key === activeDeck) ?? decks[0]!;
  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} />}
      <div className={`training-drawer${open ? " open" : ""}`}>
        <div className="training-drawer-header">
          <div className="training-tabs">
            <span className="section-title" style={{ margin: 0 }}>
              Digging Deep · Training
            </span>
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
          <div className="training-actions">
            <a className="training-popout" href={active.src} target="_blank" rel="noreferrer">
              Open full screen ↗
            </a>
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
        <div className="training-frame-wrap">
          {open && (
            <iframe
              key={active.key}
              className="training-frame"
              src={active.src}
              title={`Digging Deep — ${active.label}`}
            />
          )}
        </div>
      </div>
    </>
  );
}
