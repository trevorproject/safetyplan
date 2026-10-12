import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { LanguageProvider } from '../context/LanguageContext';
import { LANGUAGE_STORAGE_KEY, type Language } from '../context/language';
import { useAccessibilityContent } from './accessibilityContent';
import { useAdminContent } from './adminContent';
import { useAppShellContent } from './appShellContent';
import { useCompletedPlanContent } from './completedPlanContent';
import { useDefaultConfig } from './defaultConfig';
import { useResourcesContent } from './resourcesContent';
import { useThemeToggleContent } from './themeToggleContent';
import { useWelcomeContent } from './welcomeContent';
import { useWizardContent } from './wizardContent';

/**
 * Every file in src/data exposes a `useXContent()` hook that returns the
 * English or Spanish copy for the active language. These tests guard the
 * contract the components rely on: both languages have exactly the same shape,
 * and anything that is not user-facing text (routes, URLs, ids) is identical.
 */
const CONTENT_HOOKS: Record<string, () => unknown> = {
  accessibilityContent: useAccessibilityContent,
  adminContent: useAdminContent,
  appShellContent: useAppShellContent,
  completedPlanContent: useCompletedPlanContent,
  defaultConfig: useDefaultConfig,
  resourcesContent: useResourcesContent,
  themeToggleContent: useThemeToggleContent,
  welcomeContent: useWelcomeContent,
  wizardContent: useWizardContent,
};

/** Keys whose values are identifiers or links, never translated copy. */
const NON_TRANSLATABLE_KEYS = new Set(['to', 'url', 'id', 'stepId', 'field', 'category', 'code']);

function contentIn(hook: () => unknown, language: Language) {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  const { result, unmount } = renderHook(hook, { wrapper: LanguageProvider });
  const value = result.current;
  unmount();
  return value;
}

/** Structural fingerprint: same keys, same array lengths, same value types. */
function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shapeOf);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, shapeOf((value as Record<string, unknown>)[key])]),
    );
  }
  return typeof value;
}

/** Flattens every leaf to `path → value`. */
function leaves(value: unknown, path = ''): [string, unknown][] {
  if (Array.isArray(value)) return value.flatMap((item, index) => leaves(item, `${path}[${index}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => leaves(item, path ? `${path}.${key}` : key));
  }
  return [[path, value]];
}

function lastKey(path: string) {
  return path.replace(/\[\d+\]/g, '').split('.').pop() ?? '';
}

beforeEach(() => {
  window.localStorage.clear();
});

describe.each(Object.entries(CONTENT_HOOKS))('%s', (_name, hook) => {
  const en = () => contentIn(hook, 'en');
  const es = () => contentIn(hook, 'es');

  it('returns a different object for each language', () => {
    expect(es()).not.toEqual(en());
  });

  it('has exactly the same structure in English and Spanish', () => {
    expect(shapeOf(es())).toEqual(shapeOf(en()));
  });

  it('keeps routes, URLs and ids identical across languages', () => {
    const pick = (content: unknown) => leaves(content).filter(([path]) => NON_TRANSLATABLE_KEYS.has(lastKey(path)));
    expect(pick(es())).toEqual(pick(en()));
  });

  it('has no empty strings in either language', () => {
    for (const content of [en(), es()]) {
      for (const [path, value] of leaves(content)) {
        if (typeof value === 'string') expect(value.trim(), path).not.toBe('');
      }
    }
  });
});

describe('language-specific formatting', () => {
  it('formats the admin summary in the active language', () => {
    const en = contentIn(useAdminContent, 'en') as ReturnType<typeof useAdminContent>;
    const es = contentIn(useAdminContent, 'es') as ReturnType<typeof useAdminContent>;
    expect(en.summary(4, 5)).toBe('4 resources • 5 wizard steps');
    expect(es.summary(4, 5)).toBe('4 recursos • 5 pasos del asistente');
  });

  it('keeps the intro heading emphasis inside the heading, so it can be split and styled', () => {
    for (const language of ['en', 'es'] as const) {
      const { introContent } = contentIn(useWelcomeContent, language) as ReturnType<typeof useWelcomeContent>;
      expect(introContent.heading, language).toContain(introContent.headingEmphasis);
    }
  });
});
