export interface UsedCouponsRepository {
  getUsed(): string[];
  markUsed(code: string): void;
}
