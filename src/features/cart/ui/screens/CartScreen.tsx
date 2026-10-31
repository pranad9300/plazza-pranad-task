import { View } from 'react-native';
import { AppText, Screen } from '@/common/components';
import { cartStyles } from '../styles/cart.styles';

export function CartScreen() {
  return (
    <Screen>
      <View className={cartStyles.title}>
        <AppText variant="title">Cart</AppText>
      </View>
    </Screen>
  );
}
