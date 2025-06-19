import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import resources from './translations.json';

// Add an initialization guard
let isInitialized = false;

// Initialize i18next with the base translations only once
if (!isInitialized && !i18next.isInitialized) {
  isInitialized = true;

  i18next
    .use(initReactI18next)
    .init({
      resources: {
        ru: resources.ru
      },
      lng: 'ru',
      fallbackLng: 'ru',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      lowerCaseLng: true,
      nsSeparator: false,
      keySeparator: false,
    })
    .catch((e) => console.error('i18n initialization failed:', e));
}

export default i18next;
