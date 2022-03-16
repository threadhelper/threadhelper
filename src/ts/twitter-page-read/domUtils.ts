export const containsOrContained = (a: Element, b: Element): boolean =>
  b.contains(a) || a.contains(b);

export const elIntersect = (selector: string, elem: Element): boolean =>
  Array.from(document.querySelectorAll(selector)).some((s: Element) =>
    containsOrContained(elem, s)
  );

export const elContained = (selector: string, elem: Element): boolean =>
  Array.from(document.querySelectorAll(selector)).some((s: Element) =>
    s.contains(elem)
  );
// true if active element contains or is contained by the element of interest
export function isFocused(selector) {
  // return isNil(document.activeElement) ? false : elIntersect(selector, document.activeElement)
  return elIntersect(selector, document.activeElement);
}
