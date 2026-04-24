import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Shield, Bell, LogOut, ChevronRight, Apple, Syringe, Plus, X, Search, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

import { useLanguage } from '../contexts/LanguageContext';

export const ProfilePage: React.FC = () => {
  const { user, logout, db } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'info' | 'notifications' | 'livestock'>('info');
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [dietPlans, setDietPlans] = useState<any[]>([]);
  const [isAddingVaccine, setIsAddingVaccine] = useState(false);
  const [newVaccine, setNewVaccine] = useState({ animalName: '', vaccineType: '', dueDate: '' });
  const [searchDiet, setSearchDiet] = useState('');

  useEffect(() => {
    if (!user || !db) return;
    const vQuery = query(collection(db, 'vaccines'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(vQuery, (snapshot) => {
      setVaccines(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    fetch('/api/diet-plans')
      .then(res => res.json())
      .then(data => setDietPlans(data))
      .catch(err => console.error("Failed to fetch diet plans", err));
  }, []);

  const handleAddVaccine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;
    try {
      await addDoc(collection(db, 'vaccines'), {
        ...newVaccine,
        userId: user.uid,
        administered: false,
        createdAt: new Date().toISOString()
      });
      setIsAddingVaccine(false);
      setNewVaccine({ animalName: '', vaccineType: '', dueDate: '' });
    } catch (err) {
      console.error("Failed to add vaccine", err);
    }
  };

  const toggleAdministered = async (vId: string, current: boolean) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'vaccines', vId), { administered: !current });
    } catch (err) {
      console.error("Failed to update vaccine", err);
    }
  };

  const filteredDietPlans = dietPlans.filter(p => 
    p.planName.toLowerCase().includes(searchDiet.toLowerCase()) || 
    p.animalType.toLowerCase().includes(searchDiet.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center gap-8 p-10 rounded-[2.5rem] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-sm relative overflow-hidden">
        <div className="relative">
          <div className="w-24 h-24 rounded-[2rem] p-1 bg-white/40 border border-white/60 shadow-lg">
             <img src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="Profile" className="w-full h-full rounded-[1.8rem] object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-olive flex items-center justify-center text-white shadow-lg border-2 border-white">
            <Shield size={14} />
          </div>
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-3xl font-black text-earth-900 tracking-tight">{user?.displayName || 'Farmer'}</h2>
          <div className="flex items-center gap-2 text-earth-400 text-sm font-medium justify-center sm:justify-start">
             <Mail size={12} /> {user?.email}
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
             <span className="px-3 py-1 rounded-lg bg-olive/10 text-olive text-[8px] font-black uppercase tracking-widest border border-olive/20">Verified Identity</span>
             <span className="px-3 py-1 rounded-lg bg-white/40 text-earth-400 text-[8px] font-black uppercase tracking-widest border border-white/20">Active Node</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-3">
          {[
            { id: 'info', label: 'Identity', icon: User },
            { id: 'livestock', label: 'Procedures', icon: Shield },
            { id: 'notifications', label: 'Reminders', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full p-4 rounded-2xl border transition-all flex items-center justify-between group",
                activeTab === tab.id 
                  ? "bg-earth-900 border-earth-900 text-white shadow-lg" 
                  : "bg-white/10 backdrop-blur-3xl border-white/20 text-earth-500 hover:bg-white/20"
              )}
            >
              <div className="flex items-center gap-4">
                <tab.icon size={18} />
                <span className="font-black text-[10px] uppercase tracking-widest">{tab.label}</span>
              </div>
              <ChevronRight size={14} className={cn("transition-transform", activeTab === tab.id ? "text-white" : "text-earth-300")} />
            </button>
          ))}
          <button 
            onClick={logout}
            className="w-full p-4 rounded-2xl bg-white/20 backdrop-blur-3xl border border-white/10 text-earth-red font-black uppercase tracking-widest text-[10px] flex items-center gap-4 hover:bg-earth-red hover:text-white transition-all group mt-6"
          >
            <LogOut size={18} />
            Termination Session
          </button>
        </div>

        <div className="lg:col-span-2">
          {activeTab === 'info' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-sm border border-white/20 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-widest text-earth-400">Authenticated Label</p>
                  <p className="font-black text-lg text-earth-900">{user?.displayName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-widest text-earth-400">Biological Identifier</p>
                  <p className="font-black text-lg text-earth-900 break-all">{user?.uid.slice(0, 16)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-widest text-earth-400">Global Sector</p>
                  <p className="font-black text-lg text-earth-900">{user?.email}</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'livestock' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-white/10 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-sm border border-white/20 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-earth-900 tracking-tight">Active Protocols</h3>
                    <button 
                      onClick={() => setIsAddingVaccine(true)}
                      className="px-4 py-2 rounded-xl bg-olive text-white text-[9px] font-black uppercase tracking-widest shadow-sm hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <Plus size={14} /> New
                    </button>
                  </div>

                  <AnimatePresence>
                    {isAddingVaccine && (
                      <motion.form 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onSubmit={handleAddVaccine}
                        className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 shadow-sm space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <input required placeholder="Animal Identifier" className="w-full bg-white/40 p-3 rounded-xl border border-white/60 text-xs font-bold outline-none" value={newVaccine.animalName} onChange={e => setNewVaccine({...newVaccine, animalName: e.target.value})} />
                           <input required placeholder="Vaccine Class" className="w-full bg-white/40 p-3 rounded-xl border border-white/60 text-xs font-bold outline-none" value={newVaccine.vaccineType} onChange={e => setNewVaccine({...newVaccine, vaccineType: e.target.value})} />
                           <input required type="date" className="sm:col-span-2 w-full bg-white/40 p-3 rounded-xl border border-white/60 text-xs font-bold outline-none" value={newVaccine.dueDate} onChange={e => setNewVaccine({...newVaccine, dueDate: e.target.value})} />
                        </div>
                        <div className="flex gap-2">
                          <button type="submit" className="flex-1 py-3 bg-earth-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest">Register</button>
                          <button type="button" onClick={() => setIsAddingVaccine(false)} className="px-4 py-3 bg-white/40 text-earth-400 rounded-xl font-black text-[9px] uppercase tracking-widest">Cancel</button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <div className="space-y-3">
                    {vaccines.map((v) => (
                      <div key={v.id} className={cn("p-4 rounded-2xl border transition-all flex items-center justify-between", 
                        v.administered ? "bg-white/10 border-white/10 opacity-40" : "bg-white/20 border-white/60 shadow-sm")}>
                        <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", 
                             v.administered ? "bg-emerald-500 text-white" : "bg-white/40 shadow-sm text-olive")}>
                            <Stethoscope size={18} />
                          </div>
                          <div>
                            <p className="font-black text-sm text-earth-900">{v.animalName}</p>
                            <p className="text-[8px] font-black uppercase text-earth-400 tracking-widest">{v.vaccineType}</p>
                          </div>
                        </div>
                        <button onClick={() => toggleAdministered(v.id, v.administered)} className="w-8 h-8 rounded-lg bg-white/40 shadow-sm flex items-center justify-center text-earth-300 hover:text-emerald-500">
                          <CheckCircle2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/40 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white/40 space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-olive shadow-md">
                         <Apple size={24} />
                       </div>
                       <h3 className="text-2xl font-black text-earth-900 tracking-tight">{t('diet_plans')}</h3>
                    </div>
                    <div className="relative group w-full sm:w-auto">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400 group-focus-within:text-olive transition-colors" size={16} />
                      <input 
                        type="text" 
                        placeholder={t('search_plans')} 
                        className="w-full sm:w-64 pl-12 pr-6 py-3.5 bg-white/60 backdrop-blur-md border border-white rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none shadow-inner focus:bg-white focus:ring-4 ring-olive/10 transition-all"
                        value={searchDiet}
                        onChange={e => setSearchDiet(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredDietPlans.map((p, i) => (
                      <div key={i} className="p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-md border border-white shadow-xl space-y-4 hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                         <div className="absolute -right-4 -top-4 w-24 h-24 bg-olive/5 rounded-full blur-2xl group-hover:bg-olive/10 transition-all" />
                         <div className="flex justify-between items-start relative z-10">
                           <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center text-olive">
                             <Apple size={20} />
                           </div>
                           <span className="text-[8px] font-black uppercase bg-earth-900 px-3 py-1.5 rounded-lg text-white tracking-[0.2em]">{p.animalType}</span>
                         </div>
                         <div className="space-y-1 relative z-10">
                           <p className="font-black text-xl text-earth-900 leading-tight">{p.planName}</p>
                           <p className="text-xs text-earth-500 font-medium leading-relaxed line-clamp-2">{p.description}</p>
                         </div>
                         <div className="pt-4 border-t border-black/5 mt-4 relative z-10">
                           <p className="text-[8px] font-black uppercase text-earth-400 tracking-[0.25em] mb-1">Biological Value</p>
                           <p className="text-xs font-black text-olive uppercase tracking-widest">{p.nutritionalInfo}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
             </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
