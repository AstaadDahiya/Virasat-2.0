
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, values?: { [key: string]: string | number }) => string;
  translations: Map<string, string>; // Add translations to the context value
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// AI flow is imported but not used directly here anymore. The call is in `t`.
import { translateText } from '@/ai/flows/translate-text';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Map<string, string>>(new Map());
  const pendingTranslations = useRef(new Set<string>());

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language | null;
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    setTranslations(new Map()); // Clear old translations on language change
    pendingTranslations.current.clear();
  };

  const t = useCallback((key: string, values?: { [key: string]: string | number }): string => {
    if (language === 'en') {
        let result = key;
        if (values) {
            Object.entries(values).forEach(([placeholder, value]) => {
                result = result.replace(new RegExp(`{{\\s*${placeholder}\\s*}}`, 'g'), String(value));
            });
        }
        return result;
    }

    const translatedText = translations.get(key);

    if (translatedText) {
        let result = translatedText;
        if (values) {
            Object.entries(values).forEach(([placeholder, value]) => {
                result = result.replace(new RegExp(`{{\\s*${placeholder}\\s*}}`, 'g'), String(value));
            });
        }
        return result;
    }

    if (!pendingTranslations.current.has(key)) {
      pendingTranslations.current.add(key);

      translateText({ text: key, targetLanguage: 'Hindi' })
        .then(result => {
          if (result.translatedText) {
            setTranslations(prev => new Map(prev).set(key, result.translatedText));
          }
        })
        .catch(err => console.error(`Failed to translate "${key}":`, err))
        .finally(() => {
          pendingTranslations.current.delete(key);
        });
    }

    // Return original key while translation is loading
    let result = key;
    if (values) {
        Object.entries(values).forEach(([placeholder, value]) => {
            result = result.replace(new RegExp(`{{\\s*${placeholder}\\s*}}`, 'g'), String(value));
        });
    }
    return result;

  }, [language, translations]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, translations }}>
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
