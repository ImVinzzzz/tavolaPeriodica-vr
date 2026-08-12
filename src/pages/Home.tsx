import type { ElementData } from '../types/element';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PeriodicTable } from '../components/periodic-table/PeriodicTable';
import { CategoryLegend } from '../components/periodic-table/CategoryLegend';
import { ElementModal } from '../components/element-detail/ElementModal';

interface Props { selectedElement: ElementData | null; onSelect: (e: ElementData) => void; onClose: () => void; }
export function Home({ selectedElement, onSelect, onClose }: Props) {
  return <div className="min-h-screen bg-science text-slate-100 selection:bg-cyan-300/20">
    <Header />
    <main className="mx-auto w-full max-w-[1700px] px-4 pb-8 sm:px-6 lg:px-8">
      <PeriodicTable onSelect={onSelect} />
      <CategoryLegend />
    </main>
    <Footer />
    {selectedElement && <ElementModal element={selectedElement} onClose={onClose} />}
  </div>;
}
