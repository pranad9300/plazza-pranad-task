export type CouponEffect =
  | { kind: 'flat'; amount: number }
  | { kind: 'percent'; rate: number; max: number }
  | { kind: 'freeDelivery' };
