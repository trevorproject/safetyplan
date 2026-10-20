import { LANGUAGE_OPTIONS, useLanguage, type Language } from '../context/language';
import type { AppConfig, LocalizedConfig, PlanListField, SafetyPlanData } from '../types/app';

const en: LocalizedConfig = {
  title: 'Safety Plan',
  description: 'A private, supportive guide for creating a personalized safety plan.',
  intro:
    'This space is here to help you build a plan that feels steady, personal, and safe to use during hard moments.',
  resources: [
    {
      id: 'trevor',
      title: 'The Trevor Project',
      description: 'Confidential crisis support for LGBTQ+ young people.',
      url: 'https://www.thetrevorproject.org/get-help/',
      category: 'crisis',
    },
    {
      id: 'crisis-text',
      title: 'Crisis Text Line',
      description: 'Text HOME to 741741 for free, 24/7 support.',
      url: 'https://www.crisistextline.org/',
      category: 'crisis',
    },
    {
      id: 'suicide-prevention',
      title: '988 Suicide & Crisis Lifeline',
      description: 'Call or text 988 for immediate support in the United States.',
      url: 'https://988lifeline.org/',
      category: 'crisis',
    },
    {
      id: 'support-group',
      title: 'Local LGBTQ+ community support',
      description: 'Look for welcoming support groups in your area.',
      url: 'https://www.lgbtcenter.org/',
      category: 'support',
    },
  ],
  wizardSteps: [
    {
      id: 'warning-signs',
      title: 'Warning Signs',
      description: 'What are the things you think, feel or do when the times get rough?',
      placeholder: 'Write it in your own words...',
      options: ['Crying', 'Self Harm', 'Intrusive thoughts', 'Not eating', 'Shaking', 'Hopelessness', 'Heart Racing', 'Isolation'],
    },
    {
      id: 'coping',
      title: 'Coping',
      description: 'What makes you feel better when the warning signs appear?',
      placeholder: 'Write it in your own words...',
      options: ['Listening to music', 'Showering', 'Writing', 'Breathing', 'Drawing', 'Speaking to someone', 'Sleeping'],
    },
    {
      id: 'supports',
      title: 'Supports',
      description: 'Who are you comfortable talking to about what you are going through?',
      placeholder: 'Write it in your own words...',
      options: ['Friend', 'Mom/Dad', 'Therapist', 'Partner', 'Sibling', 'Counselor', 'Psychiatrist', 'Lifeline'],
    },
    {
      id: 'environment',
      title: 'Safer Environment',
      description: 'What can be done to make your surroundings safer for you?',
      placeholder: 'Write it in your own words...',
      options: ['Remove sharp objects', 'Remove fire ignition devices', 'Remove medications', 'Stay away from heights', 'Stay away from heavy machinery'],
    },
    {
      id: 'message',
      title: 'Share anything you want',
      description: 'Write anything that might make you safer.',
      placeholder: 'Type your message...',
    },
  ],
};

