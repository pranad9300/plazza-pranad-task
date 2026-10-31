import { View } from 'react-native';
import { AppText, Screen } from '@/common/components';
import { searchStyles } from '../styles/search.styles';

export function SearchScreen() {
  return (
    <Screen>
      <View className={searchStyles.title}>
        <AppText variant="title">Search</AppText>
      </View>
    </Screen>
  );
}
