import { useMemo, useState, useCallback, type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { elementsData } from "./data/elementsData";
import { type ElementData, type StateFilter, type VisualizationMode } from "./types/element";
import SearchBar from "./components/SearchBar";
import PropertySelector from "./components/PropertySelector";
import PeriodicTable from "./components/PeriodicTable";
import ElementModal from "./components/ElementModal";
import Legend from "./components/Legend";
import QuizModal from "./components/QuizModal";

const App: FC = () => {
  const [query, setQuery] = useState<string>("");
  const [stateFilter, setStateFilter] = useState<StateFilter>("all");
  const [mode, setMode] = useState<VisualizationMode>("category");
  const [selected, setSelected] = useState<ElementData | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);

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
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-300 via-cyan-200 to-fuchsia-300 bg-clip-text text-transparent">
              {"Tavola Periodica Interattiva"}
            </h1>
            <p className="text-white/50 text-sm mt-1">
              {"118 elementi · " + activeCount + " corrispondenti ai filtri attuali"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsQuizOpen(true)}
            className="self-start sm:self-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-fuchsia-600 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2.5 border border-white/10"
          >
            <FontAwesomeIcon icon={faGraduationCap} className="text-base" />
            <span>{"Modalità Quiz"}</span>
          </button>
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

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        elements={elementsData}
      />
    </div>
  );
};

export default App;
