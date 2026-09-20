import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Species = 'dog' | 'cat' | 'bird' | 'other';
export type Gender = 'male' | 'female';
export type Size = 'small' | 'medium' | 'large';

export type Animal = {
	id: string;
	shelter_id: string;
	name: string;
	species: Species;
	breed: string | null;
	dob: Date;
	gender: Gender;
	size: Size | null;
	bio: string | null;
	tags: string[];
	urgent: boolean;
}

interface AnimalContextType {
	animals: Animal[] | null;
}

const AnimalContext = createContext<AnimalContextType | null>(null);

export const AnimalProvider = ({ children }: { children: React.ReactNode }) => {

	const [animals, setAnimals] = useState<Animal[]>([])

	useEffect(() => {
		
		const initializeAnimals = async () => {

			const { data } = await supabase.from('animals').select();

			const animalArray: Animal[] = data ? data.map((animal) => {

				const animalObject: Animal = {
					id: animal.id,
					shelter_id: animal.shelter_id,
					name: animal.name,
					species: animal.species,
					breed: animal.breed,
					dob: animal.dob,
					gender: animal.gender,
					size: animal.size,
					bio: animal.bio,
					tags: animal.tags,
					urgent: animal.urgent
				}

				return animalObject

			}) : []

			setAnimals(animalArray);
		}

		initializeAnimals();

	}, []);

	return (
		<AnimalContext.Provider
			value = {{ animals }}	
		>
			{children}
		</AnimalContext.Provider>
	)
}

export function useAnimals() {
	const context = useContext(AnimalContext);

	if (!context) {
		throw new Error('useAnimals must be used within an AnimalProvider');
	}

	return context;
}