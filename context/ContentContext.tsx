import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent } from '../types';
import { CONTENT as INITIAL_CONTENT } from '../constants';
import SNAPSHOT_FILE from '../cms-snapshot.json';
import type { User } from 'firebase/auth';

// Demo 账号仅在本机开发环境（vite dev）可用；生产构建后 import.meta.env.DEV 为 false，
// 该分支会被 tree-shake，不留下任何认证后门。生产环境使用 Firebase 登录（云端持久化）。
const DEMO_ENABLED = import.meta.env.DEV;
const DEMO_EMAIL = 'admin@muqi.com';
const DEMO_PASSWORD = '123456';

// ---- Firebase 按需加载 ----
// 普通访客不下载 673KB 的 Firebase SDK：内容首屏直接用构建时快照渲染。
// 只有后台相关页面（/admin、/login）或管理员操作（登录/保存/登出）时才动态加载。
type FBModules = {
  auth: any;
  db: any;
  onAuthStateChanged: any;
  signInWithEmailAndPassword: any;
  signOut: any;
  doc: any;
  setDoc: any;
};
let fbPromise: Promise<FBModules> | null = null;
function loadFirebase(): Promise<FBModules> {
  if (!fbPromise) {
    fbPromise = Promise.all([
      import('../firebase'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ]).then(([fb, authMod, fsMod]) => ({
      auth: fb.auth,
      db: fb.db,
      onAuthStateChanged: authMod.onAuthStateChanged,
      signInWithEmailAndPassword: authMod.signInWithEmailAndPassword,
      signOut: authMod.signOut,
      doc: fsMod.doc,
      setDoc: fsMod.setDoc,
    }));
  }
  return fbPromise;
}
function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const h = window.location.hash || '';
  return h.includes('/admin') || h.includes('/login');
}

interface ContentContextType {
  content: SiteContent;
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

// 构建时快照：每次构建自动从云端拉取的最新内容（见 scripts/fetch-cms.mjs）。
// 手机等连不上 Google 服务器的设备，首屏直接用这份快照渲染，不再显示几个月前的旧内置数据。
const BUILD_SNAPSHOT: SiteContent | null =
  SNAPSHOT_FILE && (SNAPSHOT_FILE as any).content && (SNAPSHOT_FILE as any).content.departments
    ? ((SNAPSHOT_FILE as any).content as SiteContent)
    : null;

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    // 优先级：构建时快照（构建时的云端最新）> 本机缓存 > 内置默认
    if (BUILD_SNAPSHOT) return BUILD_SNAPSHOT;
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

  // 1. Auth 状态：仅在后台相关页面加载 Firebase 并监听，普通访客直接跳过
  useEffect(() => {
    if (DEMO_ENABLED) {
      const demoUserStr = localStorage.getItem('muqi_demo_user');
      if (demoUserStr) {
        setUser(JSON.parse(demoUserStr));
      }
    }

    if (!isAdminRoute()) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    loadFirebase()
      .then((fb) => {
        if (cancelled) return;
        if (!fb.auth) {
          setLoading(false);
          return;
        }
        unsubscribe = fb.onAuthStateChanged(fb.auth, (currentUser: User | null) => {
          if (currentUser) {
            setUser(currentUser);
          } else if (!DEMO_ENABLED || !localStorage.getItem('muqi_demo_user')) {
            setUser(null);
          }
          setLoading(false);
        });
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 注：之前这里的 Firestore onSnapshot 实时同步已移除。
  // 公开内容现在以构建时快照为准（每次构建自动同步云端最新），普通访客不再需要连接 Google 服务器；
  // 后台改完内容后重新构建一次，所有设备即统一最新。

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

    if (!user) {
      alert('Database not connected or user not logged in.');
      return;
    }
    const fb = await loadFirebase();
    if (!fb.db) {
      alert('Database not connected.');
      return;
    }
    try {
      const docRef = fb.doc(fb.db, 'site_content', 'main');
      await fb.setDoc(docRef, { ...content, ...override });
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

    const fb = await loadFirebase();
    if (!fb.auth) throw new Error('Auth not initialized.');
    await fb.signInWithEmailAndPassword(fb.auth, email, pass);
  };

  const logout = async () => {
    localStorage.removeItem('muqi_demo_user');
    setUser(null);
    try {
      const fb = await loadFirebase();
      if (fb.auth) {
        await fb.signOut(fb.auth);
      }
    } catch (e) {
      console.warn('Firebase signout error', e);
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
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
