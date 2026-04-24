import React from 'react';
import { motion } from 'motion/react';
import { Activity, ShieldAlert, Heart, Calendar, ArrowRight, TrendingUp, Mic, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const stats = [
    { label: t("total_cases"), value: "12", icon: Activity, color: "text-blue-500" },
    { label: t("active_alarms"), value: "0", icon: ShieldAlert, color: "text-earth-red" },
    { label: t("recovery"), value: "98%", icon: Heart, color: "text-olive" },
  ];

  const recentHistory = [
    { id: 1, animal: "Cow", date: "2 hours ago", issue: "Fever/Cough", status: "Monitor" },
    { id: 2, animal: "Goat", date: "1 day ago", issue: "Limping", status: "Good" },
    { id: 3, animal: "Poultry", date: "3 days ago", issue: "Not eating", status: "Resolved" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight text-earth-900 leading-tight">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-olive to-emerald-600">{user?.displayName || 'Farmer'}</span>
        </h2>
        <p className="text-earth-500 font-medium">Everything looks stable with your livestock today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2rem] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-sm flex flex-col items-center text-center group hover:bg-white/20 transition-all"
          >
            <div className={cn("p-4 rounded-xl bg-white/40 shadow-sm mb-4 group-hover:scale-110 transition-transform", stat.color)}>
              <stat.icon size={22} />
            </div>
            <p className="text-earth-400 font-bold uppercase tracking-[0.1em] text-[8px] mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-earth-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
             <h3 className="text-lg font-black text-earth-900 tracking-tight uppercase">Intelligence Node</h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <Link to="/assistant" className="group relative p-10 rounded-[2rem] bg-white/10 backdrop-blur-3xl border border-white/20 overflow-hidden hover:bg-white/20 transition-all shadow-sm">
              <div className="relative z-10 space-y-6">
                <div className="w-11 h-11 bg-olive shadow-lg shadow-olive/20 rounded-xl flex items-center justify-center text-white">
                  <Mic size={22} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-earth-900 mb-2">{t("voice_assistant")}</h4>
                  <p className="text-earth-500 max-w-sm font-medium leading-relaxed text-sm">{t("describe_symptoms")}</p>
                </div>
                <div className="flex items-center gap-3 text-olive font-black uppercase text-[9px] tracking-widest bg-white/40 w-fit px-6 py-3 rounded-xl border border-white/40 hover:bg-white transition-all shadow-sm">
                   {t("start_diag")} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 text-olive opacity-[0.02] group-hover:scale-110 transition-all duration-1000">
                <Mic size={300} strokeWidth={1} />
              </div>
            </Link>

            <Link to="/emergency" className="group p-10 rounded-[2rem] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-sm hover:bg-white/20 transition-all">
               <div className="space-y-6">
                 <div className="w-11 h-11 bg-earth-red shadow-lg shadow-earth-red/20 rounded-xl flex items-center justify-center text-white">
                   <AlertTriangle size={22} />
                 </div>
                 <div>
                   <h4 className="text-2xl font-black text-earth-900 mb-2">{t("emergency_mode")}</h4>
                   <p className="text-earth-500 max-w-sm font-medium leading-relaxed text-sm">Immediate veterinary contact and critical response protocols.</p>
                 </div>
                 <div className="flex items-center gap-3 text-earth-red font-black uppercase text-[9px] tracking-widest group-hover:gap-4 transition-all">
                    {t("call_helpline")} <ArrowRight size={14} />
                  </div>
               </div>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-lg font-black text-earth-900 tracking-tight px-4 uppercase">Registry</h3>
           <div className="p-6 rounded-[2rem] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-sm space-y-4">
             {recentHistory.map((item) => (
                <div key={item.id} className="group relative flex items-center gap-4 p-4 rounded-xl hover:bg-white/20 transition-all cursor-pointer">
                  <div className="w-11 h-11 rounded-lg bg-white/40 shadow-sm flex items-center justify-center text-olive font-black text-lg border border-white/60">
                    {item.animal[0]}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-earth-900 font-bold text-xs tracking-tight">{item.issue}</p>
                    <div className="flex items-center gap-2 text-[7px] text-earth-400 font-black uppercase tracking-widest">
                       <Calendar size={10} /> {item.date}
                    </div>
                  </div>
                </div>
             ))}
             <Link to="/history" className="block text-center py-4 rounded-xl bg-earth-900 text-white font-black uppercase text-[8px] tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                Archived Records
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
};
