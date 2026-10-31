import type { CartLine } from '../entities/CartLine';

export function canIncrement(line: CartLine): boolean {
  return line.qty < line.maxQty;
}

export function nextQtyAfterIncrement(line: CartLine): number | null {
  if (!canIncrement(line)) {
    return null;
  }
  return line.qty + 1;
}
