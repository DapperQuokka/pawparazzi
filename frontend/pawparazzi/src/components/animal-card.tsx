import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandColors, Spacing } from '@/constants/theme';
import type { Animal } from '@/data/animals';
import { formatAge, formatDistance } from '@/data/animals';
import { useTheme } from '@/hooks/use-theme';

const SPECIES_EMOJI: Record<Animal['species'], string> = {
  dog: '🐕',
  cat: '🐈',
  rabbit: '🐇',
  bird: '🐦',
  other: '🐾',
};

type AnimalCardProps = {
  animal: Animal;
  onPress: () => void;
};

/**
 * Card displayed in the animal listing grid.
 * Shows a photo, name, breed, age and distance badge.
 */
export function AnimalCard({ animal, onPress }: AnimalCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      {/* Photo */}
      <View style={styles.imageWrapper}>
        <Image
          source={animal.imageSource}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {/* Semi-transparent bottom scrim */}
        <View style={styles.scrim} />
        {/* Distance badge — top right */}
        <View style={[styles.distanceBadge, { backgroundColor: BrandColors.overlay }]}>
          <Text style={styles.distanceText}>{formatDistance(animal.distance)}</Text>
        </View>
        {/* Species emoji badge — top left */}
        <View style={[styles.speciesBadge, { backgroundColor: 'rgba(255,255,255,0.92)' }]}>
          <Text style={styles.speciesEmoji}>{SPECIES_EMOJI[animal.species]}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {animal.name}
          </Text>
          <View
            style={[
              styles.genderDot,
              {
                backgroundColor:
                  animal.gender === 'male'
                    ? 'rgba(59,130,246,0.18)'
                    : 'rgba(236,72,153,0.18)',
              },
            ]}>
            <Text style={[styles.genderText, { color: animal.gender === 'male' ? '#2563EB' : '#DB2777' }]}>
              {animal.gender === 'male' ? '♂' : '♀'}
            </Text>
          </View>
        </View>
        <Text style={[styles.breed, { color: theme.textSecondary }]} numberOfLines={1}>
          {animal.breed}
        </Text>
        <Text style={[styles.age, { color: BrandColors.accent }]}>
          {formatAge(animal.age)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
    // Top-to-bottom: transparent → slight darken at bottom
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  distanceBadge: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  speciesBadge: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speciesEmoji: {
    fontSize: 14,
  },
  info: {
    padding: Spacing.two + 2,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.one,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  genderDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderText: {
    fontSize: 12,
    fontWeight: '600',
  },
  breed: {
    fontSize: 12,
    fontWeight: '500',
  },
  age: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});
