import { View } from 'react-native';
import { AppText, Button } from '@/common/components';

export function PermissionRationale({
  isBlocked,
  onRequest,
  onOpenSettings,
}: {
  isBlocked: boolean;
  onRequest: () => void;
  onOpenSettings: () => void;
}) {
  return (
    <View className="mt-sm gap-sm rounded-md bg-surface px-md py-md">
      <AppText variant="body">
        {isBlocked
          ? 'Location or notification access is blocked. Enable it in system Settings to continue.'
          : 'Location and notifications help us show delivery area and order updates. You can allow them now.'}
      </AppText>
      {isBlocked ? (
        <Button label="Open Settings" onPress={onOpenSettings} />
      ) : (
        <Button label="Allow permissions" onPress={onRequest} />
      )}
    </View>
  );
}
