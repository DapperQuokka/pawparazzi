import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SPECIES_CATEGORIES, getSpeciesEmoji, type Species } from '@/constants/species';
import { BrandColors, Spacing } from '@/constants/theme';
import { useAnimals } from '@/context/animal-context';
import { useAuth } from '@/context/auth-context';
import type { Gender, Size } from '@/data/animals';
import { useTheme } from '@/hooks/use-theme';

type AddAnimalModalProps = {
  visible: boolean;
  onClose: () => void;
};

const COMMON_TAGS = [
  'vaccinated',
  'neutered',
  'spayed',
  'microchipped',
  'house-trained',
  'good with kids',
  'good with dogs',
  'good with cats',
  'playful',
];

export function AddAnimalModal({ visible, onClose }: AddAnimalModalProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const { addAnimal } = useAnimals();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('dog');
  const [breed, setBreed] = useState('');
  const [ageMonths, setAgeMonths] = useState('12');
  const [gender, setGender] = useState<Gender>('male');
  const [size, setSize] = useState<Size>('medium');
  const [distanceKm, setDistanceKm] = useState('1.5');
  const [bio, setBio] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'vaccinated',
    'microchipped',
  ]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter the animal’s name.');
      return;
    }
    if (!breed.trim()) {
      Alert.alert('Missing Breed', 'Please enter the breed.');
      return;
    }
    if (!bio.trim()) {
      Alert.alert('Missing Bio', 'Please enter a description for the animal.');
      return;
    }

    const parsedAge = parseInt(ageMonths, 10);
    const parsedDistance = parseFloat(distanceKm);

    const shelterName = user?.name || 'Happy Paws Rescue';

    const newAnimal = addAnimal({
      name: name.trim(),
      species,
      breed: breed.trim(),
      age: isNaN(parsedAge) || parsedAge < 1 ? 12 : parsedAge,
      gender,
      size,
      distance: isNaN(parsedDistance) ? 1.5 : parsedDistance,
      shelter: shelterName,
      shelterPhone: '+1 (555) 012-3456',
      bio: bio.trim(),
      tags: selectedTags.length > 0 ? selectedTags : ['vaccinated'],
      imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
    });

    Alert.alert(
      'Listing Created! 🐾',
      `${newAnimal.name} has been added to ${shelterName}'s active listings.`,
      [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            onClose();
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setName('');
    setSpecies('dog');
    setBreed('');
    setAgeMonths('12');
    setGender('male');
    setSize('medium');
    setDistanceKm('1.5');
    setBio('');
    setSelectedTags(['vaccinated', 'microchipped']);
  };

  const speciesOptions: Species[] = ['dog', 'cat', 'rabbit', 'bird', 'other'];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.background }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            
            <View style={styles.headerRow}>
              <Text style={[styles.title, { color: theme.text }]}>Add New Listing 🐾</Text>
              <Pressable onPress={onClose} style={styles.closeBtn}>
                <Text style={[styles.closeBtnText, { color: theme.textSecondary }]}>✕</Text>
              </Pressable>
            </View>

            {/* Animal Name */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Pet Name *</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Kenzo"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
            />

            {/* Species Picker */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Species *</Text>
            <View style={styles.chipRow}>
              {speciesOptions.map(sp => (
                <Pressable
                  key={sp}
                  onPress={() => setSpecies(sp)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        species === sp ? BrandColors.accent : theme.backgroundElement,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.chipText,
                      { color: species === sp ? '#fff' : theme.text },
                    ]}>
                    {getSpeciesEmoji(sp)} {sp.charAt(0).toUpperCase() + sp.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Breed */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Breed *</Text>
            <TextInput
              value={breed}
              onChangeText={setBreed}
              placeholder="e.g. German Shepherd"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
            />

            {/* Age & Distance Row */}
            <View style={styles.twoColRow}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Age (months)</Text>
                <TextInput
                  value={ageMonths}
                  onChangeText={setAgeMonths}
                  keyboardType="number-pad"
                  placeholder="12"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
                />
              </View>
              <View style={styles.col}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Distance (km)</Text>
                <TextInput
                  value={distanceKm}
                  onChangeText={setDistanceKm}
                  keyboardType="numeric"
                  placeholder="1.5"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
                />
              </View>
            </View>

            {/* Gender */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Gender</Text>
            <View style={styles.chipRow}>
              {(['male', 'female'] as Gender[]).map(g => (
                <Pressable
                  key={g}
                  onPress={() => setGender(g)}
                  style={[
                    styles.chip,
                    {
                      flex: 1,
                      backgroundColor:
                        gender === g ? BrandColors.accent : theme.backgroundElement,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.chipText,
                      { color: gender === g ? '#fff' : theme.text, textAlign: 'center' },
                    ]}>
                    {g === 'male' ? '♂ Male' : '♀ Female'}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Size */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Size</Text>
            <View style={styles.chipRow}>
              {(['small', 'medium', 'large'] as Size[]).map(sz => (
                <Pressable
                  key={sz}
                  onPress={() => setSize(sz)}
                  style={[
                    styles.chip,
                    {
                      flex: 1,
                      backgroundColor:
                        size === sz ? BrandColors.accent : theme.backgroundElement,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.chipText,
                      { color: size === sz ? '#fff' : theme.text, textAlign: 'center' },
                    ]}>
                    {sz.charAt(0).toUpperCase() + sz.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Bio */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>About / Bio *</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Describe personality, backstory, and ideal home..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: theme.backgroundElement, color: theme.text },
              ]}
            />

            {/* Traits / Tags */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Traits & Health Tags</Text>
            <View style={styles.tagWrap}>
              {COMMON_TAGS.map(t => {
                const isSel = selectedTags.includes(t);
                return (
                  <Pressable
                    key={t}
                    onPress={() => toggleTag(t)}
                    style={[
                      styles.tagChip,
                      {
                        backgroundColor: isSel
                          ? BrandColors.accent
                          : theme.backgroundElement,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.tagChipText,
                        { color: isSel ? '#fff' : theme.text },
                      ]}>
                      {isSel ? '✓ ' : ''}{t}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <Pressable
                onPress={onClose}
                style={[styles.btn, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.btnText, { color: theme.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit}
                style={[styles.btn, { backgroundColor: BrandColors.accent }]}>
                <Text style={[styles.btnText, { color: '#fff' }]}>Publish Listing</Text>
              </Pressable>
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    maxHeight: '90%',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
  },
  scrollContent: {
    gap: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  chipText: {
    fontWeight: '700',
    fontSize: 13,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  col: {
    flex: 1,
    gap: 4,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnText: {
    fontWeight: '800',
    fontSize: 15,
  },
});
