import { getData } from '@/helpers/storage';
import { createContext, useContext, useState } from 'react';
import i18n from '@/services/i18next';

type LanguageContextProps = [string, React.Dispatch<React.SetStateAction<string>>];

export const LanguageContext = createContext<LanguageContextProps | []>([]);

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<string>('en');

  getData('language').then((value) => {
    if (value !== undefined) {
      setLanguage(value);
      i18n.changeLanguage(value);
    }
  });

  return <LanguageContext.Provider value={[language, setLanguage]}>{children}</LanguageContext.Provider>;
};

export default LanguageProvider;

export const useLanguageContext = (): LanguageContextProps => {
  const [language, setLanguage] = useContext(LanguageContext);

  if (language === undefined || setLanguage === undefined) {
    throw new Error('Custom Error: language or setLanguage is undefined');
  }
  return [language, setLanguage];
};
