import { useMemo, memo, type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRadiation } from "@fortawesome/free-solid-svg-icons";
import { type ElementData, type VisualizationMode } from "../types/element";
import { getElementColor, getNumericValue } from "../utils/colors";

interface ElementCellProps {
  element: ElementData;
  mode: VisualizationMode;
  range: { min: number; max: number } | null;
  /** true se la casella deve risultare offuscata (non corrisponde a ricerca/filtro) */
  dimmed: boolean;
  onSelect: (el: ElementData) => void;
  /** true per le due caselle segnaposto "*" e "**" nella griglia principale */
  placeholder?: "lanthanide" | "actinide";
}

function formatBottomValue(el: ElementData, mode: VisualizationMode): string {
  if (mode === "category") return el.name;
  const value = getNumericValue(el, mode);
  if (value === null) return "N/D";
  if (mode === "yearDiscovered") {
    return typeof el.yearDiscovered === "number" ? String(el.yearDiscovered) : el.yearDiscovered;
  }
  return String(value);
}

const ElementCell: FC<ElementCellProps> = ({
  element,
  mode,
  range,
  dimmed,
  onSelect,
  placeholder,
}) => {
  const color = useMemo(() => getElementColor(element, mode, range), [element, mode, range]);

  if (placeholder) {
    const label = placeholder === "lanthanide" ? "*" : "**";
    return (
      <div className="aspect-square border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/40 text-sm font-semibold select-none">
        {label}
      </div>
    );
  }

  const isCategoryMode = mode === "category";

  return (
    <button
      type="button"
      onClick={() => onSelect(element)}
      className={
        "group relative aspect-square rounded-lg p-1 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 " +
        (isCategoryMode ? "border-transparent " : "border-2 ") +
        (dimmed ? "opacity-20 blur-[0.5px] scale-95" : "opacity-100 scale-100 hover:scale-[1.06] hover:z-10")
      }
      style={{
        transformOrigin: "center",
        borderColor: isCategoryMode ? "transparent" : color,
      }}
      title={element.name + " (" + element.symbol + ")"}
    >
      <div
        className="relative h-full w-full rounded-md flex flex-col justify-between overflow-hidden px-1 py-0.5"
        style={{
          backgroundColor: color,
          boxShadow: dimmed ? "none" : "0 1px 3px rgba(0, 0, 0, 0.4)",
          border: "1px solid " + (isCategoryMode ? "rgba(255, 255, 255, 0.15)" : color),
        }}
      >
        <div className="flex items-start justify-between text-[10px] sm:text-xs leading-none">
          <span className="text-white/80">
            {element.isRadioactive && (
              <FontAwesomeIcon icon={faRadiation} className="text-amber-300 drop-shadow" />
            )}
          </span>
          <span className="font-semibold text-white/90">{element.number}</span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <span className="text-lg sm:text-2xl font-extrabold text-white drop-shadow-sm tracking-tight">
            {element.symbol}
          </span>
        </div>

        <div className="text-center text-[8px] sm:text-[10px] font-medium text-white/85 truncate leading-tight">
          {formatBottomValue(element, mode)}
        </div>
      </div>
    </button>
  );
};

export default memo(ElementCell);
