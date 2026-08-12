import type { ElementData } from '../../types/element';
import { ElementCell } from './ElementCell';

interface Props { elements: ElementData[]; onSelect: (e: ElementData) => void; }
export function SeriesRows({elements,onSelect}: Props) { const series=[{label:'Lantanidi',mark:'*',items:elements.filter(e=>e.category==='lanthanoid')},{label:'Attinoidi',mark:'**',items:elements.filter(e=>e.category==='actinoid')}]; return <div className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">{series.map(s=><div key={s.label} className="flex min-w-max items-center gap-1 sm:gap-1.5"><div className="series-label"><span className="text-sm font-semibold text-white/90">{s.mark}</span><span className="hidden text-[10px] uppercase tracking-wider text-slate-400 sm:block">{s.label}</span></div>{s.items.map(e=><ElementCell key={e.atomicNumber} element={e} onSelect={onSelect} compact />)}</div>)}</div>; }
