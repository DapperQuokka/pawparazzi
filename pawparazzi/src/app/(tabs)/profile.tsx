import { useTheme } from "@/hooks/use-theme";
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView, StyleSheet, Text, TextInput, Pressable } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

import { useState } from 'react';
import { useAuth } from "@/context/AuthProvider";

export default function Profile() {

	const theme = useTheme();
	const { session, user, loading, signUp, signIn, signOut } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [newUser, setNewUser] = useState(false);

	console.log(user, session, loading)

	return (
		<ThemedView style={[styles.container, { flexDirection: 'column' }]}>
			<SafeAreaView>
				{ user ?
					(
						<>
							<ThemedText>
								Email: { user?.email }
							</ThemedText>
							<ThemedText>
								ID: { user?.id }
							</ThemedText>
							<ThemedView>
								<Pressable
									onPress={async () => {
										await signOut()
									}}
								>
									<Text>Log Out</Text>
								</Pressable>
							</ThemedView>
						</>
					) :
					(
						<>
						{ newUser ? (
							<>
								<ThemedView>
									<ThemedText style={{color: theme.primary}}>
										Email:
									</ThemedText>
									<TextInput 
										value={email}
										placeholder='Email Address'
										autoCorrect={false}
										autoComplete="email"
										inputMode="email"
										keyboardType="email-address"
										onChangeText={(text) => setEmail(text)}
									/>
								</ThemedView>
								<ThemedView>
									<ThemedText style={{color: theme.primary}}>
										Password:
									</ThemedText>
									<TextInput 
										value={password}
										placeholder='Password'
										autoComplete="current-password"
										secureTextEntry={true}
										autoCorrect={false}
										onChangeText={(text) => setPassword(text)}
									/>
								</ThemedView>
								<ThemedView>
									<Pressable
										onPress={async () => {
											await signUp(email, password)
										}}
									>
										<Text>Register</Text>
									</Pressable>
								</ThemedView>
								<ThemedText>
									Already have an account?
									<Pressable onPress={() => setNewUser(false) }>
										<Text>Sign in here!</Text>
									</Pressable>
								</ThemedText>
							</>
						) : (
							<>
								<ThemedView>
									<ThemedText style={{color: theme.primary}}>
										Email:
									</ThemedText>
									<TextInput 
										style={[styles.input]}
										value={email}
										placeholder='Email Address'
										autoCorrect={false}
										autoComplete="email"
										inputMode="email"
										keyboardType="email-address"
										onChangeText={(text) => setEmail(text)}
									/>
								</ThemedView>
								<ThemedView>
									<ThemedText style={{color: theme.primary}}>
										Password:
									</ThemedText>
									<TextInput 
										value={password}
										placeholder='Password'
										autoComplete="current-password"
										secureTextEntry={true}
										autoCorrect={false}
										onChangeText={(text) => setPassword(text)}
									/>
								</ThemedView>
								<ThemedView>
									<Pressable
										onPress={async () => {
											await signIn(email, password)
										}}
									>
										<Text>Sign In</Text>
									</Pressable>
								</ThemedView>
								<ThemedText>
									New user?
									<Pressable onPress={() => setNewUser(true) }>
										<Text>Register here!</Text>
									</Pressable>
								</ThemedText>
							</>
						) }
						</>
					) }
			</SafeAreaView>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	container: {
    flex: 1,
		padding: 12,
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'flex-start'
  },
	input: {
		borderWidth: 1,
		borderRadius: 5,
		width: '100%'
	}
})