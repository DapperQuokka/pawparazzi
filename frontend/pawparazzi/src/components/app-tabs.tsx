import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

/**
 * Native tab bar — Trigger names reference route files inside the (tabs) group.
 * Expo Router resolves these relative to the group's layout context.
 */
export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  const { user, isLoggedIn } = useAuth();
  const isShelter = user?.role === 'Shelter';

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Adopt</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="pawprint.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="urgent">
        <NativeTabs.Trigger.Label>Urgent</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="flame.fill" />
      </NativeTabs.Trigger>

      {isShelter && (
        <NativeTabs.Trigger name="manage">
          <NativeTabs.Trigger.Label>Manage</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="slider.horizontal.3" />
        </NativeTabs.Trigger>
      )}

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>{isLoggedIn ? 'Profile' : 'Log In'}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={isLoggedIn ? 'person.crop.circle.fill' : 'person.badge.key.fill'} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
