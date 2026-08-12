import type { CategoryType, ElementData, VisualizationMode } from "../types/element";

/** Colore associato a ciascuna categoria chimica, come da schema richiesto. */
export const CATEGORY_COLORS: Record<CategoryType, string> = {
  "Metalli alcalini": "#b85252",
  "Metalli alcalino terrosi": "#b37e34",
  Lantanoidi: "#9a5d8f",
  Attinoidi: "#75426b",
  "Elementi di transizione": "#524370",
  "Metalli del blocco p": "#686d80",
  Semimetalli: "#665d2c",
  "Non metalli": "#3e7c58",
  Alogeni: "#9c8942",
  "Gas nobili": "#3d7d9e",
};

export const CATEGORY_ORDER: CategoryType[] = [
  "Metalli alcalini",
  "Metalli alcalino terrosi",
  "Elementi di transizione",
  "Lantanoidi",
  "Attinoidi",
  "Metalli del blocco p",
  "Semimetalli",
  "Non metalli",
  "Alogeni",
  "Gas nobili",
];

/** Etichette leggibili per ciascuna modalità di visualizzazione. */
export const MODE_LABELS: Record<VisualizationMode, string> = {
  category: "Categoria chimica",
  atomicRadius: "Raggio atomico (pm)",
  density: "Densità (g/cm³)",
  yearDiscovered: "Anno di scoperta",
  ionizationEnergy: "Energia di ionizzazione (kJ/mol)",
  electronegativity: "Elettronegatività (Pauling)",
};

/** Estrae il valore numerico rilevante per una data modalità di heatmap. */
export function getNumericValue(el: ElementData, mode: VisualizationMode): number | null {
  switch (mode) {
    case "atomicRadius":
      return el.atomicRadius;
    case "density":
      return el.density;
    case "yearDiscovered":
      return typeof el.yearDiscovered === "number" ? el.yearDiscovered : 0; // "Antichità" -> più antico
    case "ionizationEnergy":
      return el.ionizationEnergy;
    case "electronegativity":
      return el.electronegativity;
    default:
      return null;
  }
}

/** Interpola tra azzurro avio (min) e rosso opaco (max), passando per l'ocra. */
export function heatColor(value: number, min: number, max: number): string {
  if (max === min) return "rgb(61, 125, 158)";
  const t = Math.min(1, Math.max(0, (value - min) / (max - min)));

  // Stops: azzurro avio -> ocra -> rosso opaco
  const stops: [number, number, number][] = [
    [61, 125, 158],
    [156, 137, 66],
    [184, 82, 82],
  ];

  const scaled = t * (stops.length - 1);
  const idx = Math.min(stops.length - 2, Math.floor(scaled));
  const localT = scaled - idx;
  const [r1, g1, b1] = stops[idx];
  const [r2, g2, b2] = stops[idx + 1];
  const r = Math.round(r1 + (r2 - r1) * localT);
  const g = Math.round(g1 + (g2 - g1) * localT);
  const b = Math.round(b1 + (b2 - b1) * localT);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

/** Calcola il colore di una casella per la modalità di visualizzazione corrente. */
export function getElementColor(
  el: ElementData,
  mode: VisualizationMode,
  range: { min: number; max: number } | null
): string {
  if (mode === "category") return CATEGORY_COLORS[el.category];
  const value = getNumericValue(el, mode);
  if (value === null || !range) return "#475569"; // slate-600: dato non disponibile
  return heatColor(value, range.min, range.max);
}

/** Calcola il range min/max per una modalità di heatmap sull'intero dataset. */
export function computeRange(
  elements: ElementData[],
  mode: VisualizationMode
): { min: number; max: number } | null {
  if (mode === "category") return null;
  const values = elements
    .map((e) => getNumericValue(e, mode))
    .filter((v): v is number => v !== null);
  if (values.length === 0) return null;
  return { min: Math.min(...values), max: Math.max(...values) };
}
