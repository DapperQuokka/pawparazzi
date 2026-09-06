import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
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

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user, isLoggedIn, logout, updateProfile } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('Adopter');
  const [editAddress, setEditAddress] = useState('');
  const [editWebsite, setEditWebsite] = useState('');

  const paddingTop = Platform.OS === 'ios' ? insets.top : insets.top + Spacing.two;
  const paddingBottom = insets.bottom + BottomTabInset + Spacing.four;

  const handleOpenEdit = () => {
    if (!user) return;
    setEditName(user.name);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditInstagram(user.instagramHandle);
    setEditBio(user.bio || '');
    setEditRole(user.role);
    setEditAddress(user.address || '');
    setEditWebsite(user.websiteUrl || '');
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    updateProfile({
      name: editName.trim() || 'Anonymous User',
      username: editUsername.trim().replace(/^@/, '') || 'user',
      email: editEmail.trim(),
      instagramHandle: editInstagram.trim().startsWith('@')
        ? editInstagram.trim()
        : `@${editInstagram.trim()}`,
      bio: editBio.trim(),
      role: editRole,
      address: editRole === 'Shelter' ? editAddress.trim() : undefined,
      websiteUrl: editRole === 'Shelter' ? editWebsite.trim() : undefined,
    });
    setIsEditModalOpen(false);
  };

  const handleOpenInstagram = () => {
    if (!user?.instagramHandle) return;
    const cleanHandle = user.instagramHandle.replace('@', '').trim();
    const url = `https://instagram.com/${cleanHandle}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Instagram Link', `Opening profile: ${url}`);
      }
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
          {/* Avatar Photo Placeholder */}
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

          {/* Role Badge Pill — without "Role:" prefix */}
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

          {/* Editable Bio / Description under Role Pill */}
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
          <Text style={[styles.instagramHandleText, { color: BrandColors.accent }]}>
            {user.instagramHandle || '@not_connected'}
          </Text>
          <Pressable
            onPress={handleOpenInstagram}
            style={({ pressed }) => [
              styles.instagramLinkButton,
              pressed && { opacity: 0.8 },
            ]}>
            <Text style={styles.instagramLinkText}>🔗 Visit Instagram Profile</Text>
          </Pressable>
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
          <DetailRow label="Instagram" value={user.instagramHandle} theme={theme} isLast />
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
      <Modal visible={isEditModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile</Text>

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              {editRole === 'Shelter' ? 'Shelter Name' : 'Full Name'}
            </Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
            />

            {editRole === 'Shelter' && (
              <>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Shelter Address
                </Text>
                <TextInput
                  value={editAddress}
                  onChangeText={setEditAddress}
                  placeholder="123 Rescue Way, Austin, TX"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
                />

                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  External Website URL
                </Text>
                <TextInput
                  value={editWebsite}
                  onChangeText={setEditWebsite}
                  placeholder="https://happypawsrescue.org"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </>
            )}

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Username</Text>
            <TextInput
              value={editUsername}
              onChangeText={setEditUsername}
              style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
              autoCapitalize="none"
            />

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Email Address</Text>
            <TextInput
              value={editEmail}
              onChangeText={setEditEmail}
              keyboardType="email-address"
              style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
              autoCapitalize="none"
            />

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Instagram Handle</Text>
            <TextInput
              value={editInstagram}
              onChangeText={setEditInstagram}
              placeholder="@username"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
              autoCapitalize="none"
            />

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Bio / Description</Text>
            <TextInput
              value={editBio}
              onChangeText={setEditBio}
              placeholder="Tell us about yourself or your shelter..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: theme.backgroundElement, color: theme.text },
              ]}
            />

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Account Role</Text>
            <View style={styles.rolePickerRow}>
              {(['Adopter', 'Shelter'] as UserRole[]).map(role => (
                <Pressable
                  key={role}
                  onPress={() => setEditRole(role)}
                  style={[
                    styles.roleChip,
                    {
                      backgroundColor:
                        editRole === role ? BrandColors.accent : theme.backgroundElement,
                    },
                  ]}>
                  <Text style={[styles.roleChipText, { color: editRole === role ? '#fff' : theme.text }]}>
                    {role === 'Shelter' ? 'Shelter 🏠' : 'Adopter 🐾'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalButtonsRow}>
              <Pressable
                onPress={() => setIsEditModalOpen(false)}
                style={[styles.modalButton, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.modalButtonText, { color: theme.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveProfile}
                style={[styles.modalButton, { backgroundColor: BrandColors.accent }]}>
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  modalCard: {
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: Spacing.one,
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
  rolePickerRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  roleChipText: {
    fontWeight: '700',
    fontSize: 14,
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
