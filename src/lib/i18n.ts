

// 1. Define the base English translations with a nested structure (namespacing).
// This object is the single source of truth for the entire key structure.
const en = {
    // General / Common keys
    common: {
        loading: "Loading content...",
        error_loading: "Error loading translations. Please try again.",
        search: "Search",
        viewAll: "View All",
        by: "by",
        edit: "Edit",
        delete: "Delete",
        save: "Save Product",
        saving: "Saving...",
        download: "Download",
        generating: "Generating...",
        analyzing: "Analyzing...",
        backToSite: "Back to Site",
        allRightsReserved: "All rights reserved.",
    },
    // Navigation and Footer
    nav: {
        home: 'Home',
        products: 'Products',
        artisans: 'Artisans',
        changeLanguage: 'Change language',
        shoppingCart: 'Shopping Cart',
        artisanDashboard: 'Artisan Dashboard',
        toggleMenu: 'Toggle Menu',
        about: 'About',
        contact: 'Contact',
    },
    footer: {
        shop: 'Shop',
        allProducts: 'All Products',
        ourArtisans: 'Our Artisans',
        ourStory: 'Our Story',
        careers: 'Careers',
        forArtisans: 'For Artisans',
        sellOnVirasat: 'Sell on VIRASAT',
        artisanHandbook: 'Artisan Handbook',
        termsOfService: 'Terms of Service',
        privacyPolicy: 'Privacy Policy',
    },
    // Homepage specific keys
    homepage: {
        heroTitle: 'Handcrafted Stories, Timeless Treasures',
        heroSubtitle: 'Discover unique, handmade goods from skilled artisans around the world.',
        exploreProducts: 'Explore Products',
        featuredProducts: 'Featured Products',
        meetTheArtisans: 'Meet the Artisans',
        connecting: "Connecting you with the world's finest artisans.",
    },
    // Product related keys
    product: {
        ourCollection: 'Our Collection',
        collectionDescription: 'Explore a curated selection of handcrafted goods, each with a unique story and soul.',
        searchPlaceholder: 'Search for products...',
        selectCategory: 'Select a category',
        allCategories: 'All Categories',
        priceRange: 'Price Range',
        noProductsFound: 'No Products Found',
        adjustFilters: 'Try adjusting your search or filters.',
        reviews: '({{count}} reviews)',
        materials: 'Materials',
        inStock: 'in stock',
        outOfStock: 'Out of Stock',
        addToCart: 'Add to Cart',
        soldBy: 'Sold by',
        viewDetails: 'View Details',
        productsBy: 'Products by',
        noProductsListed: 'This artisan has not listed any products yet.',
        categories: {
            blockPrinting: 'Block-Printing',
            woodCarving: 'Wood Carving',
            embroidery: 'Embroidery',
        }
    },
    // Cart and Checkout
    cart: {
        emptyTitle: 'Your cart is empty',
        emptySubtitle: 'Find something beautiful to add!',
        continueShopping: 'Continue Shopping',
        subtotal: 'Subtotal',
        checkout: 'Checkout',
        itemAdded: 'Item added!',
        itemAddedToCart: 'Added {{name}} to your cart.',
        notEnoughStock: 'Not enough stock',
        stockError: 'You cannot add more than the {{stock}} items available.',
    },
    // Artisan Dashboard
    dashboard: {
        overview: {
            title: 'Dashboard Overview',
            subtitle: "Welcome back! Here's a snapshot of your shop's activity.",
        },
        quickStart: {
            title: 'Quick Start Guide',
            subtitle: 'Follow these steps to get your shop up and running.',
            step1Title: 'Setup Profile',
            step1Description: 'Fill in your artisan details and story.',
            step2Title: 'Add a Product',
            step2Description: 'List your first handmade item for sale.',
            step3Title: 'Generate Content',
            step3Description: 'Use AI to create marketing materials.',
            step4Title: 'Connect Payouts',
            step4Description: 'Link your bank account to get paid.',
        },
        myProducts: {
            title: 'My Products',
            subtitle: 'Manage all your listed products here.',
            addProduct: 'Add Product',
            addProductSubtitle: 'Add a new item to your collection.',
            editProductSubtitle: 'Make changes to your existing product.',
            productDetails: 'Product Details',
            detailsDescription: 'Provide the necessary information for your product.',
            name: 'Product Name',
            description: 'Product Description',
            materials: 'Materials',
            images: 'Product Images',
            uploadImage: 'Upload Image',
        },
        tableHeaders: {
            name: 'Name',
            category: 'Category',
            price: 'Price',
            stock: 'Stock',
            image: 'Image',
            actions: 'Actions',
        },
        settings: {
            title: 'Settings',
            subtitle: 'Manage your profile and account settings.',
            artisanProfile: 'Artisan Profile',
            profileDescription: 'Update your public-facing artisan information.',
            profilePicture: 'Profile Picture',
            artisanName: 'Artisan Name',
            bio: 'Bio / Your Story',
            craft: 'Primary Craft/Art Form',
            location: 'Location (City, State)',
            updateProfile: 'Update Profile',
            updatingProfile: 'Updating...',
            updatePassword: 'Update Password',
            confirmNewPasswordLabel: 'Confirm New Password',
        },
        aiTools: {
            pricingOptimizer: {
                title: 'Pricing Optimizer',
                subtitle: 'Get AI-powered suggestions for your product pricing.',
                suggestPrice: 'Suggest Price',
                suggestPriceDescription: 'Fill in the details below to get a price suggestion from our AI.',
                productName: 'Product Name',
                productNamePlaceholder: 'e.g., Hand-Painted Blue Pottery Vase',
                materialsCostLabel: 'Materials Cost (INR)',
                laborCostLabel: 'Labor Cost (INR)',
                marketDemandLabel: 'Market Demand',
                selectDemand: 'Select demand',
                demandLow: 'Low',
                demandMedium: 'Medium',
                demandHigh: 'High',
                artisanSkillLabel: 'Artisan Skill Level',
                selectSkillLevel: 'Select skill level',
                skillBeginner: 'Beginner',
                skillIntermediate: 'Intermediate',
                skillExpert: 'Expert',
                productQualityLabel: 'Product Quality',
                selectQuality: 'Select quality',
                qualityStandard: 'Standard',
                qualityHigh: 'High',
                qualityPremium: 'Premium',
                optimizing: 'Optimizing...',
                suggestedPrice: 'Suggested Price',
                reasoning: 'AI Reasoning',
                analyzingMarketData: 'Analyzing market data...',
                toastPriceSuggestionError: 'Could not get price suggestion.'
            }
        }
    },
    // Toasts and notifications
    toasts: {
        errorTitle: 'An Error Occurred',
        productAdded: 'Product Added!',
        productAddedDescription: 'Your new product is now live.',
        profileUpdated: 'Profile updated successfully!',
        copied: 'Copied to clipboard!',
    }
};


