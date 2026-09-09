import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WelcomeNavbar } from './WelcomeNavbar';
import {
  atEachBreakpoint,
  renderResponsive,
  getClassSet,
  expectAdaptsAt,
  expectClass,
  expectResponsiveBaseline,
  expectResponsiveHorizontalPadding,
  expectHasMaxWidthContainer,
  BREAKPOINTS,
} from '../../test/responsive';

describe('WelcomeNavbar responsiveness', () => {
  it('renders the brand and primary actions at every supported screen width', () => {
    atEachBreakpoint(<WelcomeNavbar />, ({ width }) => {
      expect(screen.getAllByRole('img', { name: 'The Trevor Project' }).length, `logo missing at ${width}px`).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: 'Get Help' }).length).toBeGreaterThan(0);
    });
  });

  it('ships both a mobile menu cluster and a desktop nav cluster', () => {
    const { container } = renderResponsive(<WelcomeNavbar />, BREAKPOINTS.md);
    const classes = getClassSet(container);
    // Desktop full nav is hidden until lg; mobile actions/menu hide from lg up.
    expect([...classes].some((c) => c === 'lg:flex' || c === 'lg:block')).toBe(true);
    expect(classes.has('lg:hidden')).toBe(true);
    expect(screen.getByRole('button', { name: 'Toggle menu' })).toBeInTheDocument();
  });

  it('switches nav presentation at the lg breakpoint', () => {
    const { container } = renderResponsive(<WelcomeNavbar />, BREAKPOINTS.lg);
    expectAdaptsAt(container, ['lg']);
  });

  it('opens the mobile dropdown menu with the primary links on tap', async () => {
    const user = userEvent.setup();
    renderResponsive(<WelcomeNavbar />, BREAKPOINTS.mobile);
    await user.click(screen.getByRole('button', { name: 'Toggle menu' }));
    const menus = screen.getAllByRole('navigation', { name: 'Primary' });
    const mobileMenu = menus[menus.length - 1];
    expect(within(mobileMenu).getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(within(mobileMenu).getByRole('link', { name: 'Create plan' })).toBeInTheDocument();
  });

  it('keeps the container centered, padded and overflow-safe', () => {
    const { container } = renderResponsive(<WelcomeNavbar />, BREAKPOINTS.xl);
    expectHasMaxWidthContainer(container);
    expectResponsiveHorizontalPadding(container);
    expectResponsiveBaseline(container);
    expectClass(container, 'lg:px-16');
  });
});
