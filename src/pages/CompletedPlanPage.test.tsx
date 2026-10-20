import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { CompletedPlanPage } from './CompletedPlanPage';
import { finishedPlanContent, reminderCardContent } from '../data/completedPlanContent';
import { savePlan } from '../lib/storage';
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

describe('CompletedPlanPage report', () => {
  it("shows what the user wrote in each section alongside the suggestions they picked", () => {
    savePlan({
      warningSigns: ['Crying'],
      copingStrategies: [],
      supports: [],
      environment: [],
      answers: {
        warningSigns: 'I stop answering messages.\n\nI sleep all day.',
        copingStrategies: 'Walking my dog around the block',
        supports: '',
        environment: '',
      },
      message: 'Remember: this feeling passes.',
    });
    renderResponsive(<CompletedPlanPage />, BREAKPOINTS.md);

    expect(screen.getByRole('heading', { name: 'Warning Signs' })).toBeInTheDocument();
    expect(screen.getByText(/I stop answering messages\./)).toHaveTextContent('I stop answering messages. I sleep all day.');
    expect(screen.getByText('Crying')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Coping Strategies' })).toBeInTheDocument();
    expect(screen.getByText('Walking my dog around the block')).toBeInTheDocument();
    expect(screen.getByText('Remember: this feeling passes.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Support' })).not.toBeInTheDocument();
  });
});