const es: LocalizedConfig = {
  title: 'Plan de Seguridad',
  description: 'Una guía privada y de apoyo para crear un plan de seguridad personalizado.',
  intro:
    'Este espacio está aquí para ayudarte a construir un plan que se sienta estable, personal y seguro de usar durante los momentos difíciles.',
  resources: [
    {
      id: 'trevor',
      title: 'The Trevor Project',
      description: 'Apoyo confidencial en crisis para jóvenes LGBTQ+.',
      url: 'https://www.thetrevorproject.org/get-help/',
      category: 'crisis',
    },
    {
      id: 'crisis-text',
      title: 'Línea de Texto de Crisis',
      description: 'Envía HOME al 741741 para recibir apoyo gratuito las 24 horas, los 7 días de la semana.',
      url: 'https://www.crisistextline.org/',
      category: 'crisis',
    },
    {
      id: 'suicide-prevention',
      title: 'Línea 988 de Prevención del Suicidio y Crisis',
      description: 'Llama o envía un mensaje de texto al 988 para recibir apoyo inmediato en Estados Unidos.',
      url: 'https://988lifeline.org/',
      category: 'crisis',
    },
    {
      id: 'support-group',
      title: 'Apoyo comunitario LGBTQ+ local',
      description: 'Busca grupos de apoyo acogedores en tu área.',
      url: 'https://www.lgbtcenter.org/',
      category: 'support',
    },
  ],
  wizardSteps: [
    {
      id: 'warning-signs',
      title: 'Señales de alerta',
      description: '¿Qué piensas, sientes o haces cuando los momentos se ponen difíciles?',
      placeholder: 'Escríbelo con tus propias palabras...',
      options: ['Llorar', 'Autolesión', 'Pensamientos intrusivos', 'No comer', 'Temblores', 'Desesperanza', 'Taquicardia', 'Aislamiento'],
    },
    {
      id: 'coping',
      title: 'Afrontamiento',
      description: '¿Qué te hace sentir mejor cuando aparecen las señales de alerta?',
      placeholder: 'Escríbelo con tus propias palabras...',
      options: ['Escuchar música', 'Bañarte', 'Escribir', 'Respirar', 'Dibujar', 'Hablar con alguien', 'Dormir'],
    },
    {
      id: 'supports',
      title: 'Apoyos',
      description: '¿Con quién te sientes cómodo o cómoda hablando sobre lo que estás viviendo?',
      placeholder: 'Escríbelo con tus propias palabras...',
      options: ['Amigue', 'Mamá/Papá', 'Terapeuta', 'Pareja', 'Hermane', 'Consejere', 'Psiquiatra', 'Línea de ayuda'],
    },
    {
      id: 'environment',
      title: 'Entorno más seguro',
      description: '¿Qué se puede hacer para que tu entorno sea más seguro para ti?',
      placeholder: 'Escríbelo con tus propias palabras...',
      options: ['Quitar objetos punzocortantes', 'Quitar encendedores de fuego', 'Quitar medicamentos', 'Mantenerte alejade de alturas', 'Mantenerte alejade de maquinaria pesada'],
    },
    {
      id: 'message',
      title: 'Comparte lo que quieras',
      description: 'Escribe cualquier cosa que pueda ayudarte a estar más segure.',
      placeholder: 'Escribe tu mensaje...',
    },
  ],
};

export const defaultConfig: AppConfig = { en, es, adminPassword: 'safety-plan-2026' };

export function useDefaultConfig(): LocalizedConfig {
  const { language } = useLanguage();
  return defaultConfig[language];
}

export const PLAN_FIELD_STEP_IDS: Record<PlanListField, string> = {
  warningSigns: 'warning-signs',
  copingStrategies: 'coping',
  supports: 'supports',
  environment: 'environment',
};

function stepOptions(language: Language, stepId: string): string[] {
  return defaultConfig[language].wizardSteps.find((step) => step.id === stepId)?.options ?? [];
}

/**
 * The plan stores the option labels the user picked, so a language switch would
 * leave earlier answers in the old language. Preset options are matched by their
 * position in each language's list; anything the user typed is kept as-is.
 */
function translateOption(value: string, stepId: string, target: Language): string {
  const targetOptions = stepOptions(target, stepId);
  for (const { code } of LANGUAGE_OPTIONS) {
    const index = stepOptions(code, stepId).indexOf(value);
    if (index !== -1 && targetOptions[index]) return targetOptions[index];
  }
  return value;
}

export const emptyAnswers: Record<PlanListField, string> = {
  warningSigns: '',
  copingStrategies: '',
  supports: '',
  environment: '',
};

export function localizePlan(plan: SafetyPlanData, language: Language): SafetyPlanData {
  const localized = { ...plan, answers: { ...emptyAnswers, ...plan.answers } };
  for (const [field, stepId] of Object.entries(PLAN_FIELD_STEP_IDS) as [PlanListField, string][]) {
    localized[field] = Array.from(new Set((plan[field] ?? []).map((value) => translateOption(value, stepId, language))));
  }
  return localized;
}
