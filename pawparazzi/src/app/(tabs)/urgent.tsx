
import { useTheme } from "@/hooks/use-theme";
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView, Text } from "react-native";
import { useAnimals } from "@/context/AnimalProvider";
import { useEffect } from "react";

export default function Urgent() {

	const theme = useTheme();
	const { animals } = useAnimals();


	useEffect(() => {
	})

	console.log(animals);

	return (
		<SafeAreaView>
			<ScrollView>
				<Text>URGENT</Text>
			</ScrollView>
		</SafeAreaView>
	)
}