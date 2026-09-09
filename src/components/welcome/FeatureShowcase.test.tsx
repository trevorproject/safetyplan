import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { FeatureShowcase } from './FeatureShowcase';
import { featureContent } from '../../data/welcomeContent';
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

describe('FeatureShowcase responsiveness', () => {
  it('renders the intro copy and every feature item at all screen widths', () => {
    atEachBreakpoint(<FeatureShowcase />, ({ width }) => {
      for (const item of featureContent.items) {
        expect(screen.getByRole('heading', { name: item.heading }), `"${item.heading}" missing at ${width}px`).toBeInTheDocument();
      }
    });
  });

  it('stacks on mobile and goes side-by-side from lg (feature items from sm)', () => {
    const { container } = renderResponsive(<FeatureShowcase />, BREAKPOINTS.lg);
    const classes = getClassSet(container);
    expect(classes.has('lg:flex-row')).toBe(true);
    expect(classes.has('lg:w-1/2')).toBe(true);
    expect(classes.has('sm:flex-row')).toBe(true);
    expectAdaptsAt(container, ['sm', 'lg']);
  });

  it('keeps both illustrations fluid and the section overflow-safe', () => {
    const { container } = renderResponsive(<FeatureShowcase />, BREAKPOINTS.xs);
    const imgs = container.querySelectorAll('img');
    expect(imgs.length).toBeGreaterThanOrEqual(2);
    imgs.forEach((img) => expect(img.className).toMatch(/w-full/));
    expectResponsiveHorizontalPadding(container);
    expectHasMaxWidthContainer(container);
    expectResponsiveBaseline(container);
  });
});
