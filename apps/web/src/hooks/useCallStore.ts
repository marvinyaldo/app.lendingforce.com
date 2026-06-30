import { useCallback, useState } from "react";
import { flow, rebuttals, sectionOrder } from "@lf/call-script";
import type { CallData, CallState, RebuttalKey, SectionId } from "@lf/types";

const STORAGE_KEY = "lfGuidedCallV2";

const initialState: CallState = { section: "intro", index: 0, route: "" };

interface PersistShape {
  data: CallData;
  state: CallState;
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
  const [state, setState] = useState<CallState>(initialState);
  const [data, setData] = useState<CallData>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeRebuttal, setActiveRebuttal] = useState<RebuttalKey | null>(null);
  const [screen, setScreen] = useState<"guided" | "export">("guided");

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
    [loadRebuttal, openDrawer]
  );

  const save = useCallback(() => {
    const payload: PersistShape = { data, state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    alert("Saved.");
  }, [data, state]);

  const load = useCallback(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const obj = JSON.parse(raw) as Partial<PersistShape>;
      if (obj.data) setData(obj.data);
      if (obj.state) setState(obj.state);
    } catch {
      /* ignore malformed payload */
    }
  }, []);

  const clearAll = useCallback(() => {
    if (!confirm("Clear all data?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setData({});
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
