export type Species = 'dog' | 'cat' | 'rabbit' | 'bird' | 'other';

/** Central source of truth for species emojis */
export const SPECIES_EMOJI: Record<string, string> = {
  dog: '🐕',
  cat: '🐈',
  rabbit: '🐇',
  bird: '🐦',
  other: '🐾',
};

export type CategoryOption = {
  id: Species | 'all';
  label: string;
  emoji: string;
};

/** Central source of truth for species categories in filter bars & tabs */
export const SPECIES_CATEGORIES: readonly CategoryOption[] = [
  { id: 'all', label: 'All Pets', emoji: '🐾' },
  { id: 'dog', label: 'Dogs', emoji: '🐕' },
  { id: 'cat', label: 'Cats', emoji: '🐈' },
  { id: 'rabbit', label: 'Rabbits', emoji: '🐇' },
  { id: 'bird', label: 'Birds', emoji: '🐦' },
  { id: 'other', label: 'Other', emoji: '✨' },
] as const;

/** Get emoji icon for a given species safely */
export function getSpeciesEmoji(species: string): string {
  return SPECIES_EMOJI[species] || '🐾';
}
