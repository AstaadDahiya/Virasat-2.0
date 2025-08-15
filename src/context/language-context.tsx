

"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { TranslationManager, LanguageDetector } from '@/lib/i18n-manager';
import { db } from '@/lib/firebase/config';
import { getDoc, doc } from 'firebase/firestore';
import { seedDatabase } from '@/services/firebase';

export const languages = [
    { name: "English", code: "en", nativeName: "English" },
    { name: "Hindi", code: "hi", nativeName: "हिन्दी" },
    { name: "Assamese", code: "as", nativeName: "অসমীয়া" },
    { name: "Bengali", code: "bn", nativeName: "বাংলা" },
    { name: "Bodo", code: "brx", nativeName: "बड़ो" },
    { name: "Dogri", code: "doi", nativeName: "डोगरी" },
    { name: "Gujarati", code: "gu", nativeName: "ગુજરાતી" },
    { name: "Kannada", code: "kn", nativeName: "ಕನ್ನಡ" },
    { name: "Kashmiri", code: "ks", nativeName: "کٲشُر" },
    { name: "Konkani", code: "kok", nativeName: "कोंकणी" },
    { name: "Maithili", code: "mai", nativeName: "मैथिली" },
    { name: "Malayalam", code: "ml", nativeName: "മലയാളം" },
    { name: "Manipuri", code: "mni", nativeName: "মণিপুরী" },
    { name: "Marathi", code: "mr", nativeName: "मराठी" },
    { name: "Nepali", code: "ne", nativeName: "नेपाली" },
    { name: "Oriya", code: "or", nativeName: "ଓଡ଼ିଆ" },
    { name: "Punjabi", code: "pa", nativeName: "ਪੰਜਾਬੀ" },
    { name: "Sanskrit", code: "sa", nativeName: "संस्कृत" },
    { name: "Santali", code: "sat", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ" },
    { name: "Sindhi", code: "sd", nativeName: "سنڌي" },
    { name: "Tamil", code: "ta", nativeName: "தமிழ்" },
    { name: "Telugu", code: "te", nativeName: "తెలుగు" },
    { name: "Urdu", code: "ur", nativeName: "اردو" },
];

export type LanguageCode = typeof languages[number]['code'];

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, values?: { [key: string]: string | number }) => string;
  loading: boolean;
  translations: { [key: string]: any };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Instantiate the manager outside the component to act as a singleton
const translationManager = new TranslationManager(db);
const languageDetector = new LanguageDetector();

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [translations, setTranslations] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initLanguage = async () => {
      setLoading(true);

      // Check if seeding is needed before doing anything else
      const enTranslationsRef = doc(db, 'translations', 'en');
      const enTranslationsSnap = await getDoc(enTranslationsRef);
      if (!enTranslationsSnap.exists()) {
        console.log("No English translations found, seeding database...");
        await seedDatabase();
        console.log("Seeding complete.");
      }
      
      const { language: detectedLang } = await languageDetector.detectOptimalLanguage();
      
      const loadedTranslations = await translationManager.loadTranslations(detectedLang);
      setTranslations(loadedTranslations);
      setLanguage(detectedLang);
      setLoading(false);
      
      // Preload common languages in the background
      translationManager.preloadLanguages(['en', 'hi', 'bn']);
    };
    initLanguage();
  }, []);
  
  useEffect(() => {
    const rtlLanguages = ['ur', 'sd', 'ks'];
    if (rtlLanguages.includes(language)) {
        document.documentElement.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
    }
    document.documentElement.lang = language;
  }, [language]);


  const handleSetLanguage = useCallback(async (lang: LanguageCode) => {
    setLoading(true);
    try {
      const newTranslations = await translationManager.loadTranslations(lang);
      setTranslations(newTranslations);
      setLanguage(lang);
      localStorage.setItem('language', lang);
    } catch (error) {
        console.error(`Failed to switch language to ${lang}`, error);
    } finally {
        setLoading(false);
    }
  }, []);

  const t = useCallback((key: string, values?: { [key: string]: string | number }): string => {
    // Support nested keys
    let translatedText = key.split('.').reduce((obj, k) => obj && obj[k], translations);
    
    if(!translatedText) {
        translatedText = key; // Fallback to key if not found
    }

    if (values) {
        Object.entries(values).forEach(([placeholder, value]) => {
            translatedText = translatedText.replace(new RegExp(`{{\\s*${placeholder}\\s*}}`, 'g'), String(value));
        });
    }
    
    return translatedText;
  }, [translations]);
  
  const value = useMemo(() => ({ language, setLanguage: handleSetLanguage, t, loading, translations }), [language, handleSetLanguage, t, loading, translations]);

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
