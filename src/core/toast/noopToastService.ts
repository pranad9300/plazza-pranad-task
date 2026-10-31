import type { ToastService } from './ToastService';

export function createNoopToastService(): ToastService {
  return {
    show: () => {},
  };
}
