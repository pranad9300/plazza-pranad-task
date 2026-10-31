import { createContext, useContext, useMemo } from 'react';
import { createAppDependencies, type AppDependencies } from './container';

const DependenciesContext = createContext<AppDependencies | null>(null);

export function DependenciesProvider({ children }: { children: React.ReactNode }) {
  const dependencies = useMemo(() => createAppDependencies(), []);

  return (
    <DependenciesContext.Provider value={dependencies}>{children}</DependenciesContext.Provider>
  );
}

export function useDependencies(): AppDependencies {
  const dependencies = useContext(DependenciesContext);
  if (dependencies === null) {
    throw new Error('useDependencies must be used within DependenciesProvider');
  }
  return dependencies;
}
