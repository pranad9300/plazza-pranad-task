export interface UsedCouponsRepository {
  getUsed(): Promise<string[]>;
  markUsed(code: string): Promise<void>;
}
