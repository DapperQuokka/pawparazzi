import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

import { AuthProvider } from '@/context/auth-context';

SplashScreen.preventAutoHideAsync();

/**
 * Root layout — wraps the whole app in a Stack navigator.
 *
 * Screens:
 *  - (tabs)  → the bottom-tab group (animal listing + explore + profile + auth)
 *  - animal/[id] → animal profile, presented as a card push over the tabs
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="animal/[id]"
            options={{ headerShown: false, presentation: 'card' }}
          />
          <Stack.Screen
            name="shelter/[id]"
            options={{ headerShown: false, presentation: 'card' }}
          />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
