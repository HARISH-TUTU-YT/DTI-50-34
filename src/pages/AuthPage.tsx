import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

export const AuthPage: React.FC<{ isSignUp?: boolean }> = ({ isSignUp }) => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 selection:bg-olive/20 font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-olive/5 blur-[100px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-neumorph border border-white relative z-10 space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-olive rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-6">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-black text-earth-900">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-earth-500 font-medium">{isSignUp ? 'Join VetVoice AI for better livestock care.' : 'Sign in to access your livestock records.'}</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-white border border-white shadow-neumorph-sm rounded-2xl font-bold text-earth-900 flex items-center justify-center gap-3 hover:translate-y-[-2px] active:scale-95 transition-all"
          >
            {/* Simple colored dots to represent Google */}
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            Sign in with Google
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-sage-50"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-earth-500/50 bg-white px-4">Or use email</div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500/50" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-sage-50/30 border border-white rounded-2xl text-earth-900 focus:shadow-neumorph transition-all outline-none"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500/50" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-sage-50/30 border border-white rounded-2xl text-earth-900 focus:shadow-neumorph transition-all outline-none"
              />
            </div>
          </div>

          <button className="w-full py-5 bg-olive text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-olive/20 active:scale-95 hover:bg-olive-600">
            {isSignUp ? 'Register Now' : 'Sign In Now'}
          </button>
        </div>

        <div className="text-center">
          <p className="text-earth-500 font-medium text-sm">
            {isSignUp ? 'Already have an account?' : 'New here?'} 
            <Link to={isSignUp ? '/login' : '/signup'} className="text-olive font-black ml-2 hover:underline">
              {isSignUp ? 'Login' : 'Create One'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
