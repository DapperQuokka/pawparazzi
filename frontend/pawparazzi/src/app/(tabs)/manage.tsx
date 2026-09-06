import { useState } from 'react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddAnimalModal } from '@/components/add-animal-modal';
import { BrandColors, BottomTabInset, Spacing } from '@/constants/theme';
import { formatAge, type Animal } from '@/data/animals';
import { useAnimals } from '@/context/animal-context';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';

export default function ManageScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user, isLoggedIn } = useAuth();
  const { getAnimalsForShelter } = useAnimals();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const paddingTop = Platform.OS === 'ios' ? insets.top : insets.top + Spacing.two;
  const paddingBottom = insets.bottom + BottomTabInset + Spacing.four;

  if (!isLoggedIn || !user) {
    return (
      <View style={[styles.gateContainer, { backgroundColor: theme.background }]}>
        <Text style={styles.gateEmoji}>🔒</Text>
        <Text style={[styles.gateTitle, { color: theme.text }]}>Sign In Required</Text>
        <Text style={[styles.gateSubtitle, { color: theme.textSecondary }]}>
          Log in as a shelter account to manage your listings.
        </Text>
        <Pressable
          onPress={() => router.push('/auth' as any)}
          style={({ pressed }) => [
            styles.gateButton,
            { backgroundColor: pressed ? BrandColors.accentDark : BrandColors.accent },
          ]}>
          <Text style={styles.gateButtonText}>Go to Log In</Text>
        </Pressable>
      </View>
    );
  }

  if (user.role !== 'Shelter') {
    return (
      <View style={[styles.gateContainer, { backgroundColor: theme.background }]}>
        <Text style={styles.gateEmoji}>🏠</Text>
        <Text style={[styles.gateTitle, { color: theme.text }]}>Shelters Only</Text>
        <Text style={[styles.gateSubtitle, { color: theme.textSecondary }]}>
          This section is for shelter accounts only.
        </Text>
      </View>
    );
  }

  const shelterAnimals = getAnimalsForShelter(user.name);

  const handleAddAnimal = () => {
    setIsAddModalOpen(true);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: paddingTop + Spacing.two, paddingBottom },
        ]}
        showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.text }]}>Manage</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {user.name} · {shelterAnimals.length} animal{shelterAnimals.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Pressable
            onPress={handleAddAnimal}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: pressed ? BrandColors.accentDark : BrandColors.accent },
            ]}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <StatCard emoji="🐾" value={String(shelterAnimals.length)} label="Total" theme={theme} />
          <StatCard
            emoji="🐕"
            value={String(shelterAnimals.filter(a => a.species === 'dog').length)}
            label="Dogs"
            theme={theme}
          />
          <StatCard
            emoji="🐈"
            value={String(shelterAnimals.filter(a => a.species === 'cat').length)}
            label="Cats"
            theme={theme}
          />
          <StatCard
            emoji="🐇"
            value={String(shelterAnimals.filter(a => a.species !== 'dog' && a.species !== 'cat').length)}
            label="Other"
            theme={theme}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Animals</Text>

          {shelterAnimals.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.backgroundElement }]}>
              <Text style={styles.emptyEmoji}>🐾</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No listings yet</Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Tap "+ Add" above to list your first animal for adoption.
              </Text>
              <Pressable
                onPress={handleAddAnimal}
                style={({ pressed }) => [
                  styles.emptyAddBtn,
                  { backgroundColor: pressed ? BrandColors.accentDark : BrandColors.accent },
                ]}>
                <Text style={styles.emptyAddBtnText}>+ Add First Animal</Text>
              </Pressable>
            </View>
          ) : (
            shelterAnimals.map(animal => (
              <AnimalManageRow
                key={animal.id}
                animal={animal}
                theme={theme}
                onPress={() => router.push(`/animal/${animal.id}` as any)}
              />
            ))
          )}
        </View>

        {shelterAnimals.length > 0 && (
          <Pressable
            onPress={handleAddAnimal}
            style={({ pressed }) => [
              styles.addMoreButton,
              { backgroundColor: theme.backgroundElement, borderColor: BrandColors.accent },
              pressed && { opacity: 0.75 },
            ]}>
            <Text style={[styles.addMoreButtonText, { color: BrandColors.accent }]}>
              + Add New Animal Listing
            </Text>
          </Pressable>
        )}

      </ScrollView>

      <AddAnimalModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </View>
  );
}

function StatCard({
  emoji, value, label, theme,
}: { emoji: string; value: string; label: string; theme: ReturnType<typeof useTheme> }) {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.backgroundElement }]}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
    </View>
  );
}

function AnimalManageRow({
  animal, theme, onPress,
}: { animal: Animal; theme: ReturnType<typeof useTheme>; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.animalRow,
        { backgroundColor: theme.backgroundElement },
        pressed && { opacity: 0.85 },
      ]}>
      <Image source={animal.imageSource} style={styles.animalThumb} contentFit="cover" />
      <View style={styles.animalInfo}>
        <Text style={[styles.animalName, { color: theme.text }]}>{animal.name}</Text>
        <Text style={[styles.animalMeta, { color: theme.textSecondary }]}>
          {animal.breed} · {formatAge(animal.age)}
        </Text>
        <View style={styles.animalChipsRow}>
          <View style={[styles.chip, { backgroundColor: BrandColors.accentMuted }]}>
            <Text style={[styles.chipText, { color: BrandColors.accent }]}>{animal.species}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: BrandColors.accentMuted }]}>
            <Text style={[styles.chipText, { color: BrandColors.accent }]}>{animal.gender}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: BrandColors.accentMuted }]}>
            <Text style={[styles.chipText, { color: BrandColors.accent }]}>{animal.size}</Text>
          </View>
        </View>
      </View>
      <Text style={[styles.chevron, { color: BrandColors.accent }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.three, gap: Spacing.three },
  gateContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.four, gap: Spacing.two },
  gateEmoji: { fontSize: 52 },
  gateTitle: { fontSize: 22, fontWeight: '800' },
  gateSubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  gateButton: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14, marginTop: Spacing.two },
  gateButtonText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerText: { gap: 2 },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { fontSize: 13, fontWeight: '500' },
  addButton: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  addButtonText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  statsRow: { flexDirection: 'row', gap: Spacing.two },
  statCard: { flex: 1, borderRadius: 16, padding: Spacing.two, alignItems: 'center', gap: 2 },
  statEmoji: { fontSize: 18 },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  section: { gap: Spacing.two },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.2 },
  emptyCard: { borderRadius: 18, padding: Spacing.five, alignItems: 'center', gap: Spacing.two },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontSize: 17, fontWeight: '700' },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  emptyAddBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginTop: Spacing.one },
  emptyAddBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  animalRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, overflow: 'hidden', gap: Spacing.two, padding: Spacing.two },
  animalThumb: { width: 70, height: 70, borderRadius: 12 },
  animalInfo: { flex: 1, gap: 3 },
  animalName: { fontSize: 16, fontWeight: '700' },
  animalMeta: { fontSize: 12, fontWeight: '500' },
  animalChipsRow: { flexDirection: 'row', gap: 5, marginTop: 3 },
  chip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  chipText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  chevron: { fontSize: 22, paddingHorizontal: Spacing.one },
  addMoreButton: { borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, borderStyle: 'dashed' },
  addMoreButtonText: { fontSize: 15, fontWeight: '700' },
});
