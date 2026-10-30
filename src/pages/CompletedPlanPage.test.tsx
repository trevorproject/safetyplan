import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { screen, within } from '@testing-library/react';
import { CompletedPlanPage } from './CompletedPlanPage';
import { completedPlanHeroContent, finishedPlanContent, reminderCardContent } from '../data/completedPlanContent';
import { loadPlan, loadStep, savePlan, saveStep } from '../lib/storage';
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
      expect(screen.getByRole('button', { name: finishedPlanContent.newPlanLabel })).toBeInTheDocument();
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

describe('CompletedPlanPage layout', () => {
  it('shows the plan first and the reminder after it in reading order, moving the reminder to the left column on wide screens', () => {
    renderResponsive(<CompletedPlanPage />, BREAKPOINTS.lg);
    const printButton = screen.getByRole('button', { name: finishedPlanContent.printLabel });
    const reminder = screen.getByRole('heading', { name: reminderCardContent.heading });
    expect(printButton.compareDocumentPosition(reminder) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const card = reminder.closest('.rounded-3xl') as HTMLElement;
    expect(card).toHaveClass('lg:col-start-1', 'lg:row-start-1');
    expect(card.parentElement?.parentElement).toHaveClass('grid', 'lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]');
  });

  it('explains how to keep the plan in a tooltip next to the intro text', async () => {
    const user = userEvent.setup();
    renderResponsive(<CompletedPlanPage />, BREAKPOINTS.md);
    expect(screen.queryByText(completedPlanHeroContent.tip)).not.toBeInTheDocument();

    const trigger = screen.getByRole('button', { name: completedPlanHeroContent.tipLabel });
    expect(trigger.closest('p')).toHaveTextContent(completedPlanHeroContent.body);
    await user.click(trigger);
    expect(screen.getByText(completedPlanHeroContent.tip)).toBeInTheDocument();
  });
});

describe('CompletedPlanPage report', () => {
  it('lists what the user wrote in each section as bullets, followed by the suggestions they picked', () => {
    savePlan({
      warningSigns: ['Crying'],
      copingStrategies: [],
      supports: [],
      environment: [],
      answers: {
        warningSigns: ['I stop answering messages', '', '  I sleep all day  '],
        copingStrategies: ['Walking my dog around the block'],
        supports: ['', ''],
        environment: [],
      },
      message: 'Remember: this feeling passes.',
    });
    renderResponsive(<CompletedPlanPage />, BREAKPOINTS.md);

    const warningSigns = screen.getByRole('heading', { name: 'Warning Signs' }).nextElementSibling as HTMLElement;
    expect(within(warningSigns).getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'I stop answering messages',
      'I sleep all day',
      'Crying',
    ]);
    expect(screen.getByRole('heading', { name: 'Coping Strategies' })).toBeInTheDocument();
    expect(screen.getByText('Walking my dog around the block').tagName).toBe('LI');
    expect(screen.getByText('Remember: this feeling passes.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Support' })).not.toBeInTheDocument();
  });
});

describe('CompletedPlanPage new plan', () => {
  const savedPlan = {
    warningSigns: ['Crying'],
    copingStrategies: [],
    supports: [],
    environment: [],
    answers: { warningSigns: ['I go quiet'], copingStrategies: [''], supports: [''], environment: [''] },
    message: 'Hello',
  };

  function renderWithWizardRoute() {
    savePlan(savedPlan);
    saveStep(4);
    renderResponsive(
      <Routes>
        <Route path="/plan" element={<CompletedPlanPage />} />
        <Route path="/wizard" element={<p>Wizard opened</p>} />
      </Routes>,
      BREAKPOINTS.md,
      { route: '/plan' },
    );
  }

  it('erases the saved plan and reopens the wizard from the start once the user confirms', async () => {
    const user = userEvent.setup();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderWithWizardRoute();

    await user.click(screen.getByRole('button', { name: finishedPlanContent.newPlanLabel }));
    expect(confirm).toHaveBeenCalledWith(finishedPlanContent.newPlanConfirm);
    expect(loadPlan()).toBeNull();
    expect(loadStep()).toBe(0);
    expect(screen.getByText('Wizard opened')).toBeInTheDocument();
  });

  it('keeps the plan untouched when the user cancels', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderWithWizardRoute();

    await user.click(screen.getByRole('button', { name: finishedPlanContent.newPlanLabel }));
    expect(loadPlan()).toEqual(savedPlan);
    expect(screen.getByRole('heading', { name: 'Warning Signs' })).toBeInTheDocument();
  });
});
