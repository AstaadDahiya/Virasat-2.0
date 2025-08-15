
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { getTranslations } from '@/services/firebase';

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

type LanguageCode = typeof languages[number]['code'];

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, values?: { [key: string]: string | number }) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  const fetchTranslations = useCallback(async (lang: LanguageCode) => {
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
    const storedLanguage = (localStorage.getItem('language') as LanguageCode) || 'en';
    setLanguage(storedLanguage);
    fetchTranslations(storedLanguage);
  }, [fetchTranslations]);

  const handleSetLanguage = (lang: LanguageCode) => {
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

    