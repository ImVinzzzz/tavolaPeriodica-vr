import type { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRadiation } from '@fortawesome/free-solid-svg-icons';
import type { ElementData } from '../../types/element';
import { CATEGORY_CONFIG } from '../../data/categories';

interface Props { element: ElementData; onSelect: (e: ElementData) => void; compact?: boolean; }
export function ElementCell({ element, onSelect, compact=false }: Props) {
  const color = CATEGORY_CONFIG[element.category].color;
  return <button type="button" onClick={() => onSelect(element)} aria-label={`${element.name}, simbolo ${element.symbol}, numero atomico ${element.atomicNumber}. Categoria: ${CATEGORY_CONFIG[element.category].label}${element.radioactive ? '. Radioattivo.' : ''}`} className={`element-cell group ${compact ? 'element-cell--compact' : ''}`} style={{'--element-color': color} as CSSProperties}>
    <span className="element-inner">
      {element.radioactive && <FontAwesomeIcon icon={faRadiation} aria-label="Radioattivo" className="absolute left-1.5 top-1.5 text-[8px] text-white/80 sm:text-[10px]" />}
      <span className="absolute right-1.5 top-1 text-[8px] font-medium text-white/80 sm:text-[10px]">{element.atomicNumber}</span>
      <span className="element-symbol">{element.symbol}</span>
      <span className="element-name">{element.name}</span>
    </span>
  </button>;
}
