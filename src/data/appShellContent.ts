
import { useLanguage } from '../context/language';

export const appShellContent = {
  brand: 'Safety Plan',
  primaryNavAriaLabel: 'Primary',
  nav: {
    welcome: 'Welcome',
    resources: 'Resources',
    plan: 'Plan',
    admin: 'Admin',
  },
  footer: 'A private, supportive tool for building a safety plan.',
};

const en = appShellContent;

const es: typeof en = {
  brand: 'Plan de Seguridad',
  primaryNavAriaLabel: 'Principal',
  nav: {
    welcome: 'Inicio',
    resources: 'Recursos',
    plan: 'Plan',
    admin: 'Admin',
  },
  footer: 'Una herramienta privada y de apoyo para crear un plan de seguridad.',
};

export function useAppShellContent() {
  const { language } = useLanguage();
  return language === 'es' ? es : en;
}
