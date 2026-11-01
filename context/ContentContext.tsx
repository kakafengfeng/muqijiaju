import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent } from '../types';
import { CONTENT as INITIAL_CONTENT } from '../constants';
import { db, auth } from '../firebase';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

// Demo 账号仅在本机开发环境（vite dev）可用；生产构建后 import.meta.env.DEV 为 false，
// 该分支会被 tree-shake，不留下任何认证后门。生产环境使用 Firebase 登录（云端持久化）。
const DEMO_ENABLED = import.meta.env.DEV;
const DEMO_EMAIL = 'admin@muqi.com';
const DEMO_PASSWORD = '123456';

interface ContentContextType {
  content: SiteContent;
  /** 云端首个快照是否已到达（非本地缓存）。首屏用它做门，避免先渲染本地旧缓存 */
  contentReady: boolean;
  user: User | null;
  loading: boolean;
  updateContent: (section: keyof SiteContent, data: any) => void;
  updateNestedContent: (path: string[], value: any) => void;
  saveContent: (override?: Partial<SiteContent>) => Promise<void>;
  resetContent: () => void;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem('muqi_site_content');
      if (saved) return JSON.parse(saved) as SiteContent;
    } catch (e) {
      console.warn('Local content load failed', e);
    }
    return INITIAL_CONTENT;
  });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  // 1. Listen for Auth State Changes & Local Storage for Demo (dev only)
  useEffect(() => {
    if (DEMO_ENABLED) {
      const demoUserStr = localStorage.getItem('muqi_demo_user');
      if (demoUserStr) {
        setUser(JSON.parse(demoUserStr));
      }
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else if (!DEMO_ENABLED || !localStorage.getItem('muqi_demo_user')) {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Listen for Realtime Data from Firestore
  // 首屏同步门：只有拿到服务端快照（非本地缓存）才放行渲染；
  // 出错或 8 秒超时则用本地缓存/内置默认内容兜底，避免一直白屏。
  useEffect(() => {
    if (!db) {
      setContentReady(true);
      return;
    }

    let done = false;
    const markReady = () => {
      if (!done) {
        done = true;
        setContentReady(true);
      }
    };

    try {
      const docRef = doc(db, 'site_content', 'main');
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as SiteContent;
            setContent(data);
            // 同步最新数据到本地缓存：下次离线/弱网打开时也能拿到最新内容
            try {
              localStorage.setItem('muqi_site_content', JSON.stringify(data));
            } catch (e) {
              console.warn('Local cache write failed', e);
            }
          }
          if (!docSnap.metadata.fromCache) markReady();
        },
        (error) => {
          console.warn('Firestore sync unavailable (expected until Firebase is configured):', error.message);
          markReady();
        }
      );
      const timer = setTimeout(markReady, 8000);
      return () => {
        clearTimeout(timer);
        unsubscribe();
      };
    } catch (e) {
      console.warn('Firestore init error', e);
      markReady();
    }
  }, []);

  // 3. 手机浏览器切回旧标签页时（bfcache 恢复，JS 不重新执行），强制刷新一次，
  // 保证看到的永远是最新内容，而不是内存里恢复的旧页面。
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  // Save state to Firestore. Accepts an optional partial override so callers
  // (e.g. TeamPage seed) can save specific sections without racing setState.
  const saveContent = async (override?: Partial<SiteContent>) => {
    if (user && (user as any).isDemo) {
      // Demo mode: 持久化到本机 localStorage，模拟网络延迟
      const next = { ...content, ...override };
      if (override) setContent(next);
      try {
        localStorage.setItem('muqi_site_content', JSON.stringify(next));
      } catch (e) {
        console.warn('Local save failed', e);
      }
      await new Promise((resolve) => setTimeout(resolve, 400));
      return;
    }

    if (!db || !user) {
      alert('Database not connected or user not logged in.');
      return;
    }
    try {
      const docRef = doc(db, 'site_content', 'main');
      await setDoc(docRef, { ...content, ...override });
    } catch (e) {
      console.error('Failed to save content', e);
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
    if (window.confirm('This will reset all content to defaults. Continue?')) {
      localStorage.removeItem('muqi_site_content');
      setContent(INITIAL_CONTENT);
    }
  };

  const login = async (email: string, pass: string) => {
    // Demo bypass — development builds only
    if (DEMO_ENABLED && email === DEMO_EMAIL && pass === DEMO_PASSWORD) {
      const mockUser = {
        uid: 'demo-admin-001',
        email: DEMO_EMAIL,
        displayName: 'Demo Administrator',
        emailVerified: true,
        isDemo: true,
      } as unknown as User;

      localStorage.setItem('muqi_demo_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }

    if (!auth) throw new Error('Auth not initialized.');
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    localStorage.removeItem('muqi_demo_user');
    setUser(null);
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Firebase signout error', e);
      }
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        contentReady,
        user,
        loading,
        updateContent,
        updateNestedContent,
        saveContent,
        resetContent,
        login,
        logout,
      }}
    >
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
