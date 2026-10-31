import { Pressable, View } from 'react-native';
import { AppText } from '@/common/components';

export function RecentSearchList({
  items,
  onSelect,
}: {
  items: string[];
  onSelect: (query: string) => void;
}) {
  if (items.length === 0) {
    return null;
  }
  return (
    <View className="mt-md gap-sm">
      <AppText variant="muted">Recent searches</AppText>
      <View className="flex-row flex-wrap gap-sm">
        {items.map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityLabel={`Recent search ${item}`}
            className="min-h-touch justify-center rounded-pill bg-surface px-md"
            onPress={() => onSelect(item)}
          >
            <AppText variant="body">{item}</AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
