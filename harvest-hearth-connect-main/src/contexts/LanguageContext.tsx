import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Multi-language translation mappings for the agricultural marketplace
const translations: Record<string, Record<string, string>> = {
  en: {
    // Landing Page
    'landing.title': 'KrishiSettu',
    'landing.tagline': 'Connecting Farmers with Buyers Through Digital Auctions',
    'landing.description': 'Join the agricultural revolution. Fair prices, transparent bidding, direct connections.',
    'landing.registerFarmer': 'Register as Farmer',
    'landing.registerBuyer': 'Register as Buyer',
    'landing.joinAuction': 'Join Live Auction',
    'landing.about': 'About Us',
    
    // Navigation
    'nav.home': 'Home',
    'nav.auctions': 'Auctions',
    'nav.logistics': 'Logistics',
    'nav.about': 'About',
    'nav.dashboard': 'Dashboard',
    
    // Common
    'common.continue': 'Continue',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.loading': 'Loading...',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.farmer': 'Farmer',
    'dashboard.buyer': 'Buyer',
    'dashboard.auctions': 'Auctions',
    'dashboard.myBids': 'My Bids',
    'dashboard.myCrops': 'My Crops',
    'dashboard.addCrop': 'Add New Crop',
    'dashboard.mandiPrices': 'Mandi Prices',
    'dashboard.collectiveSelling': 'Collective Selling',
    'dashboard.whatsappSMS': 'WhatsApp/SMS',
    'dashboard.contracts': 'Contracts',
    
    // Auction
    'auction.joinAuction': 'Join Auction',
    'auction.placeBid': 'Place Bid',
    'auction.currentBid': 'Current Bid',
    'auction.basePrice': 'Base Price',
    'auction.timeLeft': 'Time Left',
    'auction.totalBids': 'Total Bids',
    'auction.quantity': 'Quantity',
    'auction.quality': 'Quality',
    'auction.farmingMethod': 'Farming Method',
    'auction.harvestDate': 'Harvest Date',
    'auction.description': 'Description',
    
    // Mandi Prices
    'mandi.currentPrices': 'Current Mandi Prices',
    'mandi.mspAlerts': 'MSP Alerts & Recommendations',
    'mandi.aboveMSP': 'Above MSP',
    'mandi.belowMSP': 'Below MSP',
    'mandi.goodToSell': 'Good to Sell',
    'mandi.wait': 'Wait',
    
    
    // Language Selection
    'language.title': 'KrishiSettu',
    'language.subtitle': 'Choose your preferred language',
    'language.continue': 'Continue',
  },
  hi: {
    // Landing Page
    'landing.title': 'कृषिसेट्टू',
    'landing.tagline': 'डिजिटल नीलामी के माध्यम से किसानों को खरीदारों से जोड़ना',
    'landing.description': 'कृषि क्रांति में शामिल हों। उचित मूल्य, पारदर्शी बोली, प्रत्यक्ष संपर्क।',
    'landing.registerFarmer': 'किसान के रूप में पंजीकरण करें',
    'landing.registerBuyer': 'खरीदार के रूप में पंजीकरण करें',
    'landing.joinAuction': 'लाइव नीलामी में शामिल हों',
    'landing.about': 'हमारे बारे में',
    
    // Navigation
    'nav.home': 'होम',
    'nav.auctions': 'नीलामी',
    'nav.logistics': 'रसद',
    'nav.about': 'हमारे बारे में',
    'nav.dashboard': 'डैशबोर्ड',
    
    // Common
    'common.continue': 'जारी रखें',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.loading': 'लोड हो रहा है...',
    
    // Dashboard
    'dashboard.welcome': 'वापस स्वागत है',
    'dashboard.farmer': 'किसान',
    'dashboard.buyer': 'खरीदार',
    'dashboard.auctions': 'नीलामी',
    'dashboard.myBids': 'मेरी बोलियां',
    'dashboard.myCrops': 'मेरी फसलें',
    'dashboard.addCrop': 'नई फसल जोड़ें',
    'dashboard.mandiPrices': 'मंडी कीमतें',
    'dashboard.collectiveSelling': 'सामूहिक बिक्री',
    'dashboard.whatsappSMS': 'व्हाट्सऐप/एसएमएस',
    'dashboard.contracts': 'अनुबंध',
    
    // Auction
    'auction.joinAuction': 'नीलामी में शामिल हों',
    'auction.placeBid': 'बोली लगाएं',
    'auction.currentBid': 'वर्तमान बोली',
    'auction.basePrice': 'आधार मूल्य',
    'auction.timeLeft': 'बचा समय',
    'auction.totalBids': 'कुल बोलियां',
    'auction.quantity': 'मात्रा',
    'auction.quality': 'गुणवत्ता',
    'auction.farmingMethod': 'खेती का तरीका',
    'auction.harvestDate': 'कटाई की तारीख',
    'auction.description': 'विवरण',
    
    // Mandi Prices
    'mandi.currentPrices': 'वर्तमान मंडी कीमतें',
    'mandi.mspAlerts': 'एमएसपी अलर्ट और सुझाव',
    'mandi.aboveMSP': 'एमएसपी से ऊपर',
    'mandi.belowMSP': 'एमएसपी से नीचे',
    'mandi.goodToSell': 'बेचने के लिए अच्छा',
    'mandi.wait': 'प्रतीक्षा करें',
    
    
    // Language Selection
    'language.title': 'कृषिसेट्टू',
    'language.subtitle': 'अपनी पसंदीदा भाषा चुनें',
    'language.continue': 'जारी रखें',
  },
  bn: {
    // Landing Page
    'landing.title': 'কৃষিসেট্টু',
    'landing.tagline': 'ডিজিটাল নিলামের মাধ্যমে কৃষকদের ক্রেতাদের সাথে সংযুক্ত করা',
    'landing.description': 'কৃষি বিপ্লবে যোগ দিন। ন্যায্য মূল্য, স্বচ্ছ বিডিং, সরাসরি সংযোগ।',
    'landing.registerFarmer': 'কৃষক হিসেবে নিবন্ধন করুন',
    'landing.registerBuyer': 'ক্রেতা হিসেবে নিবন্ধন করুন',
    'landing.joinAuction': 'লাইভ নিলামে যোগ দিন',
    'landing.about': 'আমাদের সম্পর্কে',
    
    // Navigation
    'nav.home': 'হোম',
    'nav.auctions': 'নিলাম',
    'nav.logistics': 'রসদ',
    'nav.about': 'আমাদের সম্পর্কে',
    'nav.dashboard': 'ড্যাশবোর্ড',
    
    // Common
    'common.continue': 'চালিয়ে যান',
    'common.submit': 'জমা দিন',
    'common.cancel': 'বাতিল',
    'common.save': 'সংরক্ষণ',
    'common.edit': 'সম্পাদনা',
    'common.delete': 'মুছুন',
    'common.loading': 'লোড হচ্ছে...',
    
    // Language Selection
    'language.title': 'কৃষিসেট্টু',
    'language.subtitle': 'আপনার পছন্দের ভাষা বেছে নিন',
    'language.continue': 'চালিয়ে যান',
  },
  mr: {
    // Landing Page
    'landing.title': 'कृषिसेट्टू',
    'landing.tagline': 'डिजिटल लिलावीद्वारे शेतकऱ्यांना खरेदीदारांशी जोडणे',
    'landing.description': 'कृषी क्रांतीत सामील व्हा. न्याय्य किंमत, पारदर्शक बोली, थेट कनेक्शन.',
    'landing.registerFarmer': 'शेतकरी म्हणून नोंदणी करा',
    'landing.registerBuyer': 'खरेदीदार म्हणून नोंदणी करा',
    'landing.joinAuction': 'लाइव्ह लिलावीत सामील व्हा',
    'landing.about': 'आमच्याबद्दल',
    
    // Navigation
    'nav.home': 'होम',
    'nav.auctions': 'लिलाव',
    'nav.logistics': 'रसद',
    'nav.about': 'आमच्याबद्दल',
    'nav.dashboard': 'डॅशबोर्ड',
    
    // Common
    'common.continue': 'सुरू ठेवा',
    'common.submit': 'सबमिट करा',
    'common.cancel': 'रद्द करा',
    'common.save': 'जतन करा',
    'common.edit': 'संपादित करा',
    'common.delete': 'हटवा',
    'common.loading': 'लोड होत आहे...',
    
    // Language Selection
    'language.title': 'कृषिसेट्टू',
    'language.subtitle': 'तुमची पसंतीची भाषा निवडा',
    'language.continue': 'सुरू ठेवा',
  },
  ta: {
    // Landing Page
    'landing.title': 'கிரிஷிசெட்டு',
    'landing.tagline': 'டிஜிட்டல் ஏலம் மூலம் விவசாயிகளை வாங்குபவர்களுடன் இணைத்தல்',
    'landing.description': 'விவசாய புரட்சியில் சேருங்கள். நியாயமான விலை, வெளிப்படையான ஏலம், நேரடி தொடர்பு.',
    'landing.registerFarmer': 'விவசாயியாக பதிவு செய்யுங்கள்',
    'landing.registerBuyer': 'வாங்குபவராக பதிவு செய்யுங்கள்',
    'landing.joinAuction': 'நேரடி ஏலத்தில் சேருங்கள்',
    'landing.about': 'எங்களைப் பற்றி',
    
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.auctions': 'ஏலங்கள்',
    'nav.logistics': 'தளவாடம்',
    'nav.about': 'எங்களைப் பற்றி',
    'nav.dashboard': 'டாஷ்போர்டு',
    
    // Common
    'common.continue': 'தொடரவும்',
    'common.submit': 'சமர்ப்பிக்கவும்',
    'common.cancel': 'ரத்து செய்',
    'common.save': 'சேமிக்கவும்',
    'common.edit': 'திருத்து',
    'common.delete': 'அழி',
    'common.loading': 'ஏற்றுகிறது...',
    
    // Language Selection
    'language.title': 'கிரிஷிசெட்டு',
    'language.subtitle': 'உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
    'language.continue': 'தொடரவும்',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: string;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  initialLanguage = 'en' 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
  };

  // Translation function with fallback to English if translation not found
  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};