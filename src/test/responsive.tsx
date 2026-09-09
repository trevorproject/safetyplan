import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { expect } from 'vitest';
import { AccessibilityProvider } from '../context/AccessibilityContext';
import { ThemeProvider } from '../context/ThemeContext';

/**
 * Responsiveness test toolkit.
 *
 * jsdom does not apply CSS or run a layout engine, so these helpers verify
 * responsiveness the way it is actually authored in this project: every layout
 * decision lives in Tailwind's mobile-first breakpoint utilities (`sm:`, `md:`,
 * `lg:`, `xl:`, `2xl:`). The assertions below encode the "Responsive Grid &
 * Layout Rules" from context.md so a regression (a dropped `lg:` variant, a
 * hard-coded pixel image size, a missing mobile/desktop nav cluster) fails a
 * unit test instead of only showing up in a browser.
 */

/** Tailwind v4 default breakpoints, plus the two narrowest supported phones. */
export const BREAKPOINTS = {
  xs: 320, // minimum supported width (body { min-width: 320px })
  mobile: 375, // typical phone
  sm: 640,
  md: 768,
  lg: 1024, // nav switches from mobile menu to full nav at this width
  xl: 1280,
  '2xl': 1536,
} as const;

export type BreakpointName = keyof typeof BREAKPOINTS;

export const BREAKPOINT_LIST: ReadonlyArray<{ name: BreakpointName; width: number }> =
  Object.entries(BREAKPOINTS).map(([name, width]) => ({ name: name as BreakpointName, width }));

/** Tailwind breakpoint prefixes that mark a structural layout change. */
export const RESPONSIVE_PREFIXES = ['sm', 'md', 'lg', 'xl', '2xl'] as const;
export type ResponsivePrefix = (typeof RESPONSIVE_PREFIXES)[number];

const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 768;
const ROOT_FONT_PX = 16;

function toPx(value: string): number {
  const num = parseFloat(value);
  if (value.includes('rem') || value.includes('em')) return num * ROOT_FONT_PX;
  return num;
}

/** Minimal but real (min|max)-width media-query evaluator for a given viewport. */
function evaluateQuery(query: string, width: number, height: number): boolean {
  return query.split(',').some((clause) => {
    const conditions = clause.match(/\((?:min|max)-(?:width|height):[^)]+\)/g) ?? [];
    if (!conditions.length) return false;
    return conditions.every((condition) => {
      const [, kind, axis, raw] = condition.match(/\((min|max)-(width|height):\s*([^)]+)\)/) ?? [];
      if (!kind) return false;
      const target = axis === 'width' ? width : height;
      const bound = toPx(raw);
      return kind === 'min' ? target >= bound : target <= bound;
    });
  });
}

/**
 * Simulate a screen size. Sets `innerWidth`/`innerHeight`, installs a
 * `matchMedia` that answers against that size, and fires a `resize` event so
 * any listener-based component recalculates.
 */
export function setViewport(width: number, height: number = DEFAULT_HEIGHT): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width });
  Object.defineProperty(window, 'outerWidth', { configurable: true, writable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: height });
  Object.defineProperty(window, 'outerHeight', { configurable: true, writable: true, value: height });
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: width });
  Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: height });

  window.matchMedia = ((query: string) => {
    const mql: MediaQueryList = {
      media: query,
      get matches() {
        return evaluateQuery(query, window.innerWidth, window.innerHeight);
      },
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    } as unknown as MediaQueryList;
    return mql;
  }) as typeof window.matchMedia;

  window.dispatchEvent(new Event('resize'));
}

/** Restore the default jsdom viewport. Called automatically after every test. */
export function resetViewport(): void {
  setViewport(DEFAULT_WIDTH, DEFAULT_HEIGHT);
}

interface RenderOptions {
  /** Initial router entry, e.g. "/wizard". Defaults to "/". */
  route?: string;
}

