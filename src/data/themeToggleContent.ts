
import { useLanguage } from '../context/language';

export const themeToggleContent = {
  switchToLight: 'Switch to light mode',
  switchToDark: 'Switch to dark mode',
};

const en = themeToggleContent;

const es: typeof en = {
  switchToLight: 'Cambiar a modo claro',
  switchToDark: 'Cambiar a modo oscuro',
};

export function useThemeToggleContent() {
  const { language } = useLanguage();
  return language === 'es' ? es : en;
}
