import { describe, it, expect, vi } from 'vitest';
import { buildPlanText, buildPlanTextFile, planSectionsFor, saveFile } from './planExport';
import { completedPlanHeroContent, finishedPlanContent, reminderCardContent } from '../data/completedPlanContent';
import type { SafetyPlanData } from '../types/app';

const content = { completedPlanHeroContent, reminderCardContent, finishedPlanContent };

const plan: SafetyPlanData = {
  warningSigns: ['Crying'],
  copingStrategies: [],
  supports: [],
  environment: [],
  answers: { warningSigns: ['I go quiet', ''], copingStrategies: ['Caminar con mi perro'], supports: [''], environment: [''] },
  message: '  Remember: this feeling passes.  ',
};

describe('planSectionsFor', () => {
  it('puts written answers before picked suggestions and drops empty sections', () => {
    expect(planSectionsFor(plan, finishedPlanContent.sections)).toEqual([
      { field: 'warningSigns', label: 'Warning Signs', items: ['I go quiet', 'Crying'] },
      { field: 'copingStrategies', label: 'Coping Strategies', items: ['Caminar con mi perro'] },
    ]);
  });

  it('returns nothing without a plan', () => {
    expect(planSectionsFor(null, finishedPlanContent.sections)).toEqual([]);
  });
});

describe('buildPlanText', () => {
  it('lists every section with its answers and the notes', () => {
    expect(buildPlanText(plan, finishedPlanContent)).toBe(
      [
        'My Safety Plan',
        '',
        'Warning Signs:',
        '- I go quiet',
        '- Crying',
        '',
        'Coping Strategies:',
        '- Caminar con mi perro',
        '',
        'Notes:',
        'Remember: this feeling passes.',
      ].join('\n'),
    );
  });
});

describe('buildPlanTextFile', () => {
  it('is UTF-8 text with the plan followed by the crisis reminder', async () => {
    const blob = buildPlanTextFile(plan, content);
    expect(blob.type).toBe('text/plain;charset=utf-8');
    const bytes = new Uint8Array(await blob.arrayBuffer());
    expect([...bytes.slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
    const text = new TextDecoder().decode(bytes);
    expect(text).toContain('- Caminar con mi perro');
    expect(text.trimEnd().endsWith(`${reminderCardContent.heading}\n${reminderCardContent.body}`)).toBe(true);
  });
});

describe('saveFile', () => {
  it('downloads the blob under the given file name and cleans up after itself', () => {
    vi.useFakeTimers();
    URL.createObjectURL = vi.fn(() => 'blob:plan');
    URL.revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      expect(this.href).toBe('blob:plan');
      expect(this.download).toBe('safety-plan.txt');
    });

    saveFile(new Blob(['plan']), 'safety-plan.txt');
    expect(click).toHaveBeenCalledOnce();
    expect(document.querySelector('a[download]')).toBeNull();
    vi.runAllTimers();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:plan');
    vi.useRealTimers();
  });
});
