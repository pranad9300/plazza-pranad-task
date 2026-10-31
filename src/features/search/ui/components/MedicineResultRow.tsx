import { View } from 'react-native';
import { AppText, Badge, Button } from '@/common/components';
import { formatRupees } from '@/utils';
import type { Medicine } from '@/features/catalog';

export function MedicineResultRow({
  medicine,
  onAdd,
}: {
  medicine: Medicine;
  onAdd: () => void;
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
      <Button
        label="Add"
        onPress={onAdd}
      />
    </View>
  );
}
