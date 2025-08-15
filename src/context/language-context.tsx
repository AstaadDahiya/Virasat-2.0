
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, values?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// AI flow is imported but not used directly here anymore. The call is in `t`.
import { translateText } from '@/ai/flows/translate-text';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const translationsRef = useRef<Map<string, string>>(new Map());
  const pendingTranslations = useRef(new Set<string>());
  // We need a state to force re-renders when translations are updated.
  const [, setForceUpdate] = useState({});

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language | null;
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    translationsRef.current.clear(); // Clear old translations on language change
    pendingTranslations.current.clear();
    setForceUpdate({}); // Force a re-render for all components
  };

  const t = useCallback((key: string, values?: { [key: string]: string | number }): string => {
    let resultText = key;
    if (language === 'hi') {
        const translatedText = translationsRef.current.get(key);
        if (translatedText) {
            resultText = translatedText;
        } else if (!pendingTranslations.current.has(key)) {
            pendingTranslations.current.add(key);
            translateText({ text: key, targetLanguage: 'Hindi' })
                .then(result => {
                    if (result.translatedText) {
                        translationsRef.current.set(key, result.translatedText);
                        // Force a re-render now that we have a new translation
                        setForceUpdate({});
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
