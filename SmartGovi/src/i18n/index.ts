import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import si from './locales/si.json';

export const LANGUAGE_KEY = '@smart_govi_language';
export type SupportedLanguage = 'en' | 'si';

const getInitialLanguage = async (): Promise<SupportedLanguage> => {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (saved === 'en' || saved === 'si') return saved;
    // Fall back to device locale
    const deviceLocale = Localization.getLocales()[0]?.languageCode;
    if (deviceLocale === 'si') return 'si';
  } catch (_) {}
  return 'en';
};

export const initI18n = async () => {
  const language = await getInitialLanguage();

  await i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      si: { translation: si },
    },
    lng: language,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
  });
};

export default i18n;
