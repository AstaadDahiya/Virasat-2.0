
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { TranslationManager, LanguageDetector } from '@/lib/i18n-manager';
import { db } from '@/lib/firebase/config';
import { seedDatabase } from '@/services/firebase';
import type { TranslationKey } from '@/lib/i18n';

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
  t: (key: TranslationKey, values?: { [key: string]: string | number }) => string;
  loading: boolean;
  translations: { [key: string]: any };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translationManager = new TranslationManager(db);
const languageDetector = new LanguageDetector();

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [translations, setTranslations] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  const setLanguage = useCallback(async (langCode: LanguageCode) => {
    if (loading || langCode === language) {
        return;
    }
    setLoading(true);
    try {
      const newTranslations = await translationManager.loadTranslations(langCode);
      localStorage.setItem('language', langCode);
      setLanguageState(langCode);
      setTranslations(newTranslations);
      console.log(`Language successfully switched to ${langCode}`);
    } catch (error) {
      console.error(`Failed to switch language to ${langCode}`, error);
    } finally {
      setLoading(false);
    }
  }, [loading, language]);

  useEffect(() => {
    const initLanguage = async () => {
      console.log("LanguageProvider: Initializing language system...");
      
      await seedDatabase();

      let initialLang: LanguageCode = 'en';
      let detectionSource = 'default';

      try {
        const savedLang = localStorage.getItem('language');
        if (savedLang && languageDetector.isLanguageSupported(savedLang)) {
          initialLang = savedLang as LanguageCode;
          detectionSource = 'saved_preference';
        } else {
          const { language: detectedLang, source } = await languageDetector.detectOptimalLanguage();
          initialLang = detectedLang as LanguageCode;
          detectionSource = source;
        }
      } catch (e) {
          console.error("Error during language detection, falling back to 'en'", e)
          initialLang = 'en';
          detectionSource = 'error_fallback';
      }
      
      console.log(`LanguageProvider: Setting initial language to ${initialLang} (source: ${detectionSource})`);
      const initialTranslations = await translationManager.loadTranslations(initialLang);
      
      setLanguageState(initialLang);
      setTranslations(initialTranslations);
      setLoading(false);
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


  const t = useCallback((key: TranslationKey, values?: { [key: string]: string | number }): string => {
    const path = key.split('.');
    
    // Attempt to get translation from the current language
    let translatedText = path.reduce((obj, p) => (obj && typeof obj === 'object' ? obj[p] : undefined), translations);

    // Fallback to English if translation is missing
    if (!translatedText || typeof translatedText !== 'string') {
        const enTranslations = translationManager.getEnglishTranslations();
        translatedText = path.reduce((obj, p) => (obj && typeof obj === 'object' ? obj[p] : undefined), enTranslations);
    }

    // If still not found, return the last part of the key as a readable fallback
    if (!translatedText || typeof translatedText !== 'string') {
        return path[path.length - 1];
    }
    
    if (values) {
        Object.entries(values).forEach(([placeholder, value]) => {
            translatedText = translatedText.replace(new RegExp(`{{\\s*${placeholder}\\s*}}`, 'g'), String(value));
        });
    }
    
    return translatedText;
  }, [translations]);
  
  const value = useMemo(() => ({ language, setLanguage, t, loading, translations }), [language, setLanguage, t, loading, translations]);

  return (
    <LanguageContext.Provider value={value}>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="text-center">
                <p className="text-2xl font-bold font-headline text-primary animate-pulse">VIRASAT</p>
                <p className="text-muted-foreground">{value.t('common.loading')}</p>
            </div>
        </div>
      ) : children}
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
