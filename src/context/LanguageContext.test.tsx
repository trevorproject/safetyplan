import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { WelcomePage } from '../pages/WelcomePage';
import { WizardPage } from '../pages/WizardPage';
import { CompletedPlanPage } from '../pages/CompletedPlanPage';
import { localizePlan } from '../data/defaultConfig';
import { savePlan } from '../lib/storage';
import { LANGUAGE_STORAGE_KEY } from './language';
import { renderResponsive, BREAKPOINTS } from '../test/responsive';
import type { SafetyPlanData } from '../types/app';

const plan: SafetyPlanData = {
  warningSigns: ['Crying', 'My own sign'],
  copingStrategies: ['Writing'],
  supports: [],
  environment: [],
  message: 'Hello',
};

// fireEvent rather than userEvent: the desktop dropdown closes on mouseleave, and
// userEvent's simulated pointer movement between the toggle and option trips it.
function switchLanguage(name: 'English' | 'Español', toggleLabel: 'Language' | 'Idioma') {
  fireEvent.click(screen.getByRole('button', { name: toggleLabel }));
  fireEvent.click(screen.getByRole('button', { name }));
}

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
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
  });

  it('restores a previously saved language on load', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
    renderResponsive(<WelcomePage />, BREAKPOINTS.lg);
    expect(screen.getByRole('button', { name: 'Idioma' })).toBeInTheDocument();
  });

  it('carries wizard selections over to the new language without touching custom entries', () => {
    savePlan(plan);
    renderResponsive(<WizardPage />, BREAKPOINTS.lg);
    expect(screen.getByText('Crying, My own sign')).toBeInTheDocument();

    switchLanguage('Español', 'Language');
    expect(screen.getByText('Llorar, My own sign')).toBeInTheDocument();
  });

  it('shows the completed plan in the active language', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
    savePlan(plan);
    renderResponsive(<CompletedPlanPage />, BREAKPOINTS.lg);
    expect(screen.getByText('Llorar')).toBeInTheDocument();
    expect(screen.getByText('Escribir')).toBeInTheDocument();
  });
});

describe('localizePlan', () => {
  it('maps preset options by position in either direction and keeps free text', () => {
    const es = localizePlan(plan, 'es');
    expect(es.warningSigns).toEqual(['Llorar', 'My own sign']);
    expect(es.copingStrategies).toEqual(['Escribir']);
    expect(es.message).toBe('Hello');
    expect(localizePlan(es, 'en')).toEqual(plan);
  });

  it('drops duplicates that collapse onto the same option', () => {
    expect(localizePlan({ ...plan, warningSigns: ['Crying', 'Llorar'] }, 'en').warningSigns).toEqual(['Crying']);
  });
});
