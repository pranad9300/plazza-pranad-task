import type { CouponRule } from './CouponRule';

export const flat50Rule: CouponRule = {
  code: 'FLAT50',
  title: '₹50 OFF',
  subtitle: 'Min item total ₹300',
  accent: 'flat',
  isEligible: (ctx) => {
    if (ctx.itemTotal < 300) {
      return { ok: false, reason: 'Add items worth ₹300 to use FLAT50' };
    }
    return { ok: true };
  },
  evaluate: () => ({ kind: 'flat', amount: 50 }),
};
