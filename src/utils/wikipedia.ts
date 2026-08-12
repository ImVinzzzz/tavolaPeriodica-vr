import type { ElementData } from '../types/element';
const overrides: Record<string,string> = { 'Azoto':'Azoto', 'Tungsteno':'Tungsteno', 'Laurenzio':'Laurenzio', 'Protoattinio':'Protoattinio' };
export function wikipediaUrl(element: ElementData) { const title=overrides[element.name] ?? element.name; return `https://it.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ','_'))}`; }
