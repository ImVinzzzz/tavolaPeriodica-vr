export const CATEGORY_CONFIG = {
  alkali: { label: 'Metalli alcalini', color: '#ef6461' },
  alkaline: { label: 'Metalli alcalino-terrosi', color: '#e9a23b' },
  lanthanoid: { label: 'Lantanoidi', color: '#d783c7' },
  actinoid: { label: 'Attinoidi', color: '#a94f88' },
  transition: { label: 'Elementi di transizione', color: '#b29ad9' },
  'post-transition': { label: 'Metalli del blocco p', color: '#8d98a7' },
  metalloid: { label: 'Semimetalli', color: '#a28f48' },
  nonmetal: { label: 'Non metalli', color: '#63b86b' },
  halogen: { label: 'Alogeni', color: '#e3c65a' },
  noble: { label: 'Gas nobili', color: '#62b7d6' },
} as const;

export type CategoryKey = keyof typeof CATEGORY_CONFIG;
