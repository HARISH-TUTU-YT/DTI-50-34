import React, { useEffect, useState } from 'react';
import { History, Search, Calendar, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { handleFirestoreError } from '../lib/firestoreUtils';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

export const HistoryPage: React.FC = () => {
  const { user, db, auth } = useAuth();
  const { t } = useLanguage();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCases = async () => {
      if (!db || !user) return;
      try {
        const q = query(
          collection(db, 'cases'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCases(docs);
      } catch (err) {
        handleFirestoreError(err, 'list', 'cases', auth);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [db, user, auth]);

  const filteredCases = cases.filter(c => 
    c.animalType.toLowerCase().includes(search.toLowerCase()) ||
    c.symptoms.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight text-earth-900">{t("history")}</h2>
        <p className="text-earth-500 font-medium">Digital archive of your clinical livestock records.</p>
      </div>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-earth-300 group-focus-within:text-olive transition-colors" size={20} />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search_plans")} 
          className="w-full bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm text-earth-900 outline-none shadow-sm focus:bg-white/20 transition-all font-black uppercase tracking-widest"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <div className="w-10 h-10 border-2 border-olive border-t-transparent rounded-full animate-spin" />
           <p className="font-black uppercase tracking-widest text-olive text-[8px]">Fetching Data</p>
        </div>
      ) : filteredCases.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredCases.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-[2rem] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-sm hover:bg-white/20 transition-all group flex items-center gap-6 relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-olive font-black text-2xl flex-shrink-0">
                {c.animalType[0]}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-black text-earth-900 tracking-tight">{c.animalType}</h4>
                  <span className={cn(
                    "text-[8px] font-black uppercase px-2 py-1 rounded-md border tracking-widest",
                    c.severity === 'EMERGENCY' ? 'bg-earth-red text-white border-earth-red/20' : 'bg-olive/10 text-olive border-olive/20'
                  )}>
                    {c.severity || 'Stable'}
                  </span>
                </div>
                <p className="text-earth-600 font-medium text-sm leading-relaxed line-clamp-1 italic">"{c.symptoms}"</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[8px] uppercase font-black tracking-widest text-earth-400">
                    <Calendar size={12} /> {c.createdAt?.toDate()?.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-white/40 shadow-sm flex items-center justify-center text-earth-300 group-hover:text-olive transition-all border border-white/60 flex-shrink-0 active:scale-95">
                <ChevronRight size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-earth-500 gap-8">
          <div className="w-28 h-28 rounded-full bg-white/40 flex items-center justify-center shadow-xl border border-white/60">
            <History size={48} className="opacity-10 text-olive" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-black text-earth-900 uppercase tracking-[0.2em] text-sm">Zero Records</p>
            <p className="text-earth-500 font-medium max-w-[280px] mx-auto text-sm leading-relaxed">No medical history detected in your local cloud sector. Records will populate after your first analysis.</p>
          </div>
        </div>
      )}
    </div>
  );
};
