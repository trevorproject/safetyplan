import { describe, it, expect } from 'vitest';
import { defaultConfig, localizePlan } from './defaultConfig';
import type { SafetyPlanData } from '../types/app';

const plan: SafetyPlanData = {
  warningSigns: ['Crying', 'My own sign'],
  copingStrategies: ['Writing'],
  supports: ['Therapist'],
  environment: ['Remove medications'],
  message: 'Hello',
};

describe('defaultConfig', () => {
  it('lists the same wizard steps, with the same number of options, in both languages', () => {
    const summarize = (language: 'en' | 'es') =>
      defaultConfig[language].wizardSteps.map((step) => [step.id, step.options?.length ?? 0]);
    expect(summarize('es')).toEqual(summarize('en'));
  });

  it('has no repeated option within a step, so each one maps to a single translation', () => {
    for (const language of ['en', 'es'] as const) {
      for (const step of defaultConfig[language].wizardSteps) {
        const options = step.options ?? [];
        expect(new Set(options).size, `${language}/${step.id}`).toBe(options.length);
      }
    }
  });
});

describe('localizePlan', () => {
  it('translates preset options to Spanish by their position in the list', () => {
    expect(localizePlan(plan, 'es')).toEqual({
      warningSigns: ['Llorar', 'My own sign'],
      copingStrategies: ['Escribir'],
      supports: ['Terapeuta'],
      environment: ['Quitar medicamentos'],
      message: 'Hello',
    });
  });

  it('translates back to English without losing anything', () => {
    expect(localizePlan(localizePlan(plan, 'es'), 'en')).toEqual(plan);
  });

  it('leaves the plan untouched when it is already in the target language', () => {
    expect(localizePlan(plan, 'en')).toEqual(plan);
  });

  it('keeps answers the user typed and the free-text message exactly as written', () => {
    const custom: SafetyPlanData = { ...plan, warningSigns: ['Me siento cansade'], message: 'Mensaje propio' };
    const localized = localizePlan(custom, 'en');
    expect(localized.warningSigns).toEqual(['Me siento cansade']);
    expect(localized.message).toBe('Mensaje propio');
  });

  it('drops duplicates that collapse onto the same option', () => {
    expect(localizePlan({ ...plan, warningSigns: ['Crying', 'Llorar'] }, 'en').warningSigns).toEqual(['Crying']);
  });

  it('copes with a partial plan from older saved data', () => {
    const partial = { message: '' } as SafetyPlanData;
    expect(localizePlan(partial, 'es')).toEqual({
      warningSigns: [],
      copingStrategies: [],
      supports: [],
      environment: [],
      message: '',
    });
  });

  it('does not mutate the plan it receives', () => {
    const snapshot = structuredClone(plan);
    localizePlan(plan, 'es');
    expect(plan).toEqual(snapshot);
  });
});
