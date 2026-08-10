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
const LANTHANIDE_RANGE = [57, 71];
const ACTINIDE_RANGE = [89, 103];

const gridTemplateColumns = "2.25rem repeat(18, minmax(2.25rem, 1fr)) 2.25rem";

const PeriodicTable: FC<PeriodicTableProps> = ({ elements, mode, matches, onSelect }) => {
  const range = useMemo(() => computeRange(elements, mode), [elements, mode]);

  const { byPosition, lanthanides, actinides } = useMemo(() => {
    const byPositionMap = new Map<string, ElementData>();
    const lanthanidesList: ElementData[] = [];
    const actinidesList: ElementData[] = [];

    for (const el of elements) {
      const inLa = el.number >= LANTHANIDE_RANGE[0] && el.number <= LANTHANIDE_RANGE[1];
      const inAc = el.number >= ACTINIDE_RANGE[0] && el.number <= ACTINIDE_RANGE[1];
      if (inLa) {
        lanthanidesList.push(el);
        continue;
      }
      if (inAc) {
        actinidesList.push(el);
        continue;
      }
      byPositionMap.set(el.period + "-" + el.group, el);
    }
    lanthanidesList.sort((a, b) => a.number - b.number);
    actinidesList.sort((a, b) => a.number - b.number);
    return { byPosition: byPositionMap, lanthanides: lanthanidesList, actinides: actinidesList };
  }, [elements]);

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[1100px]">
        {/* Griglia principale 18x7 con etichette di gruppo e periodo */}
        <div className="grid gap-1" style={{ gridTemplateColumns }}>
          {/* Riga intestazione gruppi */}
          <div />
          {GROUPS.map((g) => (
            <div
              key={"g-" + g}
              className="text-center text-[10px] sm:text-xs text-sky-300/80 font-semibold pb-1"
            >
              {g}
            </div>
          ))}
          <div />

          {PERIODS.map((p) => (
            <Fragment key={"row-" + p}>
              <div className="flex items-center justify-center text-[10px] sm:text-xs text-sky-300/80 font-semibold">
                {p}
              </div>

              {GROUPS.map((g) => {
                if (p === 6 && g === 3) {
                  return (
                    <ElementCell
                      key={p + "-" + g}
                      element={lanthanides[0]}
                      placeholder="lanthanide"
                      mode={mode}
                      range={range}
                      dimmed={false}
                      onSelect={onSelect}
                    />
                  );
                }
                if (p === 7 && g === 3) {
                  return (
                    <ElementCell
                      key={p + "-" + g}
                      element={actinides[0]}
                      placeholder="actinide"
                      mode={mode}
                      range={range}
                      dimmed={false}
                      onSelect={onSelect}
                    />
                  );
                }
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

              <div className="flex items-center justify-center text-[10px] sm:text-xs text-sky-300/80 font-semibold">
                {p}
              </div>
            </Fragment>
          ))}
        </div>

        {/* Serie staccate: Lantanoidi e Attinoidi allineate al Gruppo 3 */}
        <div className="mt-3 grid gap-1" style={{ gridTemplateColumns }}>
          <div className="flex items-center justify-center text-[10px] sm:text-xs text-pink-300/80 font-semibold">
            {"*"}
          </div>
          <div className="col-span-2" />
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
          <div className="col-span-1" />
        </div>

        <div className="mt-1 grid gap-1" style={{ gridTemplateColumns }}>
          <div className="flex items-center justify-center text-[10px] sm:text-xs text-pink-400/80 font-semibold">
            {"**"}
          </div>
          <div className="col-span-2" />
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
          <div className="col-span-1" />
        </div>
      </div>
    </div>
  );
};

export default PeriodicTable;
