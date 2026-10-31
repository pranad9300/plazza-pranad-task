import type { CouponRule } from './CouponRule';

export const save10Rule: CouponRule = {
  code: 'SAVE10',
  title: '10% OFF',
  subtitle: 'Max discount ₹100',
  accent: 'percent',
  isEligible: (ctx) => {
    if (ctx.lineCount < 1) {
      return { ok: false, reason: 'Add items to use this coupon' };
    }
    return { ok: true };
  },
  evaluate: () => ({ kind: 'percent', rate: 10, max: 100 }),
};
