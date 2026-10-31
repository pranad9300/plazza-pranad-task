import type { KeyValueStorage } from '@/core/storage';
import { createMmkvStorage } from '@/core/storage';
import type { PermissionService } from '@/core/permissions';
import { createExpoPermissionService } from '@/core/permissions';
import type { LocationService } from '@/core/location';
import { createExpoLocationService } from '@/core/location';
import type { NotificationService } from '@/core/notifications';
import { createExpoNotificationService } from '@/core/notifications';
import type { SettingsLinker } from '@/core/linking';
import { createExpoSettingsLinker } from '@/core/linking';
import type { ToastService } from '@/core/toast';
import { createNoopToastService } from '@/core/toast';
import type { CatalogRepository } from '@/features/catalog';
import { CatalogRepositoryImpl } from '@/features/catalog/data/repositories/CatalogRepositoryImpl';
import { createLocalCatalogDataSource } from '@/features/catalog/data/sources/LocalCatalogDataSource';

export type AppDependencies = {
  storage: KeyValueStorage;
  permissions: PermissionService;
  location: LocationService;
  notifications: NotificationService;
  settingsLinker: SettingsLinker;
  toast: ToastService;
  catalogRepository: CatalogRepository;
};

export function createAppDependencies(): AppDependencies {
  const storage = createMmkvStorage();
  const catalogSource = createLocalCatalogDataSource();

  return {
    storage,
    permissions: createExpoPermissionService(),
    location: createExpoLocationService(),
    notifications: createExpoNotificationService(),
    settingsLinker: createExpoSettingsLinker(),
    toast: createNoopToastService(),
    catalogRepository: new CatalogRepositoryImpl(catalogSource),
  };
}
