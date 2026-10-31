import { View } from 'react-native';
import { AppText, Button } from '@/common/components';

function buildMessage({
  isBlocked,
  locationNeedsAction,
  notificationNeedsAction,
}: {
  isBlocked: boolean;
  locationNeedsAction: boolean;
  notificationNeedsAction: boolean;
}): string {
  if (isBlocked) {
    if (locationNeedsAction && notificationNeedsAction) {
      return 'Location or notification access is blocked. Enable it in system Settings to continue.';
    }
    if (locationNeedsAction) {
      return 'Location access is blocked. Enable it in system Settings so we can show where we deliver.';
    }
    return 'Notification access is blocked. Enable it in system Settings for order updates.';
  }

  if (locationNeedsAction && notificationNeedsAction) {
    return 'Location and notifications help us show delivery area and order updates. You can allow them now.';
  }
  if (locationNeedsAction) {
    return 'Location helps us show your delivery area. You can allow it now.';
  }
  return 'Notifications help with order updates. You can allow them now.';
}

export function PermissionRationale({
  isBlocked,
  locationNeedsAction,
  notificationNeedsAction,
  onRequest,
  onOpenSettings,
}: {
  isBlocked: boolean;
  locationNeedsAction: boolean;
  notificationNeedsAction: boolean;
  onRequest: () => void;
  onOpenSettings: () => void;
}) {
  return (
    <View className="mt-sm gap-sm rounded-md bg-surface px-md py-md">
      <AppText variant="body">
        {buildMessage({ isBlocked, locationNeedsAction, notificationNeedsAction })}
      </AppText>
      {isBlocked ? (
        <Button label="Open Settings" onPress={onOpenSettings} />
      ) : (
        <Button label="Allow permissions" onPress={onRequest} />
      )}
    </View>
  );
}
