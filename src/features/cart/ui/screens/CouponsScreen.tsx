import { ScrollView, View } from 'react-native';
import { Screen } from '@/common/components';
import { CouponList } from '@/features/coupons';
import { useCartViewModel } from '../viewmodels/useCartViewModel';

export function CouponsScreen() {
  const cart = useCartViewModel();

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="pb-xl">
          <CouponList items={cart.couponItems} onToggle={cart.toggleCoupon} title="All coupons" />
        </View>
      </ScrollView>
    </Screen>
  );
}
