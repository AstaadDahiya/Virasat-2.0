
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';
import { translateText } from '@/ai/flows/translate-text';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, values?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// In-memory cache for translations
const translationCache = new Map<string, string>();

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('hi');
  // State to hold dynamic translations fetched from the AI
  const [translations, setTranslations] = useState<Map<string, string>>(translationCache);
  // Track which keys are currently being fetched
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
  };

  const t = useCallback((key: string, values?: { [key: string]: string | number }): string => {
    if (language === 'en') {
      return key; // Return the key itself if the language is English
    }

    // If translation is in the cache, use it
    if (translations.has(key)) {
      let translated = translations.get(key)!;
      if (values) {
         Object.entries(values).forEach(([placeholder, value]) => {
            translated = translated.replace(new RegExp(`{{\\s*${placeholder}\\s*}}`, 'g'), String(value));
        });
      }
      return translated;
    }

    // If translation is not in the cache, and not already being fetched, fetch it.
    if (!pendingTranslations.current.has(key)) {
      pendingTranslations.current.add(key); // Mark as pending
      
      translateText({ text: key, targetLanguage: 'Hindi' })
        .then(result => {
          // Store in both component state and module-level cache
          translationCache.set(key, result.translatedText); 
          setTranslations(prev => new Map(prev).set(key, result.translatedText));
        })
        .catch(err => {
          console.error(`Failed to translate "${key}":`, err);
          // Don't cache errors, allow retries.
        })
        .finally(() => {
           pendingTranslations.current.delete(key); // Remove from pending list
        });
    }

    // Return the English key as a fallback while the translation is loading
    return key;
  }, [language, translations]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
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
