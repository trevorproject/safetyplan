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

export interface SafetyPlanData {
  warningSigns: string[];
  copingStrategies: string[];
  supports: string[];
  environment: string[];
  message: string;
}
