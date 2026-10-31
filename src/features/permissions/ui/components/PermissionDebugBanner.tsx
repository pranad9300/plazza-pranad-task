import { View } from 'react-native';
import { AppText } from '@/common/components';
import type { PermissionState } from '@/core/permissions';

export function PermissionDebugBanner({
  locationState,
  notificationState,
}: {
  locationState: PermissionState;
  notificationState: PermissionState;
}) {
  return (
    <View
      accessibilityLabel={`Permission debug. Location ${locationState}. Notifications ${notificationState}.`}
      className="mt-sm rounded-md bg-ink/10 px-sm py-sm"
    >
      <AppText variant="muted">
        Debug · Loc: {locationState} · Notif: {notificationState}
      </AppText>
    </View>
  );
}
