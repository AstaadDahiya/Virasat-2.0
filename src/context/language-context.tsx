
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
  addTranslationKeys: (keys: string[]) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationKeys, setTranslationKeys] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang && languages.some(l => l.code === storedLang)) {
      setLanguageState(storedLang);
    }
    // Static keys that might appear on any page
    addTranslationKeys(['Materials', 'in stock', 'Out of Stock', 'Add to Cart', 'Sold by']);
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    setTranslations({}); // Clear old translations
  };

  const addTranslationKeys = useCallback((keys: string[]) => {
    setTranslationKeys(prev => {
        const newSet = new Set(prev);
        let changed = false;
        keys.forEach(key => {
            if (key && !newSet.has(key)) {
                newSet.add(key);
                changed = true;
            }
        });
        return changed ? newSet : prev;
    });
  }, []);

  useEffect(() => {
    const translateAll = async () => {
      if (language === 'en' || translationKeys.size === 0) {
        setTranslations({});
        return;
      }

      const keysToTranslate = Array.from(translationKeys).filter(key => !translations[key]);
      if (keysToTranslate.length === 0) return;

      setIsTranslating(true);
      try {
        const { translatedText } = await translateText({
          text: keysToTranslate,
          targetLanguage: language,
        });

        if (Array.isArray(translatedText)) {
          const newTranslations: Record<string, string> = {};
          keysToTranslate.forEach((key, index) => {
            newTranslations[key] = translatedText[index];
          });
          setTranslations(prev => ({ ...prev, ...newTranslations }));
        }
      } catch (error) {
        console.error("Translation error:", error);
        toast({
          variant: "destructive",
          title: "Translation Failed",
          description: "Could not translate content.",
        });
      } finally {
        setIsTranslating(false);
      }
    };

    translateAll();
  }, [language, translationKeys, translations, toast]);


  const t = (text: string): string => {
    if (language === 'en' || !text) return text;
    return translations[text] || text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations, isTranslating, addTranslationKeys }}>
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
