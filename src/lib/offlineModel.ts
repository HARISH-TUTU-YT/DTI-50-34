
export interface LocalDetectionResult {
  disease: string;
  firstAid: string;
  severity: 'Low' | 'Medium' | 'High' | 'EMERGENCY';
}

const DEFAULT_SYMPTOM_KEYWORDS: Record<string, LocalDetectionResult> = {
  'fever': { 
    disease: 'Possible Viral Infection', 
    firstAid: 'Keep the animal in a cool, shaded area. Provide fresh water.', 
    severity: 'Medium' 
  },
  'cough': { 
    disease: 'Respiratory Distress', 
    firstAid: 'Isolate the animal to prevent spread. Ensure good ventilation.', 
    severity: 'Medium' 
  },
  'not eating': { 
    disease: 'Anorexia/Digestive Issue', 
    firstAid: 'Check for mouth sores. Offer fresh, soft fodder.', 
    severity: 'Low' 
  },
  'bleeding': { 
    disease: 'Physical Injury', 
    firstAid: 'Apply pressure with a clean cloth. Do not apply mud.', 
    severity: 'EMERGENCY' 
  },
  'diarrhea': { 
    disease: 'Gastrointestinal Infection', 
    firstAid: 'Provide electrolyte-rich water (ORS). Keep surroundings clean.', 
    severity: 'High' 
  },
  'limping': { 
    disease: 'Lameness/Injury', 
    firstAid: 'Restrict movement. Check hooves for stones or punctures.', 
    severity: 'Medium' 
  }
};

const STORAGE_KEY = 'vetvoice_local_model';

export const getLocalKeywords = (): Record<string, LocalDetectionResult> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse local model", e);
    }
  }
  return DEFAULT_SYMPTOM_KEYWORDS;
};

export const updateLocalModel = async () => {
  if (!navigator.onLine) return;
  try {
    const response = await fetch('/api/local-model');
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log("Local model updated successfully");
    }
  } catch (err) {
    console.error("Model update failed", err);
  }
};

export const detectSymptomsLocally = (text: string): LocalDetectionResult | null => {
  const keywords = getLocalKeywords();
  const lowercaseText = text.toLowerCase();
  for (const [key, result] of Object.entries(keywords)) {
    if (lowercaseText.includes(key)) {
      return result;
    }
  }
  return null;
};

export const TRANSLATIONS: Record<string, any> = {
  English: {
    title: "VetVoice AI Assistant",
    subtitle: "Describe symptoms or talk to me",
    holdToSpeak: "Hold to Speak",
    analyzing: "Analyzing with AI...",
    offlineMode: "Lite Mode (Offline)",
    emergency: "EMERGENCY DETECTED",
    locateVet: "Locate Nearest Vet",
    vaccine: "Vaccine Reminder",
    diet: "Diet Plan"
  },
  Hindi: {
    title: "वेटवॉयस एआई सहायक",
    subtitle: "लक्षणों का वर्णन करें या मुझसे बात करें",
    holdToSpeak: "बोलने के लिए दबाएं",
    analyzing: "एआई के साथ विश्लेषण...",
    offlineMode: "लाइट मोड (ऑफलाइन)",
    emergency: "आपातकाल का पता चला",
    locateVet: "नजदीकी पशु चिकित्सक को खोजें",
    vaccine: "टीकाकरण अनुस्मारक",
    diet: "आहार योजना"
  },
  Tamil: {
    title: "வெட்வாய்ஸ் AI உதவியாளர்",
    subtitle: "அறிகுறிகளை விவரிக்கவும் அல்லது என்னிடம் பேசவும்",
    holdToSpeak: "பேச அழுத்தவும்",
    analyzing: "AI மூலம் பகுப்பாய்வு செய்கிறது...",
    offlineMode: "லைட் பயன்முறை (ஆஃப்லைன்)",
    emergency: "அவசर நிலை கண்டறியப்பட்டது",
    locateVet: "அருகிலுள்ள கால்நடை மருத்துவரைத் தேடுங்கள்",
    vaccine: "தடுப்பூசி நினைவூட்டல்",
    diet: "உணவுத் திட்டம்"
  }
};
