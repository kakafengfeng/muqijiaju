import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent } from '../types';
import { CONTENT as INITIAL_CONTENT } from '../constants';
import { db, auth } from '../firebase';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface ContentContextType {
  content: SiteContent;
  user: User | null;
  loading: boolean;
  updateContent: (section: keyof SiteContent, data: any) => void;
  updateNestedContent: (path: string[], value: any) => void;
  saveContent: () => Promise<void>;
  resetContent: () => void;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Listen for Auth State Changes & Local Storage for Demo
  useEffect(() => {
    // Check local storage for demo user first (Mock persistence)
    const demoUserStr = localStorage.getItem('muqi_demo_user');
    if (demoUserStr) {
        setUser(JSON.parse(demoUserStr));
    }

    if (!auth) {
        setLoading(false);
        return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Only clear user if not using demo account
        if (!localStorage.getItem('muqi_demo_user')) {
             setUser(null);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Listen for Realtime Data from Firestore
  useEffect(() => {
    if (!db) return;
    
    try {
        const docRef = doc(db, 'site_content', 'main');
        // Subscribe to live updates
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setContent(docSnap.data() as SiteContent);
          } else {
            console.log("No remote content found, using default.");
          }
        }, (error) => {
            console.warn("Firestore sync unavailable (expected in demo mode):", error.message);
        });
        return () => unsubscribe();
    } catch (e) {
        console.warn("Firestore init error", e);
    }
  }, []);

  // Save entire state to Firestore
  const saveContent = async () => {
    // If using demo user, just show alert
    if (user && (user as any).isDemo) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log("Demo Mode: Content saved to local state only.");
        return;
    }

    if (!db || !user) {
        alert("Database not connected or user not logged in.");
        return;
    }
    try {
      const docRef = doc(db, 'site_content', 'main');
      await setDoc(docRef, content);
    } catch (e) {
      console.error("Failed to save content", e);
      throw e;
    }
  };

  const updateContent = (section: keyof SiteContent, data: any) => {
    setContent((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const updateNestedContent = (path: string[], value: any) => {
    setContent((prev) => {
      const newContent = JSON.parse(JSON.stringify(prev));
      let current = newContent;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newContent;
    });
  };

  const resetContent = () => {
    if(window.confirm('重置将覆盖当前内容为默认值，确定吗？')) {
        setContent(INITIAL_CONTENT);
    }
  };

  const login = async (email: string, pass: string) => {
      // --- DEMO ACCOUNT BYPASS ---
      if (email === 'admin@muqi.com' && pass === '123456') {
          const mockUser = {
              uid: 'demo-admin-001',
              email: 'admin@muqi.com',
              displayName: 'Demo Administrator',
              emailVerified: true,
              isDemo: true // Custom flag
          } as unknown as User;
          
          localStorage.setItem('muqi_demo_user', JSON.stringify(mockUser));
          setUser(mockUser);
          return;
      }
      // ---------------------------

      if (!auth) throw new Error("Auth not initialized. Use demo account: admin@muqi.com / 123456");
      await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
      localStorage.removeItem('muqi_demo_user');
      setUser(null);
      if (auth) {
          try {
            await signOut(auth);
          } catch (e) {
            console.warn("Firebase signout error", e);
          }
      }
  };

  return (
    <ContentContext.Provider value={{ 
        content, 
        user, 
        loading,
        updateContent, 
        updateNestedContent, 
        saveContent, 
        resetContent, 
        login,
        logout
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};