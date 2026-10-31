import { canIncrement, nextQtyAfterIncrement } from '@/features/cart/domain/rules/qty';
import type { CartLine } from '@/features/cart/domain/entities/CartLine';

const line = (qty: number, maxQty: number): CartLine => ({
  medicineId: 'm1',
  name: 'Dolo 650',
  salt: 'Paracetamol',
  price: 30,
  maxQty,
  rx: false,
  qty,
});

describe('cart qty rules', () => {
  it('allows increment under maxQty', () => {
    expect(canIncrement(line(4, 5))).toBe(true);
    expect(nextQtyAfterIncrement(line(4, 5))).toBe(5);
  });

  it('refuses increment at maxQty', () => {
    expect(canIncrement(line(5, 5))).toBe(false);
    expect(nextQtyAfterIncrement(line(5, 5))).toBeNull();
  });
});
