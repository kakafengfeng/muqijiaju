import React, { createContext, useContext, useState } from 'react';
import { SiteContent } from '../types';
import { CONTENT as INITIAL_CONTENT } from '../constants';

interface ContentContextType {
  content: SiteContent;
  updateContent: (section: keyof SiteContent, data: any) => void;
  updateNestedContent: (path: string[], value: any) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);

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
    <ContentContext.Provider value={{ content, updateContent, updateNestedContent }}>
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