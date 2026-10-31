import { View } from 'react-native';
import { AppText } from './AppText';

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View className="items-center gap-sm py-xl">
      <AppText variant="title">{title}</AppText>
      <AppText variant="muted">{message}</AppText>
    </View>
  );
}
