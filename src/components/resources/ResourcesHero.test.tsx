import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { ResourcesHero } from './ResourcesHero';
import { resourcesHeroContent } from '../../data/resourcesContent';
import {
  atEachBreakpoint,
  renderResponsive,
  expectAdaptsAt,
  expectResponsiveBaseline,
  expectResponsiveHorizontalPadding,
  expectHasMaxWidthContainer,
  BREAKPOINTS,
} from '../../test/responsive';

describe('ResourcesHero responsiveness', () => {
  it('renders heading and body at every supported screen width', () => {
    atEachBreakpoint(<ResourcesHero />, ({ width }) => {
      expect(screen.getByRole('heading', { name: resourcesHeroContent.heading }), `missing at ${width}px`).toBeInTheDocument();
      expect(screen.getByText(resourcesHeroContent.body)).toBeInTheDocument();
    });
  });

  it('steps the heading size up across sm and lg', () => {
    renderResponsive(<ResourcesHero />, BREAKPOINTS.lg);
    const heading = screen.getByRole('heading', { name: resourcesHeroContent.heading });
    expect(heading.className).toMatch(/text-4xl/);
    expect(heading.className).toMatch(/sm:text-5xl/);
    expect(heading.className).toMatch(/lg:text-\[72px\]/);
  });

  it('keeps padding responsive, content centered and overflow-safe', () => {
    const { container } = renderResponsive(<ResourcesHero />, BREAKPOINTS.xs);
    expectAdaptsAt(container, ['sm', 'lg']);
    expectResponsiveHorizontalPadding(container);
    expectHasMaxWidthContainer(container);
    expectResponsiveBaseline(container);
  });
});
