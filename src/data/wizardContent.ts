
import { useLanguage } from '../context/language';

export const wizardHeroContent = {
  heading: 'Your safety plan',
  body: 'A clear path forward whether you need help right now or want to prepare for any hard days.',
};

export const howItWorksContent = {
  heading: 'How the plan works',
  body: 'A few simple questions to build something solid and true.',
  cards: [
    {
      stepId: 'warning-signs',
      heading: 'Name the hard moments',
      text: 'We ask what comes before the darkness. The places. The feelings.',
      linkLabel: 'Warning Signs',
    },
    {
      stepId: 'coping',
      heading: 'Find what steadies you',
      text: 'You tell us what action quiets the noise. A walk. A song.',
      linkLabel: 'Coping',
    },
    {
      stepId: 'supports',
      heading: 'Choose your people',
      text: 'Select the trusted voices you can call when the weight is heavy.',
      linkLabel: 'Supports',
    },
    {
      stepId: 'environment',
      heading: 'Build a safe space',
      text: 'Define the physical place or mental image that feels like shelter.',
      linkLabel: 'Environment',
    },
  ],
};

export const buildPlanContent = {
  heading: 'Build your plan',
  body: 'Answer honestly. There are no wrong words here.',
  otherLabel: 'Other...',
  consentLabel: 'I understand this is not emergency care',
  submitLabel: 'Build your plan',
  continueLabel: 'Continue',
  backLabel: 'Back',
  restartLabel: 'Restart',
  selectPlaceholder: 'Select...',
  progressLabel: 'Safety plan progress',
};

const en = { wizardHeroContent, howItWorksContent, buildPlanContent };

const es: typeof en = {
  wizardHeroContent: {
    heading: 'Tu plan de seguridad',
    body: 'Un camino claro hacia adelante, ya sea que necesites ayuda ahora mismo o quieras prepararte para los días difíciles.',
  },
  howItWorksContent: {
    heading: 'Cómo funciona el plan',
    body: 'Unas preguntas sencillas para construir algo sólido y verdadero.',
    cards: [
      {
        stepId: 'warning-signs',
        heading: 'Nombra los momentos difíciles',
        text: 'Te preguntamos qué aparece antes de la oscuridad. Los lugares. Los sentimientos.',
        linkLabel: 'Señales de alerta',
      },
      {
        stepId: 'coping',
        heading: 'Encuentra lo que te da estabilidad',
        text: 'Nos dices qué acción calma el ruido. Una caminata. Una canción.',
        linkLabel: 'Afrontamiento',
      },
      {
        stepId: 'supports',
        heading: 'Elige a tu gente',
        text: 'Selecciona las voces de confianza a las que puedes llamar cuando el peso es demasiado.',
        linkLabel: 'Apoyos',
      },
      {
        stepId: 'environment',
        heading: 'Construye un espacio seguro',
        text: 'Define el lugar físico o la imagen mental que se siente como refugio.',
        linkLabel: 'Entorno',
      },
    ],
  },
  buildPlanContent: {
    heading: 'Crea tu plan',
    body: 'Responde con honestidad. Aquí no hay respuestas incorrectas.',
    otherLabel: 'Otro...',
    consentLabel: 'Entiendo que esto no es atención de emergencia',
    submitLabel: 'Crear tu plan',
    continueLabel: 'Continuar',
    backLabel: 'Atrás',
    restartLabel: 'Reiniciar',
    selectPlaceholder: 'Selecciona...',
    progressLabel: 'Progreso del plan de seguridad',
  },
};

export function useWizardContent() {
  const { language } = useLanguage();
  return language === 'es' ? es : en;
}
