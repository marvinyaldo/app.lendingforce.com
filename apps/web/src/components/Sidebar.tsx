import type { SectionId } from "@lf/types";

interface SidebarProps {
  activeSection: SectionId;
  screen: "guided" | "export";
  onStartSection: (s: SectionId) => void;
  onShowExport: () => void;
  onRouteGoal: (goal: string) => void;
}

const sections: { id: SectionId; label: string }[] = [
  { id: "intro", label: "Intro" },
  { id: "brand", label: "Personal Brand" },
  { id: "goals", label: "Goals" },
  { id: "property", label: "Property" },
  { id: "credit", label: "Credit" },
  { id: "liabilities", label: "Liabilities" },
  { id: "income", label: "Income" },
  { id: "assets", label: "Assets" },
  { id: "presentation", label: "Presentation" },
  { id: "propertyConditions", label: "Property Conditions" },
  { id: "declarations", label: "Declarations" }
];

export function Sidebar({
  activeSection,
  screen,
  onStartSection,
  onShowExport,
  onRouteGoal
}: SidebarProps) {
  return (
    <nav className="panel">
      <div className="brand-card">
        <span className="lf-bar" />
        <div className="lf-title">LENDING FORCE</div>
        <div className="lf-sub">Guided Call Navigator</div>
      </div>
      <p className="section-title">Guided Sections</p>
      {sections.map((s) => (
        <button
          key={s.id}
          className={`navbtn${screen === "guided" && activeSection === s.id ? " active" : ""}`}
          onClick={() => onStartSection(s.id)}
        >
          {s.label}
        </button>
      ))}
      <button
        className={`navbtn${screen === "export" ? " active" : ""}`}
        onClick={onShowExport}
      >
        Export
      </button>
      <hr />
      <p className="section-title">Quick Route</p>
      <div className="jump">
        <button onClick={() => onRouteGoal("Debt consolidation")}>Debt</button>
        <button onClick={() => onRouteGoal("Lower payment")}>Payment</button>
        <button onClick={() => onRouteGoal("Cash out")}>Cash Out</button>
        <button onClick={() => onRouteGoal("Home improvement")}>Renovation</button>
      </div>
    </nav>
  );
}
