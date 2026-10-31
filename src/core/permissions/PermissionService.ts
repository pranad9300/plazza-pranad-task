export type PermissionState = 'granted' | 'denied' | 'blocked' | 'undetermined';

export interface PermissionService {
  getLocation(): Promise<PermissionState>;
  requestLocation(): Promise<PermissionState>;
  getNotifications(): Promise<PermissionState>;
  requestNotifications(): Promise<PermissionState>;
}
