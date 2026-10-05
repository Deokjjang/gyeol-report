export type ReadingGesture = { x: number; y: number; startedAt: number };
export function hasReadingSelection(selection: Selection | null) { return Boolean(selection && !selection.isCollapsed && selection.toString().length); }
export function canStartReadingGesture(target: Element, selected: boolean) {
  return !selected && !target.closest("p,h1,h2,h3,h4,span,strong,b,small,li,td,th,dt,dd,button,a,input,textarea,select,dialog,summary,[data-narrative-paragraph],[data-selectable]");
}
export function readingGestureDirection(start: ReadingGesture | null, x: number, y: number, now: number, selected: boolean): -1 | 0 | 1 {
  if (!start || selected || now - start.startedAt >= 450) return 0;
  const dx = x - start.x, dy = y - start.y;
  return Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.7 ? dx < 0 ? 1 : -1 : 0;
}
