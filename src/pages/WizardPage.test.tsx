import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { WizardPage } from './WizardPage';
import { buildPlanContent } from '../data/wizardContent';
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

describe('WizardPage responsiveness', () => {
  it('renders the hero, step content and progress bar at every supported screen width', () => {
    atEachBreakpoint(<WizardPage />, ({ width }) => {
      expect(screen.getByRole('button', { name: 'Toggle menu' }), `navbar missing at ${width}px`).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: buildPlanContent.heading })).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: buildPlanContent.continueLabel })).toBeInTheDocument();
    });
  });

  it('stacks the Back / Continue controls on mobile and rows them from sm', () => {
    const { container } = renderResponsive(<WizardPage />, BREAKPOINTS.sm);
    const classes = getClassSet(container);
    expect(classes.has('flex-col')).toBe(true);
    expect(classes.has('sm:flex-row')).toBe(true);
    expectAdaptsAt(container, ['sm', 'lg']);
  });

  it('keeps the wizard card padded and overflow-safe on the narrowest phone', () => {
    const { container } = renderResponsive(<WizardPage />, BREAKPOINTS.xs);
    expectResponsiveHorizontalPadding(container);
    expectResponsiveBaseline(container);
  });
});
