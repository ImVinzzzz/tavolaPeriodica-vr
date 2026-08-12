import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import type { StateFilter } from "../types/element";

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  stateFilter: StateFilter;
  onStateFilterChange: (value: StateFilter) => void;
  onReset: () => void;
}

const STATE_OPTIONS: { value: StateFilter; label: string }[] = [
  { value: "all", label: "Tutti" },
  { value: "solid", label: "Solido" },
  { value: "liquid", label: "Liquido" },
  { value: "gas", label: "Gassoso" },
  { value: "synthetic", label: "Sintetico" },
];

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  stateFilter,
  onStateFilterChange,
  onReset,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between w-full">
      <div className="relative w-full sm:max-w-xs">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-300/70 text-sm"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cerca per nome, simbolo o numero..."
          className="w-full bg-white/5 border border-sky-400/30 rounded-full py-2 pl-9 pr-9 text-sm text-white
            placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400/60
            backdrop-blur-sm transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            aria-label="Cancella ricerca"
          >
            <FontAwesomeIcon icon={faXmark} className="text-sm" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onStateFilterChange(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors
              ${
                stateFilter === opt.value
                  ? "bg-sky-400/20 border-sky-300 text-sky-100 shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                  : "bg-white/5 border-white/15 text-white/60 hover:border-sky-300/50 hover:text-white"
              }`}
          >
            {opt.label}
          </button>
        ))}

        <button
          type="button"
          onClick={onReset}
          className="ml-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/15 text-white/60
            hover:border-red-300/50 hover:text-red-200 transition-colors flex items-center gap-1.5"
        >
          <FontAwesomeIcon icon={faArrowRotateLeft} className="text-[10px]" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
