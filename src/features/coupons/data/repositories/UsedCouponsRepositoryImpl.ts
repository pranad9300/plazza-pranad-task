import type { KeyValueStorage } from '@/core/storage';
import { readVersioned, writeVersioned } from '@/utils';
import type { UsedCouponsRepository } from '../../domain/repositories/UsedCouponsRepository';

const STORAGE_KEY = 'coupons.used.v1';
const VERSION = 1;

export class UsedCouponsRepositoryImpl implements UsedCouponsRepository {
  constructor(private readonly storage: KeyValueStorage) {}

  async getUsed(): Promise<string[]> {
    return readVersioned(this.storage.getString(STORAGE_KEY), VERSION, [] as string[]);
  }

  async markUsed(code: string): Promise<void> {
    const used = await this.getUsed();
    if (used.includes(code)) {
      return;
    }
    this.storage.setString(STORAGE_KEY, writeVersioned(VERSION, [...used, code]));
  }
}
