import { create, type StoreApi, type UseBoundStore } from 'zustand';

export type AppStore<T extends object> = UseBoundStore<StoreApi<T>>;

export type StoreInit<T extends object> = (
  set: StoreApi<T>['setState'],
  get: StoreApi<T>['getState'],
) => T;

export function createStore<T extends object>(initializer: StoreInit<T>): AppStore<T> {
  return create<T>()((set, get) => initializer(set, get));
}
