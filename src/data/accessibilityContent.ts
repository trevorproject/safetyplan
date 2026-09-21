
import { useLanguage } from '../context/language';

export const accessibilityWidgetContent = {
  triggerLabel: 'Accessibility options',
  heading: 'Accessibility',
  closeLabel: 'Close accessibility panel',
  tabs: {
    reader: 'Screen reader',
    vision: 'Color vision',
    help: 'Get help',
  },
  reader: {
    heading: 'Read this page aloud',
    body: 'Choose a section below to hear it read aloud, or read the whole page at once.',
    readAllLabel: 'Read full page',
    pauseLabel: 'Pause',
    resumeLabel: 'Resume',
    stopLabel: 'Stop',
    readSectionLabel: 'Read section',
    emptyState: 'No readable sections were found on this page yet.',
    unsupported: "This browser doesn't support built-in reading aloud.",
  },
  vision: {
    heading: 'Color vision filters',
    body: 'Adjust the colors on this site to make them easier to tell apart.',
    options: {
      none: 'Off',
      protanopia: 'Protanopia (red-green)',
      deuteranopia: 'Deuteranopia (red-green)',
      tritanopia: 'Tritanopia (blue-yellow)',
      achromatopsia: 'Grayscale',
    },
  },
  help: {
    heading: 'Get help now',
    body: 'These resources are available anytime, from any page.',
    viewAllLabel: 'See all resources',
    viewAllTo: '/resources',
  },
};

const en = accessibilityWidgetContent;

const es: typeof en = {
  triggerLabel: 'Opciones de accesibilidad',
  heading: 'Accesibilidad',
  closeLabel: 'Cerrar panel de accesibilidad',
  tabs: {
    reader: 'Lector de pantalla',
    vision: 'Visión del color',
    help: 'Obtener ayuda',
  },
  reader: {
    heading: 'Escuchar esta página en voz alta',
    body: 'Elige una sección a continuación para escucharla en voz alta, o escucha toda la página de una vez.',
    readAllLabel: 'Leer página completa',
    pauseLabel: 'Pausar',
    resumeLabel: 'Reanudar',
    stopLabel: 'Detener',
    readSectionLabel: 'Leer sección',
    emptyState: 'Todavía no se encontraron secciones legibles en esta página.',
    unsupported: 'Este navegador no admite la lectura en voz alta integrada.',
  },
  vision: {
    heading: 'Filtros de visión del color',
    body: 'Ajusta los colores de este sitio para que sea más fácil distinguirlos.',
    options: {
      none: 'Desactivado',
      protanopia: 'Protanopía (rojo-verde)',
      deuteranopia: 'Deuteranopía (rojo-verde)',
      tritanopia: 'Tritanopía (azul-amarillo)',
      achromatopsia: 'Escala de grises',
    },
  },
  help: {
    heading: 'Obtener ayuda ahora',
    body: 'Estos recursos están disponibles en cualquier momento, desde cualquier página.',
    viewAllLabel: 'Ver todos los recursos',
    viewAllTo: '/resources',
  },
};

export function useAccessibilityContent() {
  const { language } = useLanguage();
  return language === 'es' ? es : en;
}
