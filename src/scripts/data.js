import glazesArray from '../data/glazes.json';
import combosArray from '../data/combos.json';
import missingArray from '../data/missing.json';
import propsRaw    from '../data/props.json';

// Keyed lookup: G['PC-20'] → { code, name, hex, slug }
export const G = Object.fromEntries(glazesArray.map(g => [g.code, g]));

// Ordered array for selects, chips, iteration
export const GLAZES  = glazesArray;
export const DATA    = combosArray;
export const MISSING = missingArray;
export const PROPS   = propsRaw;

export function amacoURL(base, top) {
  const bg = G[base], tg = G[top];
  if (!bg || !tg) return null;
  return `https://amaco.com/resources/layering/${tg.slug}-over-${bg.slug}`;
}

export function dot(hex, size = 10) {
  return `<span style="display:inline-block;width:${size}px;height:${size}px;border-radius:50%;background:${hex};flex-shrink:0;border:0.5px solid rgba(0,0,0,.12)"></span>`;
}
