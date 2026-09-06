import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimalCard } from '@/components/animal-card';
import { SearchBar } from '@/components/search-bar';
import { SPECIES_CATEGORIES } from '@/constants/species';
import { BrandColors, BottomTabInset, Spacing } from '@/constants/theme';
import { useAnimals } from '@/context/animal-context';
import type { Animal } from '@/data/animals';
import { useTheme } from '@/hooks/use-theme';

export default function UrgentScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { animals } = useAnimals();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAnimals = useMemo<Animal[]>(() => {
    const q = searchQuery.toLowerCase().trim();
    return animals.filter(animal => {
      if (selectedCategory !== 'all' && animal.species !== selectedCategory) {
        return false;
      }
      if (q && !animal.name.toLowerCase().includes(q) && !animal.breed.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleCardPress = (animal: Animal) => {
    router.push(`/animal/${animal.id}` as any);
  };

  const paddingTop = Platform.OS === 'ios' ? insets.top : insets.top + Spacing.two;
  const paddingBottom = insets.bottom + BottomTabInset + Spacing.three;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: paddingTop + Spacing.two }]}>
        <Text style={[styles.title, { color: theme.text }]}>Urgent Rescues</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          These animals have limited time left in their shelter and need a home immediately. A foster or adopter could change everything.
        </Text>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search species or breed…" />
        </View>

        {/* Category Pills */}
        <View style={styles.categoriesRow}>
          {SPECIES_CATEGORIES.filter(cat => cat.id !== 'other').map(cat => {
            const active = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.pill,
                  {
                    backgroundColor: active ? BrandColors.accent : theme.backgroundElement,
                  },
                ]}>
                <Text style={styles.pillEmoji}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.pillLabel,
                    { color: active ? '#ffffff' : theme.text },
                  ]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.separator, { backgroundColor: theme.backgroundElement }]} />
      </View>

      {/* ── Grid ── */}
      {filteredAnimals.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔎</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No pets found</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Try switching category or clearing search
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAnimals}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={[styles.listContent, { paddingBottom }]}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <AnimalCard animal={item} onPress={() => handleCardPress(item)} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    paddingBottom: Spacing.one,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchWrapper: {
    marginTop: Spacing.one,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  pillEmoji: {
    fontSize: 13,
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    marginTop: Spacing.two,
    marginHorizontal: -Spacing.three,
  },
  listContent: {
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  columnWrapper: {
    gap: Spacing.two,
    marginBottom: Spacing.two + 4,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '48.5%',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingBottom: BottomTabInset,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
});
