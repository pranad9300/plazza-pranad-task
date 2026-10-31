import { useCallback, useEffect, useRef, useState } from 'react';
import type { Medicine } from '@/features/catalog';
import { useCartStore } from '@/features/cart';
import { useDependencies } from '@/di/DependenciesProvider';
import { searchMedicines } from '../../domain/usecases/searchMedicines';

export type SearchStatus = 'idle' | 'loading' | 'results' | 'noResults';

const SEARCH_DEBOUNCE_MS = 1000;

export function useSearchViewModel() {
  const { catalogRepository, recentSearchesRepository, toast } = useDependencies();
  const lines = useCartStore((state) => state.lines);
  const addItem = useCartStore((state) => state.addItem);
  const incrementStore = useCartStore((state) => state.increment);
  const decrementStore = useCartStore((state) => state.decrement);

  const [query, setQueryState] = useState('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [results, setResults] = useState<Medicine[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [catalog, setCatalog] = useState<Medicine[]>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipDebounceRef = useRef(false);

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

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setQuery = useCallback(
    (value: string) => {
      setQueryState(value);
      if (!value.trim()) {
        clearTimer();
        setStatus('idle');
        setResults([]);
      }
    },
    [clearTimer],
  );

  const executeSearch = useCallback(
    async (rawQuery: string) => {
      const trimmed = rawQuery.trim();
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

  useEffect(() => {
    clearTimer();

    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      void executeSearch(query);
      return;
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      void executeSearch(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimer();
    };
  }, [query, executeSearch, clearTimer]);

  const submitSearch = useCallback(() => {
    clearTimer();
    void executeSearch(query);
  }, [clearTimer, executeSearch, query]);

  const selectRecent = useCallback((value: string) => {
    skipDebounceRef.current = true;
    setQueryState(value);
  }, []);

  const qtyFor = useCallback(
    (medicineId: string) => lines.find((line) => line.medicineId === medicineId)?.qty ?? 0,
    [lines],
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

  const increment = useCallback(
    (medicineId: string) => {
      const result = incrementStore(medicineId);
      if (!result.ok) {
        toast.show(result.reason);
      }
    },
    [incrementStore, toast],
  );

  const decrement = useCallback(
    (medicineId: string) => {
      const result = decrementStore(medicineId);
      if (!result.ok) {
        toast.show(result.reason);
      }
    },
    [decrementStore, toast],
  );

  return {
    query,
    setQuery,
    status,
    results,
    recents,
    selectRecent,
    submitSearch,
    qtyFor,
    addToCart,
    increment,
    decrement,
  };
}
