export type ReadingGesture = { x: number; y: number; startedAt: number; pointerId?: number; intent?: "pending" | "horizontal" | "cancelled" };
export function hasReadingSelection(selection: Selection | null) { return Boolean(selection && !selection.isCollapsed && selection.toString().length); }
export function canStartReadingGesture(target: Element, selected: boolean) {
  return !selected && !target.closest('button,a,input,textarea,select,dialog,summary,[contenteditable]:not([contenteditable="false"]),[role="button"],[role="link"],[role="slider"],[data-reading-gesture="ignore"]');
}
/** Preserve nested horizontal scrollers rather than stealing their gesture. */
export function hasReadingHorizontalScroll(target: Element, boundary: Element) {
  for (let element: Element | null = target; element && element !== boundary; element = element.parentElement) {
    if (element.scrollWidth > element.clientWidth + 1 && /auto|scroll/.test(element.ownerDocument.defaultView?.getComputedStyle(element).overflowX ?? "")) return true;
  }
  return false;
}
/** Once scrolling or long-pressing wins, changing direction cannot turn a page. */
export function moveReadingGesture(start: ReadingGesture | null, x: number, y: number, now: number) {
  if (!start || start.intent === "cancelled") return;
  const dx = Math.abs(x - start.x), dy = Math.abs(y - start.y);
  if (start.intent !== "horizontal" && now - start.startedAt > 600) start.intent = "cancelled";
  else if (dy > 12 && dy > dx) start.intent = "cancelled";
  else if (dx > 12 && dx > dy * 1.7) start.intent = "horizontal";
}
export function readingGestureDirection(start: ReadingGesture | null, x: number, y: number, now: number, selected: boolean): -1 | 0 | 1 {
  if (!start || selected || start.intent === "cancelled" || now - start.startedAt > 5000) return 0;
  const dx = x - start.x, dy = y - start.y;
  return Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.7 ? dx < 0 ? 1 : -1 : 0;
}
