import type { CouponRule } from './CouponRule';
import { first100Rule } from './first100Rule';
import { flat50Rule } from './flat50Rule';
import { freedelRule } from './freedelRule';
import { save10Rule } from './save10Rule';

const RULES: CouponRule[] = [flat50Rule, save10Rule, freedelRule, first100Rule];

export function listCouponRules(): CouponRule[] {
  return RULES;
}

export function getCouponRule(code: string): CouponRule | undefined {
  return RULES.find((rule) => rule.code === code);
}