// 2. This is the new, strongly-typed definition for your translations object.
type TranslationSet = typeof en;
type PartialTranslationSet = {
    [K in keyof TranslationSet]?: Partial<TranslationSet[K]>
};

// 3. The master translations object. ONLY include actual translations. No fallbacks.
export const translations: Record<string, PartialTranslationSet> = {
    en, // English is the complete object
    hi: {
        common: {
            loading: "सामग्री लोड हो रही है...",
            search: "खोजें",
            viewAll: "सभी देखें",
        },
        nav: {
            home: 'होम',
            products: 'उत्पाद',
            artisans: 'कारीगर',
            changeLanguage: 'भाषा बदलें',
        },
        homepage: {
            heroTitle: 'हस्तनिर्मित कहानियाँ, कालातीत खजाने',
            heroSubtitle: 'दुनिया भर के कुशल कारीगरों से अद्वितीय, हस्तनिर्मित सामान खोजें।',
            exploreProducts: 'उत्पाद देखें',
        },
        // ... ONLY add other keys that are actually translated.
    },
    // Other languages are initially empty. The lookup function will handle fallbacks.
    bn: {},
    ta: {},
    as: {},
    brx: {},
    doi: {},
    gu: {},
    kn: {},
    ks: {},
    kok: {},
    mai: {},
    ml: {},
    mni: {},
    mr: {},
    ne: {},
    or: {},
    pa: {},
    sa: {},
    sat: {},
    sd: {},
    te: {},
    ur: {},
};

// 4. Utility type to get all possible dot-notation paths from the 'en' object.
// This provides autocomplete and compile-time checks for translation keys.
type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
    { [K in keyof T]-?: K extends string | number ?
        `${K}` | `${K}.${Paths<T[K], Prev[D]>}`
        : never
    }[keyof T] : ""
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ...0[]]

// The new TranslationKey is a specific set of strings, not just any string.
export type TranslationKey = Paths<typeof en>;
