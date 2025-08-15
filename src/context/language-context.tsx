
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

// In-memory cache for translations, cleared on language change.
const translationCache = new Map<string, string>();

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en'); // Default to English
  // State to hold dynamic translations fetched from the AI
  const [translations, setTranslations] = useState<Map<string, string>>(new Map());
  // Track which keys are currently being fetched
  const pendingTranslations = useRef(new Set<string>());
  const isMounted = useRef(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language | null;
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    isMounted.current = true;
  }, []);

  const handleSetLanguage = (lang: Language) => {
    if (lang !== language) {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        // Clear cache when language changes
        translationCache.clear();
        setTranslations(new Map());
    }
  };

  const t = useCallback((key: string, values?: { [key: string]: string | number }): string => {
    let resultText = key;
    if (language !== 'en') {
        const cachedTranslation = translationCache.get(key);
        if (cachedTranslation) {
            resultText = cachedTranslation;
        } else if (isMounted.current && !pendingTranslations.current.has(key)) {
            pendingTranslations.current.add(key);

            translateText({ text: key, targetLanguage: 'Hindi' })
                .then(result => {
                    if (result.translatedText) {
                        translationCache.set(key, result.translatedText);
                        // Update state only if component is still mounted
                        if(isMounted.current) {
                           setTranslations(prev => new Map(prev).set(key, result.translatedText));
                        }
                    }
                })
                .catch(err => console.error(`Failed to translate "${key}":`, err))
                .finally(() => {
                    pendingTranslations.current.delete(key);
                });
        }
    }
    
    if (values) {
        Object.entries(values).forEach(([placeholder, value]) => {
            resultText = resultText.replace(new RegExp(`{{\\s*${placeholder}\\s*}}`, 'g'), String(value));
        });
    }

    return resultText;
  }, [language]);


  useEffect(() => {
      // This effect can be used to force a re-render on all components when the language changes.
  }, [language]);

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
