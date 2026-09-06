import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandColors, BottomTabInset, Spacing } from '@/constants/theme';
import { useAuth, UserRole } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';

export default function AuthScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { login, signup, isLoggedIn, user } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Log in form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up form state
  const [signupRole, setSignupRole] = useState<UserRole>('Adopter');
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupInstagram, setSignupInstagram] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [signupWebsite, setSignupWebsite] = useState('');

  const paddingTop = Platform.OS === 'ios' ? insets.top : insets.top + Spacing.two;
  const paddingBottom = insets.bottom + BottomTabInset + Spacing.four;

  const handleLoginSubmit = () => {
    if (!loginEmail.trim()) {
      Alert.alert('Missing field', 'Please enter your email or username.');
      return;
    }
    login(loginEmail.trim());
    router.replace('/profile' as any);
  };

  const handleSignupSubmit = () => {
    if (!signupEmail.trim() || !signupName.trim()) {
      Alert.alert(
        'Missing fields',
        signupRole === 'Shelter'
          ? 'Please enter shelter name and email address.'
          : 'Please enter your name and email address.'
      );
      return;
    }
    if (signupRole === 'Shelter' && (!signupAddress.trim() || !signupWebsite.trim())) {
      Alert.alert('Missing shelter details', 'Please enter shelter address and website URL.');
      return;
    }
    signup({
      name: signupName.trim(),
      username: signupUsername.trim().replace(/^@/, '') || signupEmail.split('@')[0],
      email: signupEmail.trim(),
      role: signupRole,
      address: signupRole === 'Shelter' ? signupAddress.trim() : undefined,
      websiteUrl: signupRole === 'Shelter' ? signupWebsite.trim() : undefined,
      instagramHandle: signupInstagram.trim()
        ? signupInstagram.trim().startsWith('@')
          ? signupInstagram.trim()
          : `@${signupInstagram.trim()}`
        : `@${signupName.toLowerCase().replace(/\s+/g, '')}`,
      bio:
        signupRole === 'Shelter'
          ? 'Licensed shelter unit connecting animals with loving homes.'
          : 'Ready to adopt a new family member!',
      avatarUrl: require('@/assets/images/pawparazzi/kenzo.jpeg'),
    });
    router.replace('/profile' as any);
  };

  const handleDemoLogin = (role: UserRole) => {
    if (role === 'Adopter') {
      login('alex.morgan@example.com', 'Adopter');
    } else {
      login('haven.shelter@example.com', 'Shelter');
    }
    router.replace('/profile' as any);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: paddingTop + Spacing.two, paddingBottom },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🐾</Text>
          <Text style={[styles.title, { color: theme.text }]}>Welcome to Pawparazzi</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {isLoggedIn
              ? `Currently logged in as @${user?.username}`
              : 'Sign in to contact shelters and adopt pets'}
          </Text>
        </View>

        {/* Mode Switch Segment */}
        <View style={[styles.segmentContainer, { backgroundColor: theme.backgroundElement }]}>
          <Pressable
            onPress={() => setMode('login')}
            style={[
              styles.segmentButton,
              mode === 'login' && { backgroundColor: theme.background, shadowOpacity: 0.1 },
            ]}>
            <Text style={[styles.segmentText, { color: mode === 'login' ? theme.text : theme.textSecondary }]}>
              Log In
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('signup')}
            style={[
              styles.segmentButton,
              mode === 'signup' && { backgroundColor: theme.background, shadowOpacity: 0.1 },
            ]}>
            <Text style={[styles.segmentText, { color: mode === 'signup' ? theme.text : theme.textSecondary }]}>
              Sign Up
            </Text>
          </Pressable>
        </View>

        {/* ── Log In Form ── */}
        {mode === 'login' ? (
          <View style={[styles.formCard, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Email or Username</Text>
            <TextInput
              value={loginEmail}
              onChangeText={setLoginEmail}
              placeholder="alex.morgan@example.com"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Password</Text>
            <TextInput
              value={loginPassword}
              onChangeText={setLoginPassword}
              placeholder="••••••••"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
            />

            <Pressable
              onPress={handleLoginSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                { backgroundColor: pressed ? BrandColors.accentDark : BrandColors.accent },
              ]}>
              <Text style={styles.submitButtonText}>Log In</Text>
            </Pressable>

            <View style={styles.demoDivider}>
              <View style={[styles.line, { backgroundColor: theme.backgroundSelected }]} />
              <Text style={[styles.demoDividerText, { color: theme.textSecondary }]}>
                Quick Demo Logins
              </Text>
              <View style={[styles.line, { backgroundColor: theme.backgroundSelected }]} />
            </View>

            <View style={styles.demoRow}>
              <Pressable
                onPress={() => handleDemoLogin('Adopter')}
                style={[styles.demoButton, { backgroundColor: theme.background }]}>
                <Text style={[styles.demoButtonText, { color: BrandColors.accent }]}>
                  🐾 Demo Adopter
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleDemoLogin('Shelter')}
                style={[styles.demoButton, { backgroundColor: theme.background }]}>
                <Text style={[styles.demoButtonText, { color: '#2563EB' }]}>
                  🏠 Demo Shelter
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          /* ── Sign Up Form ── */
          <View style={[styles.formCard, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Account Role</Text>
            <View style={styles.roleRow}>
              {(['Adopter', 'Shelter'] as UserRole[]).map(r => (
                <Pressable
                  key={r}
                  onPress={() => setSignupRole(r)}
                  style={[
                    styles.roleChip,
                    {
                      backgroundColor:
                        signupRole === r ? BrandColors.accent : theme.background,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.roleChipText,
                      { color: signupRole === r ? '#ffffff' : theme.text },
                    ]}>
                    {r === 'Shelter' ? '🏠 Shelter' : '🐾 Adopter'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              {signupRole === 'Shelter' ? 'Shelter Name' : 'Full Name'}
            </Text>
            <TextInput
              value={signupName}
              onChangeText={setSignupName}
              placeholder={signupRole === 'Shelter' ? 'e.g. Happy Paws Rescue' : 'e.g. Alex Morgan'}
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
            />

            {signupRole === 'Shelter' && (
              <>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Shelter Address
                </Text>
                <TextInput
                  value={signupAddress}
                  onChangeText={setSignupAddress}
                  placeholder="123 Rescue Way, Austin, TX 78701"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                />

                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  External Website URL
                </Text>
                <TextInput
                  value={signupWebsite}
                  onChangeText={setSignupWebsite}
                  placeholder="https://happypawsrescue.org"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </>
            )}

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Username</Text>
            <TextInput
              value={signupUsername}
              onChangeText={setSignupUsername}
              placeholder={signupRole === 'Shelter' ? 'happypaws_tx' : 'alex_adopts'}
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              autoCapitalize="none"
            />

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Email Address</Text>
            <TextInput
              value={signupEmail}
              onChangeText={setSignupEmail}
              placeholder={signupRole === 'Shelter' ? 'info@happypawsrescue.org' : 'alex@example.com'}
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Password</Text>
            <TextInput
              value={signupPassword}
              onChangeText={setSignupPassword}
              placeholder="Create password"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
            />

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              Instagram Handle (Optional)
            </Text>
            <TextInput
              value={signupInstagram}
              onChangeText={setSignupInstagram}
              placeholder="@pawparazzi_friend"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              autoCapitalize="none"
            />

            <Pressable
              onPress={handleSignupSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                { backgroundColor: pressed ? BrandColors.accentDark : BrandColors.accent },
              ]}>
              <Text style={styles.submitButtonText}>Create Account ({signupRole})</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  headerEmoji: {
    fontSize: 42,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  formCard: {
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.one,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  roleChipText: {
    fontWeight: '700',
    fontSize: 14,
  },
  demoDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginVertical: Spacing.two,
  },
  line: {
    flex: 1,
    height: 1,
  },
  demoDividerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  demoRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  demoButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  demoButtonText: {
    fontWeight: '700',
    fontSize: 13,
  },
});
