
import { useLanguage } from '../context/language';

export const wizardHeroContent = {
  heading: 'Your safety plan',
  body: 'A clear path forward whether you need help right now or want to prepare for any hard days.',
};

/**
 * Plain-language help shown next to each wizard question. `steps` explains the
 * question as a whole (opened from the info icon by its title); `terms` explains
 * one phrase inside the question's description, which becomes its own trigger.
 * A term only shows up when its text appears in that step's description.
 */
export const questionHelpContent = {
  stepHelpLabel: 'What this question means: {title}',
  termHelpLabel: 'What “{term}” means',
  closeLabel: 'Close explanation',
  exampleLabel: 'For example:',
  steps: [
    {
      stepId: 'warning-signs',
      text: 'We ask what comes before the darkness. The places. The feelings.',
    },
    {
      stepId: 'coping',
      text: 'You tell us what action quiets the noise. A walk. A song.',
    },
    {
      stepId: 'supports',
      text: 'Select the trusted voices you can call when the weight is heavy.',
    },
    {
      stepId: 'environment',
      text: 'Define the physical place or mental image that feels like shelter.',
    },
  ],
  terms: [
    {
      stepId: 'warning-signs',
      term: 'the times get rough',
      explanation: 'Moments when you feel very sad, scared, overwhelmed or not safe.',
      example: 'After a fight, when you feel alone at night, or after bad news.',
    },
    {
      stepId: 'coping',
      term: 'warning signs',
      explanation: 'The thoughts, feelings or actions you wrote in the first step. They tell you a hard moment may be starting.',
      example: 'Crying, not eating, or wanting to be alone.',
    },
    {
      stepId: 'supports',
      term: 'comfortable talking to',
      explanation: 'People you trust and feel safe with. You do not have to tell them everything.',
      example: 'A friend, a family member, a teacher or a counselor.',
    },
    {
      stepId: 'environment',
      term: 'surroundings',
      explanation: 'The places where you spend time, like your room, home, school or work, and the things in them.',
      example: 'Asking someone you trust to keep your medicine for you.',
    },
  ],
};

export const buildPlanContent = {
  heading: 'Build your plan',
  body: 'Answer honestly. There are no wrong words here.',
  answerLabel: 'Your answers',
  addAnswerLabel: 'Add another option',
  removeAnswerLabel: 'Remove',
  reorderHint: 'Put the answers that matter most to you first. Drag them, or use the arrows.',
  moveUpLabel: 'Move up',
  moveDownLabel: 'Move down',
  movedAnnouncement: '{answer} moved to position {position} of {total}',
  suggestionsLabel: 'Need ideas? Tap any suggestion that fits',
  consentLabel: 'I understand this is not emergency care',
  submitLabel: 'Build your plan',
  continueLabel: 'Continue',
  backLabel: 'Back',
  restartLabel: 'Restart',
  progressLabel: 'Safety plan progress',
};

const en = { wizardHeroContent, questionHelpContent, buildPlanContent };

const es: typeof en = {
  wizardHeroContent: {
    heading: 'Tu plan de seguridad',
    body: 'Un camino claro hacia adelante, ya sea que necesites ayuda ahora mismo o quieras prepararte para los días difíciles.',
  },
  questionHelpContent: {
    stepHelpLabel: 'Qué significa esta pregunta: {title}',
    termHelpLabel: 'Qué significa “{term}”',
    closeLabel: 'Cerrar explicación',
    exampleLabel: 'Por ejemplo:',
    steps: [
      {
        stepId: 'warning-signs',
        text: 'Te preguntamos qué aparece antes de la oscuridad. Los lugares. Los sentimientos.',
      },
      {
        stepId: 'coping',
        text: 'Nos dices qué acción calma el ruido. Una caminata. Una canción.',
      },
      {
        stepId: 'supports',
        text: 'Selecciona las voces de confianza a las que puedes llamar cuando el peso es demasiado.',
      },
      {
        stepId: 'environment',
        text: 'Define el lugar físico o la imagen mental que se siente como refugio.',
      },
    ],
    terms: [
      {
        stepId: 'warning-signs',
        term: 'los momentos se ponen difíciles',
        explanation: 'Momentos en los que te sientes muy triste, con miedo, abrumadx o en peligro.',
        example: 'Después de una pelea, cuando te sientes solx en la noche o después de una mala noticia.',
      },
      {
        stepId: 'coping',
        term: 'señales de alerta',
        explanation: 'Los pensamientos, sentimientos o acciones que escribiste en el primer paso. Te avisan que un momento difícil puede estar empezando.',
        example: 'Llorar, no comer o querer estar solx.',
      },
      {
        stepId: 'supports',
        term: 'te sientes cómodx hablando',
        explanation: 'Personas en las que confías y con las que te sientes segurx. No tienes que contarles todo.',
        example: 'Unx amigx, alguien de tu familia, unx maestrx o unx consejerx.',
      },
      {
        stepId: 'environment',
        term: 'entorno',
        explanation: 'Los lugares donde pasas tiempo, como tu cuarto, tu casa, la escuela o el trabajo, y las cosas que hay en ellos.',
        example: 'Pedirle a alguien de confianza que guarde tus medicinas.',
      },
    ],
  },
  buildPlanContent: {
    heading: 'Crea tu plan',
    body: 'Responde con honestidad. Aquí no hay respuestas incorrectas.',
    answerLabel: 'Tus respuestas',
    addAnswerLabel: 'Agregar otra opción',
    removeAnswerLabel: 'Eliminar',
    reorderHint: 'Pon primero las respuestas que más te importan. Arrástralas o usa las flechas.',
    moveUpLabel: 'Subir',
    moveDownLabel: 'Bajar',
    movedAnnouncement: '{answer} se movió a la posición {position} de {total}',
    suggestionsLabel: '¿Necesitas ideas? Toca cualquier sugerencia que te sirva',
    consentLabel: 'Entiendo que esto no es atención de emergencia',
    submitLabel: 'Crear tu plan',
    continueLabel: 'Continuar',
    backLabel: 'Atrás',
    restartLabel: 'Reiniciar',
    progressLabel: 'Progreso del plan de seguridad',
  },
};

export function useWizardContent() {
  const { language } = useLanguage();
  return language === 'es' ? es : en;
}
