import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandColors, BottomTabInset, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user, isLoggedIn, logout, updateProfile } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editName, setEditName] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editWebsite, setEditWebsite] = useState('');

  const paddingTop = insets.top + Spacing.two;
  const paddingBottom = insets.bottom + BottomTabInset + Spacing.four;

  const handleOpenEdit = () => {
    if (!user) return;
    setEditName(user.name);
    setEditInstagram(user.instagramHandle);
    setEditBio(user.bio || '');
    setEditAddress(user.address || '');
    setEditWebsite(user.websiteUrl || '');
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const cleanInstagram = editInstagram.trim()
        ? editInstagram.trim().startsWith('@')
          ? editInstagram.trim()
          : `@${editInstagram.trim()}`
        : '';

      await updateProfile({
        name: editName.trim() || 'Anonymous User',
        instagramHandle: cleanInstagram,
        bio: editBio.trim(),
        address: user.role === 'Shelter' ? editAddress.trim() : undefined,
        websiteUrl: user.role === 'Shelter' ? editWebsite.trim() : undefined,
      });
      setIsEditModalOpen(false);
    } catch {
      // Error alert handled in auth-context updateProfile
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenInstagram = () => {
    if (!user?.instagramHandle) return;
    const cleanHandle = user.instagramHandle.replace('@', '').trim();
    const url = `https://instagram.com/${cleanHandle}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Unable to open link', `Could not open ${url}`);
    });
  };

  if (!isLoggedIn || !user) {
    return (
      <View style={[styles.loggedOutContainer, { backgroundColor: theme.background }]}>
        <Text style={styles.loggedOutEmoji}>👤</Text>
        <Text style={[styles.loggedOutTitle, { color: theme.text }]}>Not Logged In</Text>
        <Text style={[styles.loggedOutSubtitle, { color: theme.textSecondary }]}>
          Sign in or create an account to manage your profile and adoptions.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.authButton,
            { backgroundColor: pressed ? BrandColors.accentDark : BrandColors.accent },
          ]}
          onPress={() => router.push('/auth' as any)}>
          <Text style={styles.authButtonText}>Go to Log In / Sign Up</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: paddingTop + Spacing.two, paddingBottom },
        ]}
        showsVerticalScrollIndicator={false}>
        
        {/* ── Profile Header ── */}
        <View style={[styles.headerCard, { backgroundColor: theme.backgroundElement }]}>
          <View style={styles.avatarWrapper}>
            <Image
              source={user.avatarUrl || require('@/assets/images/pawparazzi/kenzo.jpeg')}
              style={styles.avatarImage}
              contentFit="cover"
            />
          </View>

          <Text style={[styles.name, { color: theme.text }]}>{user.name}</Text>
          <Text style={[styles.username, { color: theme.textSecondary }]}>
            @{user.username}
          </Text>

          {/* Role Badge Pill */}
          <View style={styles.roleRow}>
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor:
                    user.role === 'Shelter'
                      ? 'rgba(59, 130, 246, 0.15)'
                      : BrandColors.accentMuted,
                },
              ]}>
              <Text
                style={[
                  styles.roleBadgeText,
                  {
                    color:
                      user.role === 'Shelter'
                        ? '#2563EB'
                        : BrandColors.accent,
                  },
                ]}>
                {user.role === 'Shelter' ? 'Shelter 🏠' : 'Adopter 🐾'}
              </Text>
            </View>
          </View>

          {/* Editable Bio / Description */}
          <Text style={[styles.bioText, { color: theme.textSecondary }]}>
            {user.bio || 'No description provided yet. Tap Edit Profile to add a bio!'}
          </Text>
        </View>

        {/* ── Instagram Integration Stub ── */}
        <View style={[styles.sectionCard, { backgroundColor: theme.backgroundElement }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionIcon}>📸</Text>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Instagram Account</Text>
          </View>
          <Text style={[styles.instagramHandleText, { color: user.instagramHandle ? BrandColors.accent : theme.textSecondary }]}>
            {user.instagramHandle || 'Not connected'}
          </Text>
          {user.instagramHandle ? (
            <Pressable
              onPress={handleOpenInstagram}
              style={({ pressed }) => [
                styles.instagramLinkButton,
                pressed && { opacity: 0.8 },
              ]}>
              <Text style={styles.instagramLinkText}>🔗 Visit Instagram Profile</Text>
            </Pressable>
          ) : null}
        </View>

        {/* ── Shelter Website Section (Shelters only) ── */}
        {user.role === 'Shelter' && (
          <View style={[styles.sectionCard, { backgroundColor: theme.backgroundElement }]}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionIcon}>🌐</Text>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>External Website</Text>
            </View>
            <Text style={[styles.instagramHandleText, { color: BrandColors.accent }]}>
              {user.websiteUrl || 'No website set'}
            </Text>
            {user.websiteUrl ? (
              <Pressable
                onPress={() => {
                  if (user.websiteUrl) Linking.openURL(user.websiteUrl).catch(() => {});
                }}
                style={({ pressed }) => [
                  styles.instagramLinkButton,
                  { backgroundColor: BrandColors.accent },
                  pressed && { opacity: 0.8 },
                ]}>
                <Text style={styles.instagramLinkText}>🌐 Open Website</Text>
              </Pressable>
            ) : null}
          </View>
        )}

        {/* ── User Information Details ── */}
        <View style={[styles.sectionCard, { backgroundColor: theme.backgroundElement }]}>
          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: Spacing.two }]}>
            Account Details
          </Text>

          <DetailRow
            label={user.role === 'Shelter' ? 'Shelter Name' : 'Full Name'}
            value={user.name}
            theme={theme}
          />
          <DetailRow label="Username" value={`@${user.username}`} theme={theme} />
          <DetailRow label="Email Address" value={user.email} theme={theme} />
          <DetailRow label="Role" value={user.role} theme={theme} />
          {user.role === 'Shelter' && (
            <>
              <DetailRow label="Address" value={user.address || 'Not specified'} theme={theme} />
              <DetailRow label="Website" value={user.websiteUrl || 'Not specified'} theme={theme} />
            </>
          )}
          <DetailRow label="Instagram" value={user.instagramHandle || 'Not connected'} theme={theme} isLast />
        </View>

        {/* ── Actions ── */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleOpenEdit}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: BrandColors.accent },
              pressed && { opacity: 0.85 },
            ]}>
            <Text style={styles.actionButtonText}>✏️ Edit Profile</Text>
          </Pressable>

          <Pressable
            onPress={logout}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.backgroundElement },
              pressed && { opacity: 0.85 },
            ]}>
            <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>🚪 Log Out</Text>
          </Pressable>
        </View>

      </ScrollView>

      {/* ── Edit Profile Modal ── */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'overFullScreen'}
        transparent={Platform.OS !== 'ios'}
        onRequestClose={() => setIsEditModalOpen(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[styles.modalBackdrop, { backgroundColor: Platform.OS === 'ios' ? theme.background : 'rgba(0,0,0,0.5)' }]}>
            <View style={[styles.modalSheet, { backgroundColor: theme.background }]}>
              {/* Pull-down grabber bar for iOS pageSheet swipe gesture */}
              {Platform.OS === 'ios' && (
                <View style={styles.pullDownContainer}>
                  <View style={[styles.pullDownBar, { backgroundColor: theme.textSecondary }]} />
                </View>
              )}

              <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile</Text>

              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                
                <FormField
                  label={user.role === 'Shelter' ? 'Shelter Name' : 'Full Name'}
                  value={editName}
                  onChangeText={setEditName}
                  theme={theme}
                />

                {user.role === 'Shelter' && (
                  <>
                    <FormField
                      label="Shelter Address"
                      value={editAddress}
                      onChangeText={setEditAddress}
                      placeholder="123 Rescue Way, Austin, TX"
                      theme={theme}
                    />

                    <FormField
                      label="External Website URL"
                      value={editWebsite}
                      onChangeText={setEditWebsite}
                      placeholder="https://happypawsrescue.org"
                      keyboardType="url"
                      autoCapitalize="none"
                      theme={theme}
                    />
                  </>
                )}

                <FormField
                  label="Username"
                  value={`@${user.username}`}
                  editable={false}
                  helperText="Cannot be changed"
                  theme={theme}
                />

                <FormField
                  label="Email Address"
                  value={user.email}
                  editable={false}
                  helperText="Cannot be changed"
                  theme={theme}
                />

                <FormField
                  label="Account Role"
                  value={user.role === 'Shelter' ? 'Shelter 🏠' : 'Adopter 🐾'}
                  editable={false}
                  helperText="Cannot be changed"
                  theme={theme}
                />

                <FormField
                  label="Instagram Handle"
                  value={editInstagram}
                  onChangeText={setEditInstagram}
                  placeholder="@username"
                  autoCapitalize="none"
                  theme={theme}
                />

                <FormField
                  label="Bio / Description"
                  value={editBio}
                  onChangeText={setEditBio}
                  placeholder="Tell us about yourself or your shelter..."
                  multiline
                  numberOfLines={3}
                  style={styles.textArea}
                  returnKeyType="default"
                  submitBehavior="blurAndSubmit"
                  theme={theme}
                />

                {/* Modal Action Buttons inside ScrollView for smooth keyboard clearance */}
                <View style={styles.modalButtonsRow}>
                  <Pressable
                    onPress={() => setIsEditModalOpen(false)}
                    disabled={isSaving}
                    style={[styles.modalButton, { backgroundColor: theme.backgroundElement }]}>
                    <Text style={[styles.modalButtonText, { color: theme.text }]}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSaveProfile}
                    disabled={isSaving}
                    style={[styles.modalButton, { backgroundColor: BrandColors.accent }]}>
                    {isSaving ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={[styles.modalButtonText, { color: '#fff' }]}>Save Changes</Text>
                    )}
                  </Pressable>
                </View>

                <View style={{ height: Spacing.four }} />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  theme,
  placeholder,
  multiline,
  numberOfLines,
  keyboardType,
  autoCapitalize,
  style,
  returnKeyType = 'next',
  submitBehavior = 'submit',
  editable = true,
  helperText,
}: {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  theme: ReturnType<typeof useTheme>;
  editable?: boolean;
  helperText?: string;
} & Partial<TextInputProps>) {
  return (
    <View style={styles.formFieldContainer}>
      <View style={styles.formFieldHeader}>
        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{label}</Text>
        {helperText ? (
          <Text style={[styles.inputHelperText, { color: theme.textSecondary }]}>{helperText}</Text>
        ) : null}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        submitBehavior={submitBehavior}
        editable={editable}
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundElement,
            color: editable ? theme.text : theme.textSecondary,
            opacity: editable ? 1 : 0.65,
          },
          style,
        ]}
      />
    </View>
  );
}

function DetailRow({
  label,
  value,
  theme,
  isLast = false,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>;
  isLast?: boolean;
}) {
  return (
    <View
      style={[
        styles.detailRow,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(128,128,128,0.2)' },
      ]}>
      <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: theme.text }]}>{value}</Text>
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
  headerCard: {
    borderRadius: 20,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.one,
  },
  avatarWrapper: {
    width: 84,
    height: 84,
    borderRadius: 42,
    overflow: 'hidden',
    marginBottom: Spacing.one,
    borderWidth: 3,
    borderColor: BrandColors.accent,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  bioText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.two,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  sectionCard: {
    borderRadius: 18,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  instagramHandleText: {
    fontSize: 16,
    fontWeight: '700',
  },
  instagramLinkButton: {
    backgroundColor: '#E1306C',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  instagramLinkText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  loggedOutContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  loggedOutEmoji: {
    fontSize: 56,
  },
  loggedOutTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  loggedOutSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  authButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: Spacing.two,
  },
  authButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: Platform.OS === 'ios' ? 'flex-start' : 'center',
    paddingHorizontal: Platform.OS === 'ios' ? 0 : Spacing.three,
    paddingVertical: Platform.OS === 'ios' ? 0 : Spacing.four,
  },
  modalSheet: {
    flex: Platform.OS === 'ios' ? 1 : undefined,
    maxHeight: Platform.OS === 'ios' ? undefined : '90%',
    borderRadius: Platform.OS === 'ios' ? 0 : 20,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    gap: Spacing.two,
  },
  pullDownContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.one,
  },
  pullDownBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    opacity: 0.4,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: Spacing.one,
  },
  formFieldContainer: {
    gap: Spacing.one,
  },
  formFieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputHelperText: {
    fontSize: 11,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  textArea: {
    height: 72,
    textAlignVertical: 'top',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
});

