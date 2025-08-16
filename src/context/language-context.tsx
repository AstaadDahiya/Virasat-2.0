
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { translateText } from '@/ai/flows/translate-text';

export const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
];

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (text: string) => string;
  translations: Record<string, string>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  
  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang && languages.some(l => l.code === storedLang)) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    setTranslations({}); // Clear old translations
  };

  const t = (text: string): string => {
    // This is a placeholder since the translation service is disabled
    if (language === 'en' || !text) return text;
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
