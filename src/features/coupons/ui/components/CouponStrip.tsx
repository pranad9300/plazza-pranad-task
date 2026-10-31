import { Pressable, ScrollView, View } from 'react-native';
import { AppText } from '@/common/components';
import { CouponTicketCard } from './CouponTicketCard';
import type { CouponListItem } from './CouponList';
import { couponStyles } from '../styles/coupons.styles';

export function CouponStrip({
  items,
  onToggle,
  onViewAll,
}: {
  items: CouponListItem[];
  onToggle: (code: string) => void;
  onViewAll: () => void;
}) {
  const preview = items.slice(0, 2);

  return (
    <View className={couponStyles.list}>
      <View className="flex-row items-center justify-between">
        <AppText variant="title">Coupons</AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View all coupons"
          className="min-h-touch justify-center px-sm"
          onPress={onViewAll}
        >
          <AppText variant="body">View all</AppText>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-md pr-md">
          {preview.map((item) => (
            <View key={item.rule.code} className="w-[280px]">
              <CouponTicketCard
                rule={item.rule}
                status={item.status}
                reason={item.reason}
                onPress={() => onToggle(item.rule.code)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
