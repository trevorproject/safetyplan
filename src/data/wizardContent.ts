// Copy for the wizard page. Centralized here so component files stay free of literal strings.

export const wizardHeroContent = {
  heading: 'Your safety plan',
  body: 'A clear path forward whether you need help right now or want to prepare for any hard days.',
};

export const howItWorksContent = {
  heading: 'How the plan works',
  body: 'A few simple questions to build something solid and true.',
  cards: [
    {
      stepId: 'warning-signs',
      heading: 'Name the hard moments',
      text: 'We ask what comes before the darkness. The places. The feelings.',
      linkLabel: 'Warning Signs',
    },
    {
      stepId: 'coping',
      heading: 'Find what steadies you',
      text: 'You tell us what action quiets the noise. A walk. A song.',
      linkLabel: 'Coping',
    },
    {
      stepId: 'supports',
      heading: 'Choose your people',
      text: 'Select the trusted voices you can call when the weight is heavy.',
      linkLabel: 'Supports',
    },
    {
      stepId: 'environment',
      heading: 'Build a safe space',
      text: 'Define the physical place or mental image that feels like shelter.',
      linkLabel: 'Environment',
    },
  ],
};

export const buildPlanContent = {
  heading: 'Build your plan',
  body: 'Answer honestly. There are no wrong words here.',
  otherLabel: 'Other...',
  consentLabel: 'I understand this is not emergency care',
  submitLabel: 'Build your plan',
  continueLabel: 'Continue',
  backLabel: 'Back',
  restartLabel: 'Restart',
  selectPlaceholder: 'Select...',
};
