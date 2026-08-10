import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faRadiation,
  faUpRightFromSquare,
  faAtom,
} from "@fortawesome/free-solid-svg-icons";
import type { ElementData } from "../types/element";
import { CATEGORY_COLORS } from "../utils/colors";

interface ElementModalProps {
  element: ElementData | null;
  onClose: () => void;
}

const STATE_LABELS: Record<ElementData["stateOfMatter"], string> = {
  solid: "Solido",
  liquid: "Liquido",
  gas: "Gassoso",
  synthetic: "Sintetico",
};

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-white/10 last:border-b-0">
      <span className="text-[11px] uppercase tracking-wide text-white/45">{label}</span>
      <span className="text-sm text-white font-medium text-right">{value}</span>
    </div>
  );
}

const ElementModal: React.FC<ElementModalProps> = ({ element, onClose }) => {
  useEffect(() => {
    if (!element) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [element, onClose]);

  if (!element) return null;
  const color = CATEGORY_COLORS[element.category];

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div style={{ perspective: 1400 }} className="w-full max-w-2xl">
          <motion.div
            key={element.number}
            onClick={(e) => e.stopPropagation()}
            initial={{ rotateY: 90, opacity: 0, scale: 0.9 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: -90, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-full rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900/95 via-slate-900/95 to-blue-950/95
              shadow-[0_0_40px_rgba(56,189,248,0.25)] max-h-[88vh] overflow-y-auto"
          >
            <div
              className="absolute inset-x-0 top-0 h-1.5 rounded-t-2xl"
              style={{ backgroundColor: color, boxShadow: `0 0 16px ${color}` }}
            />

            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10"
              aria-label="Chiudi"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>

            <div className="p-6 sm:p-8 grid sm:grid-cols-[auto_1fr] gap-6">
              {/* Simbolo + immagine */}
              <div className="flex flex-col items-center gap-3 sm:w-40">
                <div
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 flex items-center justify-center relative shrink-0"
                  style={{
                    borderColor: color,
                    backgroundColor: `${color}30`,
                    boxShadow: `0 0 24px ${color}60, inset 0 0 20px ${color}30`,
                  }}
                >
                  {element.isRadioactive && (
                    <FontAwesomeIcon
                      icon={faRadiation}
                      className="absolute top-2 left-2 text-amber-300 text-sm"
                    />
                  )}
                  <span className="absolute top-2 right-2 text-xs font-semibold text-white/80">
                    {element.number}
                  </span>
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">
                    {element.symbol}
                  </span>
                </div>

                <img
                  src={element.imageUrl}
                  alt={`Placeholder immagine per ${element.name}`}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl border border-white/15 object-cover"
                />

                <a
                  href={element.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center text-xs font-semibold px-3 py-2 rounded-full border border-sky-400/40
                    text-sky-200 hover:bg-sky-400/10 transition-colors flex items-center justify-center gap-1.5"
                >
                  Wikipedia <FontAwesomeIcon icon={faUpRightFromSquare} className="text-[10px]" />
                </a>
              </div>

              {/* Dati */}
              <div className="min-w-0">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {element.name}
                </h2>
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  <span
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full border"
                    style={{ borderColor: color, color, backgroundColor: `${color}20` }}
                  >
                    {element.category}
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/20 text-white/70">
                    {STATE_LABELS[element.stateOfMatter]}
                  </span>
                  {element.isRadioactive && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-amber-400/40 text-amber-300 flex items-center gap-1">
                      <FontAwesomeIcon icon={faRadiation} className="text-[10px]" />
                      Radioattivo
                    </span>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-x-6">
                  <div>
                    <DataRow label="Peso atomico" value={`${element.atomicWeight} u`} />
                    <DataRow
                      label="Energia di ionizzazione"
                      value={element.ionizationEnergy !== null ? `${element.ionizationEnergy} kJ/mol` : "N/D"}
                    />
                    <DataRow
                      label="Elettronegatività"
                      value={element.electronegativity !== null ? element.electronegativity : "N/D"}
                    />
                    <DataRow label="Stati di ossidazione" value={element.oxidationStates} />
                  </div>
                  <div>
                    <DataRow
                      label="Raggio atomico"
                      value={element.atomicRadius !== null ? `${element.atomicRadius} pm` : "N/D"}
                    />
                    <DataRow
                      label="Densità"
                      value={element.density !== null ? `${element.density} g/cm³` : "N/D"}
                    />
                    <DataRow label="Anno di scoperta" value={element.yearDiscovered} />
                    <DataRow label="Gruppo / Periodo" value={`${element.group} / ${element.period}`} />
                  </div>
                </div>

                <div className="mt-3 flex items-start gap-2 text-xs text-white/60 bg-white/5 rounded-lg p-3 border border-white/10">
                  <FontAwesomeIcon icon={faAtom} className="text-sky-300 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-white/45 uppercase tracking-wide text-[10px] block mb-0.5">
                      Configurazione elettronica
                    </span>
                    <span className="font-mono text-white/85">{element.electronConfiguration}</span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-white/50 leading-relaxed">{element.isotopesNote}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ElementModal;
