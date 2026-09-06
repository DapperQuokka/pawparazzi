import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getSpeciesEmoji } from '@/constants/species';
import { BrandColors, Spacing } from '@/constants/theme';
import { formatAge, formatDistance, getAnimalById, getShelterByName } from '@/data/animals';
import { useTheme } from '@/hooks/use-theme';

const SIZE_LABEL: Record<string, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

export default function AnimalProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const animal = getAnimalById(id);

  if (!animal) {
    return (
      <View style={[styles.notFound, { backgroundColor: theme.background }]}>
        <Text style={[styles.notFoundText, { color: theme.text }]}>Animal not found 🐾</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const shelter = getShelterByName(animal.shelter);
  const paddingBottom = insets.bottom + Spacing.three;

  const handleShelterPress = () => {
    router.push({ pathname: '/shelter/[id]', params: { id: shelter.id } } as any);
  };

  const handleContactPress = () => {
    const url = `tel:${shelter.phone.replace(/[^0-9+]/g, '')}`;
    Linking.openURL(url).catch(() => {
      handleShelterPress();
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* ── Scrollable content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: Spacing.four }}
        showsVerticalScrollIndicator={false}
        bounces>

        {/* Hero image */}
        <View style={styles.heroWrapper}>
          <Image
            source={animal.imageSource}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
          {/* Bottom scrim */}
          <View style={styles.heroScrim} />

          {/* Floating back button */}
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.floatingBack,
              {
                top: insets.top + Spacing.two,
                backgroundColor: BrandColors.overlay,
              },
            ]}>
            <View style={styles.chevronLeft} />
          </Pressable>

          {/* Name + age overlay */}
          <View style={[styles.heroOverlay, { bottom: Spacing.five + Spacing.one }]}>
            <Text style={styles.heroName}>{animal.name}</Text>
            <View style={styles.heroMeta}>
              <Text style={styles.heroAge}>{formatAge(animal.age)}</Text>
              <View style={styles.heroDot} />
              <Text style={styles.heroBreed} numberOfLines={1}>{animal.breed}</Text>
            </View>
          </View>
        </View>

        {/* ── Detail card ── */}
        <View
          style={[
            styles.detailCard,
            {
              backgroundColor: theme.background,
              marginTop: -Spacing.four,
            },
          ]}>

          {/* Stat chips */}
          <View style={styles.statRow}>
            <StatChip
              emoji={getSpeciesEmoji(animal.species)}
              label={animal.species.charAt(0).toUpperCase() + animal.species.slice(1)}
              theme={theme}
            />
            <StatChip
              emoji={animal.gender === 'male' ? '♂' : '♀'}
              label={animal.gender === 'male' ? 'Male' : 'Female'}
              theme={theme}
            />
            <StatChip
              emoji="📏"
              label={SIZE_LABEL[animal.size]}
              theme={theme}
            />
            <StatChip
              emoji="📍"
              label={formatDistance(animal.distance)}
              theme={theme}
            />
          </View>

          {/* Shelter info — Clickable to open Shelter Profile */}
          <Pressable
            onPress={handleShelterPress}
            style={({ pressed }) => [
              styles.shelterRow,
              { backgroundColor: theme.backgroundElement, borderRadius: 14 },
              pressed && { opacity: 0.8 },
            ]}>
            <View style={[styles.shelterIcon, { backgroundColor: BrandColors.accentMuted }]}>
              <Text style={styles.shelterIconText}>🏠</Text>
            </View>
            <View style={styles.shelterInfo}>
              <Text style={[styles.shelterLabel, { color: theme.textSecondary }]}>Shelter</Text>
              <Text style={[styles.shelterName, { color: theme.text }]}>
                {animal.shelter} <Text style={{ color: BrandColors.accent }}>➔</Text>
              </Text>
            </View>
          </Pressable>

          {/* Bio */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>About {animal.name}</Text>
            <Text style={[styles.bio, { color: theme.textSecondary }]}>{animal.bio}</Text>
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Traits</Text>
            <View style={styles.tagsWrap}>
              {animal.tags.map(tag => (
                <View
                  key={tag}
                  style={[styles.tag, { backgroundColor: BrandColors.accentMuted }]}>
                  <Text style={[styles.tagText, { color: BrandColors.accent }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Sticky CTA ── */}
      <View
        style={[
          styles.ctaContainer,
          {
            backgroundColor: theme.background,
            paddingBottom: paddingBottom,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: theme.backgroundElement,
          },
        ]}>
        <Pressable
          onPress={handleShelterPress}
          style={({ pressed }) => [
            styles.ctaButton,
            { backgroundColor: pressed ? BrandColors.accentDark : BrandColors.accent },
          ]}>
          <Text style={styles.ctaText}>🏠 View {animal.shelter}&apos;s Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Small icon + label chip */
function StatChip({
  emoji,
  label,
  theme,
}: {
  emoji: string;
  label: string;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={[styles.statChip, { backgroundColor: theme.backgroundElement }]}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={[styles.statLabel, { color: theme.text }]}>{label}</Text>
    </View>
  );
}

const HERO_HEIGHT = Platform.OS === 'web' ? 360 : 380;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: BrandColors.accent,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  // Hero
  heroWrapper: {
    width: '100%',
    height: HERO_HEIGHT,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  floatingBack: {
    position: 'absolute',
    left: Spacing.three,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronLeft: {
    width: 10,
    height: 10,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: '#fff',
    transform: [{ rotate: '45deg' }],
    marginLeft: 3,
  },
  heroOverlay: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
  },
  heroName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  heroAge: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  heroDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  heroBreed: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    flexShrink: 1,
  },
  // Detail card
  detailCard: {
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    gap: Spacing.four,
  },
  statRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    flex: 1,
    minWidth: '40%',
    justifyContent: 'center',
  },
  statEmoji: {
    fontSize: 16,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  shelterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  shelterIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelterIconText: {
    fontSize: 22,
  },
  shelterInfo: {
    gap: 2,
  },
  shelterLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  shelterName: {
    fontSize: 15,
    fontWeight: '700',
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  bio: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  // CTA
  ctaContainer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  ctaButton: {
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
});
