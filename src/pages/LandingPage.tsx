import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, ShieldCheck, Zap, Globe, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-cream text-earth-900 overflow-hidden font-sans selection:bg-olive/20">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 sm:pt-48 sm:pb-32">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-olive/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-clay/5 blur-[100px] rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white shadow-neumorph-sm border border-white/50 text-olive font-black text-[10px] uppercase tracking-[0.2em]"
          >
            <Zap size={14} /> AI-Powered Veterinary Care
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl sm:text-8xl font-black tracking-tight leading-[0.9] text-earth-900"
          >
            Care for them,<br/>With <span className="text-olive">Voice AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl sm:text-2xl text-earth-500 max-w-2xl mx-auto font-bold leading-relaxed"
          >
            The world's first AI Veterinary Assistant optimized for rural farms, low-internet areas, and multi-language livestock care.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link
              to="/signup"
              className="px-12 py-5 bg-olive text-white rounded-[1.5rem] font-black text-lg uppercase tracking-widest hover:bg-olive-600 active:scale-95 transition-all shadow-xl shadow-olive/20 flex items-center justify-center gap-3"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link
               to="/login"
               className="px-12 py-5 bg-white border border-white rounded-[1.5rem] font-black text-lg uppercase tracking-widest text-earth-900 hover:bg-sage-50 transition-all shadow-neumorph active:scale-95 flex items-center justify-center"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-24 text-left">
            {[
              { icon: Mic, title: "Voice First", desc: "Optimized for rural users. Just speak your symptoms in your language." },
              { icon: Globe, title: "Multi-Language", desc: "Hindi, Tamil, English and auto-detection support built-in." },
              { icon: ShieldCheck, title: "Medically Safe", desc: "Expert AI models with safety-first disclaimers and emergency detection." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-8 rounded-[2rem] bg-white shadow-neumorph border border-white hover:translate-y-[-8px] transition-all"
              >
                <div className="w-14 h-14 bg-sage-50 rounded-2xl flex items-center justify-center text-olive mb-6 shadow-inner">
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-earth-900 mb-3 uppercase tracking-tight">{f.title}</h3>
                <p className="text-earth-500 font-medium leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative footer */}
      <div className="border-t border-earth-900/5 py-12 px-6 text-center text-earth-500 text-xs font-black uppercase tracking-[0.3em]">
        © 2026 VetVoice AI • Designed for the Future of Rural Livestock
      </div>
    </div>
  );
};
