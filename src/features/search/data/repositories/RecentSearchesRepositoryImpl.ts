import type { KeyValueStorage } from '@/core/storage';
import { readVersioned, writeVersioned } from '@/utils';
import type { RecentSearchesRepository } from '../../domain/repositories/RecentSearchesRepository';

const STORAGE_KEY = 'search.recents.v1';
const VERSION = 1;
const MAX_RECENTS = 5;

export class RecentSearchesRepositoryImpl implements RecentSearchesRepository {
  constructor(private readonly storage: KeyValueStorage) {}

  async getAll(): Promise<string[]> {
    return readVersioned(this.storage.getString(STORAGE_KEY), VERSION, [] as string[]);
  }

  async add(query: string): Promise<string[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return this.getAll();
    }
    const existing = await this.getAll();
    const next = [trimmed, ...existing.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(
      0,
      MAX_RECENTS,
    );
    this.storage.setString(STORAGE_KEY, writeVersioned(VERSION, next));
    return next;
  }

  async clear(): Promise<void> {
    this.storage.remove(STORAGE_KEY);
  }
}
