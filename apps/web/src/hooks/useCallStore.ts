import { useCallback, useEffect, useRef, useState } from "react";
import { brandFields, flow, rebuttals, sampleBrand, sectionOrder } from "@lf/call-script";
import type { CallData, CallState, RebuttalKey, SectionId } from "@lf/types";

const STORAGE_KEY = "lfGuidedCallV2";
// Brand lives in its own key so it persists across calls and survives "Clear All".
const BRAND_KEY = "lfBrandV1";

/** Read the saved personal brand from its dedicated key. */
function readBrand(): CallData {
  try {
    const raw = localStorage.getItem(BRAND_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw) as unknown;
    return obj && typeof obj === "object" ? (obj as CallData) : {};
  } catch {
    return {};
  }
}

/** Pull just the brand fields out of the full call data. */
function pickBrand(data: CallData): CallData {
  const out: CallData = {};
  for (const k of brandFields) {
    if (data[k]) out[k] = data[k];
  }
  return out;
}

const initialState: CallState = { section: "intro", index: 0, route: "" };

interface PersistShape {
  data: CallData;
  state: CallState;
}

function readSnapshot(): PersistShape | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as Partial<PersistShape>;
    if (!obj || typeof obj !== "object") return null;
    return {
      data: obj.data ?? {},
      state: obj.state ?? initialState
    };
  } catch {
    return null;
  }
}

/** Replace {{key}} placeholders in `text` with values from `data`. */
export function fillTemplate(text: string | undefined, data: CallData): string {
  return String(text ?? "").replace(/\{\{(.*?)\}\}/g, (_m, k: string) => {
    const key = k.trim();
    return data[key] || `{{${key}}}`;
  });
}

export interface UseCallStore {
  state: CallState;
  data: CallData;
  activeRebuttal: RebuttalKey | null;
  drawerOpen: boolean;
  screen: "guided" | "export";
  setField: (key: string, value: string) => void;
  startSection: (section: SectionId) => void;
  showExport: () => void;
  showGuided: () => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  handleRoute: (label: string, action: string) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  loadRebuttal: (key: RebuttalKey) => void;
  routeGoal: (goal: string) => void;
  save: () => void;
  load: () => void;
  clearAll: () => void;
}

