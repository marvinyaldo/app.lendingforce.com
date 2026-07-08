import { useCallStore } from "./hooks/useCallStore.js";
import { Sidebar } from "./components/Sidebar.js";
import { Snapshot } from "./components/Snapshot.js";
import { GuidedScreen } from "./components/GuidedScreen.js";
import { ExportScreen } from "./components/ExportScreen.js";
import { RebuttalDrawer } from "./components/RebuttalDrawer.js";
import { TrainingDrawer } from "./components/TrainingDrawer.js";
import { PinGate } from "./components/PinGate.js";

export function App() {
  return (
    <PinGate>
      <AppInner />
    </PinGate>
  );
}

function AppInner() {
  const store = useCallStore();

  return (
    <>
      <button className="rebuttal-launch" type="button" onClick={store.openDrawer}>
        Rebuttals
      </button>

      <button className="training-launch" type="button" onClick={() => store.openTraining()}>
        Digging Deep
      </button>

      <RebuttalDrawer
        open={store.drawerOpen}
        activeKey={store.activeRebuttal}
        data={store.data}
        setField={store.setField}
        onClose={store.closeDrawer}
        onSelect={store.loadRebuttal}
      />

      <TrainingDrawer
        open={store.trainingOpen}
        activeArea={store.activeArea}
        onSelect={store.openTraining}
        onClose={store.closeTraining}
      />

      <header>
        <div className="brand-kicker">
          <span className="bar" /> Lending Force
        </div>
        <h1>Lending Force Guided Call Script</h1>
      </header>

      <div className="layout">
        <Sidebar
          activeSection={store.state.section}
          screen={store.screen}
          onStartSection={store.startSection}
          onShowExport={store.showExport}
          onRouteGoal={store.routeGoal}
          onOpenTraining={store.openTraining}
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
