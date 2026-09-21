
import { useLanguage } from '../context/language';

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Resources', to: '/resources' },
  { label: 'Create plan', to: '/wizard' },
];

export const navActions = {
  primary: { label: 'Get Help', to: '/resources' },
  secondary: { label: 'Donate', to: 'https://www.thetrevorproject.org/donate/' },
};

export const navLanguageLabel = 'Language';
export const primaryNavAriaLabel = 'Primary';
export const toggleMenuAriaLabel = 'Toggle menu';

export const introContent = {
  heading: 'Why we believe a safety plan is the right move',
  headingEmphasis: 'safety plan',
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
  { label: 'Get Help', to: '/resources' },
  { label: 'Home', to: '/' },
  { label: 'Resources', to: '/resources' },
  { label: 'Create plan', to: '/wizard' },
  { label: 'Donate', to: 'https://www.thetrevorproject.org/donate/' },
];

export const footerLegalLinks = [
  { label: 'Privacy policy', to: '/privacy' },
  { label: 'Terms of service', to: '/terms' },
];

export const footerCredit = { label: 'The Trevor Project', to: 'https://www.thetrevorproject.org' };
export const footerNavAriaLabel = 'Footer';

const en = {
  navLinks,
  navActions,
  navLanguageLabel,
  primaryNavAriaLabel,
  toggleMenuAriaLabel,
  introContent,
  heroContent,
  featureContent,
  footerNavLinks,
  footerLegalLinks,
  footerCredit,
  footerNavAriaLabel,
};

const es: typeof en = {
  navLinks: [
    { label: 'Inicio', to: '/' },
    { label: 'Recursos', to: '/resources' },
    { label: 'Crear plan', to: '/wizard' },
  ],
  navActions: {
    primary: { label: 'Obtener ayuda', to: '/resources' },
    secondary: { label: 'Donar', to: 'https://www.thetrevorproject.org/donate/' },
  },
  navLanguageLabel: 'Idioma',
  primaryNavAriaLabel: 'Principal',
  toggleMenuAriaLabel: 'Alternar menú',
  introContent: {
    heading: 'Creemos que un plan de seguridad es la decisión correcta',
    headingEmphasis: 'plan de seguridad',
    body: 'Un plan es una luz en la oscuridad. Descubre cómo te ayudamos a encontrar tu propio equilibrio cuando el mundo se pone difícil.',
    cta: { label: 'Crea tu plan', to: '/wizard' },
  },
  heroContent: {
    heading: 'Planeemos juntos',
    body: 'No estás por tu cuenta. Crea tu propio plan de seguridad ahora o encuentra ayuda inmediata.',
    cta: { label: 'Crear plan de seguridad', to: '/wizard' },
  },
  featureContent: {
    intro:
      'Creemos que cada joven merece un lugar seguro en el cual apoyarse. Nuestro trabajo es asegurarnos de que tengas las herramientas para afrontar cualquier crisis.',
    items: [
      {
        heading: 'Siempre aquí para ayudar',
        text: 'Nos dedicamos a garantizar que las personas jóvenes LGBTQ+ nunca se sientan solas. Nuestro personal de consejería, apasionado y empático, brinda apoyo incondicional todo el día, todos los días, sin excepciones. Además, ofrecemos distintas formas de encontrar ayuda para que puedas elegir el método que mejor te funcione.',
      },
      {
        heading: 'Todas las personas son bienvenidas',
        text: 'Celebramos la individualidad y recibimos con oídos y corazones abiertos a cada persona que se acerca, sin importar por lo que esté pasando.',
      },
    ],
  },
  footerNavLinks: [
    { label: 'Obtener ayuda', to: '/resources' },
    { label: 'Inicio', to: '/' },
    { label: 'Recursos', to: '/resources' },
    { label: 'Crear plan', to: '/wizard' },
    { label: 'Donar', to: 'https://www.thetrevorproject.org/donate/' },
  ],
  footerLegalLinks: [
    { label: 'Política de privacidad', to: '/privacy' },
    { label: 'Términos de servicio', to: '/terms' },
  ],
  footerCredit: { label: 'The Trevor Project', to: 'https://www.thetrevorproject.org' },
  footerNavAriaLabel: 'Pie de página',
};

export function useWelcomeContent() {
  const { language } = useLanguage();
  return language === 'es' ? es : en;
}