/** Render a component inside a router (and the accessibility context every page relies on) at a given viewport width. */
export function renderResponsive(ui: ReactElement, width: number, options: RenderOptions = {}) {
  setViewport(width);
  return render(
    <MemoryRouter initialEntries={[options.route ?? '/']}>
      <ThemeProvider>
        <AccessibilityProvider>{ui}</AccessibilityProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

/** Run `assert` once per breakpoint with the component freshly rendered at that width. */
export function atEachBreakpoint(
  ui: ReactElement,
  assert: (ctx: { name: BreakpointName; width: number; container: HTMLElement }) => void,
  options: RenderOptions = {},
): void {
  for (const { name, width } of BREAKPOINT_LIST) {
    const { container, unmount } = renderResponsive(ui, width, options);
    try {
      assert({ name, width, container });
    } finally {
      unmount();
    }
  }
}

/** Every distinct class token used anywhere in the rendered subtree. */
export function getClassSet(container: HTMLElement): Set<string> {
  const classes = new Set<string>();
  container.querySelectorAll('[class]').forEach((el) => {
    el.getAttribute('class')!
      .split(/\s+/)
      .filter(Boolean)
      .forEach((token) => classes.add(token));
  });
  return classes;
}

/** All utilities carrying a given breakpoint prefix, e.g. `lg:` → ["lg:flex", ...]. */
export function responsiveVariants(container: HTMLElement, prefix: ResponsivePrefix): string[] {
  return [...getClassSet(container)].filter((token) => token.startsWith(`${prefix}:`));
}

/**
 * Assert the component declares at least one utility at each given breakpoint,
 * i.e. it structurally adapts at those screen sizes rather than being a single
 * fixed layout.
 */
export function expectAdaptsAt(container: HTMLElement, prefixes: readonly ResponsivePrefix[]): void {
  for (const prefix of prefixes) {
    expect(
      responsiveVariants(container, prefix),
      `expected at least one "${prefix}:" responsive utility`,
    ).not.toHaveLength(0);
  }
}

/** Assert a specific responsive utility (e.g. "lg:grid-cols-4") is present. */
export function expectClass(container: HTMLElement, className: string): void {
  expect(getClassSet(container), `expected class "${className}"`).toContain(className);
}

/**
 * Assert no `<img>` is locked to a pixel size via inline styles, which would
 * stop it reflowing across breakpoints (context.md: images scale with
 * `w-full h-auto` / `object-*`, never fixed CSS width/height).
 */
export function expectNoPixelLockedImages(container: HTMLElement): void {
  container.querySelectorAll('img').forEach((img) => {
    const style = img.getAttribute('style') ?? '';
    expect(style, `<img src="${img.getAttribute('src')}"> must not hard-code CSS width`).not.toMatch(
      /\bwidth\s*:\s*\d+px/i,
    );
    expect(style, `<img src="${img.getAttribute('src')}"> must not hard-code CSS height`).not.toMatch(
      /\bheight\s*:\s*\d+px/i,
    );
  });
}

/**
 * Assert every `<img>` carries a sizing/fit utility so it is constrained by its
 * container and cannot overflow its column on any breakpoint. Height-driven
 * logos (`h-8 w-auto`) count — context.md allows fixed sizing for small assets
 * like logos and icons. The pixel-lock and overflow-width checks catch the
 * genuinely unsafe cases (`style="width:400px"`, `w-[400px]`).
 */
const IMG_SIZING_UTILITY =
  /(^|\s)(?:[a-z0-9]+:)?(w-full|w-auto|w-\d|w-\[|max-w-|h-full|h-auto|h-\d|h-\[|size-|object-(?:cover|contain))/;

export function expectImagesAreFluid(container: HTMLElement): void {
  container.querySelectorAll('img').forEach((img) => {
    const classes = img.getAttribute('class') ?? '';
    expect(
      IMG_SIZING_UTILITY.test(classes),
      `<img src="${img.getAttribute('src')}"> needs a sizing utility, got "${classes}"`,
    ).toBe(true);
  });
}

/**
 * Assert the subtree has a centered max-width container (page-container rule) so
 * content stops widening on large desktops instead of stretching edge to edge.
 */
export function expectHasMaxWidthContainer(container: HTMLElement): void {
  const hasMaxWidth = [...getClassSet(container)].some((token) => token.startsWith('max-w-'));
  expect(hasMaxWidth, 'expected a max-w-* container').toBe(true);
}

/**
 * Assert outer horizontal padding is present for mobile and steps up at a
 * larger breakpoint (context.md: px-6 → px-8 → lg:px-16).
 */
export function expectResponsiveHorizontalPadding(container: HTMLElement): void {
  const classes = getClassSet(container);
  const hasMobilePadding = [...classes].some((c) => /^px-\d/.test(c) || /^px-\[/.test(c));
  const scalesUp = [...classes].some((c) => /^(sm|md|lg|xl):px-/.test(c));
  expect(hasMobilePadding, 'expected a base horizontal padding utility (px-*)').toBe(true);
  expect(scalesUp, 'expected horizontal padding to scale up at a breakpoint (e.g. lg:px-16)').toBe(true);
}

/**
 * Assert nothing in the subtree forces a width wider than the smallest
 * supported screen (320px) without also being fluid — a proxy for "no
 * horizontal scrolling below 320px".
 */
export function expectNoOverflowWidth(container: HTMLElement, minSupported = BREAKPOINTS.xs): void {
  for (const token of getClassSet(container)) {
    const match = token.match(/^(?:.*:)?(?:min-)?w-\[(\d+)px\]$/);
    if (!match) continue;
    const px = Number(match[1]);
    if (px <= minSupported) continue;
    // A fixed width wider than the min screen is only safe alongside a fluid cap.
    const classes = getClassSet(container);
    const hasFluidCap =
      classes.has('w-full') || classes.has('max-w-full') || [...classes].some((c) => c.startsWith('max-w-['));
    expect(
      hasFluidCap,
      `fixed width "${token}" (>${minSupported}px) needs a w-full / max-w-* cap to avoid overflow`,
    ).toBe(true);
  }
}

/**
 * Convenience bundle: the checks that should hold for essentially every
 * visual component at every breakpoint.
 */
export function expectResponsiveBaseline(container: HTMLElement): void {
  expectNoPixelLockedImages(container);
  expectImagesAreFluid(container);
  expectNoOverflowWidth(container);
}
