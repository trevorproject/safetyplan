export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'crisis' | 'support' | 'education';
}

export interface WizardStepConfig {
  id: string;
  title: string;
  description: string;
  placeholder?: string;
  options?: string[];
}

export interface LocalizedConfig {
  title: string;
  description: string;
  intro: string;
  resources: ResourceItem[];
  wizardSteps: WizardStepConfig[];
}

export interface AppConfig {
  en: LocalizedConfig;
  es: LocalizedConfig;
  adminPassword: string;
}

export type PlanListField = 'warningSigns' | 'copingStrategies' | 'supports' | 'environment';

export interface SafetyPlanData {
  warningSigns: string[];
  copingStrategies: string[];
  supports: string[];
  environment: string[];
  /** What the user wrote in their own words for each section; the list fields hold the suggestions they picked. */
  answers: Record<PlanListField, string>;
  message: string;
}
