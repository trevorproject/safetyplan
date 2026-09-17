import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from './ThemeContext';
import { useTheme, THEME_STORAGE_KEY } from './theme';

/** Minimal consumer exposing every piece of the theme context for assertions. */
function ThemeProbe() {
  const { theme, toggleTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
      <button onClick={() => setTheme('dark')}>force dark</button>
      <button onClick={() => setTheme('light')}>force light</button>
    </div>
  );
}

function renderProbe() {
  return render(
    <ThemeProvider>
      <ThemeProbe />
    </ThemeProvider>,
  );
}

/** Stub matchMedia so it reports a given prefers-color-scheme answer. */
function stubPrefersDark(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' ? matches : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.classList.remove('dark');
  document.documentElement.style.colorScheme = '';
});

describe('ThemeContext', () => {
  it('defaults to light when nothing is stored and the OS has no dark preference', () => {
    stubPrefersDark(false);
    renderProbe();

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  it('falls back to the OS "prefers-color-scheme: dark" setting when nothing is stored', () => {
    stubPrefersDark(true);
    renderProbe();

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('restores a previously saved theme from localStorage, taking priority over the OS preference', () => {
    stubPrefersDark(true);
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    renderProbe();

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggles the theme, syncing the <html> class, colorScheme and localStorage', async () => {
    const user = userEvent.setup();
    stubPrefersDark(false);
    renderProbe();

    await user.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

    await user.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe('light');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('setTheme sets an explicit theme regardless of the current value', async () => {
    const user = userEvent.setup();
    stubPrefersDark(false);
    renderProbe();

    await user.click(screen.getByRole('button', { name: 'force dark' }));
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');

    // Setting the same theme again is a no-op, not a crash.
    await user.click(screen.getByRole('button', { name: 'force dark' }));
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');

    await user.click(screen.getByRole('button', { name: 'force light' }));
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('useTheme throws when used outside a ThemeProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ThemeProbe />)).toThrow('useTheme must be used within a ThemeProvider');
    consoleError.mockRestore();
  });
});
