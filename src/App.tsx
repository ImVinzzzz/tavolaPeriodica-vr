import { useEffect, useState } from 'react';
import { Home } from './pages/Home';
import type { ElementData } from './types/element';

export default function App() {
  const [selected, setSelected] = useState<ElementData | null>(null);
  useEffect(() => { document.body.style.overflow = selected ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [selected]);
  return <Home selectedElement={selected} onSelect={setSelected} onClose={() => setSelected(null)} />;
}
