import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import it from '../locales/it.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';

export const languageResources = {
  en: { translation: en },
  it: { translation: it },
  fr: { translation: fr },
  de: { translation: de },
};

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: languageResources,
});

export default i18n;
