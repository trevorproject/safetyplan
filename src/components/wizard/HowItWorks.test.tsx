import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { HowItWorks } from './HowItWorks';
import { howItWorksContent } from '../../data/wizardContent';
import {
  atEachBreakpoint,
  renderResponsive,
  expectAdaptsAt,
  expectClass,
  expectImagesAreFluid,
  expectResponsiveBaseline,
  expectResponsiveHorizontalPadding,
  expectHasMaxWidthContainer,
  BREAKPOINTS,
} from '../../test/responsive';

describe('HowItWorks responsiveness', () => {
  it('renders the heading and all four step cards at every supported screen width', () => {
    atEachBreakpoint(<HowItWorks />, ({ width }) => {
      expect(screen.getByRole('heading', { name: howItWorksContent.heading }), `heading missing at ${width}px`).toBeInTheDocument();
      for (const card of howItWorksContent.cards) {
        expect(screen.getByRole('heading', { name: card.heading })).toBeInTheDocument();
      }
    });
  });

  it('grows the card grid 1 → 2 → 4 columns across sm and lg', () => {
    const { container } = renderResponsive(<HowItWorks />, BREAKPOINTS.lg);
    expectClass(container, 'grid-cols-1');
    expectClass(container, 'sm:grid-cols-2');
    expectClass(container, 'lg:grid-cols-4');
    expectAdaptsAt(container, ['sm', 'lg']);
  });

  it('keeps card icons fluid and the section padded + overflow-safe', () => {
    const { container } = renderResponsive(<HowItWorks />, BREAKPOINTS.xs);
    expectImagesAreFluid(container);
    expectResponsiveHorizontalPadding(container);
    expectHasMaxWidthContainer(container);
    expectResponsiveBaseline(container);
  });
});
