import { flow, labelSection, sectionOrder } from "@lf/call-script";
import type { CallData, CallState } from "@lf/types";
import { Fields } from "./Fields.js";
import { fillTemplate } from "../hooks/useCallStore.js";

interface GuidedScreenProps {
  state: CallState;
  data: CallData;
  setField: (key: string, value: string) => void;
  onRoute: (label: string, action: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSave: () => void;
  onOpenDrawer: () => void;
}

export function GuidedScreen({
  state,
  data,
  setField,
  onRoute,
  onNext,
  onPrev,
  onSave,
  onOpenDrawer
}: GuidedScreenProps) {
  const arr = flow[state.section] ?? flow.intro;
  const q = arr[state.index] ?? arr[0]!;
  const progress = Math.round(((state.index + 1) / arr.length) * 100);

  return (
    <section>
      <div className="card">
        <p className="section-title">Live Call Flow</p>
        <div>
          <span className="badge blue">{labelSection(state.section)}</span>{" "}
          <span className="badge">
            Step {state.index + 1} of {arr.length}
          </span>{" "}
          <span className="badge green">{state.route || "No route selected"}</span>
        </div>
        <div className="progressbar">
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="question-card">
        <h2>{q.title}</h2>
        <div className="script">{fillTemplate(q.script, data)}</div>
        {q.coach && <div className="coach">{q.coach}</div>}
        <div style={{ marginTop: 16 }}>
          <Fields fields={q.fields ?? []} data={data} setField={setField} />
        </div>
        <div className="path-row">
          {(q.routes ?? []).map((r) => (
            <button
              key={r[0]}
              className="primary"
              onClick={() => onRoute(r[0], r[1] ?? "")}
            >
              {r[0]}
            </button>
          ))}
        </div>
      </div>
      <div className="path-row">
        <button onClick={onPrev} disabled={isAtStart(state)}>
          ← Previous
        </button>
        <button className="primary" onClick={onNext}>
          Next Question →
        </button>
        <button onClick={onSave}>Save</button>
        <button onClick={onOpenDrawer}>Open Rebuttals</button>
      </div>
    </section>
  );
}

function isAtStart(state: CallState): boolean {
  return state.section === sectionOrder[0] && state.index === 0;
}
