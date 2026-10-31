import type { CouponContext } from '../CouponContext';
import type { CouponEffect } from '../CouponEffect';
import type { Eligibility } from '../Eligibility';

export interface CouponRule {
  readonly code: string;
  readonly title: string;
  readonly subtitle: string;
  readonly accent: 'flat' | 'percent' | 'ship' | 'first';
  isEligible(ctx: CouponContext): Eligibility;
  evaluate(ctx: CouponContext): CouponEffect;
}
