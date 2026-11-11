import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { screen, within } from '@testing-library/react';
import { CompletedPlanPage } from './CompletedPlanPage';
import { completedPlanHeroContent, finishedPlanContent, reminderCardContent } from '../data/completedPlanContent';
import { loadPlan, loadStep, savePlan, saveStep } from '../lib/storage';
import * as planExport from '../lib/planExport';
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
      // Sharing is switched off for now (SHARE_ENABLED), so there is no Share button.
      expect(screen.queryByRole('button', { name: finishedPlanContent.shareLabel })).not.toBeInTheDocument();
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

  it('shows The Trevor Project logo only on the printed page', () => {
    renderResponsive(<CompletedPlanPage />, BREAKPOINTS.md);
    const logo = within(screen.getByRole('main')).getByRole('img', { name: 'The Trevor Project' });
    expect(logo.parentElement).toHaveClass('hidden', 'print:flex');
  });

  it('prints the reminder as a small black-and-white note without its on-screen-only parts', () => {
    renderResponsive(<CompletedPlanPage />, BREAKPOINTS.md);
    const heading = screen.getByRole('heading', { name: reminderCardContent.heading });
    const card = heading.closest('.rounded-3xl') as HTMLElement;
    expect(card).toHaveClass('print:bg-white', 'print:border', 'break-inside-avoid');
    expect(heading).toHaveClass('print:text-black', 'print:text-base');
    expect(within(card).getByRole('link', { name: reminderCardContent.action.label })).toHaveClass('print:hidden');
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

  it('shows the plan inside its own titled card', () => {
    savePlan({
      warningSigns: ['Crying'],
      copingStrategies: [],
      supports: [],
      environment: [],
      answers: { warningSigns: [''], copingStrategies: [''], supports: [''], environment: [''] },
      message: 'Thank you',
    });
    renderResponsive(<CompletedPlanPage />, BREAKPOINTS.md);

    const card = screen.getByRole('article', { name: finishedPlanContent.shareSubject });
    expect(card).toHaveClass('rounded-3xl', 'border-2');
    expect(within(card).getByRole('heading', { name: 'Warning Signs' })).toBeInTheDocument();
    expect(within(card).getByText('Thank you')).toBeInTheDocument();
    expect(within(card).queryByRole('button')).not.toBeInTheDocument();
  });

  it('leaves the card out when there is nothing in the plan yet', () => {
    renderResponsive(<CompletedPlanPage />, BREAKPOINTS.md);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
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

describe('CompletedPlanPage download', () => {
  const savedPlan = {
    warningSigns: ['Crying'],
    copingStrategies: [],
    supports: [],
    environment: [],
    answers: { warningSigns: ['I go quiet'], copingStrategies: [''], supports: [''], environment: [''] },
    message: '',
  };
  const { download } = finishedPlanContent;

  async function openFormats() {
    const user = userEvent.setup();
    savePlan(savedPlan);
    renderResponsive(<CompletedPlanPage />, BREAKPOINTS.md);
    const toggle = screen.getByRole('button', { name: download.label });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    return user;
  }

  it('offers the plan as a PDF or a text file', async () => {
    await openFormats();
    const formats = screen.getByRole('group', { name: download.formatsLabel });
    expect(within(formats).getAllByRole('button').map((button) => button.textContent)).toEqual([
      download.formats.pdf,
      download.formats.txt,
    ]);
  });

  it('downloads the chosen format with the plan in the current language', async () => {
    const downloadPlan = vi.spyOn(planExport, 'downloadPlan').mockResolvedValue();
    const user = await openFormats();

    await user.click(screen.getByRole('button', { name: download.formats.txt }));
    expect(downloadPlan).toHaveBeenCalledWith('txt', savedPlan, expect.objectContaining({ finishedPlanContent }), 'en');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows an error with a retry for the same format when the download fails', async () => {
    const downloadPlan = vi.spyOn(planExport, 'downloadPlan').mockRejectedValueOnce(new Error('offline'));
    const user = await openFormats();

    await user.click(screen.getByRole('button', { name: download.formats.pdf }));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(download.error);

    downloadPlan.mockResolvedValueOnce();
    await user.click(within(alert).getByRole('button', { name: download.retryLabel }));
    expect(downloadPlan).toHaveBeenLastCalledWith('pdf', savedPlan, expect.anything(), 'en');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('has nothing to download before the plan has any answers', () => {
    renderResponsive(<CompletedPlanPage />, BREAKPOINTS.md);
    expect(screen.queryByRole('button', { name: download.label })).not.toBeInTheDocument();
  });
});
