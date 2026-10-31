import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { AppText, Button, EmptyState, Screen } from '@/common/components';
import { CouponStrip } from '@/features/coupons';
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
          <>
            {cart.lines.map((line) => (
              <CartLineRow
                key={line.medicineId}
                line={line}
                onIncrement={() => cart.increment(line.medicineId)}
                onDecrement={() => cart.decrement(line.medicineId)}
                onRemove={() => cart.remove(line.medicineId)}
              />
            ))}

            <CouponStrip
              items={cart.couponItems}
              onToggle={cart.toggleCoupon}
              onViewAll={() => {
                router.push('/coupons');
              }}
            />

            <BillBreakdown bill={cart.bill} />

            <View className="mt-lg mb-xl">
              <Button
                label="Place order"
                onPress={() => {
                  void cart.placeOrder();
                }}
              />
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
