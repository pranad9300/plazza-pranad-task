import { View } from 'react-native';

export function Screen({ children }: { children: React.ReactNode }) {
  return <View className="flex-1 bg-canvas px-md pt-lg">{children}</View>;
}
