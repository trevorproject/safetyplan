import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { getDocs } from 'firebase/firestore';
import { resetViewport } from './responsive';

// No test talks to the real Firestore. `getDocs` answers with no documents by
// default; a test that needs resources sets them with
// `vi.mocked(getDocs).mockResolvedValue(...)` (see useResources.test.ts).
vi.mock('../firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn((_db: unknown, path: string) => ({ path })),
  where: vi.fn((field: string, op: string, value: unknown) => ({ field, op, value })),
  query: vi.fn((ref: unknown, ...constraints: unknown[]) => ({ ref, constraints })),
  getDocs: vi.fn(async () => ({ docs: [] })),
}));

// jsdom ships no layout engine and no matchMedia. The helpers below give the
// components enough of a browser that render + the responsive-class assertions
// in src/test/responsive.tsx can run at any simulated screen width.

if (!window.matchMedia) {
  // Real implementation is installed per-test by setViewport(); this stub keeps
  // any component that calls matchMedia at import/mount time from throwing.
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

if (!window.scrollTo) {
  window.scrollTo = (() => {}) as typeof window.scrollTo;
}

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver ??= ResizeObserverStub as unknown as typeof window.ResizeObserver;

// jsdom has no speech synthesis engine; the accessibility panel's read-aloud
// controls just need something to call so tests can assert on the calls.
if (!window.speechSynthesis) {
  window.speechSynthesis = {
    speak: () => {},
    cancel: () => {},
    pause: () => {},
    resume: () => {},
  } as unknown as SpeechSynthesis;
}
if (!window.SpeechSynthesisUtterance) {
  window.SpeechSynthesisUtterance = class {
    text: string;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor(text: string) {
      this.text = text;
    }
  } as unknown as typeof SpeechSynthesisUtterance;
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

afterEach(() => {
  cleanup();
  resetViewport();
  vi.restoreAllMocks();
  vi.mocked(getDocs).mockReset();
  vi.mocked(getDocs).mockImplementation(async () => ({ docs: [] }) as never);
});
