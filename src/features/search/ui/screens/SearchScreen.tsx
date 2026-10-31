import { ScrollView, TextInput, View } from 'react-native';
import { AppText, EmptyState, Loader, Screen } from '@/common/components';
import { colors } from '@/core/theme';
import {
  PermissionDebugBanner,
  PermissionRationale,
  usePermissionsViewModel,
} from '@/features/permissions';
import { MedicineResultRow } from '../components/MedicineResultRow';
import { RecentSearchList } from '../components/RecentSearchList';
import { searchStyles } from '../styles/search.styles';
import { useSearchViewModel } from '../viewmodels/useSearchViewModel';

export function SearchScreen() {
  const permissionsVm = usePermissionsViewModel();
  const searchVm = useSearchViewModel();

  return (
    <Screen>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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
              locationNeedsAction={permissionsVm.locationNeedsAction}
              notificationNeedsAction={permissionsVm.notificationNeedsAction}
              onRequest={() => {
                void permissionsVm.requestAll();
              }}
              onOpenSettings={() => {
                void permissionsVm.openSettings();
              }}
            />
          ) : null}
        </View>

        <TextInput
          accessibilityLabel="Search medicines"
          className={searchStyles.input}
          placeholder="Search Dolo 650 mg"
          placeholderTextColor={colors.muted}
          value={searchVm.query}
          onChangeText={searchVm.setQuery}
          onSubmitEditing={searchVm.submitSearch}
          returnKeyType="search"
        />

        <RecentSearchList items={searchVm.recents} onSelect={searchVm.selectRecent} />

        <View className="mt-lg">
          {searchVm.status === 'idle' ? (
            <EmptyState title="Search medicines" message="Try a name or salt like Paracetamol." />
          ) : null}
          {searchVm.status === 'loading' ? <Loader /> : null}
          {searchVm.status === 'noResults' ? (
            <EmptyState title="No results" message="Nothing matched that search." />
          ) : null}
          {searchVm.status === 'results'
            ? searchVm.results.map((medicine) => (
                <MedicineResultRow
                  key={medicine.id}
                  medicine={medicine}
                  qty={searchVm.qtyFor(medicine.id)}
                  onAdd={() => searchVm.addToCart(medicine)}
                  onIncrement={() => searchVm.increment(medicine.id)}
                  onDecrement={() => searchVm.decrement(medicine.id)}
                />
              ))
            : null}
        </View>
      </ScrollView>
    </Screen>
  );
}
