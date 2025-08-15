

"use client";

import { doc, getDoc, type Firestore } from "firebase/firestore";

type LanguageCode = string;
type Translations = { [key: string]: any };

export class LanguageDetector {
    countryLanguageMap: { [key: string]: string[] };

    constructor() {
        this.countryLanguageMap = {
            'IN': ['hi', 'bn', 'ta', 'te', 'mr', 'gu'], // India - multiple options
            'BD': ['bn'],  // Bangladesh - Bengali
            'PK': ['ur'],  // Pakistan - Urdu
            'NP': ['ne'],  // Nepal - Nepali
            'LK': ['ta'],  // Sri Lanka - Tamil
            'MY': ['ta'],  // Malaysia - Tamil
            'SG': ['ta'],  // Singapore - Tamil
        };
    }

    async detectOptimalLanguage(): Promise<{ language: LanguageCode, source: string }> {
        try {
            // 1. Check saved preference first
            const savedLang = localStorage.getItem('language');
            if (savedLang && this.isLanguageSupported(savedLang)) {
                return { language: savedLang, source: 'saved_preference' };
            }

            // 2. Try browser language
            const browserLangs = navigator.languages || [navigator.language];
            for (let lang of browserLangs) {
                const langCode = lang.slice(0, 2);
                if (this.isLanguageSupported(langCode)) {
                    return { language: langCode, source: 'browser' };
                }
            }

            // 3. Try location-based detection
            const locationLang = await this.detectByLocation();
            if (locationLang) {
                return { language: locationLang, source: 'location' };
            }

            // 4. Default fallback
            return { language: 'en', source: 'default' };

        } catch (error) {
            console.error('Language detection failed:', error);
            return { language: 'en', source: 'error_fallback' };
        }
    }

    async detectByLocation(): Promise<LanguageCode | null> {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            const countryCode = data.country_code;
            
            const possibleLanguages = this.countryLanguageMap[countryCode];
            if (possibleLanguages && possibleLanguages.length > 0) {
                // Return first supported language for the country
                return possibleLanguages[0];
            }
            
            return null;
        } catch (error) {
            console.error('Location detection failed:', error);
            return null;
        }
    }

    isLanguageSupported(langCode: LanguageCode): boolean {
        const supportedLanguages = [
            'en', 'as', 'bn', 'brx', 'doi', 'gu', 'hi', 'kn', 'ks', 
            'kok', 'mai', 'ml', 'mni', 'mr', 'ne', 'or', 'pa', 
            'sa', 'sat', 'sd', 'ta', 'te', 'ur'
        ];
        return supportedLanguages.includes(langCode);
    }
}

export class TranslationManager {
    private db: Firestore;
    private cache: Map<LanguageCode, Translations>;
    private fallbackChain: LanguageCode[];
    private loadingPromises: Map<LanguageCode, Promise<Translations>>;

    constructor(firestore: Firestore) {
        this.db = firestore;
        this.cache = new Map();
        this.fallbackChain = ['en']; // Default fallback chain
        this.loadingPromises = new Map();
    }

    async loadTranslations(langCode: LanguageCode): Promise<Translations> {
        // Return cached version if available
        if (this.cache.has(langCode)) {
            return this.cache.get(langCode)!;
        }

        // Return existing loading promise if already in progress
        if (this.loadingPromises.has(langCode)) {
            return await this.loadingPromises.get(langCode)!;
        }

        // Create new loading promise
        const loadingPromise = this.fetchFromFirestore(langCode);
        this.loadingPromises.set(langCode, loadingPromise);

        try {
            const translations = await loadingPromise;
            this.cache.set(langCode, translations);
            return translations;
        } finally {
            this.loadingPromises.delete(langCode);
        }
    }

    async fetchFromFirestore(langCode: LanguageCode): Promise<Translations> {
        try {
            const docRef = doc(this.db, 'translations', langCode);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return docSnap.data() as Translations;
            } else {
                for (let fallbackLang of this.fallbackChain) {
                    if (fallbackLang !== langCode) {
                        const fallbackRef = doc(this.db, 'translations', fallbackLang);
                        const fallbackSnap = await getDoc(fallbackRef);
                        if (fallbackSnap.exists()) {
                            console.warn(`Using ${fallbackLang} as fallback for ${langCode}`);
                            return fallbackSnap.data() as Translations;
                        }
                    }
                }
                throw new Error(`No translations found for ${langCode}`);
            }
        } catch (error) {
            console.error(`Error loading translations for ${langCode}:`, error);
            return this.getEmergencyFallback();
        }
    }

    getEmergencyFallback(): Translations {
        return {
            loading: "Loading...",
            error: "An error occurred",
            welcome: "Welcome",
            language: "Language",
            common: {
                loading: "Loading..."
            }
        };
    }

    async preloadLanguages(langCodes: LanguageCode[]): Promise<void> {
        const promises = langCodes.map(code => this.loadTranslations(code));
        await Promise.allSettled(promises);
    }

    clearCache(langCode: LanguageCode | null = null): void {
        if (langCode) {
            this.cache.delete(langCode);
        } else {
            this.cache.clear();
        }
    }
}

    