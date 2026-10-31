import type { PermissionResponse } from 'expo';
import type { PermissionState } from './PermissionService';

export function toPermissionState(response: PermissionResponse): PermissionState {
  if (response.granted) {
    return 'granted';
  }
  if (response.status === 'denied' && response.canAskAgain === false) {
    return 'blocked';
  }
  if (response.status === 'denied') {
    return 'denied';
  }
  return 'undetermined';
}
