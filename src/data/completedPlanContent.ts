
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
  tip: 'You can print this page, save it as a PDF, or share it with someone you trust when you feel ready.',
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
  newPlanConfirm: 'This will erase your current plan from this device so you can start from scratch. Print or share it first if you want to keep it. Continue?',
};

const en = { completedPlanHeroContent, reminderCardContent, finishedPlanContent };

const es: typeof en = {
  completedPlanHeroContent: {
    headingLead: 'Aquí está ',
    headingScript: 'tu',
    headingTail: ' plan',
    body: 'Guárdalo cerca de ti y no olvides pedir ayuda si la necesitas',
    tipLabel: 'Cómo guardar tu plan',
    tip: 'Puedes imprimir esta página, guardarla como PDF o compartirla con alguien de confianza cuando te sientas preparadx.',
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
    newPlanConfirm: 'Esto borrará tu plan actual de este dispositivo para que puedas empezar desde cero. Si quieres conservarlo, imprímelo o compártelo antes. ¿Continuar?',
  },
};

export function useCompletedPlanContent() {
  const { language } = useLanguage();
  return language === 'es' ? es : en;
}
