import type { CouponEffect } from '@/features/coupons';
import type { CartLine } from '../entities/CartLine';

export type Bill = {
  itemTotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  deliveryWaived: boolean;
};

export function itemTotalOf(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.price * line.qty, 0);
}

export function deliveryFeeBase(itemTotal: number): number {
  if (itemTotal <= 0) {
    return 0;
  }
  return itemTotal < 499 ? 40 : 0;
}

export function calculateBill(itemTotal: number, effect: CouponEffect | null): Bill {
  if (itemTotal <= 0) {
    return {
      itemTotal: 0,
      deliveryFee: 0,
      discount: 0,
      grandTotal: 0,
      deliveryWaived: false,
    };
  }

  const baseFee = deliveryFeeBase(itemTotal);
  let discount = 0;
  let deliveryWaived = false;

  if (effect?.kind === 'flat') {
    discount = effect.amount;
  } else if (effect?.kind === 'percent') {
    discount = Math.min((itemTotal * effect.rate) / 100, effect.max);
  } else if (effect?.kind === 'freeDelivery') {
    deliveryWaived = true;
  }

  discount = Math.min(discount, itemTotal);
  const deliveryFee = deliveryWaived ? 0 : baseFee;
  const grandTotal = itemTotal - discount + deliveryFee;

  return {
    itemTotal,
    deliveryFee,
    discount,
    grandTotal,
    deliveryWaived,
  };
}