export function useCallStore(): UseCallStore {
  // Hydrate synchronously from localStorage so the first render shows saved work.
  const initial = typeof window !== "undefined" ? readSnapshot() : null;
  const savedBrand = typeof window !== "undefined" ? readBrand() : {};
  const [state, setState] = useState<CallState>(initial?.state ?? initialState);
  // Brand key wins over the snapshot so the LO's saved brand is always present.
  const [data, setData] = useState<CallData>({ ...(initial?.data ?? {}), ...savedBrand });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeRebuttal, setActiveRebuttal] = useState<RebuttalKey | null>(null);
  const [screen, setScreen] = useState<"guided" | "export">("guided");

  // Auto-save: debounce writes so rapid typing doesn't thrash localStorage.
  const saveTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        const payload: PersistShape = { data, state };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        /* quota or privacy mode — ignore */
      }
    }, 250);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [data, state]);

  // Persist the personal brand to its own key whenever any brand field changes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(BRAND_KEY, JSON.stringify(pickBrand(data)));
    } catch {
      /* quota or privacy mode — ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.brandPositioning, data.brandWhy, data.brandProof]);

  const setField = useCallback((key: string, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
  }, []);

  const startSection = useCallback((section: SectionId) => {
    setState({ section, index: 0, route: "" });
    setScreen("guided");
  }, []);

  const showExport = useCallback(() => setScreen("export"), []);
  const showGuided = useCallback(() => setScreen("guided"), []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const loadRebuttal = useCallback((key: RebuttalKey) => {
    setActiveRebuttal(key);
    setDrawerOpen(true);
  }, []);

  const nextQuestion = useCallback(() => {
    setState((s) => {
      const arr = flow[s.section] ?? flow.intro;
      if (s.index < arr.length - 1) return { ...s, index: s.index + 1 };
      const nxtIdx = sectionOrder.indexOf(s.section) + 1;
      const nxt = sectionOrder[nxtIdx];
      if (nxt) return { section: nxt, index: 0, route: s.route };
      setScreen("export");
      return s;
    });
  }, []);

  const prevQuestion = useCallback(() => {
    setState((s) => {
      if (s.index > 0) return { ...s, index: s.index - 1 };
      const prvIdx = sectionOrder.indexOf(s.section) - 1;
      const prv = sectionOrder[prvIdx];
      if (prv) {
        const len = (flow[prv] ?? []).length;
        return { section: prv, index: Math.max(0, len - 1), route: s.route };
      }
      return s;
    });
  }, []);

  const routeGoal = useCallback((goal: string) => {
    setData((d) => ({ ...d, primaryGoal: goal }));
    setState({ section: "goals", index: 7, route: goal });
    setScreen("guided");
  }, []);

  const handleRoute = useCallback(
    (label: string, action: string) => {
      const parts = action.split(";");
      const updates: Record<string, string> = {};
      let finalAction = "";
      for (const part of parts) {
        if (part.startsWith("set:")) {
          const eq = part.slice(4).indexOf("=");
          if (eq >= 0) {
            const k = part.slice(4, 4 + eq);
            const v = part.slice(4 + eq + 1);
            updates[k] = v;
          }
        } else if (!finalAction) {
          finalAction = part;
        }
      }
      if (Object.keys(updates).length) {
        setData((d) => ({ ...d, ...updates }));
      }

      // Drop in the ready-made personal brand without navigating away.
      if (finalAction === "presetBrand") {
        setData((d) => ({ ...d, ...sampleBrand }));
        return;
      }

      // Conditional routing: when:key=value?actionIfTrue|actionIfFalse
      if (finalAction.startsWith("when:")) {
        const body = finalAction.slice("when:".length);
        const qm = body.indexOf("?");
        if (qm >= 0) {
          const cond = body.slice(0, qm);
          const [ifTrue = "", ifFalse = ""] = body.slice(qm + 1).split("|");
          const eq = cond.indexOf("=");
          const k = cond.slice(0, eq);
          const v = cond.slice(eq + 1);
          // Evaluate against current data plus any set: updates from this route.
          const merged = { ...data, ...updates };
          finalAction = merged[k] === v ? ifTrue : ifFalse;
        }
      }

      // Jump to a specific section AND index: at:<section>:<index>
      if (finalAction.startsWith("at:")) {
        const rest = finalAction.slice("at:".length);
        const ci = rest.lastIndexOf(":");
        const sec = rest.slice(0, ci) as SectionId;
        const idx = Number(rest.slice(ci + 1));
        setState({ section: sec, index: idx, route: label });
        return;
      }

      if (finalAction.startsWith("rebuttal:")) {
        setState((s) => ({ ...s, route: label }));
        const key = finalAction.slice("rebuttal:".length) as RebuttalKey;
        loadRebuttal(key);
        return;
      }
      if (finalAction === "drawer") {
        setState((s) => ({ ...s, route: label }));
        openDrawer();
        return;
      }
      if (finalAction.startsWith("jump:")) {
        const i = Number(finalAction.slice("jump:".length));
        setState((s) => ({ ...s, index: i, route: label }));
        return;
      }
      if (finalAction.startsWith("next:")) {
        const sec = finalAction.slice("next:".length) as SectionId;
        setState({ section: sec, index: 0, route: label });
        return;
      }
      if (finalAction === "export") {
        setState((s) => ({ ...s, route: label }));
        setScreen("export");
        return;
      }
      if (finalAction in flow) {
        setState({ section: finalAction as SectionId, index: 0, route: label });
      }
    },
    [data, loadRebuttal, openDrawer]
  );

  const save = useCallback(() => {
    // Auto-save runs on every change; this is just user feedback.
    try {
      const payload: PersistShape = { data, state };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
    alert("Saved.");
  }, [data, state]);

  const load = useCallback(() => {
    const snap = readSnapshot();
    if (!snap) return;
    setData(snap.data);
    setState(snap.state);
  }, []);

  const clearAll = useCallback(() => {
    if (!confirm("Clear all data? (Your saved personal brand will be kept.)")) return;
    localStorage.removeItem(STORAGE_KEY);
    // Keep the LO's brand — it lives in its own key and should survive a clear.
    setData(readBrand());
    setState(initialState);
    setScreen("guided");
  }, []);

  return {
    state,
    data,
    activeRebuttal,
    drawerOpen,
    screen,
    setField,
    startSection,
    showExport,
    showGuided,
    nextQuestion,
    prevQuestion,
    handleRoute,
    openDrawer,
    closeDrawer,
    loadRebuttal,
    routeGoal,
    save,
    load,
    clearAll
  };
}

export { rebuttals };
