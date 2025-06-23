import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationsHe from './locales/he.json';
import translationsEn from './locales/en.json';
import translationsRu from './locales/ru.json';
import translationsAr from './locales/ar.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      he: {
        translation: translationsHe
      },
      en: {
        translation: translationsEn
      },
      ru: {
        translation: translationsRu
      },
      ar: {
        translation: translationsAr
      }
    },
    lng: 'he', // Default language
    fallbackLng: 'he',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;