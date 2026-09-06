export type Shelter = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  bio: string;
  hours: string;
  website: string;
  imageSource: any;
};

export const SHELTERS: Shelter[] = [
  {
    id: 'happy-paws',
    name: 'Happy Paws Rescue',
    phone: '+1 (555) 012-3456',
    email: 'info@happypawsrescue.org',
    address: '123 Rescue Way, Austin, TX 78701',
    bio: 'Happy Paws Rescue is a non-profit dedicated to rescuing, rehabilitating, and rehoming dogs and cats in need. We operate a zero-kill sanctuary powered by passionate staff and volunteers.',
    hours: 'Mon-Sat: 10 AM - 6 PM | Sun: Closed',
    website: 'https://happypawsrescue.org',
    imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  },
  {
    id: 'city-animal',
    name: 'City Animal Shelter',
    phone: '+1 (555) 234-5678',
    email: 'adoptions@cityanimalshelter.gov',
    address: '456 Municipal Blvd, Austin, TX 78704',
    bio: 'City Animal Shelter provides care and temporary housing to thousands of lost and abandoned animals each year. We offer adoption, spay/neuter programs, and pet resources.',
    hours: 'Mon-Sun: 9 AM - 5 PM',
    website: 'https://cityanimalshelter.gov',
    imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  },
  {
    id: 'sunshine-animal',
    name: 'Sunshine Animal Haven',
    phone: '+1 (555) 345-6789',
    email: 'contact@sunshinehaven.org',
    address: '789 Sunny Lane, Austin, TX 78745',
    bio: 'Sunshine Animal Haven specializes in caring for active dogs and cats, giving them high quality medical care, training, and socialization before finding their perfect home.',
    hours: 'Tue-Sun: 11 AM - 7 PM | Mon: Closed',
    website: 'https://sunshinehaven.org',
    imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  },
  {
    id: 'small-paws',
    name: 'Small Paws Rescue',
    phone: '+1 (555) 456-7890',
    email: 'hello@smallpawsrescue.org',
    address: '321 Bunny Trail, Austin, TX 78702',
    bio: 'Small Paws Rescue focuses on small animals like rabbits, guinea pigs, hamsters, and small pets. We provide education on small animal care and foster-to-adopt options.',
    hours: 'Wed-Sun: 12 PM - 5 PM',
    website: 'https://smallpawsrescue.org',
    imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  },
  {
    id: 'urban-cat',
    name: 'Urban Cat Coalition',
    phone: '+1 (555) 567-8901',
    email: 'adopt@urbancatcoalition.org',
    address: '555 Whisker Alley, Austin, TX 78703',
    bio: 'Urban Cat Coalition is a feline-only sanctuary helping street cats and surrendered felines find peaceful, loving homes. We specialize in socialization and senior cat care.',
    hours: 'Tue-Sat: 10 AM - 6 PM',
    website: 'https://urbancatcoalition.org',
    imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  },
  {
    id: 'feathered-friends',
    name: 'Feathered Friends Sanctuary',
    phone: '+1 (555) 678-9012',
    email: 'info@featheredfriends.org',
    address: '888 Avian Ave, Austin, TX 78751',
    bio: 'Feathered Friends Sanctuary provides rehabilitation and rehoming services for parrots, cockatiels, and rescue birds of all species across the region.',
    hours: 'Thu-Sun: 10 AM - 4 PM',
    website: 'https://featheredfriends.org',
    imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  },
];

export function getShelterById(id: string): Shelter | undefined {
  return SHELTERS.find(s => s.id === id);
}

export function getShelterByName(name: string): Shelter {
  const found = SHELTERS.find(s => s.name.toLowerCase() === name.toLowerCase());
  if (found) return found;
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: name,
    phone: '+1 (555) 000-0000',
    email: 'contact@shelter.org',
    address: '100 Rescue St, Austin, TX',
    bio: `${name} is dedicated to animal care and welfare in the community.`,
    hours: 'Mon-Sat: 9 AM - 5 PM',
    website: 'https://example.org',
    imageSource: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  };
}
