import * as Linking from 'expo-linking';
import type { SettingsLinker } from './SettingsLinker';

export function createExpoSettingsLinker(): SettingsLinker {
  return {
    openAppSettings: () => Linking.openSettings(),
  };
}
