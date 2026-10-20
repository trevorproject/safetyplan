import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent, screen, within } from '@testing-library/react';
import { WelcomePage } from '../pages/WelcomePage';
import { ResourcesPage } from '../pages/ResourcesPage';
import { WizardPage } from '../pages/WizardPage';
import { CompletedPlanPage } from '../pages/CompletedPlanPage';
import { SpeakableSection } from '../components/accessibility/SpeakableSection';
import { useAccessibility } from './accessibility';
import { loadPlan, savePlan } from '../lib/storage';
import { LANGUAGE_STORAGE_KEY } from './language';
import { renderResponsive, BREAKPOINTS } from '../test/responsive';
import type { SafetyPlanData } from '../types/app';

const plan: SafetyPlanData = {
  warningSigns: ['Crying', 'My own sign'],
  copingStrategies: ['Writing'],
  supports: [],
  environment: [],
  answers: { warningSigns: '', copingStrategies: '', supports: '', environment: '' },
  message: 'Hello',
};

// fireEvent rather than userEvent: the desktop dropdown closes on mouseleave, and
// userEvent's simulated pointer movement between the toggle and option trips it.
function switchLanguage(name: 'English' | 'Español', toggleLabel: 'Language' | 'Idioma') {
  fireEvent.click(screen.getByRole('button', { name: toggleLabel }));
  fireEvent.click(screen.getByRole('button', { name }));
}

let descriptionMeta: HTMLMetaElement;

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  descriptionMeta = document.createElement('meta');
  descriptionMeta.name = 'description';
  document.head.appendChild(descriptionMeta);
});

afterEach(() => {
  descriptionMeta.remove();
});

describe('LanguageProvider', () => {
  it('switches page content to Spanish and back, updating <html lang> and persisting the choice', () => {
    renderResponsive(<WelcomePage />, BREAKPOINTS.lg);
    expect(screen.getByRole('heading', { level: 1, name: /safety plan/i })).toBeInTheDocument();

    switchLanguage('Español', 'Language');
    expect(screen.getByRole('heading', { level: 1, name: /plan de seguridad/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Cambiar a modo oscuro' }).length).toBeGreaterThan(0);
    expect(document.documentElement.lang).toBe('es');
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es');

    switchLanguage('English', 'Idioma');
    expect(screen.getAllByRole('button', { name: 'Switch to dark mode' }).length).toBeGreaterThan(0);
    expect(document.documentElement.lang).toBe('en');
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
  });

  it('translates the browser tab title and meta description', () => {
    renderResponsive(<WelcomePage />, BREAKPOINTS.lg);
    expect(document.title).toBe('Safety Plan - The Trevor Project');
    expect(descriptionMeta.content).toBe('The Trevor Project Safety Plan Page');

    switchLanguage('Español', 'Language');
    expect(document.title).toBe('Plan de Seguridad - The Trevor Project');
    expect(descriptionMeta.content).toBe('Página del Plan de Seguridad de The Trevor Project');
  });

  it('restores a previously saved language on load', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
    renderResponsive(<WelcomePage />, BREAKPOINTS.lg);
    expect(screen.getByRole('button', { name: 'Idioma' })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('es');
  });

  it('marks the active language as pressed in the desktop dropdown', () => {
    renderResponsive(<WelcomePage />, BREAKPOINTS.lg);
    fireEvent.click(screen.getByRole('button', { name: 'Language' }));
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Español' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('switches language from the mobile menu', () => {
    renderResponsive(<WelcomePage />, BREAKPOINTS.mobile);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));
    fireEvent.click(screen.getByRole('button', { name: 'Español' }));

    const mobileNav = screen.getByRole('button', { name: 'Alternar menú' }).parentElement!;
    expect(within(mobileNav).getByText('Idioma')).toBeInTheDocument();
    expect(within(mobileNav).getByRole('button', { name: 'Español' })).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement.lang).toBe('es');
  });
});

