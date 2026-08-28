import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from './types';
import { TRANSLATIONS } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Detect user's preferred language from navigator.languages / navigator.language.
 * Checks if the primary language tag matches any of the 11 supported languages.
 * If not, strictly defaults to 'en' (English).
 */
export function detectBrowserLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem('app_lang');
    if (saved && isSupported(saved)) {
      return saved as SupportedLanguage;
    }

    const browserLangs = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
    for (const raw of browserLangs) {
      if (!raw) continue;
      const clean = raw.toLowerCase().trim();
      const code = clean.split('-')[0].split('_')[0];

      if (code === 'es') return 'es';
      if (code === 'fr') return 'fr';
      if (code === 'pt') return 'pt';
      if (code === 'de') return 'de';
      if (code === 'hu') return 'hu';
      if (code === 'el') return 'el';
      if (code === 'tr') return 'tr';
      if (code === 'sq') return 'sq';
      if (code === 'sr') return 'sr';
      if (code === 'ru') return 'ru';
      if (code === 'en') return 'en';
    }
  } catch {
    // Default fallback
  }

  return 'en';
}

function isSupported(code: string): boolean {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === code);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => detectBrowserLanguage());

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('app_lang', lang);
      document.documentElement.lang = lang;
    } catch {
      // safe
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // safe
    }
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
