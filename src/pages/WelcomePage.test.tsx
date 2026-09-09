import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { WelcomePage } from './WelcomePage';
import { introContent, heroContent, featureContent } from '../data/welcomeContent';
import {
  atEachBreakpoint,
  renderResponsive,
  getClassSet,
  expectAdaptsAt,
  expectResponsiveBaseline,
  expectResponsiveHorizontalPadding,
  BREAKPOINTS,
} from '../test/responsive';

describe('WelcomePage responsiveness', () => {
  it('renders navbar, every section and the footer at all supported screen widths', () => {
    atEachBreakpoint(<WelcomePage />, ({ width }) => {
      expect(screen.getByRole('button', { name: 'Toggle menu' }), `navbar missing at ${width}px`).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: introContent.heading })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: heroContent.heading })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: featureContent.items[0].heading })).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: 'Footer' })).toBeInTheDocument();
    });
  });

  it('adapts its layout at sm and lg and keeps a mobile + desktop nav', () => {
    const { container } = renderResponsive(<WelcomePage />, BREAKPOINTS.md);
    expectAdaptsAt(container, ['sm', 'lg']);
    const classes = getClassSet(container);
    expect(classes.has('lg:hidden')).toBe(true);
    expect(classes.has('lg:flex')).toBe(true);
  });

  it('keeps padding responsive and content overflow-safe on the narrowest phone', () => {
    const { container } = renderResponsive(<WelcomePage />, BREAKPOINTS.xs);
    expectResponsiveHorizontalPadding(container);
    expectResponsiveBaseline(container);
  });
});
