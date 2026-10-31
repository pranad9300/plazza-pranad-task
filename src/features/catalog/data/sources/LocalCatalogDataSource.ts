import type { MedicineDto } from '../dtos/MedicineDto';
import catalog from './catalog.json';

export interface CatalogDataSource {
  load(): MedicineDto[];
}

export function createLocalCatalogDataSource(): CatalogDataSource {
  return {
    load: () => catalog.medicines,
  };
}
