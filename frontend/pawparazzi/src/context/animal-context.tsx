import React, { createContext, useContext, useState } from 'react';
import { ANIMALS as INITIAL_ANIMALS, Animal } from '@/data/animals';

type AnimalContextType = {
  animals: Animal[];
  addAnimal: (animalData: Omit<Animal, 'id'>) => Animal;
  getAnimalById: (id: string) => Animal | undefined;
  getAnimalsForShelter: (shelterName: string) => Animal[];
};

const AnimalContext = createContext<AnimalContextType | undefined>(undefined);

export function AnimalProvider({ children }: { children: React.ReactNode }) {
  const [animals, setAnimals] = useState<Animal[]>(INITIAL_ANIMALS);

  const addAnimal = (newAnimalData: Omit<Animal, 'id'>): Animal => {
    const newAnimal: Animal = {
      ...newAnimalData,
      id: String(Date.now()),
    };
    setAnimals(prev => [newAnimal, ...prev]);
    INITIAL_ANIMALS.unshift(newAnimal);
    return newAnimal;
  };

  const getAnimalById = (id: string) => {
    return animals.find(a => a.id === id);
  };

  const getAnimalsForShelter = (shelterName: string) => {
    const sName = shelterName.toLowerCase().trim();
    return animals.filter(a => {
      const aShelter = a.shelter.toLowerCase().trim();
      return aShelter === sName || aShelter.includes(sName) || sName.includes(aShelter);
    });
  };

  return (
    <AnimalContext.Provider
      value={{
        animals,
        addAnimal,
        getAnimalById,
        getAnimalsForShelter,
      }}>
      {children}
    </AnimalContext.Provider>
  );
}

export function useAnimals() {
  const context = useContext(AnimalContext);
  if (!context) {
    throw new Error('useAnimals must be used within an AnimalProvider');
  }
  return context;
}
