import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminPage } from './AdminPage';
import { defaultConfig } from '../data/defaultConfig';
import { LANGUAGE_STORAGE_KEY } from '../context/language';
import {
  atEachBreakpoint,
  renderResponsive,
  getClassSet,
  expectAdaptsAt,
  expectHasMaxWidthContainer,
  expectResponsiveBaseline,
  BREAKPOINTS,
} from '../test/responsive';

beforeEach(() => {
  window.localStorage.clear();
});

async function unlock() {
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText('Password'), defaultConfig.adminPassword);
  await user.click(screen.getByRole('button', { name: 'Unlock editor' }));
  return user;
}

describe('AdminPage responsiveness', () => {
  it('renders the password gate, centered and overflow-safe, at every screen width', () => {
    atEachBreakpoint(<AdminPage />, ({ container, width }) => {
      expect(screen.getByPlaceholderText('Password'), `gate missing at ${width}px`).toBeInTheDocument();
      expectHasMaxWidthContainer(container);
      expectResponsiveBaseline(container);
    });
  });

  it('lays the editor out in one column on mobile and two from lg once unlocked', async () => {
    const { container } = renderResponsive(<AdminPage />, BREAKPOINTS.lg);
    await unlock();
    expect(screen.getByRole('heading', { name: 'General content' })).toBeInTheDocument();
    const classes = getClassSet(container);
    expect(classes.has('lg:grid-cols-2')).toBe(true);
    expect(classes.has('sm:flex-row')).toBe(true);
    expectAdaptsAt(container, ['sm', 'lg']);
  });

  it('keeps the unlocked editor overflow-safe on the narrowest phone', async () => {
    const { container } = renderResponsive(<AdminPage />, BREAKPOINTS.xs);
    await unlock();
    expectResponsiveBaseline(container);
  });
});

describe('AdminPage languages', () => {
  it('shows the password gate in Spanish', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
    renderResponsive(<AdminPage />, BREAKPOINTS.lg);
    expect(screen.getByRole('heading', { name: 'Configuración del administrador' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Desbloquear editor' })).toBeInTheDocument();
  });

  it('shows the editor labels and the Spanish content once unlocked in Spanish', async () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
    renderResponsive(<AdminPage />, BREAKPOINTS.lg);
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Contraseña'), defaultConfig.adminPassword);
    await user.click(screen.getByRole('button', { name: 'Desbloquear editor' }));

    expect(screen.getByRole('heading', { name: 'Contenido general' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pasos del asistente' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Agregar recurso' })).toBeInTheDocument();
    expect(screen.getByLabelText('Título de la app')).toHaveValue(defaultConfig.es.title);
    expect(screen.getAllByRole('option', { name: 'Apoyo' }).length).toBeGreaterThan(0);
  });

  it('switches the editor between languages and edits each one separately', async () => {
    renderResponsive(<AdminPage />, BREAKPOINTS.lg);
    const user = await unlock();
    expect(screen.getByLabelText('App title')).toHaveValue(defaultConfig.en.title);

    await user.click(screen.getByRole('button', { name: 'Español' }));
    expect(screen.getByRole('button', { name: 'Español' })).toHaveAttribute('aria-pressed', 'true');
    const spanishTitle = screen.getByLabelText('Título de la app');
    expect(spanishTitle).toHaveValue(defaultConfig.es.title);

    await user.clear(spanishTitle);
    await user.type(spanishTitle, 'Mi plan');

    await user.click(screen.getByRole('button', { name: 'English' }));
    expect(screen.getByLabelText('App title')).toHaveValue(defaultConfig.en.title);

    await user.click(screen.getByRole('button', { name: 'Español' }));
    expect(screen.getByLabelText('Título de la app')).toHaveValue('Mi plan');
  });

  it('shows the content summary in the active language', async () => {
    renderResponsive(<AdminPage />, BREAKPOINTS.lg);
    const user = await unlock();
    const { resources, wizardSteps } = defaultConfig.en;
    expect(screen.getByText(`${resources.length} resources • ${wizardSteps.length} wizard steps`)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Español' }));
    expect(screen.getByText(`${resources.length} recursos • ${wizardSteps.length} pasos del asistente`)).toBeInTheDocument();
  });
});
