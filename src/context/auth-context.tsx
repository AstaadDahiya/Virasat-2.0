
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { auth, db } from '@/lib/firebase/config';
import { 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut,
    updatePassword as firebaseUpdatePassword,
    type User,
    type Auth
} from "firebase/auth";
import { ensureArtisanProfile } from '@/services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email, password) => Promise<any>;
  signOut: () => Promise<void>;
  signUp: (email, password) => Promise<any>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    return firebaseSignOut(auth);
  };

  const signUp = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
        await ensureArtisanProfile(userCredential.user);
    }
    return userCredential;
  };

  const updatePassword = async (newPassword: string) => {
    if (auth.currentUser) {
      return firebaseUpdatePassword(auth.currentUser, newPassword);
    }
    throw new Error("No user is currently signed in.");
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
    signUp,
    updatePassword
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
