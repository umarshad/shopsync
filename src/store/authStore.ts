import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/supabase';
import { storage } from '../lib/localforage';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithPin: (pin: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    set({ loading: true });
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          set({ user: session.user, profile });
          await storage.setProfile(profile);
        }
      } else {
        // Try to load from cache
        const cachedProfile = await storage.getProfile();
        if (cachedProfile) {
          set({ profile: cachedProfile });
        }
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            set({ user: session.user, profile });
            await storage.setProfile(profile);
          }
        } else {
          set({ user: null, profile: null });
          await storage.setProfile(null);
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          set({ user: data.user, profile });
          await storage.setProfile(profile);
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      set({ loading: false });
    }
  },

  loginWithPin: async (pin: string) => {
    set({ loading: true });
    try {
      // Get current user session
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user session found');
      }

      // Verify PIN
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .eq('pin', pin)
        .single();

      if (!profile) {
        throw new Error('Invalid PIN');
      }

      set({ profile });
      await storage.setProfile(profile);
    } catch (error: any) {
      throw new Error(error.message || 'PIN login failed');
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await supabase.auth.signOut();
      set({ user: null, profile: null });
      await storage.setProfile(null);
      await storage.clear();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const { profile } = get();
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        set({ profile: data });
        await storage.setProfile(data);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }
}));

