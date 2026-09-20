import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';

export default function AppTabs() {

  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
	const { user, session } = useAuth();

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.secondary}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{ default: require('@/assets/images/tabIcons/home.png'), selected: require('@/assets/images/tabIcons/home-selected.png')}}
        />
      </NativeTabs.Trigger>
			{ user ? (
					<NativeTabs.Trigger name="(tabs)/favourite">
						<NativeTabs.Trigger.Label>Favourite</NativeTabs.Trigger.Label>
						<NativeTabs.Trigger.Icon
							src={{ default: require('@/assets/images/tabIcons/favorite.png'), selected: require('@/assets/images/tabIcons/favorite-selected.png')}}
						/>
					</NativeTabs.Trigger>
				) : (<></>) 
			}
			{ user ? (
					<NativeTabs.Trigger name="(tabs)/urgent">
						<NativeTabs.Trigger.Label>Urgent</NativeTabs.Trigger.Label>
						<NativeTabs.Trigger.Icon
							src={{ default: require('@/assets/images/tabIcons/urgent.png'), selected: require('@/assets/images/tabIcons/urgent-selected.png')}}
						/>
					</NativeTabs.Trigger>
				) : (<></>) 
			}

			<NativeTabs.Trigger name="(tabs)/profile">
				<NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon
					src={{ default: require('@/assets/images/tabIcons/user.png'), selected: require('@/assets/images/tabIcons/user-selected.png')}}
				/>
			</NativeTabs.Trigger>
    </NativeTabs>
  );
}
