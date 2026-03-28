import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../src/context/AppContext';
import { COLORS } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="habit/add"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="habit/[id]"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="premium"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </AppProvider>
  );
}
