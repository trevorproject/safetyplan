import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { LANGUAGE_OPTIONS, LANGUAGE_STORAGE_KEY, loadStoredLanguage, useLanguage } from './language';

function mockBrowserLanguage(value: string) {
  vi.spyOn(window.navigator, 'language', 'get').mockReturnValue(value);
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('loadStoredLanguage', () => {
  it('returns a previously saved language over the browser setting', () => {
    mockBrowserLanguage('en-US');
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
    expect(loadStoredLanguage()).toBe('es');

    mockBrowserLanguage('es-MX');
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
    expect(loadStoredLanguage()).toBe('en');
  });

  it('falls back to Spanish for any Spanish browser locale', () => {
    for (const locale of ['es', 'es-MX', 'es-ES', 'ES-us']) {
      mockBrowserLanguage(locale);
      expect(loadStoredLanguage(), locale).toBe('es');
    }
  });

  it('defaults to English for any other browser locale', () => {
    for (const locale of ['en-US', 'fr-FR', 'pt-BR', '']) {
      mockBrowserLanguage(locale);
      expect(loadStoredLanguage(), locale || '(empty)').toBe('en');
    }
  });

  it('ignores an unsupported saved value and uses the browser setting instead', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr');
    mockBrowserLanguage('es-MX');
    expect(loadStoredLanguage()).toBe('es');
  });
});

describe('LANGUAGE_OPTIONS', () => {
  it('offers English and Spanish, each labelled in its own language', () => {
    expect(LANGUAGE_OPTIONS).toEqual([
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
    ]);
  });
});

describe('useLanguage without a provider', () => {
  it('defaults to English with a setter that is a safe no-op', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.language).toBe('en');

    act(() => result.current.setLanguage('es'));
    expect(result.current.language).toBe('en');
  });
});
