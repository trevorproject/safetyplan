
import { useLanguage } from '../context/language';
import type { PlanListField } from '../types/app';

interface FinishedPlanSection {
  field: PlanListField;
  label: string;
}

export const completedPlanHeroContent = {
  headingLead: 'Here is ',
  headingScript: 'your',
  headingTail: ' plan',
  body: "Keep it close to you and don't forget to ask for help if you need it",
  tipLabel: 'How to keep your plan',
  tip: 'You can download your plan as a PDF or text file to keep it on your device without internet, print it, or share it with someone you trust when you feel ready.',
};

export const reminderCardContent = {
  heading: 'A gentle reminder',
  body: 'If you are in immediate danger or feel unsafe, contact emergency support or a crisis lifeline right away.',
  action: { label: 'Crisis Resources', to: '/resources' },
};

export const finishedPlanContent: {
  sections: FinishedPlanSection[];
  notesLabel: string;
  printLabel: string;
  shareLabel: string;
  shareSubject: string;
  newPlanLabel: string;
  newPlanConfirm: string;
  download: {
    label: string;
    formatsLabel: string;
    formats: { pdf: string; txt: string };
    pending: string;
    error: string;
    retryLabel: string;
    fileName: string;
  };
} = {
  sections: [
    { field: 'warningSigns', label: 'Warning Signs' },
    { field: 'copingStrategies', label: 'Coping Strategies' },
    { field: 'supports', label: 'Support' },
    { field: 'environment', label: 'Safe Environment' },
  ],
  notesLabel: 'Notes',
  printLabel: 'Print',
  shareLabel: 'Share',
  shareSubject: 'My Safety Plan',
  newPlanLabel: 'Make a new plan',
  newPlanConfirm: 'This will erase your current plan from this device so you can start from scratch. Download, print or share it first if you want to keep it. Continue?',
  download: {
    label: 'Download',
    formatsLabel: 'Choose a file format',
    formats: { pdf: 'PDF document (.pdf)', txt: 'Text file (.txt)' },
    pending: 'Preparing your file…',
    error: "We couldn't create your file. Your plan is still here, so you can try again.",
    retryLabel: 'Try again',
    fileName: 'safety-plan',
  },
};

const en = { completedPlanHeroContent, reminderCardContent, finishedPlanContent };

const es: typeof en = {
  completedPlanHeroContent: {
    headingLead: 'Aquí está ',
    headingScript: 'tu',
    headingTail: ' plan',
    body: 'Guárdalo cerca de ti y no olvides pedir ayuda si la necesitas',
    tipLabel: 'Cómo guardar tu plan',
    tip: 'Puedes descargar tu plan como PDF o archivo de texto para tenerlo en tu dispositivo sin internet, imprimirlo o compartirlo con alguien de confianza cuando te sientas preparadx.',
  },
  reminderCardContent: {
    heading: 'Un recordatorio amable',
    body: 'Si estás en peligro inmediato o te sientes en riesgo, contacta a servicios de emergencia o a una línea de crisis de inmediato.',
    action: { label: 'Recursos de crisis', to: '/resources' },
  },
  finishedPlanContent: {
    sections: [
      { field: 'warningSigns', label: 'Señales de alerta' },
      { field: 'copingStrategies', label: 'Estrategias de afrontamiento' },
      { field: 'supports', label: 'Apoyo' },
      { field: 'environment', label: 'Entorno seguro' },
    ],
    notesLabel: 'Notas',
    printLabel: 'Imprimir',
    shareLabel: 'Compartir',
    shareSubject: 'Mi plan de seguridad',
    newPlanLabel: 'Hacer un nuevo plan',
    newPlanConfirm: 'Esto borrará tu plan actual de este dispositivo para que puedas empezar desde cero. Si quieres conservarlo, descárgalo, imprímelo o compártelo antes. ¿Continuar?',
    download: {
      label: 'Descargar',
      formatsLabel: 'Elige un formato de archivo',
      formats: { pdf: 'Documento PDF (.pdf)', txt: 'Archivo de texto (.txt)' },
      pending: 'Preparando tu archivo…',
      error: 'No pudimos crear tu archivo. Tu plan sigue aquí, así que puedes intentarlo de nuevo.',
      retryLabel: 'Intentar de nuevo',
      fileName: 'plan-de-seguridad',
    },
  },
};

export function useCompletedPlanContent() {
  const { language } = useLanguage();
  return language === 'es' ? es : en;
}
