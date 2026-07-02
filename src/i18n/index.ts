import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { STORAGE_KEYS } from '@/utils/constants';

export const SUPPORTED_LANGUAGES = ['kk', 'en', 'zh', 'ru'] as const;
export const DEFAULT_LANGUAGE = 'kk';

void i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    load: 'languageOnly',
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: { escapeValue: false },
    backend: {
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: STORAGE_KEYS.language,
      caches: ['localStorage'],
    },
    react: { useSuspense: true },
  });

// Keep the <html lang> attribute in sync for accessibility / SEO.
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

export default i18n;
