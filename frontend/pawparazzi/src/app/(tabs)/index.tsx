import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimalCard } from '@/components/animal-card';
import { FilterBar, type FilterState } from '@/components/filter-bar';
import { SearchBar } from '@/components/search-bar';
import { BrandColors, BottomTabInset, Spacing } from '@/constants/theme';
import { ANIMALS, type Animal } from '@/data/animals';
import { useTheme } from '@/hooks/use-theme';

const DEFAULT_FILTERS: FilterState = {
  species: 'all',
  size: 'any',
  gender: 'any',
};

export default function AnimalListingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filteredAnimals = useMemo<Animal[]>(() => {
    const q = searchQuery.toLowerCase().trim();
    return ANIMALS.filter(animal => {
      if (q && !animal.name.toLowerCase().includes(q) && !animal.breed.toLowerCase().includes(q)) {
        return false;
      }
      if (filters.species !== 'all' && animal.species !== filters.species) return false;
      if (filters.size !== 'any' && animal.size !== filters.size) return false;
      if (filters.gender !== 'any' && animal.gender !== filters.gender) return false;
      return true;
    });
  }, [searchQuery, filters]);

  const handleCardPress = (animal: Animal) => {
    router.push(`/animal/${animal.id}` as any);
  };

  const paddingTop = Platform.OS === 'ios' ? insets.top : insets.top + Spacing.two;
  const paddingBottom = insets.bottom + BottomTabInset + Spacing.three;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: paddingTop + Spacing.two }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.appTitle, { color: theme.text }]}>Pawparazzi 🐾</Text>
            <View style={styles.locationRow}>
              <View style={[styles.locationDot, { backgroundColor: BrandColors.positive }]} />
              <Text style={[styles.locationText, { color: theme.textSecondary }]}>
                Nearby · within 10 km
              </Text>
            </View>
          </View>
          {/* Active filter count badge */}
          {(filters.species !== 'all' || filters.size !== 'any' || filters.gender !== 'any') && (
            <View style={[styles.activeBadge, { backgroundColor: BrandColors.accentMuted }]}>
              <Text style={[styles.activeBadgeText, { color: BrandColors.accent }]}>
                Filtered
              </Text>
            </View>
          )}
        </View>

        {/* Search bar */}
        <View style={styles.searchWrapper}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        </View>

        {/* Filter chips */}
        <FilterBar filters={filters} onChange={setFilters} />

        <View style={[styles.separator, { backgroundColor: theme.backgroundElement }]} />
      </View>

      {/* ── Animal Grid ── */}
      {filteredAnimals.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🐾</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No pets found</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Try adjusting your search or filters
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAnimals}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom },
          ]}
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
    gap: Spacing.two + 2,
    paddingBottom: Spacing.two,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.one,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  locationDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '500',
  },
  activeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  searchWrapper: {
    marginTop: Spacing.one,
  },
  separator: {
    height: 1,
    marginTop: Spacing.one,
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
