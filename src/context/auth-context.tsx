
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthError, AuthResponse, Session, User } from '@supabase/supabase-js';
import { ensureArtisanProfile } from '@/services/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email, password) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signUp: (email, password) => Promise<AuthResponse>;
  updatePassword: (password: string) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
    }
    
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const response = await supabase.auth.signInWithPassword({ email, password });
    if (response.error) throw response.error;
    if (response.data.user) {
        // This ensures a profile exists on login, in case it was missed at sign-up
        await ensureArtisanProfile(response.data.user);
    }
    return response;
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  const signUp = async (email, password) => {
    const response = await supabase.auth.signUp({
      email,
      password,
    });
    if (response.error) throw response.error;
    return response;
  };

  const updatePassword = async (password: string) => {
    const response = await supabase.auth.updateUser({ password });
    if (response.error) throw response.error;
    return response;
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
    signUp,
    updatePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

    