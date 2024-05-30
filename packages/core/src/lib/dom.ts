export type AttributeRecord = Record<string, string | number>;

export function setAttributeNS<T extends SVGElement>(
  el: T,
  obj: AttributeRecord
) {
  for (let key in obj) {
    el.setAttributeNS(null, key, String(obj[key]));
  }

  return el;
}

export function setAttribute<T extends SVGElement>(
  el: T,
  obj: AttributeRecord
) {
  for (let key in obj) {
    el.setAttribute(key, String(obj[key]));
  }

  return el;
}

export function setStyle<T extends HTMLElement>(
  el: T,
  obj: Partial<CSSStyleDeclaration>
) {
  for (let key in obj) {
    el.style[key] = String(obj[key]);
  }

  return el;
}
