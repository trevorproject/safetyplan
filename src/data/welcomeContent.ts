// Copy for the welcome page. Centralized here so component files stay free of literal strings.

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Resources', to: '/resources' },
  { label: 'Create plan', to: '/wizard' },
];

export const navActions = {
  primary: { label: 'Get Help', to: '/resources' },
  secondary: { label: 'Donate', to: 'https://www.thetrevorproject.org/donate/' },
};

export const introContent = {
  heading: 'Why we believe a safety plan is the right move',
  body: 'A plan is a light in the dark. Watch to see how we help you find your own steady ground when the world gets rough.',
  cta: { label: 'Build your plan', to: '/wizard' },
};

export const heroContent = {
  heading: "Let's plan together",
  body: 'You are not alone in this. Build your own safety plan now or find immediate help.',
  cta: { label: 'Build Safety Plan', to: '/wizard' },
};

export const featureContent = {
  intro:
    'We believe every young person deserves a safe place to rely on. Our work is to make sure you have the tools to cope with any crisis.',
  items: [
    {
      heading: 'Always there to help',
      text: "We're dedicated to ensuring LGBTQ+ young people never feel alone. Our passionate and empathetic counselors are there to provide unconditional support all day, every day - no exceptions. And, we offer a variety of ways for young people to find help so they can chose the method that's best for them.",
    },
    {
      heading: 'All are welcome',
      text: "We embrace uniqueness and welcome every person who reaches out with open ears and open hearts - regardlesss of what they're struggling with.",
    },
  ],
};

export const footerNavLinks = [
  { label: 'Home', to: '/' },
  { label: 'Resources', to: '/resources' },
  { label: 'Create plan', to: '/wizard' },
  { label: 'Donate', to: 'https://www.thetrevorproject.org/donate/' },
  { label: 'Emergency', to: '/resources' },
];

export const footerLegalLinks = [
  { label: 'Privacy policy', to: '/privacy' },
  { label: 'Terms of service', to: '/terms' },
  { label: 'Cookies settings', to: '/cookies' },
];

export const footerCredit = { label: 'The Trevor Project', to: 'https://www.thetrevorproject.org' };
