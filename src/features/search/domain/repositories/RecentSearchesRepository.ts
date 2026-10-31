export interface RecentSearchesRepository {
  getAll(): Promise<string[]>;
  add(query: string): Promise<string[]>;
  clear(): Promise<void>;
}
