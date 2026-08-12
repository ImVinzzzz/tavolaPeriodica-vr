import { type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlask, faShieldHalved, faUpRightFromSquare, faAngleRight, faBookOpen } from "@fortawesome/free-solid-svg-icons";

interface FooterProps {
  onOpenReadme?: () => void;
}

const Footer: FC<FooterProps> = ({ onOpenReadme }) => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-slate-950/80 backdrop-blur-md text-white/60 text-xs py-8 px-4 sm:px-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sezione Fonti Dati */}
          <div className="flex flex-col gap-2 bg-white/[0.02] p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-sky-300 font-semibold text-sm">
              <FontAwesomeIcon icon={faFlask} className="text-xs" />
              <span>{"Fonti dei Dati Scientifici"}</span>
            </div>
            <p className="leading-relaxed text-white/70">
              {"I dati chimico-fisici e le proprietà atomiche degli elementi sono tratti da fonti scientifiche ufficiali:"}
            </p>
            <div className="flex flex-col gap-2 mt-1 text-white/60">
              <div className="flex items-start gap-2">
                <FontAwesomeIcon icon={faAngleRight} className="text-sky-400 text-[10px] mt-1 shrink-0" />
                <div>
                  <strong className="text-white/80">{"IUPAC / CIAAW"}</strong>
                  {": Pesi atomici standard convenzionali e mono-isotopici ("}
                  <a
                    href="https://www.ciaaw.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-300 hover:underline inline-flex items-center gap-1"
                  >
                    ciaaw.org <FontAwesomeIcon icon={faUpRightFromSquare} className="text-[9px]" />
                  </a>
                  {")."}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <FontAwesomeIcon icon={faAngleRight} className="text-sky-400 text-[10px] mt-1 shrink-0" />
                <div>
                  <strong className="text-white/80">{"NIST ASD"}</strong>
                  {": Energie di ionizzazione e spettri atomici ("}
                  <a
                    href="https://www.nist.gov/pml/atomic-spectra-database"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-300 hover:underline inline-flex items-center gap-1"
                  >
                    physics.nist.gov <FontAwesomeIcon icon={faUpRightFromSquare} className="text-[9px]" />
                  </a>
                  {")."}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <FontAwesomeIcon icon={faAngleRight} className="text-sky-400 text-[10px] mt-1 shrink-0" />
                <div>
                  <strong className="text-white/80">{"Immagini & Approfondimenti"}</strong>
                  {": Le immagini dimostrative e i collegamenti presenti nelle schede degli elementi sono tratti da "}
                  <a
                    href="https://it.wikipedia.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-300 hover:underline inline-flex items-center gap-1"
                  >
                    it.wikipedia.org <FontAwesomeIcon icon={faUpRightFromSquare} className="text-[9px]" />
                  </a>
                  {"."}
                </div>
              </div>
            </div>
          </div>

          {/* Sezione Disclaimer Legale */}
          <div className="flex flex-col justify-between gap-3 bg-white/[0.02] p-4 rounded-xl border border-white/5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                <FontAwesomeIcon icon={faShieldHalved} className="text-xs" />
                <span>{"Disclaimer & Note Legali"}</span>
              </div>
              <p className="leading-relaxed text-white/70">
                {"Sito amatoriale a carattere puramente didattico e divulgativo, senza fini di lucro."}
              </p>
              <p className="leading-relaxed text-white/60">
                {"Non si intende infrangere alcun copyright. Tutti i marchi registrati, nomi di prodotti e marchi citati appartengono ai rispettivi proprietari. Le immagini tratte da Wikipedia restano di proprietà dei rispettivi autori sotto le relative licenze Creative Commons / Pubblico Dominio."}
              </p>
            </div>

            {/* Link al popup del README sotto al disclaimer */}
            <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={onOpenReadme}
                className="inline-flex items-center gap-2 text-xs font-semibold text-sky-300 hover:text-sky-200 transition-colors bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 px-3 py-1.5 rounded-lg active:scale-95"
              >
                <FontAwesomeIcon icon={faBookOpen} className="text-sky-400 text-xs" />
                <span>{"Documentazione e Note"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/40">
          <p>{"© " + new Date().getFullYear() + " Tavola Periodica Interattiva · Progetto Didattico Open Source"}</p>
          <p>{"Dati validati secondo le direttive IUPAC/CIAAW e NIST ASD."}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

