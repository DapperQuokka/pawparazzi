import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'Adopter' | 'Shelter';

export type UserProfile = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  instagramHandle: string;
  bio?: string;
  avatarUrl?: any;
  address?: string;
  websiteUrl?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (email: string, role?: UserRole) => void;
  signup: (profile: Omit<UserProfile, 'id'>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
};

const DEFAULT_USER: UserProfile = {
  id: 'usr_1',
  name: 'Alex Morgan',
  username: 'alex_adopts',
  email: 'alex.morgan@example.com',
  role: 'Adopter',
  instagramHandle: '@alex_pawprints',
  bio: 'Animal lover searching for a rescue dog to join our family! 🐕',
  avatarUrl: require('@/assets/images/pawparazzi/kenzo.jpeg'),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);

  const login = (email: string, role: UserRole = 'Adopter') => {
    setUser({
      id: 'usr_' + Date.now(),
      name: role === 'Shelter' ? 'Happy Paws Shelter' : email.split('@')[0].replace('.', ' '),
      username: email.split('@')[0],
      email: email,
      role: role,
      instagramHandle: `@${email.split('@')[0]}_ig`,
      bio: role === 'Shelter' ? 'Licensed animal rescue shelter connecting pets with loving homes.' : 'Passionate pet adopter.',
      address: role === 'Shelter' ? '123 Rescue Way, Austin, TX 78701' : undefined,
      websiteUrl: role === 'Shelter' ? 'https://happypawsrescue.org' : undefined,
      avatarUrl: require('@/assets/images/pawparazzi/kenzo.jpeg'),
    });
  };

  const signup = (profile: Omit<UserProfile, 'id'>) => {
    setUser({
      ...profile,
      avatarUrl: profile.avatarUrl || require('@/assets/images/pawparazzi/kenzo.jpeg'),
      id: 'usr_' + Date.now(),
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        signup,
        logout,
        updateProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
