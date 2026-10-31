import { create, type StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { KeyValueStorage } from '@/core/storage';
import type { AppStore, StoreInit } from './createStore';

function toStateStorage(storage: KeyValueStorage) {
  return {
    getItem: (key: string) => storage.getString(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.setString(key, value);
    },
    removeItem: (key: string) => {
      storage.remove(key);
    },
  };
}

export function createPersistedStore<T extends object>(
  name: string,
  storage: KeyValueStorage,
  initializer: StoreInit<T>,
): AppStore<T> {
  const persistedInitializer = persist(
    ((set, get) => initializer(set, get)) as StateCreator<T, [], [['zustand/persist', T]]>,
    {
      name,
      storage: createJSONStorage(() => toStateStorage(storage)),
    },
  );

  return create<T>()(persistedInitializer);
}
