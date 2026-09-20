import { useTheme } from "@/hooks/use-theme";
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView, Text } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function Favourite() {

	const theme = useTheme();

	return (
		<ThemedView>
			<SafeAreaView>
				<ScrollView>
					<ThemedText>FAVOURITE</ThemedText>
					<ThemedText>FAVOURITE</ThemedText>
					<ThemedText>FAVOURITE</ThemedText>
					<ThemedText>FAVOURITE</ThemedText>
					<ThemedText>FAVOURITE</ThemedText>
					<ThemedText>FAVOURITE</ThemedText>
					<ThemedText>FAVOURITE</ThemedText>
				</ScrollView>
			</SafeAreaView>
		</ThemedView>
	)
}