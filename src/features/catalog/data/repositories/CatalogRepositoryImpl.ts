import type { Medicine } from '../../domain/entities/Medicine';
import type { CatalogRepository } from '../../domain/repositories/CatalogRepository';
import { toMedicine } from '../mappers/medicineMapper';
import type { CatalogDataSource } from '../sources/LocalCatalogDataSource';

export class CatalogRepositoryImpl implements CatalogRepository {
  constructor(private readonly source: CatalogDataSource) {}

  getAll(): Promise<Medicine[]> {
    return Promise.resolve(this.source.load().map(toMedicine));
  }
}
