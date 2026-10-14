import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { formatDate, formatPhoneNumber, formatTime, toLocaleTag, toTelHref, useLocale } from './locale';
import { LanguageProvider } from '../context/LanguageContext';
import { RegionProvider } from '../context/RegionContext';
import { useRegion, REGION_STORAGE_KEY } from '../context/region';
import { useLanguage, LANGUAGE_STORAGE_KEY } from '../context/language';

// Local time, so the day never shifts with the test machine's time zone.
const date = new Date(2026, 2, 5, 14, 30);

beforeEach(() => {
  window.localStorage.clear();
});

describe('toLocaleTag', () => {
  it('combines the language and the region', () => {
    expect(toLocaleTag('en', 'us')).toBe('en-US');
    expect(toLocaleTag('es', 'mx')).toBe('es-MX');
    expect(toLocaleTag('es', 'us')).toBe('es-US');
    expect(toLocaleTag('en', 'mx')).toBe('en-MX');
  });

  it('uses only the language for the global region', () => {
    expect(toLocaleTag('en', 'global')).toBe('en');
    expect(toLocaleTag('es', 'global')).toBe('es');
  });
});

describe('formatDate / formatTime', () => {
  it('uses month-first numeric dates in the US and day-first in Mexico', () => {
    const numeric: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'numeric', year: 'numeric' };
    expect(formatDate(date, 'en-US', numeric)).toBe('3/5/2026');
    expect(formatDate(date, 'es-MX', numeric)).toBe('5/3/2026');
  });

  it('writes long dates in the active language', () => {
    expect(formatDate(date, 'en-US')).toBe('March 5, 2026');
    expect(formatDate(date, 'es-MX')).toBe('5 de marzo de 2026');
  });

  it('formats times for the locale', () => {
    expect(formatTime(date, 'en-US')).toMatch(/^2:30\sPM$/);
    expect(formatTime(date, 'es-MX')).toMatch(/^2:30\sp\.\s?m\.$/);
    expect(formatTime(date, 'es-MX', { hour: 'numeric', minute: '2-digit', hour12: false })).toBe('14:30');
  });

  it('returns an empty string for an invalid date instead of throwing', () => {
    expect(formatDate('not a date', 'en-US')).toBe('');
  });
});

describe('formatPhoneNumber', () => {
  it('formats US numbers as (XXX) XXX-XXXX, with or without +1', () => {
    expect(formatPhoneNumber('8664887386', 'us')).toBe('(866) 488-7386');
    expect(formatPhoneNumber('+1 866-488-7386', 'us')).toBe('(866) 488-7386');
  });

  it('formats Mexican numbers by area code length, with or without +52', () => {
    expect(formatPhoneNumber('5512345678', 'mx')).toBe('55 1234 5678');
    expect(formatPhoneNumber('+52 33 1234 5678', 'mx')).toBe('33 1234 5678');
    expect(formatPhoneNumber('2221234567', 'mx')).toBe('222 123 4567');
  });

  it('leaves short codes and unrecognised numbers unchanged', () => {
    expect(formatPhoneNumber('988', 'us')).toBe('988');
    expect(formatPhoneNumber('911', 'mx')).toBe('911');
    expect(formatPhoneNumber('Text START to 678-678', 'us')).toBe('Text START to 678-678');
  });

  it('leaves every number unchanged in the global region', () => {
    expect(formatPhoneNumber('8664887386', 'global')).toBe('8664887386');
    expect(formatPhoneNumber('+44 20 7946 0958', 'global')).toBe('+44 20 7946 0958');
  });
});

describe('toTelHref', () => {
  it('builds an international tel: link for national numbers', () => {
    expect(toTelHref('(866) 488-7386', 'us')).toBe('tel:+18664887386');
    expect(toTelHref('55 1234 5678', 'mx')).toBe('tel:+525512345678');
  });

  it('keeps short codes as they are', () => {
    expect(toTelHref('988', 'us')).toBe('tel:988');
  });

  it('adds no country code in the global region, keeping a leading +', () => {
    expect(toTelHref('+44 20 7946 0958', 'global')).toBe('tel:+442079460958');
    expect(toTelHref('866 488 7386', 'global')).toBe('tel:8664887386');
  });
});

describe('useLocale', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <LanguageProvider>
      <RegionProvider>{children}</RegionProvider>
    </LanguageProvider>
  );

  it('follows the selected language and region', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
    const { result } = renderHook(
      () => ({ locale: useLocale(), region: useRegion(), language: useLanguage() }),
      { wrapper },
    );
    expect(result.current.locale.locale).toBe('en-US');
    expect(result.current.locale.formatPhoneNumber('8664887386')).toBe('(866) 488-7386');

    act(() => result.current.region.setRegion('mx'));
    expect(result.current.locale.locale).toBe('en-MX');
    expect(result.current.locale.formatPhoneNumber('5512345678')).toBe('55 1234 5678');
    expect(window.localStorage.getItem(REGION_STORAGE_KEY)).toBe('mx');

    act(() => result.current.language.setLanguage('es'));
    expect(result.current.locale.locale).toBe('es-MX');
    expect(result.current.locale.formatDate(date)).toBe('5 de marzo de 2026');

    act(() => result.current.region.setRegion('global'));
    expect(result.current.locale.locale).toBe('es');
    expect(result.current.locale.formatPhoneNumber('5512345678')).toBe('5512345678');
  });
});
