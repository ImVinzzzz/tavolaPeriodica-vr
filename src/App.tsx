import React, { useMemo, useState, useCallback } from "react";
import { elementsData } from "./data/elementsData";
import type { ElementData, StateFilter, VisualizationMode } from "./types/element";
import SearchBar from "./components/SearchBar";
import PropertySelector from "./components/PropertySelector";
import PeriodicTable from "./components/PeriodicTable";
import ElementModal from "./components/ElementModal";
import Legend from "./components/Legend";

const App: React.FC = () => {
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<StateFilter>("all");
  const [mode, setMode] = useState<VisualizationMode>("category");
  const [selected, setSelected] = useState<ElementData | null>(null);

  const matches = useCallback(
    (el: ElementData): boolean => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        el.name.toLowerCase().includes(q) ||
        el.symbol.toLowerCase().includes(q) ||
        String(el.number) === q;
      const matchesState = stateFilter === "all" || el.stateOfMatter === stateFilter;
      return matchesQuery && matchesState;
    },
    [query, stateFilter]
  );

  const handleReset = () => {
    setQuery("");
    setStateFilter("all");
  };

  const activeCount = useMemo(() => elementsData.filter(matches).length, [matches]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <header className="px-4 sm:px-8 pt-8 pb-4">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-300 via-cyan-200 to-fuchsia-300 bg-clip-text text-transparent">
            Tavola Periodica Interattiva
          </h1>
          <p className="text-white/50 text-sm mt-1">
            118 elementi · {activeCount} corrispondenti ai filtri attuali
          </p>
        </div>
      </header>

      <main className="px-4 sm:px-8 pb-16">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4 flex flex-col gap-4">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              stateFilter={stateFilter}
              onStateFilterChange={setStateFilter}
              onReset={handleReset}
            />
            <div className="h-px bg-white/10" />
            <PropertySelector mode={mode} onModeChange={setMode} />
          </div>

          <PeriodicTable elements={elementsData} mode={mode} matches={matches} onSelect={setSelected} />

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4">
            <Legend elements={elementsData} mode={mode} />
          </div>
        </div>
      </main>

      <ElementModal element={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default App;
