
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
    
    // Header
    changeLanguage: 'Change language',
    search: 'Search',
    toggleMenu: 'Toggle Menu',
    
    // Hero Section
    heroTitle: 'Handcrafted Stories, Timeless Treasures',
    heroSubtitle: 'Discover unique, handmade goods from skilled artisans around the world.',
    exploreProducts: 'Explore Products',

    // Sections
    featuredProducts: 'Featured Products',
    meetTheArtisans: 'Meet the Artisans',
    viewAll: 'View All',
    
    // Footer
    footerSlogan: "Connecting you with the world's finest artisans.",
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

    // Categories
    categoryBlockPrinting: 'Block-Printing',
    categoryWoodCarving: 'Wood Carving',
    categoryEmbroidery: 'Embroidery',

    // Product Page
    viewDetails: 'View Details',
    productReviews: '(12 reviews)',
    productMaterials: 'Materials',
    addToCart: 'Add to Cart',
    soldBy: 'Sold by',
    
    // Products Page
    ourCollection: 'Our Collection',
    ourCollectionSubtitle: 'Explore a curated selection of handcrafted goods, each with a unique story and soul.',

    // Products Search Page
    productSearchTitle: 'Product Search',
    productSearchSubtitle: "Find exactly what you're looking for. Filter by category, artisan, price, and more.",
    searchProductsPlaceholder: 'Search for products...',
    allCategories: 'All Categories',
    selectACategory: 'Select a category',
    priceRange: 'Price Range',
    noProductsFound: 'No Products Found',
    noProductsFoundSubtitle: 'Try adjusting your search or filters.',
    allArtisans: 'All Artisans',
    productSearchPlaceholder: 'Search by product name or description...',
    noProductsFoundFilterSubtitle: "Try adjusting your search or filters to find what you're looking for.",


    // Artisans Page
    meetOurArtisans: 'Meet Our Artisans',
    artisansPageSubtitle: 'The heart and soul of Virasat. Discover the stories and crafts of the talented individuals behind our products.',
    viewProfile: 'View Profile',

    // Artisan Detail Page
    artisanDetailAbout: 'About',
    artisanDetailContact: 'Contact',
    artisanDetailProductsBy: 'Products by',
    artisanDetailNoProducts: 'This artisan has not listed any products yet.',

    // Contact Artisan Form
    formLabelYourName: 'Your Name',
    formPlaceholderYourName: 'Jane Doe',
    formLabelYourEmail: 'Your Email',
    formPlaceholderYourEmail: 'jane.doe@example.com',
    formLabelMessage: 'Message',
    formPlaceholderMessage: 'Inquire about a custom order or ask a question...',
    sending: 'Sending...',
    sendMessage: 'Send Message',
    toastMessageSentTitle: 'Message Sent!',
    toastMessageSentDescription: 'The artisan has been notified and will get back to you soon.',
    
    // Dashboard
    dashboardOverviewTitle: 'Overview',
    dashboardOverviewSubtitle: "Welcome back, here's a summary of your shop's activity.",
    totalRevenue: 'Total Revenue',
    revenueLastMonth: '+20.1% from last month',
    totalProducts: 'Total Products',
    productsLastMonth: '+3 since last month',
    profileViews: 'Profile Views',
    viewsLastMonth: '+9.2% from last month',
    recentProducts: 'Recent Products',
    recentProductsDescription: 'An overview of your most recently added products.',
    tableHeaderName: 'Name',
    tableHeaderCategory: 'Category',
    tableHeaderPrice: 'Price',
    tableHeaderStock: 'Stock',

    // Dashboard - Products
    myProducts: 'My Products',
    myProductsSubtitle: 'Manage your inventory and view product details.',
    addProduct: 'Add Product',
    allProductsDescription: 'A list of all products in your store.',
    tableHeaderImage: 'Image',
    tableHeaderActions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    
    // Dashboard - Add Product
    addProductSubtitle: "Fill in the details below to add a new product to your store.",
    productDetails: "Product Details",
    productDetailsDescription: "Provide both English and Hindi details for a wider reach.",
    productName: "Product Name",
    productDescription: "Product Description",
    productImages: "Product Images",
    imageUploadPlaceholder: "Image upload functionality coming soon!",
    saveProduct: "Save Product",
    savingProduct: "Saving...",
    toastProductAddedTitle: "Product Added!",
    toastProductAddedDescription: "Your new product has been successfully added to the database.",
    
    // Dashboard - Sidebar
    aiTools: 'AI Tools',
    settings: 'Settings',
    backToSite: 'Back to Site',

    // AI Storyteller
    aiStorytellerTitle: 'AI Storyteller',
    aiStorytellerSubtitle: "Tell your product's story with your voice. We'll turn it into a captivating description.",
    recordAStory: 'Record a Story',
    recordAStoryDescription: "Share the story, inspiration, and details of your product. Our AI will transform your voice note into a compelling product description.",
    stopRecording: 'Stop Recording',
    startRecording: 'Start Recording',
    yourVoiceNote: 'Your voice note:',
    recordAgain: 'Record again',
    styleToneLabel: 'Style/Tone (Optional)',
    styleTonePlaceholder: 'e.g., Elegant, Rustic, Modern, Playful',
    generateDescription: 'Generate Description',
    generating: 'Generating...',
    generatedDescription: 'Generated Description:',
    transcript: 'Transcript:',
    micAccessRequiredTitle: 'Microphone Access Required',
    micAccessRequiredDescription: 'Please allow microphone access in your browser settings to use this feature.',
    checkingForMicrophone: 'Checking for microphone...',
    
    // Marketing Suite
    marketingSuiteTitle: 'Smart Marketing Suite',
    marketingSuiteSubtitle: 'Automatically generate social media posts, email newsletters, and ad copy.',
    generateMarketingContent: 'Generate Marketing Content',
    generateMarketingContentDescription: 'Select a product and target audience to generate tailored marketing materials.',
    product: 'Product',
    selectAProduct: 'Select a product',
    targetAudience: 'Target Audience',
    targetAudiencePlaceholder: 'e.g., Eco-conscious millennials, home decor enthusiasts',
    generateContent: 'Generate Content',
    socialMediaPost: 'Social Media Post',
    emailNewsletter: 'Email Newsletter',
    adCopy: 'Ad Copy',

    // Pricing Optimizer
    pricingOptimizerTitle: 'AI Pricing Optimizer',
    pricingOptimizerSubtitle: 'Get competitive and profitable price suggestions for your products.',
    suggestPrice: 'Suggest a Price',
    suggestPriceDescription: 'Provide details about your product to receive a suggested price and the reasoning behind it.',
    productNamePlaceholder: 'e.g., Hand-painted Blue Pottery Vase',
    materialsCostLabel: 'Materials Cost (₹)',
    laborCostLabel: 'Labor Cost (₹)',
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
    reasoning: 'Reasoning',
    analyzingMarketData: 'Analyzing market data...',

    // Trend Harmonizer
    trendHarmonizerTitle: 'Trend Harmonizer',
    trendHarmonizerSubtitle: 'Align your craft with market trends without losing your unique style.',
    analyzeProductTrends: 'Analyze Product Trends',
    analyzeProductTrendsDescription: 'Select a product to analyze current market trends and get actionable suggestions.',
    selectProductToAnalyze: 'Select a product to analyze',
    analyzing: 'Analyzing...',
    analyzeTrends: 'Analyze Trends',
    trendAnalysis: 'Trend Analysis',
    actionableSuggestions: 'Actionable Suggestions',

    // Visual Enhancer
    visualEnhancerTitle: 'Visual Enhancer & Mockup Studio',
    visualEnhancerSubtitle: 'Create stunning, professional-looking product photos and mockups.',
    generateLifestyleMockup: 'Generate Lifestyle Mockup',
    generateLifestyleMockupDescription: 'Upload a photo of your product and describe a scene. Our AI will generate a realistic lifestyle image.',
    productImage: 'Product Image',
    uploadImage: 'Upload Image',
    sceneDescription: 'Scene Description',
    sceneDescriptionPlaceholder: 'e.g., A handmade quilt on a bed in a modern, sunlit bedroom.',
    generateMockup: 'Generate Mockup',
    generatingMockupMessage: 'Generating your beautiful mockup... this may take a moment.',
    generatedMockup: 'Generated Mockup:',
    download: 'Download',

    // Toasts
    toastErrorTitle: 'An error occurred',
    toastErrorDescription: 'Something went wrong. Please try again.',
    toastPriceSuggestionError: 'Failed to suggest price. Please try again.',
    toastTrendAnalysisError: 'Failed to analyze trends. Please try again.',
    toastMockupError: 'Failed to generate mockup. Please try again.',
    toastProcessImageError: 'Failed to process image. Please try again.',
    toastProductNotFound: 'Product not found',
    toastCopied: 'Copied to clipboard!',
    toastMicAccessDeniedTitle: 'Microphone Access Denied',
    toastMicAccessDeniedDescription: 'Please enable microphone permissions in your browser settings.',
    toastNoAudioTitle: 'No audio recorded',
    toastNoAudioDescription: 'Please record your story before generating a description.',
    toastProcessAudioError: 'Failed to process audio. Please try again.',

  },
  hi: {
    // Navigation
    home: 'होम',
    products: 'उत्पाद',
    artisans: 'कारीगर',
    artisanDashboard: 'कारीगर डैशबोर्ड',

    // Header
    changeLanguage: 'भाषा बदलें',
    search: 'खोजें',
    toggleMenu: 'मेन्यू टॉगल करें',

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

    // Categories
    categoryBlockPrinting: 'ब्लॉक-प्रिंटिंग',
    categoryWoodCarving: 'लकड़ी की नक्काशी',
    categoryEmbroidery: 'कढ़ाई',

    // Product Page
    viewDetails: 'विवरण देखें',
    productReviews: '(12 समीक्षाएं)',
    productMaterials: 'सामग्री',
    addToCart: 'कार्ट में जोड़ें',
    soldBy: 'द्वारा बेचा गया',
    
    // Products Page
    ourCollection: 'हमारा संग्रह',
    ourCollectionSubtitle: 'हस्तनिर्मित वस्तुओं का एक क्यूरेटेड चयन देखें, प्रत्येक की एक अनूठी कहानी और आत्मा है।',

    // Products Search Page
    productSearchTitle: 'उत्पाद खोज',
    productSearchSubtitle: 'ठीक वही खोजें जो आप खोज रहे हैं। श्रेणी, कारीगर, मूल्य और बहुत कुछ के आधार पर फ़िल्टर करें।',
    searchProductsPlaceholder: 'उत्पादों के लिए खोजें...',
    allCategories: 'सभी श्रेणियां',
    selectACategory: 'एक श्रेणी चुनें',
    priceRange: 'मूल्य सीमा',
    noProductsFound: 'कोई उत्पाद नहीं मिला',
    noProductsFoundSubtitle: 'अपनी खोज या फ़िल्टर समायोजित करने का प्रयास करें।',
    allArtisans: 'सभी कारीगर',
    productSearchPlaceholder: 'उत्पाद के नाम या विवरण से खोजें...',
    noProductsFoundFilterSubtitle: "आप जो खोज रहे हैं उसे खोजने के लिए अपनी खोज या फ़िल्टर समायोजित करने का प्रयास करें।",


    // Artisans Page
    meetOurArtisans: 'हमारे कारीगरों से मिलें',
    artisansPageSubtitle: 'विरासत का दिल और आत्मा। हमारे उत्पादों के पीछे प्रतिभाशाली व्यक्तियों की कहानियों और शिल्पों की खोज करें।',
    viewProfile: 'प्रोफ़ाइल देखें',

    // Artisan Detail Page
    artisanDetailAbout: 'के बारे में',
    artisanDetailContact: 'संपर्क करें',
    artisanDetailProductsBy: 'द्वारा उत्पाद',
    artisanDetailNoProducts: 'इस कारीगर ने अभी तक कोई उत्पाद सूचीबद्ध नहीं किया है।',
    
    // Contact Artisan Form
    formLabelYourName: 'आपका नाम',
    formPlaceholderYourName: 'เจน โด',
    formLabelYourEmail: 'आपका ईमेल',
    formPlaceholderYourEmail: 'jane.doe@example.com',
    formLabelMessage: 'संदेश',
    formPlaceholderMessage: 'एक कस्टम ऑर्डर के बारे में पूछताछ करें या एक प्रश्न पूछें...',
    sending: 'भेज रहा है...',
    sendMessage: 'संदेश भेजें',
    toastMessageSentTitle: 'संदेश भेजा गया!',
    toastMessageSentDescription: 'कारीगर को सूचित कर दिया गया है और वह जल्द ही आपसे संपर्क करेगा।',

    // Dashboard
    dashboardOverviewTitle: 'अवलोकन',
    dashboardOverviewSubtitle: 'वापसी पर स्वागत है, यहाँ आपकी दुकान की गतिविधि का सारांश है।',
    totalRevenue: 'कुल राजस्व',
    revenueLastMonth: 'पिछले महीने से +20.1%',
    totalProducts: 'कुल उत्पाद',
    productsLastMonth: 'पिछले महीने से +3',
    profileViews: 'प्रोफ़ाइल देखे जाने की संख्या',
    viewsLastMonth: 'पिछले महीने से +9.2%',
    recentProducts: 'हाल के उत्पाद',
    recentProductsDescription: 'आपके हाल ही में जोड़े गए उत्पादों का एक अवलोकन।',
    tableHeaderName: 'नाम',
    tableHeaderCategory: 'श्रेणी',
    tableHeaderPrice: 'कीमत',
    tableHeaderStock: 'स्टॉक',

    // Dashboard - Products
    myProducts: 'मेरे उत्पाद',
    myProductsSubtitle: 'अपनी इन्वेंट्री प्रबंधित करें और उत्पाद विवरण देखें।',
    addProduct: 'उत्पाद जोड़ें',
    allProductsDescription: 'आपके स्टोर में सभी उत्पादों की एक सूची।',
    tableHeaderImage: 'छवि',
    tableHeaderActions: 'कार्रवाइयाँ',
    edit: 'संपादित करें',
    delete: 'हटाएं',

    // Dashboard - Add Product
    addProductSubtitle: "अपने स्टोर में एक नया उत्पाद जोड़ने के लिए नीचे दिए गए विवरण भरें।",
    productDetails: "उत्पाद विवरण",
    productDetailsDescription: "व्यापक पहुंच के लिए अंग्रेजी और हिंदी दोनों में विवरण प्रदान करें।",
    productName: "उत्पाद का नाम",
    productDescription: "उत्पाद विवरण",
    productImages: "उत्पाद छवियाँ",
    imageUploadPlaceholder: "छवि अपलोड कार्यक्षमता जल्द ही आ रही है!",
    saveProduct: "उत्पाद सहेजें",
    savingProduct: "सहेजा जा रहा है...",
    toastProductAddedTitle: "उत्पाद जोड़ा गया!",
    toastProductAddedDescription: "आपका नया उत्पाद डेटाबेस में सफलतापूर्वक जोड़ दिया गया है।",
    
    // Dashboard - Sidebar
    aiTools: 'एआई उपकरण',
    settings: 'समायोजन',
    backToSite: 'साइट पर वापस',

    // AI Storyteller
    aiStorytellerTitle: 'एआई कथाकार',
    aiStorytellerSubtitle: 'अपने उत्पाद की कहानी अपनी आवाज़ में बताएं। हम इसे एक मनोरम विवरण में बदल देंगे।',
    recordAStory: 'एक कहानी रिकॉर्ड करें',
    recordAStoryDescription: 'अपने उत्पाद की कहानी, प्रेरणा और विवरण साझा करें। हमारा एआई आपके वॉयस नोट को एक आकर्षक उत्पाद विवरण में बदल देगा।',
    stopRecording: 'रिकॉर्डिंग बंद करें',
    startRecording: 'रिकॉर्डिंग शुरू करें',
    yourVoiceNote: 'आपका वॉयस नोट:',
    recordAgain: 'फिर से रिकॉर्ड करें',
    styleToneLabel: 'शैली/टोन (वैकल्पिक)',
    styleTonePlaceholder: 'उदा., सुंदर, देहाती, आधुनिक, चंचल',
    generateDescription: 'विवरण उत्पन्न करें',
    generating: 'उत्पन्न हो रहा है...',
    generatedDescription: 'उत्पन्न विवरण:',
    transcript: 'प्रतिलिपि:',
    micAccessRequiredTitle: 'माइक्रोफोन एक्सेस आवश्यक है',
    micAccessRequiredDescription: 'इस सुविधा का उपयोग करने के लिए कृपया अपने ब्राउज़र सेटिंग्स में माइक्रोफोन एक्सेस की अनुमति दें।',
    checkingForMicrophone: 'माइक्रोफोन की जाँच हो रही है...',

    // Marketing Suite
    marketingSuiteTitle: 'स्मार्ट मार्केटिंग सूट',
    marketingSuiteSubtitle: 'स्वचालित रूप से सोशल मीडिया पोस्ट, ईमेल न्यूज़लेटर और विज्ञापन प्रतिलिपि उत्पन्न करें।',
    generateMarketingContent: 'विपणन सामग्री उत्पन्न करें',
    generateMarketingContentDescription: 'अनुरूप विपणन सामग्री उत्पन्न करने के लिए एक उत्पाद और लक्षित दर्शक चुनें।',
    product: 'उत्पाद',
    selectAProduct: 'एक उत्पाद चुनें',
    targetAudience: 'लक्षित दर्शक',
    targetAudiencePlaceholder: 'उदा., पर्यावरण के प्रति जागरूक सहस्राब्दी, गृह सज्जा के प्रति उत्साही',
    generateContent: 'सामग्री उत्पन्न करें',
    socialMediaPost: 'सोशल मीडिया पोस्ट',
    emailNewsletter: 'ईमेल न्यूज़लेटर',
    adCopy: 'विज्ञापन प्रतिलिपि',

    // Pricing Optimizer
    pricingOptimizerTitle: 'एआई मूल्य निर्धारण अनुकूलक',
    pricingOptimizerSubtitle: 'अपने उत्पादों के लिए प्रतिस्पर्धी और लाभदायक मूल्य सुझाव प्राप्त करें।',
    suggestPrice: 'एक मूल्य सुझाएं',
    suggestPriceDescription: 'एक सुझाए गए मूल्य और उसके पीछे के तर्क को प्राप्त करने के लिए अपने उत्पाद के बारे में विवरण प्रदान करें।',
    productNamePlaceholder: 'उदा., हाथ से पेंट किया हुआ नीला मिट्टी का फूलदान',
    materialsCostLabel: 'सामग्री लागत (₹)',
    laborCostLabel: 'श्रम लागत (₹)',
    marketDemandLabel: 'बाजार की मांग',
    selectDemand: 'मांग चुनें',
    demandLow: 'कम',
    demandMedium: 'मध्यम',
    demandHigh: 'उच्च',
    artisanSkillLabel: 'कारीगर कौशल स्तर',
    selectSkillLevel: 'कौशल स्तर चुनें',
    skillBeginner: 'शुरुआती',
    skillIntermediate: 'मध्यवर्ती',
    skillExpert: 'विशेषज्ञ',
    productQualityLabel: 'उत्पाद की गुणवत्ता',
    selectQuality: 'गुणवत्ता चुनें',
    qualityStandard: 'मानक',
    qualityHigh: 'उच्च',
    qualityPremium: 'प्रीमियम',
    optimizing: 'अनुकूलन हो रहा है...',
    suggestedPrice: 'सुझाया गया मूल्य',
    reasoning: 'तर्क',
    analyzingMarketData: 'बाजार के आंकड़ों का विश्लेषण हो रहा है...',

    // Trend Harmonizer
    trendHarmonizerTitle: 'ट्रेंड हार्मोनाइज़र',
    trendHarmonizerSubtitle: 'अपनी अनूठी शैली को खोए बिना अपने शिल्प को बाजार के रुझानों के साथ संरेखित करें।',
    analyzeProductTrends: 'उत्पाद रुझानों का विश्लेषण करें',
    analyzeProductTrendsDescription: 'वर्तमान बाजार के रुझानों का विश्लेषण करने और कार्रवाई योग्य सुझाव प्राप्त करने के लिए एक उत्पाद चुनें।',
    selectProductToAnalyze: 'विश्लेषण करने के लिए एक उत्पाद चुनें',
    analyzing: 'विश्लेषण हो रहा है...',
    analyzeTrends: 'रुझानों का विश्लेषण करें',
    trendAnalysis: 'रुझान विश्लेषण',
    actionableSuggestions: 'कार्रवाई योग्य सुझाव',
    
    // Visual Enhancer
    visualEnhancerTitle: 'विज़ुअल एन्हांसर और मॉकअप स्टूडियो',
    visualEnhancerSubtitle: 'आश्चर्यजनक, पेशेवर दिखने वाली उत्पाद तस्वीरें और मॉकअप बनाएं।',
    generateLifestyleMockup: 'लाइफस्टाइल मॉकअप उत्पन्न करें',
    generateLifestyleMockupDescription: 'अपने उत्पाद की एक तस्वीर अपलोड करें और एक दृश्य का वर्णन करें। हमारा एआई एक यथार्थवादी जीवन शैली की छवि उत्पन्न करेगा।',
    productImage: 'उत्पाद छवि',
    uploadImage: 'छवि अपलोड करें',
    sceneDescription: 'दृश्य विवरण',
    sceneDescriptionPlaceholder: 'उदा., एक आधुनिक, धूप वाले बेडरूम में बिस्तर पर एक हस्तनिर्मित रजाई।',
    generateMockup: 'मॉकअप उत्पन्न करें',
    generatingMockupMessage: 'आपका सुंदर मॉकअप उत्पन्न हो रहा है... इसमें कुछ समय लग सकता है।',
    generatedMockup: 'उत्पन्न मॉकअप:',
    download: 'डाउनलोड करें',

    // Toasts
    toastErrorTitle: 'एक त्रुटि हुई',
    toastErrorDescription: 'कुछ गलत हो गया। कृपया पुन: प्रयास करें।',
    toastPriceSuggestionError: 'मूल्य सुझाने में विफल। कृपया पुन: प्रयास करें।',
    toastTrendAnalysisError: 'रुझानों का विश्लेषण करने में विफल। कृपया पुन: प्रयास करें।',
    toastMockupError: 'मॉकअप उत्पन्न करने में विफल। कृपया पुन: प्रयास करें।',
    toastProcessImageError: 'छवि को संसाधित करने में विफल। कृपया पुन: प्रयास करें।',
    toastProductNotFound: 'उत्पाद नहीं मिला',
    toastCopied: 'क्लिपबोर्ड पर कॉपी किया गया!',
    toastMicAccessDeniedTitle: 'माइक्रोफोन एक्सेस अस्वीकृत',
    toastMicAccessDeniedDescription: 'कृपया अपने ब्राउज़र सेटिंग्स में माइक्रोफोन अनुमतियों को सक्षम करें।',
    toastNoAudioTitle: 'कोई ऑडियो रिकॉर्ड नहीं किया गया',
    toastNoAudioDescription: 'विवरण उत्पन्न करने से पहले कृपया अपनी कहानी रिकॉर्ड करें।',
    toastProcessAudioError: 'ऑडियो संसाधित करने में विफल। कृपया पुन: प्रयास करें।',
  },
};

export type TranslationKey = keyof (typeof translations)['en'];
