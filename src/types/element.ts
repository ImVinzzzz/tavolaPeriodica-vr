// Tipi centrali dell'applicazione "Tavola Periodica Interattiva".

/** Le 10 categorie chimiche usate per la colorazione della tavola. */
export type CategoryType =
  | "Metalli alcalini"
  | "Metalli alcalino terrosi"
  | "Lantanoidi"
  | "Attinoidi"
  | "Elementi di transizione"
  | "Metalli del blocco p"
  | "Semimetalli"
  | "Non metalli"
  | "Alogeni"
  | "Gas nobili";

/** Stato della materia a temperatura ambiente (20 °C). */
export type StateOfMatter = "solid" | "liquid" | "gas" | "synthetic";

/** Le modalità di visualizzazione/evidenziazione della tavola. */
export type VisualizationMode =
  | "category"
  | "atomicRadius"
  | "density"
  | "yearDiscovered"
  | "ionizationEnergy"
  | "electronegativity";

/** Filtro rapido per stato della materia (include "all"). */
export type StateFilter = "all" | StateOfMatter;

export interface ElementData {
  /** Numero atomico (1-118) */
  number: number;
  /** Simbolo chimico, es. "H", "Fe", "Og" */
  symbol: string;
  /** Nome in italiano */
  name: string;
  /** Categoria chimica */
  category: CategoryType;
  /** Stato della materia a t.a. */
  stateOfMatter: StateOfMatter;
  /** Numero di gruppo (1-18) */
  group: number;
  /** Numero di periodo (1-7) */
  period: number;
  /** Peso atomico standard (u) */
  atomicWeight: number;
  /** Prima energia di ionizzazione in kJ/mol (null se non misurata) */
  ionizationEnergy: number | null;
  /** Elettronegatività, scala di Pauling (null se non definita/misurata) */
  electronegativity: number | null;
  /** Stati di ossidazione principali, come stringa leggibile */
  oxidationStates: string;
  /** Configurazione elettronica (forma semantica, es. "[Ar] 3d6 4s2") */
  electronConfiguration: string;
  /** Raggio atomico in pm (null se non disponibile) */
  atomicRadius: number | null;
  /** Densità in g/cm³ (o g/L per i gas), null se non misurata */
  density: number | null;
  /** Anno di scoperta (numero) o stringa per elementi noti sin dall'antichità */
  yearDiscovered: number | string;
  /** true se l'elemento è radioattivo */
  isRadioactive: boolean;
  /** Nota sintetica sugli isotopi principali */
  isotopesNote: string;
  /** Link alla pagina Wikipedia in italiano */
  wikiUrl: string;
  /** URL placeholder per l'immagine dell'elemento */
  imageUrl: string;
}

/** Voce di legenda generica, usata sia in modalità categoria che heatmap. */
export interface LegendEntry {
  label: string;
  color: string;
}
