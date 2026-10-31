import { Pressable, View } from 'react-native';
import { AppText } from './AppText';

export function QtyStepper({
  qty,
  onIncrement,
  onDecrement,
  accessibilityName,
}: {
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  accessibilityName: string;
}) {
  return (
    <View className="flex-row items-center gap-sm">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${accessibilityName}`}
        className="min-h-touch min-w-[44px] items-center justify-center rounded-md bg-surface"
        onPress={onDecrement}
      >
        <AppText variant="title">−</AppText>
      </Pressable>
      <AppText variant="body">{qty}</AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Increase ${accessibilityName}`}
        className="min-h-touch min-w-[44px] items-center justify-center rounded-md bg-surface"
        onPress={onIncrement}
      >
        <AppText variant="title">+</AppText>
      </Pressable>
    </View>
  );
}
