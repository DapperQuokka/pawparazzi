import { ScrollView, StyleSheet, View } from 'react-native';

import { FilterChip } from './filter-chip';
import { Spacing } from '@/constants/theme';
import type { Gender, Size, Species } from '@/data/animals';

export type FilterState = {
  species: Species | 'all';
  size: Size | 'any';
  gender: Gender | 'any';
};

type FilterBarProps = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
};

const SPECIES_OPTIONS: Array<{ label: string; value: FilterState['species'] }> = [
  { label: '🐾 All', value: 'all' },
  { label: '🐕 Dogs', value: 'dog' },
  { label: '🐈 Cats', value: 'cat' },
  { label: '🐇 Rabbits', value: 'rabbit' },
  { label: '🐦 Birds', value: 'bird' },
  { label: '✨ Other', value: 'other' },
];

const SIZE_OPTIONS: Array<{ label: string; value: FilterState['size'] }> = [
  { label: 'Any size', value: 'any' },
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

const GENDER_OPTIONS: Array<{ label: string; value: FilterState['gender'] }> = [
  { label: 'Any', value: 'any' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

/**
 * Horizontal scrollable filter bar with three chip groups:
 * Species · Size · Gender
 */
export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        keyboardShouldPersistTaps="handled">
        {/* Species */}
        {SPECIES_OPTIONS.map(opt => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            selected={filters.species === opt.value}
            onPress={() => onChange({ ...filters, species: opt.value })}
          />
        ))}

        <View style={styles.divider} />

        {/* Size */}
        {SIZE_OPTIONS.map(opt => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            selected={filters.size === opt.value}
            onPress={() => onChange({ ...filters, size: opt.value })}
          />
        ))}

        <View style={styles.divider} />

        {/* Gender */}
        {GENDER_OPTIONS.map(opt => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            selected={filters.gender === opt.value}
            onPress={() => onChange({ ...filters, gender: opt.value })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(128,128,128,0.25)',
    marginHorizontal: Spacing.one,
  },
});
