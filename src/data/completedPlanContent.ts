// Copy for the completed plan page. Centralized here so component files stay free of literal strings.

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

export const finishedPlanContent = {
  body: 'You can print this page, save it as a PDF, or share it with someone you trust when you feel ready.',
  sections: [
    { field: 'warningSigns', label: 'Warning Signs' },
    { field: 'copingStrategies', label: 'Coping Strategies' },
    { field: 'supports', label: 'Support' },
    { field: 'environment', label: 'Safe Environment' },
  ] as const,
  notesLabel: 'Notes',
  printLabel: 'Print',
  shareLabel: 'Share',
  shareSubject: 'My Safety Plan',
};
