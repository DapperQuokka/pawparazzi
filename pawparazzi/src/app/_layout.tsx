import AppTabs from '@/components/app-tabs';
import { AnimalProvider } from '@/context/AnimalProvider';
import { AuthProvider } from '@/context/AuthProvider';

/** Tab group layout — renders the native tab bar with its screens. */
export default function TabLayout() {
  return (
		<AuthProvider>
			<AnimalProvider>
				<AppTabs />
			</AnimalProvider>
		</AuthProvider>
	);
}