describe('pages in Spanish', () => {
  beforeEach(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
  });

  it('renders the welcome page, navbar and footer in Spanish', () => {
    renderResponsive(<WelcomePage />, BREAKPOINTS.lg);
    expect(screen.getByRole('heading', { name: 'Planeemos juntos' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Obtener ayuda' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('navigation', { name: 'Pie de página' })).toBeInTheDocument();
    expect(screen.queryByText("Let's plan together")).not.toBeInTheDocument();
  });

  it('renders the resources page in Spanish', () => {
    renderResponsive(<ResourcesPage />, BREAKPOINTS.lg);
    expect(screen.getByRole('heading', { name: 'Ayuda cerca de ti' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Recursos gratuitos' })).toBeInTheDocument();
  });

  it('renders the wizard, including its first step, in Spanish', () => {
    renderResponsive(<WizardPage />, BREAKPOINTS.lg);
    expect(screen.getByRole('heading', { name: 'Crea tu plan' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Señales de alerta' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Progreso del plan de seguridad' })).toBeInTheDocument();
  });

  it('renders the completed plan headings and saved answers in Spanish', () => {
    savePlan(plan);
    renderResponsive(<CompletedPlanPage />, BREAKPOINTS.lg);
    expect(screen.getByRole('heading', { name: 'Un recordatorio amable' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Señales de alerta' })).toBeInTheDocument();
    expect(screen.getByText('Llorar')).toBeInTheDocument();
    expect(screen.getByText('Escribir')).toBeInTheDocument();
    expect(screen.getByText('My own sign')).toBeInTheDocument();
  });
});

describe('wizard answers across a language switch', () => {
  it('translates selected options without touching custom entries', () => {
    savePlan(plan);
    renderResponsive(<WizardPage />, BREAKPOINTS.lg);
    expect(screen.getByRole('button', { name: 'Crying' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'My own sign' })).toHaveAttribute('aria-pressed', 'true');

    switchLanguage('Español', 'Language');
    expect(screen.getByRole('button', { name: 'Llorar' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'My own sign' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps what the user wrote exactly as typed', () => {
    savePlan({ ...plan, answers: { ...plan.answers, warningSigns: 'I go quiet' } });
    renderResponsive(<WizardPage />, BREAKPOINTS.lg);

    switchLanguage('Español', 'Language');
    expect(screen.getByRole('textbox', { name: 'Tu respuesta' })).toHaveValue('I go quiet');
    expect(loadPlan()?.answers.warningSigns).toBe('I go quiet');
  });

  it('saves the translated answers, so later steps show them as selected', () => {
    savePlan(plan);
    renderResponsive(<WizardPage />, BREAKPOINTS.lg);

    switchLanguage('Español', 'Language');
    expect(loadPlan()?.copingStrategies).toEqual(['Escribir']);

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(screen.getByRole('button', { name: 'Escribir' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('lets the user unselect an answer chosen in the other language', () => {
    savePlan({ ...plan, warningSigns: ['Crying'] });
    renderResponsive(<WizardPage />, BREAKPOINTS.lg);
    switchLanguage('Español', 'Language');
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    fireEvent.click(screen.getByRole('button', { name: 'Escribir' }));
    expect(screen.getByRole('button', { name: 'Escribir' })).toHaveAttribute('aria-pressed', 'false');
    expect(loadPlan()?.copingStrategies).toEqual([]);
  });
});

describe('read-aloud language', () => {
  function ReadAllButton() {
    const { speakAll } = useAccessibility();
    return (
      <button type="button" onClick={speakAll}>
        read
      </button>
    );
  }

  function renderSpeakable() {
    renderResponsive(
      <>
        <SpeakableSection id="sample">
          <h2>Texto</h2>
        </SpeakableSection>
        <ReadAllButton />
      </>,
      BREAKPOINTS.lg,
    );
  }

  it.each(['en', 'es'] as const)('reads text aloud with a %s voice when that language is active', (language) => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    const speak = vi.spyOn(window.speechSynthesis, 'speak');
    renderSpeakable();

    fireEvent.click(screen.getByRole('button', { name: 'read' }));
    expect(speak).toHaveBeenCalledTimes(1);
    expect(speak.mock.calls[0][0].lang).toBe(language);
  });
});
