import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { LanguageContext, loadStoredLanguage, LANGUAGE_STORAGE_KEY, type Language } from './language';

const DOCUMENT_META = {
  en: { title: 'Safety Plan - The Trevor Project', description: 'The Trevor Project Safety Plan Page' },
  es: { title: 'Plan de Seguridad - The Trevor Project', description: 'Página del Plan de Seguridad de The Trevor Project' },
} as const;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(loadStoredLanguage);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
    document.title = DOCUMENT_META[language].title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', DOCUMENT_META[language].description);
  }, [language]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((next: Language) => setLanguageState(next), []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
  );
}
