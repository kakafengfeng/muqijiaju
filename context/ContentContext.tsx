import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent } from '../types';
import { CONTENT as INITIAL_CONTENT } from '../constants';

interface ContentContextType {
  content: SiteContent;
  updateContent: (section: keyof SiteContent, data: any) => void;
  updateNestedContent: (path: string[], value: any) => void;
  saveContent: () => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const STORAGE_KEY = 'muqi_site_content_v1';

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available, otherwise use default constant
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CONTENT;
    } catch (e) {
      console.error("Failed to load content from storage", e);
      return INITIAL_CONTENT;
    }
  });

  // Save to localStorage
  const saveContent = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (e) {
      console.error("Failed to save content", e);
    }
  };

  // Reset to default
  const resetContent = () => {
    if(window.confirm('确定要重置所有内容恢复默认吗？此操作无法撤销。')) {
      localStorage.removeItem(STORAGE_KEY);
      setContent(INITIAL_CONTENT);
      window.location.reload();
    }
  };

  const updateContent = (section: keyof SiteContent, data: any) => {
    setContent((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  // Helper to update deeply nested values (e.g. products[0].name)
  const updateNestedContent = (path: string[], value: any) => {
    setContent((prev) => {
      const newContent = JSON.parse(JSON.stringify(prev)); // Deep clone
      let current = newContent;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newContent;
    });
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, updateNestedContent, saveContent, resetContent }}>
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