import type { Medicine } from '../entities/Medicine';

export interface CatalogRepository {
  getAll(): Promise<Medicine[]>;
}
