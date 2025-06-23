import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'he' | 'en' | 'ru' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language storage key
const LANGUAGE_STORAGE_KEY = 'tachlesai-language';

// Helper to determine text direction based on language
const getTextDirection = (lang: Language): 'rtl' | 'ltr' => {
  return ['he', 'ar'].includes(lang) ? 'rtl' : 'ltr';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with Hebrew as default, but check localStorage first
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      return savedLanguage || 'he';
    }
    return 'he';
  });

  const [dir, setDir] = useState<'rtl' | 'ltr'>(getTextDirection(language));

  // Update language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
    setDir(getTextDirection(lang));
    
    // Update document direction
    document.documentElement.dir = getTextDirection(lang);
    document.documentElement.lang = lang;
  };

  // Set initial document direction on mount
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};