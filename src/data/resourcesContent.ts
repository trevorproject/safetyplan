
import { useLanguage } from '../context/language';

export const resourcesHeroContent = {
  heading: 'Help near you',
  body: 'You matter. Find help than can support you 24/7.',
};

export const freeResourcesContent = {
  heading: 'Free Resources',
  textLead: 'Real places with real people who',
  textScript: 'understand without judgment',
  learnTogetherImageAlt: 'The Trevor Project',
};

export const lifelineCard = {
  heading: '988 Lifeline',
  text: 'Call or text 988',
  url: 'https://988lifeline.org/',
  action: { label: 'Go to the website', to: 'https://988lifeline.org/' },
  imageAlt: '988 Suicide & Crisis Lifeline',
};

export const trevorCard = {
  heading: 'The Trevor Project',
  textScript: "We're here to listen",
  textRest: 'when you need us. Our certified counselors are available 24/7.',
  action: { label: 'Go to the website', to: 'https://www.thetrevorproject.org/get-help/' },
};

const en = { resourcesHeroContent, freeResourcesContent, lifelineCard, trevorCard };

const es: typeof en = {
  resourcesHeroContent: {
    heading: 'Ayuda cerca de ti',
    body: 'Nos importas. Encuentra ayuda disponible para apoyarte las 24 horas, los 7 días de la semana.',
  },
  freeResourcesContent: {
    heading: 'Recursos gratuitos',
    textLead: 'Lugares reales con personas reales que',
    textScript: 'entienden sin juzgar',
    learnTogetherImageAlt: 'The Trevor Project',
  },
  lifelineCard: {
    heading: 'Línea de Vida 988',
    text: 'Llama o envía un mensaje de texto al 988',
    url: 'https://988lifeline.org/',
    action: { label: 'Ir al sitio web', to: 'https://988lifeline.org/' },
    imageAlt: 'Línea 988 de Prevención del Suicidio y Crisis',
  },
  trevorCard: {
    heading: 'The Trevor Project',
    textScript: 'Estamos aquí para escucharte',
    textRest: 'cuando nos necesites. Nuestro personal de consejería certificado está disponible las 24 horas, los 7 días de la semana.',
    action: { label: 'Ir al sitio web', to: 'https://www.thetrevorproject.org/get-help/' },
  },
};

export function useResourcesContent() {
  const { language } = useLanguage();
  return language === 'es' ? es : en;
}
