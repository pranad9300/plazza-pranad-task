export type AppPermissionState = 'granted' | 'denied' | 'blocked' | 'undetermined';

export type PermissionSnapshot = {
  location: AppPermissionState;
  notifications: AppPermissionState;
};

export type DeliveryCoords = {
  latitude: number;
  longitude: number;
};
