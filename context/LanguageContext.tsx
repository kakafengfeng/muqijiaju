import React, { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'zh' | 'en';

interface LanguageContextType {
  lang: Lang;
  toggle: () => void;
  t: (zh: string, en: string) => string;
}

const STORAGE_KEY = 'muqi_lang';
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'zh';
    } catch {
      return 'zh';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const toggle = () => setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  const t = (zh: string, en: string) => (lang === 'en' ? en : zh);

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
