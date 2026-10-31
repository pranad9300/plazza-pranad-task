import { searchMedicines } from '@/features/search/domain/usecases/searchMedicines';
import type { Medicine } from '@/features/catalog';

const catalog: Medicine[] = [
  {
    id: 'm1',
    name: 'Dolo 650',
    salt: 'Paracetamol',
    price: 30,
    maxQty: 5,
    rx: false,
  },
  {
    id: 'm3',
    name: 'Azithral 500',
    salt: 'Azithromycin',
    price: 120,
    maxQty: 2,
    rx: true,
  },
];

describe('searchMedicines', () => {
  it('returns empty for blank query', () => {
    expect(searchMedicines(catalog, '   ')).toEqual([]);
  });

  it('matches name case-insensitively', () => {
    expect(searchMedicines(catalog, 'dolo')).toEqual([catalog[0]]);
  });

  it('matches salt', () => {
    expect(searchMedicines(catalog, 'paracetamol')).toEqual([catalog[0]]);
  });

  it('returns empty when nothing matches', () => {
    expect(searchMedicines(catalog, 'xyz')).toEqual([]);
  });
});
