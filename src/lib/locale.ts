import { useMemo } from 'react';
import { useLanguage, type Language } from '../context/language';
import { useRegion, type Region } from '../context/region';

/**
 * Language and region are chosen independently (e.g. Spanish in the United
 * States), so the locale used for formatting combines both: `es-US`, `en-MX`...
 * `global` has no country, so only the language is used (`en`, `es`).
 */
export function toLocaleTag(language: Language, region: Region): string {
  if (region === 'global') return language;
  return `${language}-${region.toUpperCase()}`;
}

export function formatDate(
  value: Date | string | number,
  locale: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'long' },
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatTime(
  value: Date | string | number,
  locale: string,
  options: Intl.DateTimeFormatOptions = { timeStyle: 'short' },
): string {
  return formatDate(value, locale, options);
}

const COUNTRY_CODE: Record<Exclude<Region, 'global'>, string> = { us: '1', mx: '52' };

// Mexico City, Guadalajara and Monterrey use 2-digit area codes; the rest of
// the country uses 3 digits. Both add up to 10 digits.
const MX_TWO_DIGIT_AREA_CODES = ['55', '56', '33', '81'];

/**
 * Formats a phone number the way it is written in the region:
 * US `(555) 123-4567`, MX `55 1234 5678` / `222 123 4567`.
 * Short codes (988, 911, text lines), anything that is not a national
 * number, and every number in the `global` region (no single format applies)
 * are returned unchanged so nothing is ever lost or broken.
 */
export function formatPhoneNumber(value: string, region: Region): string {
  if (region === 'global') return value;
  let digits = value.replace(/\D/g, '');
  const countryCode = COUNTRY_CODE[region];
  if (digits.length === 10 + countryCode.length && digits.startsWith(countryCode)) {
    digits = digits.slice(countryCode.length);
  }
  if (digits.length !== 10) return value;

  if (region === 'us') {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (MX_TWO_DIGIT_AREA_CODES.includes(digits.slice(0, 2))) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

/**
 * `tel:` href in international format, valid whichever region is selected.
 * In `global` the country is unknown, so a leading `+` is kept and nothing is
 * added.
 */
export function toTelHref(value: string, region: Region): string {
  const digits = value.replace(/\D/g, '');
  if (region === 'global') return `tel:${value.trim().startsWith('+') ? '+' : ''}${digits}`;
  if (digits.length === 10) return `tel:+${COUNTRY_CODE[region]}${digits}`;
  return `tel:${digits}`;
}

/** Formatting helpers bound to the user's current language and region. */
export function useLocale() {
  const { language } = useLanguage();
  const { region } = useRegion();

  return useMemo(() => {
    const locale = toLocaleTag(language, region);
    return {
      language,
      region,
      locale,
      formatDate: (value: Date | string | number, options?: Intl.DateTimeFormatOptions) =>
        formatDate(value, locale, options),
      formatTime: (value: Date | string | number, options?: Intl.DateTimeFormatOptions) =>
        formatTime(value, locale, options),
      formatPhoneNumber: (value: string) => formatPhoneNumber(value, region),
      toTelHref: (value: string) => toTelHref(value, region),
    };
  }, [language, region]);
}
