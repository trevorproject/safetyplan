import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { ResourcesPage } from './ResourcesPage';
import { resourcesHeroContent, freeResourcesContent } from '../data/resourcesContent';
import {
  atEachBreakpoint,
  renderResponsive,
  getClassSet,
  expectAdaptsAt,
  expectResponsiveBaseline,
  expectResponsiveHorizontalPadding,
  BREAKPOINTS,
} from '../test/responsive';

describe('ResourcesPage responsiveness', () => {
  it('renders navbar, hero, resources and footer at every supported screen width', () => {
    atEachBreakpoint(<ResourcesPage />, ({ width }) => {
      expect(screen.getByRole('button', { name: 'Toggle menu' }), `navbar missing at ${width}px`).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: resourcesHeroContent.heading })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: freeResourcesContent.heading })).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: 'Footer' })).toBeInTheDocument();
    });
  });

  it('adapts at sm and lg and keeps content overflow-safe on the narrowest phone', () => {
    const { container } = renderResponsive(<ResourcesPage />, BREAKPOINTS.xs);
    expectAdaptsAt(container, ['sm', 'lg']);
    expect(getClassSet(container).has('lg:flex-row')).toBe(true);
    expectResponsiveHorizontalPadding(container);
    expectResponsiveBaseline(container);
  });
});
