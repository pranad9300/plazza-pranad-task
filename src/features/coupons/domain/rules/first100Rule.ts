import type { CouponRule } from './CouponRule';

export const first100Rule: CouponRule = {
  code: 'FIRST100',
  title: '₹100 OFF',
  subtitle: 'First order · min ₹200',
  accent: 'first',
  isEligible: (ctx) => {
    if (ctx.usedCodes.has('FIRST100')) {
      return { ok: false, reason: 'FIRST100 has already been used' };
    }
    if (ctx.itemTotal < 200) {
      return { ok: false, reason: 'Add items worth ₹200 to use FIRST100' };
    }
    return { ok: true };
  },
  evaluate: () => ({ kind: 'flat', amount: 100 }),
};
