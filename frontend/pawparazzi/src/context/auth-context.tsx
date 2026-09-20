import type { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { supabase } from '@/lib/supabase';

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
  session: Session | null;
  supabaseUser: User | null;
  user: UserProfile | null;
  isLoggedIn: boolean;
  loading: boolean;
  signUp: (email: string, password: string, role?: UserRole, profile?: Partial<UserProfile>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  login: (email: string, role?: UserRole) => void;
  signup: (profile: Omit<UserProfile, 'id'>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
};

/** Consolidates UserProfile object creation from a Supabase User instance */
export function formatUserProfile(authUser: User): UserProfile {
  const meta = authUser.user_metadata || {};
  return {
    id: authUser.id,
    name: meta.name || 'Unknown user',
    username: meta.username || 'Unknown username',
    email: authUser.email || '',
    role: meta.role || 'Adopter',
    instagramHandle: meta.instagramHandle || '',
    bio: meta.bio || '',
    address: meta.address,
    websiteUrl: meta.websiteUrl,
    avatarUrl: require('@/assets/images/pawparazzi/kenzo.jpeg'),
  };
}

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
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setSupabaseUser(session?.user ?? null);
        if (session?.user) {
          setUser(formatUserProfile(session.user));
        }
      } catch (err) {
        console.error('Error getting Supabase session:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        setUser(formatUserProfile(session.user));
      } else {
        // Fall back to default user if no Supabase session exists
        setUser(prev => (prev?.id.startsWith('usr_') ? prev : null));
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    role: UserRole = 'Adopter',
    profileDetails: Partial<UserProfile> = {}
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          name: profileDetails.name,
          username: profileDetails.username,
          instagramHandle: profileDetails.instagramHandle,
          address: profileDetails.address,
          websiteUrl: profileDetails.websiteUrl,
          bio: profileDetails.bio,
        },
      },
    });

    if (error) {
      Alert.alert('Sign Up Error', error.message);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Sign In Error', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Sign Out Error', error.message);
    }
    setSession(null);
    setSupabaseUser(null);
    setUser(null);
  };

  const login = (email: string, role: UserRole = 'Adopter') => {
    setUser({
      id: 'usr_' + Date.now(),
      name: role === 'Shelter' ? 'Happy Paws Rescue' : email.split('@')[0].replace('.', ' '),
      username: email.split('@')[0],
      email: email,
      role: role,
      instagramHandle: '',
      bio:
        role === 'Shelter'
          ? 'Licensed animal rescue shelter connecting pets with loving homes.'
          : 'Passionate pet adopter.',
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
    signOut();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const previousUser = user;
    // Optimistic local update (ignoring immutable fields)
    const { role: _r, username: _u, email: _e, ...allowedUpdates } = updates;
    setUser(prev => (prev ? { ...prev, ...allowedUpdates } : null));

    if (session?.user) {
      try {
        // Build metadata payload for allowed editable fields
        const metadataUpdates: Record<string, any> = {};
        if (allowedUpdates.name !== undefined) metadataUpdates.name = allowedUpdates.name;
        if (allowedUpdates.instagramHandle !== undefined) metadataUpdates.instagramHandle = allowedUpdates.instagramHandle;
        if (allowedUpdates.bio !== undefined) metadataUpdates.bio = allowedUpdates.bio;
        if (allowedUpdates.address !== undefined) metadataUpdates.address = allowedUpdates.address;
        if (allowedUpdates.websiteUrl !== undefined) metadataUpdates.websiteUrl = allowedUpdates.websiteUrl;

        const updatePayload: { data?: Record<string, any> } = {};
        if (Object.keys(metadataUpdates).length > 0) {
          updatePayload.data = metadataUpdates;
        }

        // Only call Supabase if there's something to update
        if (Object.keys(updatePayload).length > 0) {
          const { data, error } = await supabase.auth.updateUser(updatePayload);

          if (error) {
            // Rollback optimistic update on failure
            setUser(previousUser);
            Alert.alert('Update Profile Error', error.message);
            throw error;
          }

          if (data?.user) {
            setUser(formatUserProfile(data.user));
          }
        }
      } catch (err) {
        // Rollback on any unexpected error
        setUser(previousUser);
        console.error('Error updating user profile in Supabase:', err);
        throw err;
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        supabaseUser,
        user,
        isLoggedIn: !!user || !!session,
        loading,
        signUp,
        signIn,
        signOut,
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
