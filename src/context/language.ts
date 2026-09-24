import { createContext, useContext } from 'react';

export type Language = 'en' | 'es';

export interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const LANGUAGE_STORAGE_KEY = 'safety-plan-language';

/**
 * Resolves the initial language: a previously saved choice wins, otherwise we
 * fall back to the browser's language setting, defaulting to English.
 */
export function loadStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === 'en' || stored === 'es') return stored;
  return window.navigator?.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

// Defaults to English with a no-op setter (rather than throwing like useTheme)
// so components that read language-aware content can render correctly in
// isolation, e.g. in tests that don't wrap with LanguageProvider.
const defaultContextValue: LanguageContextValue = {
  language: 'en',
  setLanguage: () => {},
};

export const LanguageContext = createContext<LanguageContextValue>(defaultContextValue);

export function useLanguage() {
  return useContext(LanguageContext);
}
