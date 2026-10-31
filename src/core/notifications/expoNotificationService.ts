import * as Notifications from 'expo-notifications';
import { toPermissionState } from '@/core/permissions';
import type { NotificationService } from './NotificationService';

export function createExpoNotificationService(): NotificationService {
  return {
    getPermission: async () => toPermissionState(await Notifications.getPermissionsAsync()),
    requestPermission: async () =>
      toPermissionState(await Notifications.requestPermissionsAsync()),
  };
}
