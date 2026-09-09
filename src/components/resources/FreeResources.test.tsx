import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { FreeResources } from './FreeResources';
import { freeResourcesContent, lifelineCard, trevorCard } from '../../data/resourcesContent';
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

describe('FreeResources responsiveness', () => {
  it('renders the heading and both resource cards at every supported screen width', () => {
    atEachBreakpoint(<FreeResources />, ({ width }) => {
      expect(screen.getByRole('heading', { name: freeResourcesContent.heading }), `missing at ${width}px`).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: trevorCard.heading })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: lifelineCard.heading })).toBeInTheDocument();
    });
  });

  it('stacks the two cards on mobile and lays them side-by-side from lg', () => {
    const { container } = renderResponsive(<FreeResources />, BREAKPOINTS.lg);
    expect(getClassSet(container).has('lg:flex-row')).toBe(true);
    expectAdaptsAt(container, ['sm', 'lg']);
  });

  it('keeps card images fluid and the section overflow-safe', () => {
    const { container } = renderResponsive(<FreeResources />, BREAKPOINTS.xs);
    const imgs = container.querySelectorAll('img');
    expect(imgs.length).toBe(2);
    imgs.forEach((img) => expect(img.className).toMatch(/w-full/));
    expectResponsiveHorizontalPadding(container);
    expectHasMaxWidthContainer(container);
    expectResponsiveBaseline(container);
  });
});
