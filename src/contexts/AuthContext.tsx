import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  db: any;
  auth: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<any>(null);
  const [db, setDb] = useState<any>(null);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        const configResponse = await fetch('/firebase-applet-config.json');
        if (configResponse.ok) {
          const firebaseConfig = await configResponse.json();
          const app = initializeApp(firebaseConfig);
          const firebaseAuth = getAuth(app);
          const firestore = getFirestore(app);
          
          setAuth(firebaseAuth);
          setDb(firestore);

          onAuthStateChanged(firebaseAuth, (user) => {
            setUser(user);
            setLoading(false);
          });
        } else {
          console.warn("Firebase config not found. Please run set_up_firebase.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Firebase init error:", error);
        setLoading(false);
      }
    };

    initFirebase();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, db, auth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context;
};
