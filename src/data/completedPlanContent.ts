
import { useLanguage } from '../context/language';
import type { SafetyPlanData } from '../types/app';

type SectionField = keyof Pick<SafetyPlanData, 'warningSigns' | 'copingStrategies' | 'supports' | 'environment'>;
interface FinishedPlanSection {
  field: SectionField;
  label: string;
}

export const completedPlanHeroContent = {
  headingLead: 'Here is ',
  headingScript: 'your',
  headingTail: ' plan',
  body: "Keep it close to you and don't forget to ask for help if you need it",
};

export const reminderCardContent = {
  heading: 'A gentle reminder',
  body: 'If you are in immediate danger or feel unsafe, contact emergency support or a crisis lifeline right away.',
  action: { label: 'Crisis Resources', to: '/resources' },
};

export const finishedPlanContent: {
  body: string;
  sections: FinishedPlanSection[];
  notesLabel: string;
  printLabel: string;
  shareLabel: string;
  shareSubject: string;
} = {
  body: 'You can print this page, save it as a PDF, or share it with someone you trust when you feel ready.',
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
};

const en = { completedPlanHeroContent, reminderCardContent, finishedPlanContent };

const es: typeof en = {
  completedPlanHeroContent: {
    headingLead: 'Aquí está ',
    headingScript: 'tu',
    headingTail: ' plan',
    body: 'Guárdalo cerca de ti y no olvides pedir ayuda si la necesitas',
  },
  reminderCardContent: {
    heading: 'Un recordatorio amable',
    body: 'Si estás en peligro inmediato o te sientes en riesgo, contacta a servicios de emergencia o a una línea de crisis de inmediato.',
    action: { label: 'Recursos de crisis', to: '/resources' },
  },
  finishedPlanContent: {
    body: 'Puedes imprimir esta página, guardarla como PDF o compartirla con alguien de confianza cuando te sientas preparade.',
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
  },
};

export function useCompletedPlanContent() {
  const { language } = useLanguage();
  return language === 'es' ? es : en;
}
