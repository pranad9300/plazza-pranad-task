export type { CouponEffect } from './domain/CouponEffect';
export type { CouponContext } from './domain/CouponContext';
export type { Eligibility } from './domain/Eligibility';
export type { CouponRule } from './domain/rules/CouponRule';
export type { UsedCouponsRepository } from './domain/repositories/UsedCouponsRepository';
export { listCouponRules, getCouponRule } from './domain/rules/registry';
export { evaluateCoupon } from './domain/evaluateCoupon';
