import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { CompletedPlanPage } from './CompletedPlanPage';
import { finishedPlanContent, reminderCardContent } from '../data/completedPlanContent';
import {
  atEachBreakpoint,
  renderResponsive,
  getClassSet,
  expectAdaptsAt,
  expectResponsiveBaseline,
  expectResponsiveHorizontalPadding,
  BREAKPOINTS,
} from '../test/responsive';

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('CompletedPlanPage responsiveness', () => {
  it('renders navbar, plan sections, action buttons and footer at every screen width', () => {
    atEachBreakpoint(<CompletedPlanPage />, ({ width }) => {
      expect(screen.getByRole('button', { name: 'Toggle menu' }), `navbar missing at ${width}px`).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: reminderCardContent.heading })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: finishedPlanContent.printLabel })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: finishedPlanContent.shareLabel })).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: 'Footer' })).toBeInTheDocument();
    });
  });

  it('moves focus to the plan heading on load so keyboard users start at the top', () => {
    renderResponsive(<CompletedPlanPage />, BREAKPOINTS.md);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('tabindex', '-1');
    expect(heading).toHaveFocus();
  });

  it('hides the on-screen action buttons in print layout', () => {
    const { container } = renderResponsive(<CompletedPlanPage />, BREAKPOINTS.md);
    expect(getClassSet(container).has('print:hidden')).toBe(true);
  });

  it('adapts at sm and lg and stays padded + overflow-safe on the narrowest phone', () => {
    const { container } = renderResponsive(<CompletedPlanPage />, BREAKPOINTS.xs);
    expectAdaptsAt(container, ['sm', 'lg']);
    expectResponsiveHorizontalPadding(container);
    expectResponsiveBaseline(container);
  });
});
