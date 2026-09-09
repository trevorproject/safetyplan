import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { WelcomeFooter } from './WelcomeFooter';
import {
  atEachBreakpoint,
  renderResponsive,
  getClassSet,
  expectAdaptsAt,
  expectResponsiveBaseline,
  expectHasMaxWidthContainer,
  BREAKPOINTS,
} from '../../test/responsive';

describe('WelcomeFooter responsiveness', () => {
  it('renders the footer navigation at every supported screen width', () => {
    atEachBreakpoint(<WelcomeFooter />, ({ width }) => {
      const footerNav = screen.getByRole('navigation', { name: 'Footer' });
      expect(footerNav, `footer nav missing at ${width}px`).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: 'Privacy policy' }).length).toBeGreaterThan(0);
    });
  });

  it('provides a stacked mobile legal strip and an inline desktop one', () => {
    const { container } = renderResponsive(<WelcomeFooter />, BREAKPOINTS.md);
    const classes = getClassSet(container);
    expect(classes.has('lg:hidden')).toBe(true); // mobile-only orange legal strip
    expect(classes.has('lg:flex')).toBe(true); // desktop-only legal row + logo band
    expect(classes.has('lg:flex-row')).toBe(true); // footer links go row-wise on desktop
  });

  it('reflows its layout at the lg breakpoint and stays overflow-safe', () => {
    const { container } = renderResponsive(<WelcomeFooter />, BREAKPOINTS.lg);
    expectAdaptsAt(container, ['lg']);
    expectHasMaxWidthContainer(container);
    expectResponsiveBaseline(container);
  });
});
