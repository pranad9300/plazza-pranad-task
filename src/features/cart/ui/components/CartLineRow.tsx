import { Pressable, View } from 'react-native';
import { AppText, Badge, Button } from '@/common/components';
import { formatRupees } from '@/utils';
import type { CartLine } from '../../domain/entities/CartLine';

export function CartLineRow({
  line,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  line: CartLine;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  return (
    <View className="gap-sm border-b border-ink/10 py-md">
      <View className="flex-row items-center gap-sm">
        <AppText variant="body">{line.name}</AppText>
        {line.rx ? <Badge label="Rx" /> : null}
      </View>
      <AppText variant="muted">
        {formatRupees(line.price)} · max {line.maxQty}
      </AppText>
      <View className="flex-row items-center gap-sm">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${line.name}`}
          className="min-h-touch min-w-[44px] items-center justify-center rounded-md bg-surface"
          onPress={onDecrement}
        >
          <AppText variant="title">−</AppText>
        </Pressable>
        <AppText variant="body">{line.qty}</AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Increase ${line.name}`}
          className="min-h-touch min-w-[44px] items-center justify-center rounded-md bg-surface"
          onPress={onIncrement}
        >
          <AppText variant="title">+</AppText>
        </Pressable>
        <View className="flex-1" />
        <Button label="Remove" onPress={onRemove} />
      </View>
    </View>
  );
}
