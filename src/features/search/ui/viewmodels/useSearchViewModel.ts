import { useCallback, useEffect, useState } from 'react';
import type { Medicine } from '@/features/catalog';
import { useCartStore } from '@/features/cart';
import { useDependencies } from '@/di/DependenciesProvider';
import { searchMedicines } from '../../domain/usecases/searchMedicines';

export type SearchStatus = 'idle' | 'loading' | 'results' | 'noResults';

export function useSearchViewModel() {
  const { catalogRepository, recentSearchesRepository, toast } = useDependencies();
  const addItem = useCartStore((state) => state.addItem);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [results, setResults] = useState<Medicine[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [catalog, setCatalog] = useState<Medicine[]>([]);

  useEffect(() => {
    void (async () => {
      const [items, recent] = await Promise.all([
        catalogRepository.getAll(),
        recentSearchesRepository.getAll(),
      ]);
      setCatalog(items);
      setRecents(recent);
    })();
  }, [catalogRepository, recentSearchesRepository]);

  const runSearch = useCallback(
    async (rawQuery: string) => {
      const trimmed = rawQuery.trim();
      setQuery(rawQuery);
      if (!trimmed) {
        setStatus('idle');
        setResults([]);
        return;
      }
      setStatus('loading');
      await Promise.resolve();
      const items = catalog.length > 0 ? catalog : await catalogRepository.getAll();
      if (catalog.length === 0) {
        setCatalog(items);
      }
      const matched = searchMedicines(items, trimmed);
      setResults(matched);
      setStatus(matched.length === 0 ? 'noResults' : 'results');
      const nextRecents = await recentSearchesRepository.add(trimmed);
      setRecents(nextRecents);
    },
    [catalog, catalogRepository, recentSearchesRepository],
  );

  const addToCart = useCallback(
    (medicine: Medicine) => {
      const result = addItem(medicine);
      if (!result.ok) {
        toast.show(result.reason);
        return;
      }
      toast.show(`${medicine.name} added to cart`);
    },
    [addItem, toast],
  );

  return {
    query,
    setQuery,
    status,
    results,
    recents,
    runSearch,
    addToCart,
    selectRecent: (value: string) => {
      void runSearch(value);
    },
  };
}
