import React from "react";
import type { VisualizationMode } from "../types/element";
import { MODE_LABELS } from "../utils/colors";

interface PropertySelectorProps {
  mode: VisualizationMode;
  onModeChange: (mode: VisualizationMode) => void;
}

const MODES: VisualizationMode[] = [
  "category",
  "atomicRadius",
  "density",
  "yearDiscovered",
  "ionizationEnergy",
  "electronegativity",
];

const PropertySelector: React.FC<PropertySelectorProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] uppercase tracking-wider text-white/40 font-semibold mr-1">
        Visualizza:
      </span>
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onModeChange(m)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors
            ${
              mode === m
                ? "bg-fuchsia-400/20 border-fuchsia-300 text-fuchsia-100 shadow-[0_0_10px_rgba(232,121,249,0.35)]"
                : "bg-white/5 border-white/15 text-white/60 hover:border-fuchsia-300/50 hover:text-white"
            }`}
        >
          {MODE_LABELS[m]}
        </button>
      ))}
    </div>
  );
};

export default PropertySelector;
