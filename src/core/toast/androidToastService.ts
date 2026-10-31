import { Platform, ToastAndroid } from 'react-native';
import type { ToastService } from './ToastService';

export function createAndroidToastService(): ToastService {
  return {
    show: (message: string) => {
      if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      }
    },
  };
}
