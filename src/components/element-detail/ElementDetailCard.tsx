import type { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faRadiation } from '@fortawesome/free-solid-svg-icons';
import type { ElementData } from '../../types/element';
import { CATEGORY_CONFIG } from '../../data/categories';
import { ElementImage } from './ElementImage';
import { wikipediaUrl } from '../../utils/wikipedia';

function Value({children}: {children: ReactNode}) { return <span className="text-right font-medium text-slate-100">{children}</span>; }
function Row({label,children}: {label:string;children:ReactNode}) { return <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-white/7 py-2.5 text-sm last:border-0"><span className="text-slate-400">{label}</span><Value>{children}</Value></div>; }
export function ElementDetailCard({element}: {element: ElementData}) { const category=CATEGORY_CONFIG[element.category]; return <div className="element-modal-card">
 <div className="grid gap-5 lg:grid-cols-[minmax(250px,.75fr)_1.25fr]">
  <div className="flex flex-col gap-4"><div className="element-image"><ElementImage element={element}/></div><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="flex items-end gap-3"><span className="text-6xl font-semibold tracking-tight text-white">{element.symbol}</span><div><div className="text-lg font-semibold text-white">{element.name}</div><div className="text-xs text-slate-400">Numero atomico {element.atomicNumber}</div></div></div><div className="mt-4 flex items-center gap-2 text-xs" style={{color:category.color}}><span className="h-2 w-2 rounded-full" style={{backgroundColor:category.color}}/>{category.label}</div></div></div>
  <div><h2 className="mb-3 text-xs font-semibold uppercase tracking-[.22em] text-cyan-200/70">Dati chimici</h2><div className="rounded-2xl border border-white/10 bg-white/[0.025] px-4"><Row label="Peso atomico / numero di massa">{element.atomicWeight ?? 'Non disponibile'}</Row><Row label="Prima energia di ionizzazione">{element.ionizationEnergy != null ? `${element.ionizationEnergy} kJ/mol` : 'Non disponibile'}</Row><Row label="Elettronegatività (Pauling)">{element.electronegativity != null ? element.electronegativity : 'Non assegnata'}</Row><Row label="Stati di ossidazione">{element.oxidationStates.length ? element.oxidationStates.join(', ') : 'Non disponibili'}</Row><Row label="Configurazione elettronica"><span className="max-w-[250px] font-mono text-xs leading-5">{element.electronConfiguration ?? 'Non disponibile'}</span></Row></div>
  {element.radioactive && <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm"><div className="flex items-center gap-2 font-semibold text-amber-100"><FontAwesomeIcon icon={faRadiation}/> Elemento radioattivo</div>{element.isotopeNote && <p className="mt-2 text-xs leading-5 text-slate-300/75">{element.isotopeNote}</p>}</div>}
  <a className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan-200/20 bg-cyan-200/5 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-200/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70" href={wikipediaUrl(element)} target="_blank" rel="noreferrer">Scopri di più su Wikipedia <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs"/></a>
  </div>
 </div></div>; }
