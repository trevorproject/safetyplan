import type { AppConfig } from '../types/app';

export const defaultConfig: AppConfig = {
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
      placeholder: 'Add your own',
      options: ['Crying', 'Self Harm', 'Intrusive thoughts', 'Not eating', 'Shaking', 'Hopelessness', 'Heart Racing', 'Isolation'],
    },
    {
      id: 'coping',
      title: 'Coping',
      description: 'What makes you feel better when the warning signs appear?',
      placeholder: 'Add your own',
      options: ['Listening to music', 'Showering', 'Writing', 'Breathing', 'Drawing', 'Speaking to someone', 'Sleeping'],
    },
    {
      id: 'supports',
      title: 'Supports',
      description: 'Who are you comfortable talking to about what you are going through?',
      placeholder: 'Add your own',
      options: ['Friend', 'Mom/Dad', 'Therapist', 'Partner', 'Sibling', 'Counselor', 'Psychiatrist', 'Lifeline'],
    },
    {
      id: 'environment',
      title: 'Safer Environment',
      description: 'What can be done to make your surroundings safer for you?',
      placeholder: 'Add your own',
      options: ['Remove sharp objects', 'Remove fire ignition devices', 'Remove medications', 'Stay away from heights', 'Stay away from heavy machinery'],
    },
    {
      id: 'message',
      title: 'Share anything you want',
      description: 'Write anything that might make you safer.',
      placeholder: 'Type your message...',
    },
  ],
  adminPassword: 'safety-plan-2026',
};
