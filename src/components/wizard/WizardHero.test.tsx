import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { WizardHero } from './WizardHero';
import { wizardHeroContent } from '../../data/wizardContent';
import {
  atEachBreakpoint,
  renderResponsive,
  expectAdaptsAt,
  expectResponsiveBaseline,
  expectResponsiveHorizontalPadding,
  expectHasMaxWidthContainer,
  BREAKPOINTS,
} from '../../test/responsive';

describe('WizardHero responsiveness', () => {
  it('renders heading and body at every supported screen width', () => {
    atEachBreakpoint(<WizardHero />, ({ width }) => {
      expect(screen.getByRole('heading', { name: wizardHeroContent.heading }), `missing at ${width}px`).toBeInTheDocument();
      expect(screen.getByText(wizardHeroContent.body)).toBeInTheDocument();
    });
  });

  it('steps the heading size up across sm and lg', () => {
    renderResponsive(<WizardHero />, BREAKPOINTS.lg);
    const heading = screen.getByRole('heading', { name: wizardHeroContent.heading });
    expect(heading.className).toMatch(/text-4xl/);
    expect(heading.className).toMatch(/sm:text-5xl/);
    expect(heading.className).toMatch(/lg:text-\[72px\]/);
  });

  it('keeps padding responsive, content centered and overflow-safe', () => {
    const { container } = renderResponsive(<WizardHero />, BREAKPOINTS.xs);
    expectAdaptsAt(container, ['sm', 'lg']);
    expectResponsiveHorizontalPadding(container);
    expectHasMaxWidthContainer(container);
    expectResponsiveBaseline(container);
  });
});
