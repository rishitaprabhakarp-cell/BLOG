export const GRID_CELL_SIZE = 48;

export type GridCell = {
  col: number;
  row: number;
  left: number;
  top: number;
  centerX: number;
  centerY: number;
};

export function snapToGrid(x: number, y: number): GridCell {
  const col = Math.floor(x / GRID_CELL_SIZE);
  const row = Math.floor(y / GRID_CELL_SIZE);
  const left = col * GRID_CELL_SIZE;
  const top = row * GRID_CELL_SIZE;

  return {
    col,
    row,
    left,
    top,
    centerX: left + GRID_CELL_SIZE / 2,
    centerY: top + GRID_CELL_SIZE / 2,
  };
}

export function getCellIndex(col: number, row: number): number {
  return (col + row) % 5;
}

const INTERACTIVE_SELECTOR =
  "a, button, input, textarea, select, summary, label, [role='button'], [role='link'], [role='tab'], [contenteditable='true'], [data-no-grid-sound]";

export function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest(INTERACTIVE_SELECTOR));
}
