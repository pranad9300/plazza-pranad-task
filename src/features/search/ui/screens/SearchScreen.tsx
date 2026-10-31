import { View } from 'react-native';
import { AppText, Screen } from '@/common/components';
import {
  PermissionDebugBanner,
  PermissionRationale,
  usePermissionsViewModel,
} from '@/features/permissions';
import { searchStyles } from '../styles/search.styles';

export function SearchScreen() {
  const permissionsVm = usePermissionsViewModel();

  return (
    <Screen>
      <View className={searchStyles.title}>
        <AppText variant="title">Plazza</AppText>
        <AppText variant="muted">{permissionsVm.deliveryLine}</AppText>
        <PermissionDebugBanner
          locationState={permissionsVm.locationState}
          notificationState={permissionsVm.notificationState}
        />
        {permissionsVm.needsRationale ? (
          <PermissionRationale
            isBlocked={permissionsVm.isBlocked}
            onRequest={() => {
              void permissionsVm.requestAll();
            }}
            onOpenSettings={() => {
              void permissionsVm.openSettings();
            }}
          />
        ) : null}
      </View>
    </Screen>
  );
}
