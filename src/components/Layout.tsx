import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Mic, History, AlertTriangle, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: t("home") },
    { to: "/assistant", icon: Mic, label: t("assistant") },
    { to: "/history", icon: History, label: t("history") },
    { to: "/profile", icon: User, label: t("profile") },
    { to: "/emergency", icon: AlertTriangle, label: "SOS", critical: true },
  ];

  return (
    <div className="min-h-screen bg-[#F1F3F5] relative overflow-x-hidden selection:bg-olive/20 font-sans text-earth-900 isolation-isolate">
      {/* Dynamic Background Elements - Optimized for performance */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transform-gpu">
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-olive/5 rounded-full blur-[140px] will-change-transform" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-earth-red/3 rounded-full blur-[140px] will-change-transform" />
        <div className="absolute top-[30%] right-[5%] w-[40%] h-[40%] bg-clay/3 rounded-full blur-[120px] will-change-transform" />
      </div>

      <header className="sticky top-0 z-50 px-4 pt-4 transform-gpu">
        <div className="max-w-7xl mx-auto bg-white/20 backdrop-blur-2xl border border-white/30 rounded-[2rem] shadow-sm px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-olive rounded-xl flex items-center justify-center shadow-lg shadow-olive/10">
              <Mic className="text-white" size={20} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black text-earth-900 leading-none">VetVoice</h1>
              <p className="text-[8px] font-black text-olive uppercase tracking-[0.25em] mt-1">Diagnostic Mesh</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-white/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/40 shadow-sm text-[10px] font-black uppercase tracking-widest text-earth-900 outline-none hover:bg-white transition-all cursor-pointer"
            >
              <option value="English">EN</option>
              <option value="Hindi">HI</option>
              <option value="Bengali">BN</option>
              <option value="Marathi">MR</option>
              <option value="Telugu">TE</option>
              <option value="Tamil">TA</option>
            </select>
            {user?.photoURL && (
              <img src={user.photoURL} alt="Profile" className="w-11 h-11 rounded-2xl border-2 border-white shadow-md transition-transform hover:scale-105" />
            )}
            <button 
              onClick={() => logout()}
              className="p-3 rounded-2xl bg-white/20 border border-white/40 text-earth-400 hover:text-earth-red hover:bg-white/40 transition-all shadow-sm"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="transform-gpu"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 w-full max-w-xl transform-gpu">
        <div className="bg-white/20 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-sm p-1.5 flex items-center justify-between gap-1 overflow-hidden group">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all relative overflow-hidden",
                isActive 
                  ? "text-earth-900 bg-white/30 shadow-sm" 
                  : "text-earth-400 hover:text-earth-600 hover:bg-white/10"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={cn(
                    "transition-transform group-active:scale-90",
                    item.critical && "animate-pulse text-earth-red"
                  )} />
                  <span className="text-[8px] font-black uppercase tracking-[0.1em]">{item.label}</span>
                  {isActive && !item.critical && (
                    <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white/20 -z-10 rounded-xl" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
