
type Translations = {
  [key: string]: string;
};

type LanguageTranslations = {
  en: Translations;
  hi: Translations;
};

export const translations: LanguageTranslations = {
  en: {
    // Navigation
    home: 'Home',
    products: 'Products',
    artisans: 'Artisans',
    artisanDashboard: 'Artisan Dashboard',

    // Hero Section
    heroTitle: 'Handcrafted Stories, Timeless Treasures',
    heroSubtitle: 'Discover unique, handmade goods from skilled artisans around the world.',
    exploreProducts: 'Explore Products',

    // Sections
    featuredProducts: 'Featured Products',
    meetTheArtisans: 'Meet the Artisans',
    viewAll: 'View All',
    
    // Footer
    footerSlogan: 'Connecting you with the world\'s finest artisans.',
    shop: 'Shop',
    allProducts: 'All Products',
    about: 'About',
    ourArtisans: 'Our Artisans',
    ourStory: 'Our Story',
    careers: 'Careers',
    forArtisans: 'For Artisans',
    sellOnVirasat: 'Sell on VIRASAT',
    artisanHandbook: 'Artisan Handbook',
    allRightsReserved: 'All rights reserved.',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',

    // Product Page
    viewDetails: 'View Details'
  },
  hi: {
    // Navigation
    home: 'होम',
    products: 'उत्पाद',
    artisans: 'कारीगर',
    artisanDashboard: 'कारीगर डैशबोर्ड',
    
    // Hero Section
    heroTitle: 'हस्तनिर्मित कहानियाँ, कालातीत खजाने',
    heroSubtitle: 'दुनिया भर के कुशल कारीगरों से अद्वितीय, हस्तनिर्मित सामान खोजें।',
    exploreProducts: 'उत्पाद देखें',
    
    // Sections
    featuredProducts: 'विशेष रुप से प्रदर्शित उत्पाद',
    meetTheArtisans: 'कारीगरों से मिलें',
    viewAll: 'सभी देखें',

    // Footer
    footerSlogan: 'आपको दुनिया के बेहतरीन कारीगरों से जोड़ना।',
    shop: 'खरीदारी करें',
    allProducts: 'सभी उत्पाद',
    about: 'हमारे बारे में',
    ourArtisans: 'हमारे कारीगर',
    ourStory: 'हमारी कहानी',
    careers: 'करियर',
    forArtisans: 'कारीगरों के लिए',
    sellOnVirasat: 'विरासत पर बेचें',
    artisanHandbook: 'कारीगर हैंडबुक',
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',
    termsOfService: 'सेवा की शर्तें',
    privacyPolicy: 'गोपनीयता नीति',

    // Product Page
    viewDetails: 'विवरण देखें'
  },
};

export type TranslationKey = keyof (typeof translations)['en'];
