import { useLanguage } from '../context/language';

export const adminContent = {
  loginHeading: 'Admin configuration',
  loginBody: 'Enter the shared password to edit the content shown across the app.',
  passwordPlaceholder: 'Password',
  unlockLabel: 'Unlock editor',
  editorHeading: 'Admin configuration',
  editorBody: 'Adjust the content shown across the app.',
  editingLanguageLabel: 'Editing content in:',
  generalHeading: 'General content',
  titleLabel: 'App title',
  descriptionLabel: 'App description',
  introLabel: 'Welcome intro',
  resourcesHeading: 'Resources',
  addResourceLabel: 'Add resource',
  categories: {
    crisis: 'Crisis',
    support: 'Support',
    education: 'Education',
  },
  wizardStepsHeading: 'Wizard steps',
  addStepLabel: 'Add step',
  summary: (resources: number, steps: number) => `${resources} resources • ${steps} wizard steps`,
  newResourceTitle: 'New resource',
  newResourceDescription: 'Add a description',
  newResourceUrl: 'https://example.com',
  newStepTitle: 'New step',
  newStepDescription: 'Add a description',
  newStepPlaceholder: 'Add guidance',
  newStepOption: 'Option 1',
};

const en = adminContent;

const es: typeof en = {
  loginHeading: 'Configuración del administrador',
  loginBody: 'Ingresa la contraseña compartida para editar el contenido que se muestra en toda la aplicación.',
  passwordPlaceholder: 'Contraseña',
  unlockLabel: 'Desbloquear editor',
  editorHeading: 'Configuración del administrador',
  editorBody: 'Ajusta el contenido que se muestra en toda la aplicación.',
  editingLanguageLabel: 'Editando contenido en:',
  generalHeading: 'Contenido general',
  titleLabel: 'Título de la app',
  descriptionLabel: 'Descripción de la app',
  introLabel: 'Introducción de bienvenida',
  resourcesHeading: 'Recursos',
  addResourceLabel: 'Agregar recurso',
  categories: {
    crisis: 'Crisis',
    support: 'Apoyo',
    education: 'Educación',
  },
  wizardStepsHeading: 'Pasos del asistente',
  addStepLabel: 'Agregar paso',
  summary: (resources: number, steps: number) => `${resources} recursos • ${steps} pasos del asistente`,
  newResourceTitle: 'Nuevo recurso',
  newResourceDescription: 'Agrega una descripción',
  newResourceUrl: 'https://example.com',
  newStepTitle: 'Nuevo paso',
  newStepDescription: 'Agrega una descripción',
  newStepPlaceholder: 'Agrega una guía',
  newStepOption: 'Opción 1',
};

export function useAdminContent() {
  const { language } = useLanguage();
  return language === 'es' ? es : en;
}
