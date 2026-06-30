import { useCallStore } from "./hooks/useCallStore.js";
import { Sidebar } from "./components/Sidebar.js";
import { Snapshot } from "./components/Snapshot.js";
import { GuidedScreen } from "./components/GuidedScreen.js";
import { ExportScreen } from "./components/ExportScreen.js";
import { RebuttalDrawer } from "./components/RebuttalDrawer.js";

export function App() {
  const store = useCallStore();

  return (
    <>
      <button className="rebuttal-launch" onClick={store.openDrawer}>
        Rebuttals
      </button>

      <RebuttalDrawer
        open={store.drawerOpen}
        activeKey={store.activeRebuttal}
        data={store.data}
        setField={store.setField}
        onClose={store.closeDrawer}
        onSelect={store.loadRebuttal}
      />

      <header>
        <div className="brand-kicker">
          <span className="bar" /> Lending Force
        </div>
        <h1>Lending Force Guided Call Script</h1>
        <p>
          Branded in Lending Force colors with guided question flow, response routes,
          right-side rebuttal drawer, and export tools.
        </p>
      </header>

      <div className="layout">
        <Sidebar
          activeSection={store.state.section}
          screen={store.screen}
          onStartSection={store.startSection}
          onShowExport={store.showExport}
          onRouteGoal={store.routeGoal}
        />

        <main className="panel">
          {store.screen === "guided" ? (
            <GuidedScreen
              state={store.state}
              data={store.data}
              setField={store.setField}
              onRoute={store.handleRoute}
              onNext={store.nextQuestion}
              onPrev={store.prevQuestion}
              onSave={store.save}
              onOpenDrawer={store.openDrawer}
            />
          ) : (
            <ExportScreen data={store.data} onClear={store.clearAll} />
          )}
        </main>

        <Snapshot
          data={store.data}
          setField={store.setField}
          onSave={store.save}
          onLoad={store.load}
        />
      </div>
    </>
  );
}
