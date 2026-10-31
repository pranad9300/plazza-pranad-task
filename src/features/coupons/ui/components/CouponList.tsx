import { View } from 'react-native';
import { AppText } from '@/common/components';
import type { CouponRule } from '../../domain/rules/CouponRule';
import { CouponTicketCard, type CouponCardStatus } from './CouponTicketCard';
import { couponStyles } from '../styles/coupons.styles';

export type CouponListItem = {
  rule: CouponRule;
  status: CouponCardStatus;
  reason?: string;
};

export function CouponList({
  items,
  onToggle,
  title = 'Coupons',
}: {
  items: CouponListItem[];
  onToggle: (code: string) => void;
  title?: string;
}) {
  return (
    <View className={couponStyles.list}>
      <AppText variant="title">{title}</AppText>
      {items.map((item) => (
        <CouponTicketCard
          key={item.rule.code}
          rule={item.rule}
          status={item.status}
          reason={item.reason}
          onPress={() => onToggle(item.rule.code)}
        />
      ))}
    </View>
  );
}
