import { useEffect, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faBookOpen,
  faFlask,
  faShieldHalved,
  faScaleBalanced,
  faCheck,
  faAtom,
} from "@fortawesome/free-solid-svg-icons";

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReadmeModal: FC<ReadmeModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const gestisciPressioneTasto = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") onClose();
    };
    window.addEventListener("keydown", gestisciPressioneTasto);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", gestisciPressioneTasto);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="readme-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            key="readme-content"
            onClick={(evento) => evento.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border border-sky-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-6 sm:p-8 shadow-[0_0_50px_rgba(14,165,233,0.15)] text-white"
          >
            {/* Indicatore decorativo superiore */}
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500" />

            {/* Pulsante di chiusura */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              aria-label="Chiudi modale documentazione"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>

            {/* Intestazione */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-300">
                <FontAwesomeIcon icon={faBookOpen} className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-200 bg-clip-text text-transparent">
                  {"Documentazione del Progetto"}
                </h2>
                <p className="text-xs text-white/60 mt-0.5">
                  {"Nota informativa sintetica."}
                </p>
              </div>
            </div>

            {/* Contenuto Estratto README */}
            <div className="flex flex-col gap-6 text-sm text-slate-300 leading-relaxed">
              {/* Sezione Introduzione */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faAtom} className="text-sky-400 text-xs" />
                  <span>{"Tavola Periodica Interattiva"}</span>
                </h3>
                <p className="text-xs sm:text-sm text-white/70">
                  {"Un'applicazione web moderna, reattiva e scientificamente accurata per l'esplorazione degli elementi della tavola periodica, sviluppata con React 18, TypeScript, Vite e TailwindCSS."}
                </p>
              </div>

              {/* Sezione Funzionalità Principali */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">
                  {"Funzionalita Principali"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-start gap-2.5">
                    <FontAwesomeIcon icon={faCheck} className="text-sky-400 text-xs mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-xs text-white">{"118 Elementi Chimici"}</h4>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        {"Organizzazione completa in 18 gruppi e 7 periodi, compresi Lantanoidi e Attinoidi."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-start gap-2.5">
                    <FontAwesomeIcon icon={faCheck} className="text-sky-400 text-xs mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-xs text-white">{"Modalita Heatmap"}</h4>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        {"Mappe di calore cromatiche per raggio atomico, densita, anno e proprieta atomiche."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-start gap-2.5">
                    <FontAwesomeIcon icon={faCheck} className="text-sky-400 text-xs mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-xs text-white">{"Schede Dettaglio 3D"}</h4>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        {"Pesi atomici, stati di ossidazione, configurazioni elettroniche e collegamenti Wikipedia."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-start gap-2.5">
                    <FontAwesomeIcon icon={faCheck} className="text-sky-400 text-xs mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-xs text-white">{"Quiz Educativo Interattivo"}</h4>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        {"4 modalita di gioco, 3 livelli di difficolta, supporto timer e salvataggio dei record."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sezione Accuratezza Scientifica e Fonti */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2">
                  <FontAwesomeIcon icon={faFlask} className="text-xs text-sky-400" />
                  <span>{"Accuratezza Scientifica e Fonti dei Dati"}</span>
                </h3>
                <p className="text-xs text-white/70">
                  {"Il dataset dell'applicazione e costantemente validato e aggiornato a partire dalle fonti ufficiali della chimica mondiale:"}
                </p>
                <div className="flex flex-col gap-2 bg-white/[0.02] border border-white/5 rounded-xl p-4 text-xs">
                  <div>
                    <strong className="text-white">{"IUPAC / CIAAW"}</strong>
                    <span className="text-white/60">
                      {": Pesi atomici standard convenzionali e mono-isotopici accurati. Per gli elementi radioattivi privi di isotopi stabili, il valore e racchiuso tra parentesi quadre [...] e rappresenta il numero di massa dell'isotopo piu stabile."}
                    </span>
                  </div>
                  <div className="h-px bg-white/5 my-1" />
                  <div>
                    <strong className="text-white">{"NIST ASD (Atomic Spectra Database)"}</strong>
                    <span className="text-white/60">
                      {": Energie di ionizzazione e configurazioni elettroniche verificate. Per le proprieta non ancora misurate sperimentalmente, il dato e presentato come N/D anziche forzare stime teoriche."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sezione Disclaimer e Licenza */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-amber-400" />
                    <span>{"Disclaimer Legale"}</span>
                  </h4>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    {"Sito amatoriale a carattere puramente didattico e divulgativo, senza fini di lucro. Non si intende infrangere alcun copyright. Marchi ed immagini appartengono ai rispettivi proprietari."}
                  </p>
                </div>

                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faScaleBalanced} className="text-indigo-400" />
                    <span>{"Licenza di Distribuzione"}</span>
                  </h4>
                  <p className="text-[11px] text-indigo-200/80 leading-relaxed">
                    {"Questo progetto e distribuito con licenza Open Source MIT, per promuovere la libera diffusione della conoscenza scientifica."}
                  </p>
                </div>
              </div>
            </div>

            {/* Pie' di pagina modale */}
            <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                {"Chiudi Documentazione"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReadmeModal;
