import { View } from 'react-native';
import { AppText, Button } from '@/common/components';
import type { CouponRule } from '../../domain/rules/CouponRule';
import { couponHeaderClass, couponStyles } from '../styles/coupons.styles';

export type CouponCardStatus = 'eligible' | 'applied' | 'blocked';

export function CouponTicketCard({
  rule,
  status,
  reason,
  onPress,
}: {
  rule: CouponRule;
  status: CouponCardStatus;
  reason?: string;
  onPress: () => void;
}) {
  const actionLabel = status === 'applied' ? 'Remove' : 'Apply';
  return (
    <View
      accessibilityLabel={`${rule.code} coupon. ${status}${reason ? `. ${reason}` : ''}`}
      className={couponStyles.card}
    >
      <View className={couponHeaderClass[rule.accent]}>
        <AppText variant="muted">{rule.code}</AppText>
      </View>
      <View className={couponStyles.body}>
        <AppText variant="title">{rule.title}</AppText>
        <AppText variant="muted">{rule.subtitle}</AppText>
        {status === 'blocked' && reason ? <AppText variant="muted">{reason}</AppText> : null}
        {status === 'eligible' ? <AppText variant="muted">Eligible</AppText> : null}
        {status === 'applied' ? <AppText variant="body">Applied</AppText> : null}
        <View className={couponStyles.row}>
          <Button
            label={actionLabel}
            onPress={onPress}
          />
        </View>
      </View>
    </View>
  );
}
