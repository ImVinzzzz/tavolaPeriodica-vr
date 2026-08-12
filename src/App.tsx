import { useMemo, useState, useCallback, type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faGamepad, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { elementsData } from "./data/elementsData";
import { type ElementData, type StateFilter, type VisualizationMode } from "./types/element";
import SearchBar from "./components/SearchBar";
import PropertySelector from "./components/PropertySelector";
import PeriodicTable from "./components/PeriodicTable";
import ElementModal from "./components/ElementModal";
import Legend from "./components/Legend";
import QuizModal from "./components/QuizModal";
import ReadmeModal from "./components/ReadmeModal";
import Footer from "./components/Footer";

const App: FC = () => {
  const [query, setQuery] = useState<string>("");
  const [stateFilter, setStateFilter] = useState<StateFilter>("all");
  const [mode, setMode] = useState<VisualizationMode>("category");
  const [selected, setSelected] = useState<ElementData | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [isReadmeOpen, setIsReadmeOpen] = useState<boolean>(false);

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
      {/* Header Applicazione */}
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

          {/* Pulsante Quiz nell'Header */}
          <button
            type="button"
            onClick={() => setIsQuizOpen(true)}
            className="self-start sm:self-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-fuchsia-600 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/60 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2.5 border border-white/20"
          >
            <FontAwesomeIcon icon={faGraduationCap} className="text-lg text-sky-200" />
            <span>{"Modalità Quiz"}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-8 pb-16">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-5">
          {/* Barra di ricerca e filtri */}
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

          {/* Griglia della Tavola Periodica */}
          <PeriodicTable elements={elementsData} mode={mode} matches={matches} onSelect={setSelected} />

          {/* Legenda */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4">
            <Legend elements={elementsData} mode={mode} />
          </div>

          {/* Banner d'invito al Quiz posizionato in basso */}
          <div className="rounded-2xl border border-sky-400/30 bg-gradient-to-r from-sky-900/40 via-indigo-900/30 to-purple-900/40 backdrop-blur-md p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="p-3.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-md">
                <FontAwesomeIcon icon={faGamepad} className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>{"Vuoi mettere alla prova la tua conoscenza chimica?"}</span>
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  {"Affronta la Modalità Quiz con sfide a tempo, streak e livelli di difficoltà."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsQuizOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2.5 whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faTrophy} className="text-amber-300" />
              <span>{"Avvia Quiz Ora"}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer con Fonti e Disclaimer */}
      <Footer onOpenReadme={() => setIsReadmeOpen(true)} />

      {/* Modale Dettaglio Elemento */}
      <ElementModal element={selected} onClose={() => setSelected(null)} />

      {/* Modale Quiz Interattivo */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        elements={elementsData}
      />

      {/* Modale Documentazione README */}
      <ReadmeModal
        isOpen={isReadmeOpen}
        onClose={() => setIsReadmeOpen(false)}
      />
    </div>
  );
};

export default App;

