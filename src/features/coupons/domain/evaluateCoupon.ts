import type { CouponContext } from './CouponContext';
import type { CouponEffect } from './CouponEffect';
import { getCouponRule } from './rules/registry';

export type EvaluateCouponResult =
  | { ok: true; effect: CouponEffect }
  | { ok: false; reason: string };

export function evaluateCoupon(code: string, ctx: CouponContext): EvaluateCouponResult {
  const rule = getCouponRule(code);
  if (!rule) {
    return { ok: false, reason: 'Unknown coupon' };
  }
  const eligibility = rule.isEligible(ctx);
  if (!eligibility.ok) {
    return eligibility;
  }
  return { ok: true, effect: rule.evaluate(ctx) };
}
