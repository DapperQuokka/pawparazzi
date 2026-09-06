import type { Species, CategoryOption } from '@/constants/species';
export { SPECIES_EMOJI, SPECIES_CATEGORIES, getSpeciesEmoji } from '@/constants/species';
export type { Species, CategoryOption };
export type { Shelter } from './shelters';
export { SHELTERS, getShelterById, getShelterByName } from './shelters';

export type Size = 'small' | 'medium' | 'large';
export type Gender = 'male' | 'female';

export type Animal = {
  id: string;
  name: string;
  species: Species;
  breed: string;
  /** Age in months */
  age: number;
  gender: Gender;
  size: Size;
  /** Distance from user in km */
  distance: number;
  shelter: string;
  shelterPhone: string;
  bio: string;
  tags: string[];
  imageSource: any;
};

export const ANIMALS: Animal[] = [
  {
    id: '1',
    name: 'Kenzo',
    species: 'dog',
    breed: 'German Shepherd',
    age: 24,
    gender: 'male',
    size: 'large',
    distance: 1.2,
    shelter: 'Happy Paws Rescue',
    shelterPhone: '+1 (555) 012-3456',
    bio: 'Kenzo is a majestic and loyal German Shepherd looking for his forever home. He loves outdoor adventures, playing fetch, and cuddles on the couch after a long walk. He is great with adults and older children, and gets along well with other dogs after a proper introduction. Kenzo knows basic commands and is eager to learn more.',
    tags: ['vaccinated', 'neutered', 'microchipped', 'house-trained', 'good with dogs'],
    imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  },
  {
    id: '2',
    name: 'Luna',
    species: 'cat',
    breed: 'Domestic Shorthair',
    age: 18,
    gender: 'female',
    size: 'small',
    distance: 0.8,
    shelter: 'City Animal Shelter',
    shelterPhone: '+1 (555) 234-5678',
    bio: 'Luna is a gentle and affectionate cat who loves sunny window spots and soft blankets. She is very calm and would thrive in a quiet home. She purrs immediately when petted and enjoys interactive feather toys. Luna is litter-box trained and has never had any accidents indoors.',
    tags: ['vaccinated', 'spayed', 'indoor-only', 'good with cats', 'microchipped'],
    imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  },
  {
    id: '3',
    name: 'Biscuit',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 8,
    gender: 'male',
    size: 'large',
    distance: 2.5,
    shelter: 'Sunshine Animal Haven',
    shelterPhone: '+1 (555) 345-6789',
    bio: 'Biscuit is an energetic Golden Retriever puppy bursting with love and playfulness. He is still in his training phase but learns quickly with positive reinforcement. He adores everyone he meets, including children, other dogs, and even cats. He will need a yard or regular outdoor exercise.',
    tags: ['vaccinated', 'microchipped', 'playful', 'puppy', 'good with kids'],
    imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  },
  {
    id: '4',
    name: 'Mochi',
    species: 'rabbit',
    breed: 'Holland Lop',
    age: 6,
    gender: 'female',
    size: 'small',
    distance: 0.4,
    shelter: 'Small Paws Rescue',
    shelterPhone: '+1 (555) 456-7890',
    bio: 'Mochi is an adorable Holland Lop rabbit with floppy ears and a big personality. She is litter-box trained and loves exploring. She enjoys being held and will binky with joy when she is happy. Mochi is perfect for a calm household and does not require as much space as a dog or cat.',
    tags: ['vaccinated', 'litter-trained', 'indoor', 'good with children'],
    imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  },
  {
    id: '5',
    name: 'Shadow',
    species: 'cat',
    breed: 'Maine Coon Mix',
    age: 36,
    gender: 'male',
    size: 'large',
    distance: 3.1,
    shelter: 'Urban Cat Coalition',
    shelterPhone: '+1 (555) 567-8901',
    bio: 'Shadow is a fluffy Maine Coon mix with a dignified personality. He takes his time warming up to new people, but once he trusts you, he is incredibly loyal and affectionate. He loves sitting beside you on the sofa and chattering at birds through the window. Shadow does best as the only pet.',
    tags: ['vaccinated', 'neutered', 'microchipped', 'indoor-only', 'senior-friendly'],
    imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  },
  {
    id: '6',
    name: 'Sunny',
    species: 'bird',
    breed: 'Cockatiel',
    age: 14,
    gender: 'female',
    size: 'small',
    distance: 1.7,
    shelter: 'Feathered Friends Sanctuary',
    shelterPhone: '+1 (555) 678-9012',
    bio: 'Sunny is a cheerful cockatiel who loves to whistle and mimic sounds. She is hand-tame and enjoys perching on shoulders. Sunny does best when she has daily interaction and enrichment. She will sing along to music and is a wonderful companion for someone at home often.',
    tags: ['hand-tame', 'sociable', 'whistles', 'good with birds'],
    imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  },
  {
    id: '7',
    name: 'Daisy',
    species: 'dog',
    breed: 'Beagle Mix',
    age: 48,
    gender: 'female',
    size: 'medium',
    distance: 2.0,
    shelter: 'Happy Paws Rescue',
    shelterPhone: '+1 (555) 012-3456',
    bio: 'Daisy is a sweet and curious Beagle mix who follows her nose everywhere. She is calm, well-mannered, and knows sit, stay, and come. Daisy loves leisurely walks and sniffing games. She gets along well with other dogs and is gentle with children. She would love a cozy home with a garden.',
    tags: ['vaccinated', 'spayed', 'microchipped', 'house-trained', 'good with kids', 'good with dogs'],
    imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  },
  {
    id: '8',
    name: 'Pebble',
    species: 'rabbit',
    breed: 'Lionhead Mix',
    age: 10,
    gender: 'male',
    size: 'small',
    distance: 0.6,
    shelter: 'Small Paws Rescue',
    shelterPhone: '+1 (555) 456-7890',
    bio: 'Pebble is a fluffy Lionhead rabbit with a magnificent mane. He is curious and friendly, and loves running around during free-roam time. Pebble enjoys leafy greens and will approach you for treats. He is litter-box trained and neutered, making him easy to care for as a house rabbit.',
    tags: ['vaccinated', 'neutered', 'litter-trained', 'indoor', 'sociable'],
    imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  },
];

/** Look up a single animal by ID. */
export function getAnimalById(id: string): Animal | undefined {
  return ANIMALS.find(a => a.id === id);
}

/** Format age in months to a human-readable string. */
export function formatAge(months: number): string {
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return years === 1 ? '1 yr' : `${years} yrs`;
  return `${years}y ${rem}m`;
}

/** Format distance to a tidy label. */
export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)} km`;
}

/** Get all animals belonging to a specific shelter. */
export function getAnimalsForShelter(shelterName: string): Animal[] {
  return ANIMALS.filter(a => a.shelter.toLowerCase() === shelterName.toLowerCase());
}
