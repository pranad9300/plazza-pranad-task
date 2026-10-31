import { calculateBill, deliveryFeeBase } from '@/features/cart/domain/rules/bill';

describe('deliveryFeeBase', () => {
  it('charges 40 when item total is under 499', () => {
    expect(deliveryFeeBase(498)).toBe(40);
  });

  it('is free at 499', () => {
    expect(deliveryFeeBase(499)).toBe(0);
  });

  it('is zero for empty cart', () => {
    expect(deliveryFeeBase(0)).toBe(0);
  });
});

describe('calculateBill', () => {
  it('applies flat discount clamped to item total', () => {
    const bill = calculateBill(30, { kind: 'flat', amount: 50 });
    expect(bill.discount).toBe(30);
    expect(bill.grandTotal).toBe(40);
  });

  it('caps percent discount at max', () => {
    const bill = calculateBill(2000, { kind: 'percent', rate: 10, max: 100 });
    expect(bill.discount).toBe(100);
  });

  it('waives delivery for freeDelivery effect', () => {
    const bill = calculateBill(100, { kind: 'freeDelivery' });
    expect(bill.deliveryFee).toBe(0);
    expect(bill.deliveryWaived).toBe(true);
    expect(bill.grandTotal).toBe(100);
  });

  it('includes delivery when no effect and under threshold', () => {
    const bill = calculateBill(100, null);
    expect(bill.deliveryFee).toBe(40);
    expect(bill.grandTotal).toBe(140);
  });
});
