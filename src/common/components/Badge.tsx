import { Text, View } from 'react-native';

export function Badge({ label }: { label: string }) {
  return (
    <View className="self-start rounded-pill bg-ink px-sm py-xs">
      <Text className="text-caption font-semibold text-surface">{label}</Text>
    </View>
  );
}
