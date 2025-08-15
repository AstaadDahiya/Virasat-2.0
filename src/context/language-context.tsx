
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { getTranslations } from '@/services/firebase';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, values?: { [key: string]: string | number }) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  const fetchTranslations = useCallback(async (lang: Language) => {
    setLoading(true);
    try {
      const cachedTranslations = localStorage.getItem(`translations_${lang}`);
      if (cachedTranslations) {
        setTranslations(JSON.parse(cachedTranslations));
      }
      
      const newTranslations = await getTranslations(lang);
      if (newTranslations) {
        setTranslations(newTranslations);
        localStorage.setItem(`translations_${lang}`, JSON.stringify(newTranslations));
      }
      
    } catch (error) {
      console.error(`Failed to fetch translations for ${lang}`, error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedLanguage = (localStorage.getItem('language') as Language) || 'en';
    setLanguage(storedLanguage);
    fetchTranslations(storedLanguage);
  }, [fetchTranslations]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    fetchTranslations(lang);
  };

  const t = useCallback((key: string, values?: { [key: string]: string | number }): string => {
    let translatedText = translations[key] || key;

    if (values) {
        Object.entries(values).forEach(([placeholder, value]) => {
            translatedText = translatedText.replace(new RegExp(`{{\\s*${placeholder}\\s*}}`, 'g'), String(value));
        });
    }
    
    return translatedText;
  }, [translations]);
  
  const value = { language, setLanguage: handleSetLanguage, t, loading };

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
