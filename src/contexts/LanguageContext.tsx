import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'English' | 'Hindi' | 'Bengali' | 'Marathi' | 'Telugu' | 'Tamil';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  English: {
    voice_assistant: 'Voice Assistant',
    describe_symptoms: "Describe symptoms or type them below.",
    emergency_mode: 'Emergency Mode',
    nearest_vets: 'Nearest Veterinary Centers',
    livestock_care: 'Livestock Care',
    vaccine_reminders: 'Vaccine Reminders',
    diet_plans: 'Diet Plans',
    home: 'Home',
    emergency: 'Emergency',
    assistant: 'Assistant',
    profile: 'Profile',
    call_helpline: 'Call Helpline',
    sms_sos: 'SMS SOS',
    lite_mode_active: 'Lite Mode',
    offline_mode: 'Offline',
    add_animal: 'Add Animal',
    search_plans: 'Search...',
    nav_now: 'Navigate',
    call_now: 'Call',
    last_updated: 'Updated',
    just_now: 'just now',
    type_here: 'Type symptoms here...',
    analyze: 'Analyze Now',
    history: 'History',
    symptoms: 'Symptoms',
    severity: 'Severity',
    diagnosis: 'Diagnosis',
    treatment: 'Suggested Treatment',
    start_diag: 'Start Diagnostic',
    total_cases: 'Total Cases',
    active_alarms: 'Active Alarms',
    recovery: 'Success Recovery'
  },
  Hindi: {
    voice_assistant: 'आवाज़ सहायक',
    describe_symptoms: 'लक्षण बताएं या नीचे टाइप करें।',
    emergency_mode: 'आपातकालीन मोड',
    nearest_vets: 'निकटतम पशु चिकित्सा केंद्र',
    livestock_care: 'पशुधन देखभाल',
    vaccine_reminders: 'टीकाकरण अनुस्मारक',
    diet_plans: 'आहार योजनाएं',
    home: 'होम',
    emergency: 'आपातकालीन',
    assistant: 'सहायक',
    profile: 'प्रोफ़ाइल',
    call_helpline: 'हेल्पलाइन कॉल',
    sms_sos: 'एसएमएस एसओएस',
    lite_mode_active: 'लाइट मोड',
    offline_mode: 'ऑफ़लाइन',
    add_animal: 'पशु जोड़ें',
    search_plans: 'खोजें...',
    nav_now: 'नेविगेट करें',
    call_now: 'कॉल करें',
    last_updated: 'अपडेट',
    just_now: 'अभी',
    type_here: 'यहाँ लक्षण लिखें...',
    analyze: 'अभी विश्लेषण करें',
    history: 'इतिहास',
    symptoms: 'लक्षण',
    severity: 'गंभीरता',
    diagnosis: 'निदान',
    treatment: 'सुझाया गया उपचार',
    start_diag: 'निदान शुरू करें',
    total_cases: 'कुल केस',
    active_alarms: 'सक्रिय अलार्म',
    recovery: 'सफलता दर'
  },
  Bengali: {
    voice_assistant: 'ভয়েস অ্যাসিস্ট্যান্ট',
    describe_symptoms: 'লক্ষণ বর্ণনা করুন বা নিচে লিখুন।',
    emergency_mode: 'জরুরী মোড',
    nearest_vets: 'নিকটতম পশু চিকিৎসা কেন্দ্র',
    livestock_care: 'গবাদি পশুর যত্ন',
    vaccine_reminders: 'টিকা অনুস্মারক',
    diet_plans: 'খাদ্য পরিকল্পনা',
    home: 'হোম',
    emergency: 'জরুরী',
    assistant: 'সহকারী',
    profile: 'প্রোফাইল',
    call_helpline: 'হেল্পলাইনে কল',
    sms_sos: 'এসএমএস এসওএস',
    lite_mode_active: 'লাইট মোড',
    offline_mode: 'অফলাইন',
    add_animal: 'প্রাণী যোগ করুন',
    search_plans: 'খুঁজুন...',
    nav_now: 'নেভিগেট',
    call_now: 'কল',
    last_updated: 'আপডেট',
    just_now: 'এইমাত্র',
    type_here: 'এখানে লক্ষণ লিখুন...',
    analyze: 'বিশ্লেষণ করুন',
    history: 'ইতিহাস',
    symptoms: 'লক্ষণ',
    severity: 'তীব্রতা',
    diagnosis: 'রোগনির্ণয়',
    treatment: 'চিকিত্সা',
    start_diag: 'শুরু করুন',
    total_cases: 'মোট কেস',
    active_alarms: 'সক্রিয় অ্যালার্ম',
    recovery: 'সুস্থতার হার'
  },
  Marathi: {
    voice_assistant: 'व्हॉइस असिस्टंट',
    describe_symptoms: 'लक्षणे सांगा किंवा खाली टाईप करा.',
    emergency_mode: 'आणीबाणी मोड',
    nearest_vets: 'जवळचे पशुवैद्यकीय केंद्र',
    livestock_care: 'पशुधन काळजी',
    vaccine_reminders: 'लसीकरण स्मरणपत्र',
    diet_plans: 'आहार नियोजन',
    home: 'होम',
    emergency: 'आणीबाणी',
    assistant: 'सहाय्यक',
    profile: 'प्रोफाइल',
    call_helpline: 'हेल्पलाईन कॉल',
    sms_sos: 'एसएमएस एसओएस',
    lite_mode_active: 'लाईट मोड',
    offline_mode: 'ऑफलाइन',
    add_animal: 'प्राणी जोडा',
    search_plans: 'शोधा...',
    nav_now: 'नेव्हिगेट करा',
    call_now: 'कॉल करा',
    last_updated: 'अपडेट',
    just_now: 'आत्ताच',
    type_here: 'येथे लक्षणे लिहा...',
    analyze: 'आता विश्लेषण करा',
    history: 'इतिहास',
    symptoms: 'लक्षणे',
    severity: 'तीव्रता',
    diagnosis: 'निदान',
    treatment: 'उपचार',
    start_diag: 'तपासणी सुरू करा',
    total_cases: 'एकूण केसेस',
    active_alarms: 'सक्रिय अलार्म',
    recovery: 'यशस्वी रिकव्हरी'
  },
  Telugu: {
    voice_assistant: 'వాయిస్ అసిస్టెంట్',
    describe_symptoms: 'లక్షణాలను వివరించండి లేదా టైప్ చేయండి.',
    emergency_mode: 'అత్యవసర మోడ్',
    nearest_vets: 'సమీప పశువైద్య కేంద్రాలు',
    livestock_care: 'పశువుల సంరక్షణ',
    vaccine_reminders: 'టీకా రిమైండర్లు',
    diet_plans: 'ఆహార ప్రణాళికలు',
    home: 'హోమ్',
    emergency: 'అత్యవసరం',
    assistant: 'అసిస్టెంట్',
    profile: 'ప్రొఫైల్',
    call_helpline: 'హెల్ప్‌లైన్ కాల్',
    sms_sos: 'SMS SOS',
    lite_mode_active: 'లైట్ మోడ్',
    offline_mode: 'ఆఫ్‌లైన్',
    add_animal: 'జంతువును చేర్చండి',
    search_plans: 'వెతకండి...',
    nav_now: 'నేవిగేట్',
    call_now: 'కాల్ చేయండి',
    last_updated: 'అప్‌డేట్',
    just_now: 'ఇప్పుడే',
    type_here: 'లక్షణాలను ఇక్కడ టైప్ చేయండి...',
    analyze: 'విశ్లేషించు',
    history: 'చరిత్ర',
    symptoms: 'లక్షణాలు',
    severity: 'తీవ్రత',
    diagnosis: 'వ్యాధి నిర్ధారణ',
    treatment: 'చికిత్స',
    start_diag: 'ప్రారంభించండి',
    total_cases: 'మొత్తం కేసులు',
    active_alarms: 'యాక్టివ్ అలారమ్స్',
    recovery: 'రికవరీ రేటు'
  },
  Tamil: {
    voice_assistant: 'குரல் உதவியாளர்',
    describe_symptoms: 'அறிகுறிகளை விவரிக்கவும் அல்லது கீழே தட்டச்சு செய்யவும்.',
    emergency_mode: 'அவசர நிலை',
    nearest_vets: 'அருகிலுள்ள கால்நடை மையங்கள்',
    livestock_care: 'கால்நடை பராமரிப்பு',
    vaccine_reminders: 'தடுப்பூசி நினைவூட்டல்கள்',
    diet_plans: 'உணவுத் திட்டங்கள்',
    home: 'முகப்பு',
    emergency: 'அவசரம்',
    assistant: 'உதவியாளர்',
    profile: 'சுயவிவரம்',
    call_helpline: 'உதவி எண்',
    sms_sos: 'SMS SOS',
    lite_mode_active: 'லைட் மோட்',
    offline_mode: 'ஆஃப்லைன்',
    add_animal: 'விலங்கு சேர்',
    search_plans: 'தேடு...',
    nav_now: 'வழிசெலுத்து',
    call_now: 'அழைக்கவும்',
    last_updated: 'புதுப்பிக்கப்பட்டது',
    just_now: 'இப்போது',
    type_here: 'அறிகுறிகளை இங்கே தட்டச்சு செய்க...',
    analyze: 'ஆய்வு செய்',
    history: 'வரலாறு',
    symptoms: 'அறிகுறிகள்',
    severity: 'தீவிரம்',
    diagnosis: 'நோய் கண்டறிதல்',
    treatment: 'பரிந்துரைக்கப்பட்ட சிகிச்சை',
    start_diag: 'பரிசோதனையைத் தொடங்கு',
    total_cases: 'மொத்த வழக்குகள்',
    active_alarms: 'செயலில் உள்ள எச்சரிக்கைகள்',
    recovery: 'வெற்றிகரமான மீட்பு'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('English');

  const t = (key: string) => {
    return TRANSLATIONS[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
