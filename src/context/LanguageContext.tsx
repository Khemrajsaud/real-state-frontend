import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { translations, type Language, type TranslationKey } from '../constants/translations';

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('np');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'np' ? 'en' : 'np'));
  };

  const t = (key: TranslationKey) => {
    return translations[language][key] || translations['np'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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
