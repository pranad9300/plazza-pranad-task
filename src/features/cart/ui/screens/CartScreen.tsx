import { View } from 'react-native';
import { AppText, Screen } from '@/common/components';
import { cartStyles } from '../styles/cart.styles';

export function CartScreen() {
  return (
    <Screen>
      <View className={cartStyles.title}>
        <AppText variant="title">Cart</AppText>
        <AppText variant="muted">Cart UI lands in the next feature commit.</AppText>
      </View>
    </Screen>
  );
}
