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
      title: 'Warning signs',
      description: 'What tells you that things are getting hard?',
      placeholder: 'Add anything that feels important to notice.',
      options: ['Changes in sleep', 'Feeling isolated', 'Intense mood swings'],
    },
    {
      id: 'coping',
      title: 'Coping strategies',
      description: 'What can help you feel steadier in the moment?',
      placeholder: 'Add your own idea.',
      options: ['Take a slow breath', 'Go for a walk', 'Text a friend'],
    },
    {
      id: 'support',
      title: 'Support people',
      description: 'Who can help you stay connected?',
      placeholder: 'Name and contact information',
      options: ['Trusted friend', 'Family member', 'Counselor'],
    },
    {
      id: 'professionals',
      title: 'Professional help',
      description: 'Who can support you professionally?',
      placeholder: 'Add a clinic, hotline, or counselor.',
      options: ['Therapist', 'Doctor', 'School counselor'],
    },
    {
      id: 'environment',
      title: 'Environment changes',
      description: 'What can make your space feel safer right now?',
      placeholder: 'Add one thing to remove or add.',
      options: ['Turn off sharp objects', 'Move to a shared space', 'Keep a comfort item nearby'],
    },
    {
      id: 'reason',
      title: 'Reason for living',
      description: 'What matters to you, even in a hard moment?',
      placeholder: 'Write something personal and meaningful.',
    },
  ],
  adminPassword: 'safety-plan-2026',
};
