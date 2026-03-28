import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../src/context/AppContext';
import { COLORS } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="pet/add" options={{ presentation: 'modal' }} />
        <Stack.Screen name="pet/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="premium" options={{ presentation: 'modal' }} />
      </Stack>
    </AppProvider>
  );
}
