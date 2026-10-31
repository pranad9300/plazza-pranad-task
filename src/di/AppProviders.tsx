import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DependenciesProvider } from './DependenciesProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <DependenciesProvider>{children}</DependenciesProvider>
    </SafeAreaProvider>
  );
}
