
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

// Simplified for now until translation is re-implemented correctly.
export const languages = [
    { code: 'en', name: 'English' },
];

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (text: string) => string;
  isTranslating: boolean;
  addTranslationKeys: (keys: string[]) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('en');
  
  // Disabled translation state for now
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
  };

  // The t function will simply return the original text, as translation is disabled.
  const t = (text: string): string => {
    return text;
  };
  
  // This function does nothing for now.
  const addTranslationKeys = useCallback((keys: string[]) => {
      // No-op
  }, []);

  const value = {
    language,
    setLanguage,
    t,
    translations,
    isTranslating,
    addTranslationKeys,
  };

  return (
    <LanguageContext.Provider value={value}>
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
