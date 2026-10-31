import type { CouponRule } from './CouponRule';

export const freedelRule: CouponRule = {
  code: 'FREEDEL',
  title: 'FREE DELIVERY',
  subtitle: 'Waives delivery fee',
  accent: 'ship',
  isEligible: (ctx) => {
    if (ctx.lineCount < 1) {
      return { ok: false, reason: 'Add items to use this coupon' };
    }
    return { ok: true };
  },
  evaluate: () => ({ kind: 'freeDelivery' }),
};
