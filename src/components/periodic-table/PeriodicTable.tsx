import { elements } from '../../data/elements';
import type { ElementData } from '../../types/element';
import { ElementCell } from './ElementCell';
import { GroupLabels } from './GroupLabels';
import { PeriodLabels } from './PeriodLabels';
import { SeriesRows } from './SeriesRows';

interface Props { onSelect: (e: ElementData) => void; }
const main = elements.filter(e => e.category !== 'lanthanoid' && e.category !== 'actinoid');
const at=(p:number,g:number)=>main.find(e=>e.period===p&&e.group===g);
export function PeriodicTable({onSelect}: Props) {
 return <section aria-label="Tavola periodica" className="mx-auto w-full overflow-x-auto pb-2 scrollbar-thin"><div className="mx-auto min-w-[920px] max-w-[1500px]">
  <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-1.5 sm:grid-cols-[34px_minmax(0,1fr)] sm:gap-2"><div/><GroupLabels/><PeriodLabels/><div className="grid grid-cols-18 grid-rows-7 gap-1 sm:gap-1.5">{Array.from({length:126},(_,i)=>{const p=Math.floor(i/18)+1,g=(i%18)+1,e=at(p,g); return <div key={`${p}-${g}`} className="aspect-[0.92] min-w-0">{e ? <ElementCell element={e} onSelect={onSelect}/> : p===6&&g===3 ? <div className="series-marker">*</div> : p===7&&g===3 ? <div className="series-marker">**</div> : null}</div>})}</div></div>
  <SeriesRows elements={elements} onSelect={onSelect}/>
 </div></section>;
}
