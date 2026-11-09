import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildPlanPdf } from './planPdf';
import { completedPlanHeroContent, finishedPlanContent, reminderCardContent } from '../data/completedPlanContent';
import type { SafetyPlanData } from '../types/app';

const content = { completedPlanHeroContent, reminderCardContent, finishedPlanContent };

const plan: SafetyPlanData = {
  warningSigns: ['Crying'],
  copingStrategies: ['Listening to music'],
  supports: [],
  environment: [],
  answers: {
    warningSigns: ['I stop answering messages'],
    copingStrategies: ['Caminar con mi perro alrededor de la cuadra, despacio y sin prisa'],
    supports: [''],
    environment: [''],
  },
  message: 'Remember: this feeling passes.\nYou are not alone.',
};

// jsdom can't fetch the Vite asset URLs, so serve the font files from disk.
beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      const bytes = readFileSync(resolve(process.cwd(), url.replace(/^\//, '').replace(/\?.*$/, '')));
      return new Response(bytes);
    }),
  );
});

async function pdfSource(blob: Blob) {
  return new TextDecoder('latin1').decode(await blob.arrayBuffer());
}

function pageCount(source: string) {
  return source.match(/\/Type \/Page\b/g)?.length ?? 0;
}

describe('buildPlanPdf', () => {
  it('produces a PDF document', async () => {
    const blob = await buildPlanPdf(plan, content, 'en');
    expect(blob.type).toBe('application/pdf');
    expect((await pdfSource(blob)).startsWith('%PDF-')).toBe(true);
  });

  it('embeds the app fonts so the layout and accents look the same on every reader', async () => {
    const source = await pdfSource(await buildPlanPdf(plan, content, 'es'));
    expect(source).toMatch(/\/FontFile2/);
    expect(source).toMatch(/Manrope/);
    expect(source).toMatch(/Caveat/);
  });

  it('starts with The Trevor Project logo, like the printed page', async () => {
    const source = await pdfSource(await buildPlanPdf(plan, content, 'en'));
    expect(source).toMatch(/\/Subtype \/Image/);
  });

  it('keeps the metadata to a title, with no author, subject or keywords', async () => {
    const source = await pdfSource(await buildPlanPdf(plan, content, 'en'));
    expect(source).toContain(`/Title (${finishedPlanContent.shareSubject})`);
    expect(source).not.toMatch(/\/(Author|Subject|Keywords) \(/);
    expect(source).toMatch(/\/CreationDate \(D:\d{8}000000\+00'00'\)/);
  });

  it('flows a long plan onto more pages instead of cutting it off', async () => {
    const short = pageCount(await pdfSource(await buildPlanPdf(plan, content, 'en')));
    const longPlan = {
      ...plan,
      answers: { ...plan.answers, warningSigns: Array.from({ length: 60 }, (_, i) => `Warning sign number ${i + 1}`) },
    };
    const long = pageCount(await pdfSource(await buildPlanPdf(longPlan, content, 'en')));
    expect(short).toBe(1);
    expect(long).toBeGreaterThan(1);
  });

  it('fails loudly when the fonts cannot be loaded, and succeeds on the next try', async () => {
    // A fresh copy of the module, so the fonts cached by the tests above don't hide the failure.
    vi.resetModules();
    const { buildPlanPdf: freshBuildPlanPdf } = await import('./planPdf');
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 503 }));
    await expect(freshBuildPlanPdf(plan, content, 'en')).rejects.toThrow();
    await expect(freshBuildPlanPdf(plan, content, 'en')).resolves.toBeInstanceOf(Blob);
  });
});
