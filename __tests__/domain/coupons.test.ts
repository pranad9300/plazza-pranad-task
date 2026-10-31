import { evaluateCoupon } from '@/features/coupons/domain/evaluateCoupon';
import { listCouponRules } from '@/features/coupons/domain/rules/registry';
import type { CouponContext } from '@/features/coupons/domain/CouponContext';
import { calculateBill } from '@/features/cart/domain/rules/bill';

function ctx(partial: Partial<CouponContext>): CouponContext {
  return {
    itemTotal: 0,
    lineCount: 0,
    usedCodes: new Set(),
    ...partial,
  };
}

describe('coupon registry', () => {
  it('exposes four pluggable rules', () => {
    expect(listCouponRules().map((rule) => rule.code)).toEqual([
      'FLAT50',
      'SAVE10',
      'FREEDEL',
      'FIRST100',
    ]);
  });
});

describe('evaluateCoupon', () => {
  it('rejects unknown codes', () => {
    expect(evaluateCoupon('NOPE', ctx({ itemTotal: 500, lineCount: 1 }))).toEqual({
      ok: false,
      reason: 'Unknown coupon',
    });
  });

  it('applies FLAT50 when item total >= 300', () => {
    const result = evaluateCoupon('FLAT50', ctx({ itemTotal: 300, lineCount: 2 }));
    expect(result).toEqual({ ok: true, effect: { kind: 'flat', amount: 50 } });
  });

  it('rejects FLAT50 under minimum', () => {
    const result = evaluateCoupon('FLAT50', ctx({ itemTotal: 299, lineCount: 2 }));
    expect(result.ok).toBe(false);
  });

  it('caps SAVE10 at 100', () => {
    const result = evaluateCoupon('SAVE10', ctx({ itemTotal: 2000, lineCount: 1 }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      const bill = calculateBill(2000, result.effect);
      expect(bill.discount).toBe(100);
    }
  });

  it('rejects SAVE10 on empty cart', () => {
    expect(evaluateCoupon('SAVE10', ctx({ itemTotal: 0, lineCount: 0 })).ok).toBe(false);
  });

  it('applies FREEDEL on non-empty cart', () => {
    const result = evaluateCoupon('FREEDEL', ctx({ itemTotal: 100, lineCount: 1 }));
    expect(result).toEqual({ ok: true, effect: { kind: 'freeDelivery' } });
  });

  it('applies FIRST100 when eligible', () => {
    const result = evaluateCoupon('FIRST100', ctx({ itemTotal: 200, lineCount: 1 }));
    expect(result).toEqual({ ok: true, effect: { kind: 'flat', amount: 100 } });
  });

  it('rejects FIRST100 when already used', () => {
    const result = evaluateCoupon(
      'FIRST100',
      ctx({ itemTotal: 500, lineCount: 1, usedCodes: new Set(['FIRST100']) }),
    );
    expect(result).toEqual({
      ok: false,
      reason: 'FIRST100 has already been used',
    });
  });
});

describe('auto-remove eligibility', () => {
  it('becomes ineligible when item total drops below FLAT50 min', () => {
    const applied = evaluateCoupon('FLAT50', ctx({ itemTotal: 320, lineCount: 2 }));
    expect(applied.ok).toBe(true);
    const after = evaluateCoupon('FLAT50', ctx({ itemTotal: 250, lineCount: 1 }));
    expect(after.ok).toBe(false);
  });
});
