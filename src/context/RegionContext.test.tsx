import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, screen, within } from '@testing-library/react';
import { WelcomePage } from '../pages/WelcomePage';
import { REGION_STORAGE_KEY } from './region';
import { LANGUAGE_STORAGE_KEY } from './language';
import { renderResponsive, BREAKPOINTS } from '../test/responsive';

// fireEvent for the same reason as the language tests: the desktop dropdown
// closes on mouseleave.
function pickRegion(toggleLabel: 'Region' | 'Región', name: string) {
  fireEvent.click(screen.getByRole('button', { name: toggleLabel }));
  fireEvent.click(screen.getByRole('button', { name }));
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('Region selector (desktop navbar)', () => {
  it('shows the United States as selected by default', () => {
    renderResponsive(<WelcomePage />, BREAKPOINTS.xl);
    fireEvent.click(screen.getByRole('button', { name: 'Region' }));
    expect(screen.getByRole('button', { name: 'United States' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Mexico' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Global' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('switches to Global and saves the choice', () => {
    renderResponsive(<WelcomePage />, BREAKPOINTS.xl);
    pickRegion('Region', 'Global');
    expect(window.localStorage.getItem(REGION_STORAGE_KEY)).toBe('global');

    fireEvent.click(screen.getByRole('button', { name: 'Region' }));
    expect(screen.getByRole('button', { name: 'Global' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'United States' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('switches to Mexico, closes the dropdown and saves the choice', () => {
    renderResponsive(<WelcomePage />, BREAKPOINTS.xl);
    pickRegion('Region', 'Mexico');
    expect(screen.queryByRole('button', { name: 'Mexico' })).not.toBeInTheDocument();
    expect(window.localStorage.getItem(REGION_STORAGE_KEY)).toBe('mx');

    fireEvent.click(screen.getByRole('button', { name: 'Region' }));
    expect(screen.getByRole('button', { name: 'Mexico' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('restores a saved region on load', () => {
    window.localStorage.setItem(REGION_STORAGE_KEY, 'mx');
    renderResponsive(<WelcomePage />, BREAKPOINTS.xl);
    fireEvent.click(screen.getByRole('button', { name: 'Region' }));
    expect(screen.getByRole('button', { name: 'Mexico' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('is independent of the language: Spanish labels, region kept', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
    window.localStorage.setItem(REGION_STORAGE_KEY, 'us');
    renderResponsive(<WelcomePage />, BREAKPOINTS.xl);
    fireEvent.click(screen.getByRole('button', { name: 'Región' }));
    expect(screen.getByRole('button', { name: 'Estados Unidos' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'México' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Global' })).toHaveAttribute('aria-pressed', 'false');
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es');
  });

  it('opening one dropdown does not open the other', () => {
    renderResponsive(<WelcomePage />, BREAKPOINTS.xl);
    fireEvent.click(screen.getByRole('button', { name: 'Region' }));
    expect(screen.getByRole('button', { name: 'Region' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Language' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: 'Español' })).not.toBeInTheDocument();
  });
});

describe('Region selector (mobile menu)', () => {
  it('lists all regions and switches without closing the menu', () => {
    renderResponsive(<WelcomePage />, BREAKPOINTS.mobile);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));
    const menu = screen.getAllByRole('navigation', { name: 'Primary' }).at(-1)!;
    expect(within(menu).getByText('Region')).toBeInTheDocument();
    expect(within(menu).getByRole('button', { name: 'Global' })).toBeInTheDocument();

    fireEvent.click(within(menu).getByRole('button', { name: 'Mexico' }));
    expect(within(menu).getByRole('button', { name: 'Mexico' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(menu).getByRole('button', { name: 'United States' })).toHaveAttribute('aria-pressed', 'false');
    expect(window.localStorage.getItem(REGION_STORAGE_KEY)).toBe('mx');
  });
});
