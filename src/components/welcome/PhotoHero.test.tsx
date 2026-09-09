import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { PhotoHero } from './PhotoHero';
import { heroContent } from '../../data/welcomeContent';
import {
  atEachBreakpoint,
  renderResponsive,
  getClassSet,
  expectAdaptsAt,
  expectResponsiveBaseline,
  expectHasMaxWidthContainer,
  BREAKPOINTS,
} from '../../test/responsive';

describe('PhotoHero responsiveness', () => {
  it('renders the hero heading, body and CTA at every supported screen width', () => {
    atEachBreakpoint(<PhotoHero />, ({ width }) => {
      expect(screen.getByRole('heading', { name: heroContent.heading }), `heading missing at ${width}px`).toBeInTheDocument();
      expect(screen.getByRole('link', { name: heroContent.cta.label })).toBeInTheDocument();
    });
  });

  it('increases its minimum height and heading size from mobile to desktop', () => {
    const { container } = renderResponsive(<PhotoHero />, BREAKPOINTS.lg);
    const classes = getClassSet(container);
    expect(classes.has('min-h-[520px]')).toBe(true);
    expect(classes.has('lg:min-h-[816px]')).toBe(true);

    const heading = screen.getByRole('heading', { name: heroContent.heading });
    expect(heading.className).toMatch(/text-4xl/);
    expect(heading.className).toMatch(/sm:text-5xl/);
    expect(heading.className).toMatch(/lg:text-\[72px\]/);
  });

  it('adapts at sm and lg and clips its background instead of overflowing', () => {
    const { container } = renderResponsive(<PhotoHero />, BREAKPOINTS.xl);
    expectAdaptsAt(container, ['sm', 'lg']);
    expect(getClassSet(container).has('overflow-hidden')).toBe(true);
    expectHasMaxWidthContainer(container);
    expectResponsiveBaseline(container);
  });
});
