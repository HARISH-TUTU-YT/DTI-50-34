import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, AlertCircle, ChevronRight, Stethoscope, Activity, MapPin, WifiOff } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError } from '../lib/firestoreUtils';
import { detectSymptomsLocally } from '../lib/offlineModel';
import { useLanguage, Language } from '../contexts/LanguageContext';

export const AssistantPage: React.FC = () => {
  const { isListening, transcript, startListening, stopListening, speak } = useVoice();
  const { user, db, auth } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [animalType, setAnimalType] = useState('Cow');
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const GET_LANG_CODE = (lang: Language) => {
    const codes: Record<Language, string> = {
      English: 'en-US',
      Hindi: 'hi-IN',
      Bengali: 'bn-IN',
      Marathi: 'mr-IN',
      Telugu: 'te-IN',
      Tamil: 'ta-IN'
    };
    return codes[lang];
  };

  useEffect(() => {
    const handleStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  useEffect(() => {
    if (transcript) {
      setSymptoms(transcript);
    }
  }, [transcript]);

  const handleAnalyze = async () => {
    if (!symptoms) return;
    
    const activeLang = language;

    if (isOffline) {
      const localResult = detectSymptomsLocally(symptoms);
      if (localResult) {
        const fakeData = {
          diseases: [{ name: localResult.disease, confidence: 75 }],
          severity: localResult.severity,
          firstAid: localResult.firstAid,
          disclaimer: t("offline_mode") + ". Please consult a vet when possible.",
          isEmergency: localResult.severity === 'EMERGENCY'
        };
        setResult(fakeData);
        speak(`${localResult.disease}. ${localResult.firstAid}`, GET_LANG_CODE(activeLang));
      } else {
        setResult({
          diseases: [{ name: "Unknown Symptom", confidence: 0 }],
          severity: "Low",
          firstAid: t("describe_symptoms"),
          disclaimer: "No local match found."
        });
      }
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, animalType, language: activeLang }),
      });
      const data = await response.json();
      setResult(data);

      if (db) {
        try {
          await addDoc(collection(db, 'cases'), {
            userId: user?.uid,
            animalType,
            symptoms,
            predictedDiseases: data.diseases || [],
            severity: data.severity,
            createdAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, 'create', 'cases', auth);
        }
      }

      if (data.severity === 'EMERGENCY') {
        const emergencyMsg = activeLang === 'Hindi' ? "आपातकाल का पता चला।" : activeLang === 'Tamil' ? "அவசர நிலை கண்டறியப்பட்டது." : "Emergency detected.";
        speak(emergencyMsg, GET_LANG_CODE(activeLang));
      } else {
        const summary = data.diseases?.[0] ? `${data.diseases[0].name}. ${data.firstAid}` : "Analysis complete.";
        speak(summary, GET_LANG_CODE(activeLang));
      }
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-earth-900">{t("voice_assistant")}</h2>
          <p className="text-earth-500 font-medium">{t("describe_symptoms")}</p>
        </div>
        <div className="flex items-center gap-3">
          {isOffline && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-clay/10 text-clay text-xs font-bold border border-clay/20">
              <WifiOff size={14} /> {t("offline_mode")}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Animal Selectors */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none px-1">
            {['Cow', 'Goat', 'Dog', 'Cat', 'Poultry', 'Sheep', 'Horse'].map(a => (
              <button
                key={a}
                onClick={() => setAnimalType(a)}
                className={cn(
                  "px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  animalType === a 
                    ? "bg-earth-900 border-earth-900 text-white shadow-lg" 
                    : "bg-white/10 backdrop-blur-3xl border-white/20 shadow-sm text-earth-500 hover:bg-white/20"
                )}
              >
                {a}
              </button>
            ))}
          </div>

          {/* Voice Orb Area (when listening) */}
          <div className="relative group bg-white/10 backdrop-blur-3xl p-8 rounded-[2rem] shadow-sm border border-white/20 flex flex-col items-center justify-center min-h-[400px]">
            {isListening ? (
              <div className="flex flex-col items-center gap-8 py-10 w-full">
                <div className="relative flex items-center justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute w-40 h-40 rounded-full bg-olive/10"
                  />
                  <div className="w-24 h-24 bg-olive rounded-full shadow-2xl shadow-olive/20 z-10 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/30 animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-3 w-full">
                  <p className="text-[10px] font-black text-olive uppercase tracking-[0.3em] font-mono">LISTENING...</p>
                  <div className="max-w-[280px] mx-auto p-4 bg-white/20 rounded-2xl border border-white/20 italic text-earth-600 text-sm font-medium">
                    {transcript || 'Synthesizing input...'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col">
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={t("type_here")}
                  className="w-full flex-grow bg-transparent border-none text-xl text-earth-900 placeholder-earth-300 transition-all outline-none resize-none px-4 py-2 font-medium"
                />
                {!symptoms && (
                   <div className="flex items-center gap-3 text-earth-400 p-4 opacity-40">
                     <AlertCircle size={14} />
                     <p className="text-[10px] font-bold uppercase tracking-widest">Detail optimization recommended</p>
                   </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onMouseDown={() => startListening(GET_LANG_CODE(language))}
              onMouseUp={stopListening}
              onTouchStart={() => startListening(GET_LANG_CODE(language))}
              onTouchEnd={stopListening}
              className={cn(
                "relative flex-1 py-4 rounded-xl flex items-center justify-center gap-3 font-black text-sm transition-all overflow-hidden border",
                isListening 
                  ? "bg-earth-red text-white border-white/20 shadow-lg" 
                  : "bg-white/10 backdrop-blur-3xl text-earth-600 border-white/20 shadow-sm hover:bg-white/20 active:scale-95"
              )}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              <span className="uppercase tracking-widest text-[10px]">{isListening ? "RELEASE" : "HOLD TO TALK"}</span>
            </button>
            <button
              onClick={() => handleAnalyze()}
              disabled={isLoading || !symptoms}
              className="bg-earth-900 text-white px-8 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-black active:scale-95 transition-all disabled:opacity-30 flex items-center gap-2"
            >
              {t("analyze")} <Send size={14} />
            </button>
          </div>

        </div>

        <div className="hidden md:block">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full bg-white/10 backdrop-blur-3xl border border-dashed border-white/20 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center gap-6"
              >
                <div className="w-12 h-12 border-2 border-olive border-t-transparent rounded-full animate-spin" />
                <div className="space-y-1">
                  <p className="text-olive font-black uppercase tracking-widest text-[8px]">Neural Sync</p>
                  <p className="text-earth-900 font-bold text-sm">Processing...</p>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-[2rem] bg-white/10 backdrop-blur-3xl shadow-sm space-y-6 overflow-y-auto max-h-[650px] border border-white/20"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border",
                      result.isEmergency 
                        ? "bg-earth-red/10 text-earth-red border-earth-red/20" 
                        : "bg-olive/10 text-olive border-olive/20"
                    )}>
                      {result.isEmergency ? "URGENT" : "RESULT"}
                    </span>
                    <h3 className="text-xl font-black text-earth-900 mt-1">{t("diagnosis")}</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {result.diseases?.map((d: any, idx: number) => (
                    <div key={idx} className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/30 flex justify-between items-center shadow-sm">
                      <div className="space-y-2 w-full">
                        <p className="text-earth-900 font-bold text-lg">{d.name}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-grow h-1 bg-black/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} animate={{ width: `${d.confidence}%` }}
                              className={cn("h-full", result.isEmergency ? "bg-earth-red" : "bg-olive")}
                            />
                          </div>
                          <span className="text-[8px] font-black text-earth-400 uppercase">{d.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-5 bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 space-y-3">
                  <p className="text-olive text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Stethoscope size={14} /> Protocols
                  </p>
                  <p className="text-earth-700 font-medium text-sm leading-relaxed">{result.firstAid}</p>
                </div>

                {result.isEmergency && (
                  <Link to="/emergency" className="block w-full py-4 bg-earth-red hover:bg-earth-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest text-center shadow-lg active:scale-95 transition-all">
                    GO TO EMERGENCY
                  </Link>
                )}
              </motion.div>
            ) : (
              <div className="h-full bg-white/10 backdrop-blur-2xl border border-white/20 shadow-sm rounded-[2rem] flex flex-col items-center justify-center p-12 text-center text-earth-400 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-white/10">
                  <Activity size={24} className="opacity-10 text-olive" />
                </div>
                <div>
                  <p className="font-black text-earth-900 uppercase tracking-widest text-[8px]">Intelligence Idle</p>
                  <p className="text-earth-400 font-medium text-[10px] mt-1">Provide symptomatology data for real-time diagnostic synchronization.</p>
                </div>
              </div>
            )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
