import { Pressable, StyleSheet, Text } from 'react-native';

import { BrandColors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

/**
 * A small pill-shaped chip used inside FilterBar.
 * When selected, it renders with the brand accent colour.
 */
export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected
          ? { backgroundColor: BrandColors.accent }
          : { backgroundColor: theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <Text
        style={[
          styles.label,
          { color: selected ? '#ffffff' : theme.textSecondary },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  pressed: {
    opacity: 0.75,
  },
});
