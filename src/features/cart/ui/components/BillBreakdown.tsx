import { View } from 'react-native';
import { AppText } from '@/common/components';
import { formatRupees } from '@/utils';
import type { Bill } from '../../domain/rules/bill';

export function BillBreakdown({ bill }: { bill: Bill }) {
  return (
    <View className="mt-lg gap-sm rounded-md bg-surface px-md py-md">
      <AppText variant="title">Bill</AppText>
      <AppText variant="body">Item Total · {formatRupees(bill.itemTotal)}</AppText>
      <AppText variant="body">Discount · {formatRupees(bill.discount)}</AppText>
      <AppText variant="body">
        Delivery Fee · {bill.deliveryWaived ? 'FREE' : formatRupees(bill.deliveryFee)}
      </AppText>
      <AppText variant="title">Grand Total · {formatRupees(bill.grandTotal)}</AppText>
    </View>
  );
}
