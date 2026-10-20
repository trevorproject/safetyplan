import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WizardPage } from './WizardPage';
import { buildPlanContent } from '../data/wizardContent';
import { defaultConfig } from '../data/defaultConfig';
import { loadPlan, loadStep, saveStep } from '../lib/storage';
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

describe('WizardPage answers', () => {
  const steps = defaultConfig.en.wizardSteps;
  const answerField = () => screen.getByRole('textbox', { name: buildPlanContent.answerLabel });
  const continueButton = () => screen.getByRole('button', { name: buildPlanContent.continueLabel });

  it('gives every list section a free-text answer, with the preset options only as suggestions', async () => {
    const user = userEvent.setup();
    renderResponsive(<WizardPage />, BREAKPOINTS.md);
    for (const step of steps.slice(0, 4)) {
      expect(screen.getByRole('heading', { name: step.title })).toBeInTheDocument();
      expect(answerField()).toBeInTheDocument();
      for (const option of step.options ?? []) {
        expect(screen.getByRole('button', { name: option })).toHaveAttribute('aria-pressed', 'false');
      }
      await user.type(answerField(), `My answer for ${step.id}`);
      await user.click(continueButton());
    }
    expect(screen.getByRole('heading', { name: steps[4].title })).toBeInTheDocument();
  });

  it('lets the user continue by writing alone, without picking a suggestion', async () => {
    const user = userEvent.setup();
    renderResponsive(<WizardPage />, BREAKPOINTS.md);
    expect(continueButton()).toBeDisabled();
    await user.type(answerField(), 'I stop answering messages');
    expect(continueButton()).toBeEnabled();
  });

  it('lets the user continue by picking a suggestion alone', async () => {
    const user = userEvent.setup();
    renderResponsive(<WizardPage />, BREAKPOINTS.md);
    await user.click(screen.getByRole('button', { name: 'Crying' }));
    expect(continueButton()).toBeEnabled();
  });

  it('saves the written answer and keeps it unchanged when navigating back', async () => {
    const user = userEvent.setup();
    renderResponsive(<WizardPage />, BREAKPOINTS.md);
    await user.type(answerField(), 'First line{Enter}Second line');
    await user.click(screen.getByRole('button', { name: 'Isolation' }));
    expect(loadPlan()?.answers.warningSigns).toBe('First line\nSecond line');
    expect(loadPlan()?.warningSigns).toEqual(['Isolation']);

    await user.click(continueButton());
    await user.click(screen.getByRole('button', { name: buildPlanContent.backLabel }));
    expect(answerField()).toHaveValue('First line\nSecond line');
    expect(screen.getByRole('button', { name: 'Isolation' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('resumes from the section the user was last on', () => {
    saveStep(2);
    renderResponsive(<WizardPage />, BREAKPOINTS.md);
    expect(screen.getByRole('heading', { name: steps[2].title })).toBeInTheDocument();
    expect(screen.getByText(`3/${steps.length}`)).toBeInTheDocument();
  });

  it('starts over from the first section after a restart', async () => {
    const user = userEvent.setup();
    saveStep(3);
    renderResponsive(<WizardPage />, BREAKPOINTS.md);
    await user.click(screen.getByRole('button', { name: buildPlanContent.restartLabel }));
    expect(screen.getByRole('heading', { name: steps[0].title })).toBeInTheDocument();
    expect(loadStep()).toBe(0);
  });
});
