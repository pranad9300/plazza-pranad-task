import { ScrollView, View } from 'react-native';
import { AppText, EmptyState, Screen } from '@/common/components';
import { BillBreakdown } from '../components/BillBreakdown';
import { CartLineRow } from '../components/CartLineRow';
import { cartStyles } from '../styles/cart.styles';
import { useCartViewModel } from '../viewmodels/useCartViewModel';

export function CartScreen() {
  const cart = useCartViewModel();

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className={cartStyles.title}>
          <AppText variant="title">Cart</AppText>
        </View>

        {cart.isEmpty ? (
          <EmptyState title="Cart is empty" message="Add medicines from Home search." />
        ) : (
          cart.lines.map((line) => (
            <CartLineRow
              key={line.medicineId}
              line={line}
              onIncrement={() => cart.increment(line.medicineId)}
              onDecrement={() => cart.decrement(line.medicineId)}
              onRemove={() => cart.remove(line.medicineId)}
            />
          ))
        )}

        <BillBreakdown bill={cart.bill} />
      </ScrollView>
    </Screen>
  );
}
