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

import { AnimalCard } from '@/components/animal-card';
import { BrandColors, Spacing } from '@/constants/theme';
import { useAnimals } from '@/context/animal-context';
import { getShelterById, getShelterByName } from '@/data/animals';
import { useTheme } from '@/hooks/use-theme';

export default function ShelterProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { getAnimalsForShelter } = useAnimals();

  const shelter = getShelterById(id) || getShelterByName(id);

  if (!shelter) {
    return (
      <View style={[styles.notFound, { backgroundColor: theme.background }]}>
        <Text style={[styles.notFoundText, { color: theme.text }]}>Shelter not found 🏠</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const animals = getAnimalsForShelter(shelter.name);
  const paddingBottom = insets.bottom + Spacing.four;

  const handleCall = () => {
    const phoneUrl = `tel:${shelter.phone.replace(/[^0-9+]/g, '')}`;
    Linking.openURL(phoneUrl).catch(() => {});
  };

  const handleEmail = () => {
    const emailUrl = `mailto:${shelter.email}`;
    Linking.openURL(emailUrl).catch(() => {});
  };

  const handleWebsite = () => {
    Linking.openURL(shelter.website).catch(() => {});
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom }}
        showsVerticalScrollIndicator={false}
        bounces>

        {/* Hero Banner */}
        <View style={styles.heroWrapper}>
          <Image
            source={shelter.imageSource}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.heroScrim} />

          {/* Back button */}
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

          {/* Shelter Name & Badge Overlay */}
          <View style={[styles.heroOverlay, { bottom: Spacing.four }]}>
            <View style={styles.badgeRow}>
              <View style={styles.shelterBadge}>
                <Text style={styles.shelterBadgeText}>Verified Shelter 🏠</Text>
              </View>
            </View>
            <Text style={styles.heroName}>{shelter.name}</Text>
          </View>
        </View>

        {/* Detail Card */}
        <View
          style={[
            styles.detailCard,
            {
              backgroundColor: theme.background,
              marginTop: -Spacing.three,
            },
          ]}>

          {/* Contact Action Buttons */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={handleCall}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: BrandColors.accent },
                pressed && { opacity: 0.8 },
              ]}>
              <Text style={styles.actionBtnText}>📞 Call</Text>
            </Pressable>

            <Pressable
              onPress={handleEmail}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: theme.backgroundElement },
                pressed && { opacity: 0.8 },
              ]}>
              <Text style={[styles.actionBtnText, { color: theme.text }]}>✉️ Email</Text>
            </Pressable>

            <Pressable
              onPress={handleWebsite}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: theme.backgroundElement },
                pressed && { opacity: 0.8 },
              ]}>
              <Text style={[styles.actionBtnText, { color: theme.text }]}>🌐 Web</Text>
            </Pressable>
          </View>

          {/* Quick Details */}
          <View style={[styles.infoBox, { backgroundColor: theme.backgroundElement }]}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={[styles.infoText, { color: theme.text }]}>{shelter.address}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🕒</Text>
              <Text style={[styles.infoText, { color: theme.text }]}>{shelter.hours}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📞</Text>
              <Text style={[styles.infoText, { color: theme.text }]}>{shelter.phone}</Text>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>About {shelter.name}</Text>
            <Text style={[styles.bio, { color: theme.textSecondary }]}>{shelter.bio}</Text>
          </View>

          {/* Pets available at this shelter */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Pets at {shelter.name} ({animals.length})
            </Text>
            {animals.length === 0 ? (
              <Text style={[styles.bio, { color: theme.textSecondary }]}>
                No pets currently listed from this shelter.
              </Text>
            ) : (
              <View style={styles.grid}>
                {animals.map((item) => (
                  <View key={item.id} style={styles.gridItem}>
                    <AnimalCard
                      animal={item}
                      onPress={() => router.push(`/animal/${item.id}`)}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const HERO_HEIGHT = Platform.OS === 'web' ? 280 : 300;

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
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  floatingBack: {
    position: 'absolute',
    left: Spacing.three,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
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
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  shelterBadge: {
    backgroundColor: BrandColors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  shelterBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  heroName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  detailCard: {
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    gap: Spacing.four,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  infoBox: {
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  infoDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(150,150,150,0.2)',
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.one,
  },
  gridItem: {
    width: '50%',
    padding: Spacing.one,
  },
});
