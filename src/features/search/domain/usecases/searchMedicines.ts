import type { Medicine } from '@/features/catalog';

export function searchMedicines(items: Medicine[], query: string): Medicine[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [];
  }
  return items.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(q) || medicine.salt.toLowerCase().includes(q),
  );
}
