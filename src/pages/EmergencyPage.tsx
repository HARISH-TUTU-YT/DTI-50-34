import React, { useState, useEffect, useMemo } from 'react';
import { Phone, MapPin, Navigation, Clock, AlertTriangle, ShieldCheck, Volume2, Wifi, ZapOff, MessageSquare, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useVoice } from '../hooks/useVoice';
import { useLanguage } from '../contexts/LanguageContext';

const CACHE_KEY = 'vetvoice_cached_vets';

export const EmergencyPage: React.FC = () => {
  const { speak } = useVoice();
  const { t, language } = useLanguage();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [vets, setVets] = useState<any[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [selectedVet, setSelectedVet] = useState<any>(null);

  const GET_LANG_CODE = (lang: string) => {
    const codes: Record<string, string> = {
      English: 'en-US', Hindi: 'hi-IN', Bengali: 'bn-IN', Marathi: 'mr-IN', Telugu: 'te-IN', Tamil: 'ta-IN'
    };
    return codes[lang] || 'en-US';
  };

  useEffect(() => {
    const checkConnection = () => {
      // @ts-ignore
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn) {
        if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || conn.saveData) {
          setIsLiteMode(true);
        } else {
          setIsLiteMode(false);
        }
      }
      if (!navigator.onLine) setIsLiteMode(true);
    };

    checkConnection();
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  const startNavigationVoice = (vetName: string, distance: string) => {
    setIsNavigating(true);
    const langCode = GET_LANG_CODE(language);
    const steps = [
      { text: `Navigating to ${vetName}. It is ${distance} away.`, delay: 0 },
      { text: `In 200 meters, turn left.`, delay: 5000 },
      { text: `Continue straight for 1 kilometer.`, delay: 10000 },
    ];
    
    steps.forEach(step => {
      setTimeout(() => {
        if (isNavigating) speak(step.text, langCode);
      }, step.delay);
    });

    setTimeout(() => setIsNavigating(false), 15000);
  };

  const sendEmergencySMS = () => {
    const message = `EMERGENCY: Animal distress at: ${location?.lat}, ${location?.lng}. Need help.`;
    window.location.href = `sms:+919876543210?body=${encodeURIComponent(message)}`;
  };

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) setVets(JSON.parse(cached));

    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(newLoc);
          setIsLocating(false);
          
          const mockVets = [
            { id: 1, name: "Rural Vet Care Center", dist: "2.1 km", phone: "+91 98765 43210", time: "8 mins", address: "Market Road, Block B" },
            { id: 2, name: "City Animal Hospital", dist: "5.4 km", phone: "+91 91234 56789", time: "15 mins", address: "Main St, Sector 4" },
            { id: 3, name: "Dr. Sharma Livestock Clinic", dist: "7.8 km", phone: "+91 99887 76655", time: "22 mins", address: "Village Outer Road" },
          ];
          
          const expandedVets = mockVets.map(v => ({
            ...v,
            hours: "9:00 AM - 8:00 PM",
            services: ["Emergency", "Surgery", "Pharmacy"],
            website: "https://example.com"
          }));

          setVets(expandedVets);
          localStorage.setItem(CACHE_KEY, JSON.stringify(expandedVets));
        },
        (err) => {
          console.error("Location error", err);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  return (
    <div className={cn("space-y-8 pb-32", isLiteMode ? "" : "animate-in fade-in duration-500")}>
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={() => setIsLiteMode(!isLiteMode)}
          className={cn("flex-1 p-4 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3", 
            isLiteMode ? "bg-earth-900 border-earth-900 text-white" : "bg-white/10 backdrop-blur-3xl text-earth-500 border-white/20 shadow-sm hover:bg-white/20")}
        >
          <ZapOff size={14} /> {isLiteMode ? "High Fidelity Mode" : "Activate Lite Mode"}
        </button>
      </div>

      <div className={cn(
        "p-10 rounded-[2.5rem] shadow-sm relative group overflow-hidden border border-white/20",
        isLiteMode ? "bg-earth-red" : "bg-earth-red shadow-lg shadow-earth-red/20"
      )}>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4 text-white">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/20">
              <AlertTriangle size={24} className={!isLiteMode ? "animate-pulse" : ""} />
            </div>
            <h2 className="text-3xl font-black tracking-tight uppercase">{t("emergency_mode")}</h2>
          </div>
          <p className="text-white/80 max-w-lg font-bold text-lg leading-relaxed">
            Severe distress detected. Broadcast in progress.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="tel:102" className="bg-white text-earth-red px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-white/90 active:scale-95 transition-all">
              <Phone size={18} /> {t("call_helpline")}
            </a>
            <button 
              onClick={sendEmergencySMS}
              className="bg-earth-900 text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-black active:scale-95 transition-all"
            >
              <MessageSquare size={18} /> {t("sms_sos")}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
            <div className="space-y-0.5">
              <h3 className="text-2xl font-black text-earth-900 tracking-tight">Nearest Responders</h3>
              <p className="text-earth-400 font-medium text-[10px] uppercase tracking-widest flex items-center gap-2">
                <MapPin size={12} /> Local GPS Sector
              </p>
            </div>
            {isLocating && <div className="w-6 h-6 border-2 border-olive border-t-transparent rounded-full animate-spin" />}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {vets.map((vet, i) => (
            <motion.div
              key={vet.id}
              initial={isLiteMode ? {} : { opacity: 0, y: 10 }}
              whileInView={isLiteMode ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedVet(vet)}
              className="p-6 rounded-[2rem] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-sm hover:bg-white/20 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-black text-earth-900 tracking-tight">{vet.name}</h4>
                    <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
                      ONLINE
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-earth-500 text-[10px] font-black uppercase tracking-widest">{vet.address}</p>
                    <div className="flex gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-olive font-black text-[9px] uppercase tracking-widest">
                        <Navigation size={12} /> {vet.dist}
                      </div>
                      <div className="flex items-center gap-1.5 text-earth-300 font-black text-[9px] uppercase tracking-widest">
                        <Clock size={12} /> {vet.time}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${vet.phone}`} className="w-12 h-12 rounded-xl bg-white/60 border border-white flex items-center justify-center text-olive hover:bg-white transition-all shadow-sm">
                    <Phone size={20} />
                  </a>
                  <button 
                    onClick={(e) => { e.stopPropagation(); startNavigationVoice(vet.name, vet.dist); }}
                    className={cn(
                      "flex-1 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 border border-white/20",
                      isNavigating ? "bg-earth-red text-white animate-pulse" : "bg-earth-900 text-white hover:bg-black"
                    )}
                  >
                    {isNavigating ? <Volume2 size={16} /> : <Navigation size={16} />}
                    {isNavigating ? "GUIDING" : t("nav_now")}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedVet && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-earth-900/10 backdrop-blur-sm">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedVet(null)} className="absolute inset-0" />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative bg-white/40 backdrop-blur-3xl w-full max-w-lg rounded-[2.5rem] shadow-sm p-8 border border-white/20 space-y-8"
             >
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <h3 className="text-2xl font-black text-earth-900 tracking-tight">{selectedVet.name}</h3>
                      <p className="text-earth-400 font-medium text-xs uppercase tracking-widest">{selectedVet.address}</p>
                   </div>
                   <button onClick={() => setSelectedVet(null)} className="w-10 h-10 rounded-xl bg-white/20 shadow-sm flex items-center justify-center text-earth-300 hover:text-earth-red transition-all border border-white/20 active:scale-95"><X size={20} /></button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-2xl bg-white/10 border border-white shadow-sm space-y-1">
                       <p className="text-[8px] font-black uppercase text-earth-400 tracking-widest">Protocol Hours</p>
                       <p className="font-black text-earth-900 text-sm uppercase">{selectedVet.hours}</p>
                   </div>
                   <div className="p-4 rounded-2xl bg-white/10 border border-white shadow-sm space-y-1">
                       <p className="text-[8px] font-black uppercase text-earth-400 tracking-widest">Biological Sector</p>
                       <p className="font-black text-olive text-sm uppercase">{selectedVet.dist}</p>
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="flex flex-wrap gap-2">
                      {selectedVet.services?.map((s: string) => (
                        <span key={s} className="px-3 py-1 bg-white/20 border border-white rounded-lg text-[8px] font-black uppercase text-earth-500 shadow-sm tracking-widest">{s}</span>
                      ))}
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                   <a href={`tel:${selectedVet.phone}`} className="flex-1 py-4 bg-olive text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm hover:bg-olive-700 transition-all">
                      <Phone size={16} /> {t("call_now")}
                   </a>
                   <button onClick={() => { setSelectedVet(null); startNavigationVoice(selectedVet.name, selectedVet.dist); }} className="flex-1 py-4 bg-earth-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-all">
                      {t("nav_now")}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
