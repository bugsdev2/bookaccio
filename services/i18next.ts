import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import it from '../locales/it.json';

export const languageResources = {
  en: { translation: en },
  it: { translation: it },
};

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: languageResources,
});

export default i18n;
