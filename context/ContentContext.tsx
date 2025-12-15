import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent } from '../types';
import { CONTENT as INITIAL_CONTENT } from '../constants';
import { db, auth } from '../firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut } from 'firebase/auth';

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

  // 1. Listen for Auth State Changes
  useEffect(() => {
    if (!auth) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Listen for Realtime Data from Firestore
  useEffect(() => {
    if (!db) return;
    
    const docRef = doc(db, 'site_content', 'main');
    
    // Subscribe to live updates
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setContent(docSnap.data() as SiteContent);
      } else {
        // If doc doesn't exist (first run), we might want to initialize it
        // or just stick with INITIAL_CONTENT until saved
        console.log("No remote content found, using default.");
      }
    }, (error) => {
        console.error("Firestore sync error:", error);
    });

    return () => unsubscribe();
  }, []);

  // Save entire state to Firestore
  const saveContent = async () => {
    if (!db || !user) {
        alert("Database not connected or user not logged in.");
        return;
    }
    try {
      await setDoc(doc(db, 'site_content', 'main'), content);
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
    if(window.confirm('重置将覆盖数据库中的内容为默认值，确定吗？')) {
        setContent(INITIAL_CONTENT);
        // Optionally immediately save to DB to "hard reset" remote
        // saveContent(); 
    }
  };

  const login = async (email: string, pass: string) => {
      if (!auth) throw new Error("Auth not initialized");
      await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
      if (!auth) return;
      await signOut(auth);
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
