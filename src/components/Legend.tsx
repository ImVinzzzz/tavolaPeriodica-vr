import React from "react";
import type { ElementData, VisualizationMode } from "../types/element";
import { CATEGORY_COLORS, CATEGORY_ORDER, MODE_LABELS, computeRange } from "../utils/colors";

interface LegendProps {
  elements: ElementData[];
  mode: VisualizationMode;
}

const Legend: React.FC<LegendProps> = ({ elements, mode }) => {
  if (mode === "category") {
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {CATEGORY_ORDER.map((cat) => (
          <div key={cat} className="flex items-center gap-1.5 text-[11px] text-white/70">
            <span
              className="w-3 h-3 rounded-sm border border-white/30 shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[cat] }}
            />
            {cat}
          </div>
        ))}
      </div>
    );
  }

  const range = computeRange(elements, mode);

  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-white/60 whitespace-nowrap">{MODE_LABELS[mode]}</span>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-sky-300 font-mono">
          {range ? Math.round(range.min * 100) / 100 : "N/D"}
        </span>
        <div
          className="w-32 sm:w-48 h-2.5 rounded-full border border-white/20"
          style={{
            background: "linear-gradient(90deg, rgb(59, 112, 151), rgb(163, 132, 56), rgb(158, 71, 68))",
          }}
        />
        <span className="text-[11px] text-red-300 font-mono">
          {range ? Math.round(range.max * 100) / 100 : "N/D"}
        </span>
      </div>
      <span className="text-[10px] text-white/40 italic">grigio = dato non disponibile / non criticamente valutato</span>
    </div>
  );
};

export default Legend;
