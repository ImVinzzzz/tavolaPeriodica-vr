import { useMemo, Fragment, type FC } from "react";
import { type ElementData, type VisualizationMode } from "../types/element";
import ElementCell from "./ElementCell";
import { computeRange } from "../utils/colors";

interface PeriodicTableProps {
  elements: ElementData[];
  mode: VisualizationMode;
  matches: (el: ElementData) => boolean;
  onSelect: (el: ElementData) => void;
}

const GROUPS = Array.from({ length: 18 }, (_, i) => i + 1);
const PERIODS = Array.from({ length: 7 }, (_, i) => i + 1);
// Lantanoidi staccati: da 57 (La) a 70 (Yb) (14 elementi); Lu (71) sta nel Gruppo 3 Periodo 6
// Attinoidi staccati: da 89 (Ac) a 102 (No) (14 elementi); Lr (103) sta nel Gruppo 3 Periodo 7
const LANTHANIDE_SERIES_RANGE = [57, 70];
const ACTINIDE_SERIES_RANGE = [89, 102];

// Template colonne: Periodo (2.25rem) | Gr.1 | Gr.2 | Separatore (1.125rem) | Gr.3..18 | Periodo (2.25rem)
const gridTemplateColumns =
  "2.25rem minmax(2.25rem, 1fr) minmax(2.25rem, 1fr) minmax(1.125rem, 0.5fr) repeat(16, minmax(2.25rem, 1fr)) 2.25rem";

const PeriodicTable: FC<PeriodicTableProps> = ({ elements, mode, matches, onSelect }) => {
  const range = useMemo(() => computeRange(elements, mode), [elements, mode]);

  const { byPosition, lanthanides, actinides } = useMemo(() => {
    const byPositionMap = new Map<string, ElementData>();
    const lanthanidesList: ElementData[] = [];
    const actinidesList: ElementData[] = [];

    for (const el of elements) {
      const inLaSeries = el.number >= LANTHANIDE_SERIES_RANGE[0] && el.number <= LANTHANIDE_SERIES_RANGE[1];
      const inAcSeries = el.number >= ACTINIDE_SERIES_RANGE[0] && el.number <= ACTINIDE_SERIES_RANGE[1];

      if (inLaSeries) {
        lanthanidesList.push(el);
        continue;
      }
      if (inAcSeries) {
        actinidesList.push(el);
        continue;
      }

      // Elementi normali + Lu (71) e Lr (103) posizionati in base a period e group
      byPositionMap.set(el.period + "-" + el.group, el);
    }

    lanthanidesList.sort((a, b) => a.number - b.number);
    actinidesList.sort((a, b) => a.number - b.number);

    return { byPosition: byPositionMap, lanthanides: lanthanidesList, actinides: actinidesList };
  }, [elements]);

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[1100px]">
        {/* Griglia principale con separatore tra Gruppo 2 e Gruppo 3 */}
        <div className="grid gap-1" style={{ gridTemplateColumns }}>
          {/* Riga intestazione gruppi */}
          <div />
          {/* Gruppo 1 e 2 */}
          <div className="text-center text-[10px] sm:text-xs text-sky-300/80 font-semibold pb-1">1</div>
          <div className="text-center text-[10px] sm:text-xs text-sky-300/80 font-semibold pb-1">2</div>
          {/* Spazio sopra il separatore */}
          <div />
          {/* Gruppi 3..18 */}
          {GROUPS.slice(2).map((g) => (
            <div
              key={"g-" + g}
              className="text-center text-[10px] sm:text-xs text-sky-300/80 font-semibold pb-1"
            >
              {g}
            </div>
          ))}
          <div />

          {/* Righe dei periodi (1..7) */}
          {PERIODS.map((p) => (
            <Fragment key={"row-" + p}>
              {/* Etichetta periodo sinistra */}
              <div className="flex items-center justify-center text-[10px] sm:text-xs text-sky-300/80 font-semibold">
                {p}
              </div>

              {/* Gruppo 1 e 2 */}
              {[1, 2].map((g) => {
                const el = byPosition.get(p + "-" + g);
                if (!el) return <div key={p + "-" + g} />;
                return (
                  <ElementCell
                    key={p + "-" + g}
                    element={el}
                    mode={mode}
                    range={range}
                    dimmed={!matches(el)}
                    onSelect={onSelect}
                  />
                );
              })}

              {/* Colonna Separatore tra Gruppo 2 e 3 */}
              {p === 6 ? (
                <div className="aspect-square border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/50 text-xs font-bold select-none">
                  *
                </div>
              ) : p === 7 ? (
                <div className="aspect-square border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/50 text-xs font-bold select-none">
                  **
                </div>
              ) : (
                <div />
              )}

              {/* Gruppi 3..18 */}
              {GROUPS.slice(2).map((g) => {
                const el = byPosition.get(p + "-" + g);
                if (!el) return <div key={p + "-" + g} />;
                return (
                  <ElementCell
                    key={p + "-" + g}
                    element={el}
                    mode={mode}
                    range={range}
                    dimmed={!matches(el)}
                    onSelect={onSelect}
                  />
                );
              })}

              {/* Etichetta periodo destra */}
              <div className="flex items-center justify-center text-[10px] sm:text-xs text-sky-300/80 font-semibold">
                {p}
              </div>
            </Fragment>
          ))}
        </div>

        {/* Serie staccate: Lantanoidi (57-70) ed Attinoidi (89-102) */}
        <div className="mt-3 grid gap-1" style={{ gridTemplateColumns }}>
          <div />
          {/* Spazio per Gruppo 1 e 2 */}
          <div className="col-span-2" />
          {/* Segnaposto * colonna separatore */}
          <div className="flex items-center justify-center text-[10px] sm:text-xs text-pink-300/80 font-semibold">
            *
          </div>
          {lanthanides.map((el) => (
            <ElementCell
              key={el.number}
              element={el}
              mode={mode}
              range={range}
              dimmed={!matches(el)}
              onSelect={onSelect}
            />
          ))}
          {/* Spazio vuoto rimanente (col-span-2 per coprire gli ultimi due gruppi e l'etichetta) */}
          <div className="col-span-3" />
        </div>

        <div className="mt-1 grid gap-1" style={{ gridTemplateColumns }}>
          <div />
          {/* Spazio per Gruppo 1 e 2 */}
          <div className="col-span-2" />
          {/* Segnaposto ** colonna separatore */}
          <div className="flex items-center justify-center text-[10px] sm:text-xs text-pink-400/80 font-semibold">
            **
          </div>
          {actinides.map((el) => (
            <ElementCell
              key={el.number}
              element={el}
              mode={mode}
              range={range}
              dimmed={!matches(el)}
              onSelect={onSelect}
            />
          ))}
          {/* Spazio vuoto rimanente */}
          <div className="col-span-3" />
        </div>
      </div>
    </div>
  );
};

export default PeriodicTable;
