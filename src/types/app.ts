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

export interface AppConfig {
  title: string;
  description: string;
  intro: string;
  resources: ResourceItem[];
  wizardSteps: WizardStepConfig[];
  adminPassword: string;
}

export interface SafetyPlanData {
  warningSigns: string[];
  copingStrategies: string[];
  supportPeople: Array<{ name: string; contact: string }>;
  professionals: string[];
  environment: string[];
  reason: string;
}
