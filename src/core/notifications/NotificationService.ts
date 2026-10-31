import type { PermissionState } from '@/core/permissions';

export interface NotificationService {
  getPermission(): Promise<PermissionState>;
  requestPermission(): Promise<PermissionState>;
}
