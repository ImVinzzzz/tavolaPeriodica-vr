export type ElementCategory =
  | 'alkali' | 'alkaline' | 'lanthanoid' | 'actinoid' | 'transition'
  | 'post-transition' | 'metalloid' | 'nonmetal' | 'halogen' | 'noble';

export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  group: number;
  period: number;
  category: ElementCategory;
  atomicWeight?: string;
  ionizationEnergy?: number;
  electronegativity?: number;
  oxidationStates: string[];
  electronConfiguration?: string;
  radioactive: boolean;
  isotopeNote?: string;
  image?: string;
}
