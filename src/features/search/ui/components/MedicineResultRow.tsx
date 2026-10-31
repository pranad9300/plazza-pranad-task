import { View } from 'react-native';
import { AppText, Badge, Button, QtyStepper } from '@/common/components';
import { formatRupees } from '@/utils';
import type { Medicine } from '@/features/catalog';

export function MedicineResultRow({
  medicine,
  qty,
  onAdd,
  onIncrement,
  onDecrement,
}: {
  medicine: Medicine;
  qty: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <View className="flex-row items-center gap-sm border-b border-ink/10 py-md">
      <View className="flex-1 gap-xs">
        <View className="flex-row items-center gap-sm">
          <AppText variant="body">{medicine.name}</AppText>
          {medicine.rx ? <Badge label="Rx" /> : null}
        </View>
        <AppText variant="muted">{medicine.salt}</AppText>
        <AppText variant="body">{formatRupees(medicine.price)}</AppText>
      </View>
      {qty === 0 ? (
        <Button label="Add" onPress={onAdd} />
      ) : (
        <QtyStepper
          qty={qty}
          accessibilityName={medicine.name}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      )}
    </View>
  );
}
