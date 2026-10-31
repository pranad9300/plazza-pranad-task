import '../../global.css';
import { Stack } from 'expo-router';
import { AppProviders } from '@/di/AppProviders';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="coupons"
          options={{ headerShown: true, title: 'All coupons', headerBackTitle: 'Cart' }}
        />
      </Stack>
    </AppProviders>
  );
}
