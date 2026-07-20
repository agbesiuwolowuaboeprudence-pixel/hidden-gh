import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '@/src/theme';
import { useAuthStore } from '@/src/store/authStore';

function RootStack() {
  const { colors } = useTheme();
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => { hydrate(); }, [hydrate]);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ animation: 'none' }} />
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      <Stack.Screen name="site-detail" />
      <Stack.Screen name="guide-detail" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="premium" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="hotels" />
      <Stack.Screen name="help-support" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider initialScheme="dark">
      <SafeAreaProvider>
        <RootStack />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
