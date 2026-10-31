import { ActivityIndicator } from 'react-native';
import { colors } from '@/core/theme';

export function Loader() {
  return <ActivityIndicator color={colors.brand} />;
}
