import { Pressable, Text } from 'react-native';

export function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      className="min-h-touch items-center justify-center rounded-md bg-brand px-md"
      onPress={onPress}
    >
      <Text className="text-body font-semibold text-surface">{label}</Text>
    </Pressable>
  );
}
