import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { IntroSection } from './IntroSection';
import { introContent } from '../../data/welcomeContent';
import {
  atEachBreakpoint,
  renderResponsive,
  getClassSet,
  expectAdaptsAt,
  expectResponsiveBaseline,
  expectResponsiveHorizontalPadding,
  expectHasMaxWidthContainer,
  BREAKPOINTS,
} from '../../test/responsive';

describe('IntroSection responsiveness', () => {
  it('renders its heading and CTA at every supported screen width', () => {
    atEachBreakpoint(<IntroSection />, ({ width }) => {
      expect(screen.getByRole('heading', { name: introContent.heading }), `heading missing at ${width}px`).toBeInTheDocument();
      expect(screen.getByRole('link', { name: introContent.cta.label })).toBeInTheDocument();
    });
  });

  it('scales the heading up across sm and lg breakpoints', () => {
    const { container } = renderResponsive(<IntroSection />, BREAKPOINTS.lg);
    const heading = screen.getByRole('heading', { name: introContent.heading });
    expect(heading.className).toMatch(/text-3xl/);
    expect(heading.className).toMatch(/sm:text-4xl/);
    expect(heading.className).toMatch(/lg:text-\[52px\]/);
    expectAdaptsAt(container, ['sm', 'lg']);
  });

  it('grows the media placeholder from mobile to desktop height', () => {
    const { container } = renderResponsive(<IntroSection />, BREAKPOINTS.lg);
    const classes = getClassSet(container);
    expect(classes.has('h-[300px]')).toBe(true);
    expect(classes.has('lg:h-[580px]')).toBe(true);
  });

  it('keeps section padding responsive and content overflow-safe', () => {
    const { container } = renderResponsive(<IntroSection />, BREAKPOINTS.xs);
    expectResponsiveHorizontalPadding(container);
    expectHasMaxWidthContainer(container);
    expectResponsiveBaseline(container);
  });
});
