import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import type { PermissionService } from './PermissionService';
import { toPermissionState } from './toPermissionState';

export function createExpoPermissionService(): PermissionService {
  return {
    getLocation: async () => toPermissionState(await Location.getForegroundPermissionsAsync()),
    requestLocation: async () =>
      toPermissionState(await Location.requestForegroundPermissionsAsync()),
    getNotifications: async () => toPermissionState(await Notifications.getPermissionsAsync()),
    requestNotifications: async () =>
      toPermissionState(await Notifications.requestPermissionsAsync()),
  };
}
