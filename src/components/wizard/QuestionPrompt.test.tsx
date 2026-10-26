import { describe, it, expect, afterEach } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuestionPrompt } from './QuestionPrompt';
import { questionHelpContent } from '../../data/wizardContent';
import { defaultConfig } from '../../data/defaultConfig';
import { LANGUAGE_STORAGE_KEY, type Language } from '../../context/language';
import { renderResponsive, expectImagesAreFluid, expectResponsiveBaseline, BREAKPOINTS } from '../../test/responsive';

const step = defaultConfig.en.wizardSteps.find((item) => item.id === 'coping')!;
const stepHelp = questionHelpContent.steps.find((item) => item.stepId === step.id)!;
const term = questionHelpContent.terms.find((item) => item.stepId === step.id)!;

const stepLabel = questionHelpContent.stepHelpLabel.replace('{title}', step.title);
const termLabel = questionHelpContent.termHelpLabel.replace('{term}', term.term);

function renderPrompt(width: number = BREAKPOINTS.md) {
  return renderResponsive(
    <>
      <QuestionPrompt stepId={step.id} title={step.title} description={step.description} />
      <button type="button">Continue</button>
    </>,
    width,
  );
}

const stepTrigger = () => screen.getByRole('button', { name: stepLabel });
const termTrigger = () => screen.getByRole('button', { name: termLabel });

describe('QuestionPrompt', () => {
  it('shows the question with an info icon and a trigger on the unclear term', () => {
    renderPrompt();
    expect(screen.getByRole('heading', { name: step.title })).toBeInTheDocument();
    expect(stepTrigger()).toHaveAttribute('aria-expanded', 'false');
    expect(termTrigger()).toHaveTextContent(term.term);
    expect(screen.getByText(step.description.split(term.term)[0].trim(), { exact: false })).toBeInTheDocument();
  });

  it('opens the explanation of the whole question from the info icon, without leaving the question', async () => {
    const user = userEvent.setup();
    renderPrompt();
    await user.click(stepTrigger());
    expect(stepTrigger()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(stepHelp.text)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: step.title })).toBeInTheDocument();
  });

  it('explains a specific term, with an example, without repeating the term as a title', async () => {
    const user = userEvent.setup();
    renderPrompt();
    await user.click(termTrigger());
    const region = document.getElementById(termTrigger().getAttribute('aria-controls')!)!;
    expect(region).not.toHaveTextContent(term.term);
    expect(screen.getByText(term.explanation)).toBeInTheDocument();
    expect(screen.getByText(term.example)).toBeInTheDocument();
    expect(screen.queryByText(stepHelp.text)).not.toBeInTheDocument();
  });

  it('opens on mouse hover and closes again when the mouse leaves', async () => {
    renderPrompt();
    fireEvent.pointerEnter(termTrigger(), { pointerType: 'mouse' });
    expect(screen.getByText(term.explanation)).toBeInTheDocument();
    fireEvent.pointerLeave(termTrigger(), { pointerType: 'mouse' });
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(screen.queryByText(term.explanation)).not.toBeInTheDocument();
  });

  it('stays open after a click even when the mouse leaves', async () => {
    const user = userEvent.setup();
    renderPrompt();
    await user.click(termTrigger());
    fireEvent.pointerLeave(termTrigger(), { pointerType: 'mouse' });
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(screen.getByText(term.explanation)).toBeInTheDocument();
  });

  it('does not open on touch hover, only on tap', () => {
    renderPrompt(BREAKPOINTS.mobile);
    fireEvent.pointerEnter(termTrigger(), { pointerType: 'touch' });
    expect(screen.queryByText(term.explanation)).not.toBeInTheDocument();
  });

  it('closes when tapping elsewhere on the page', async () => {
    const user = userEvent.setup();
    renderPrompt(BREAKPOINTS.mobile);
    await user.click(termTrigger());
    await user.click(screen.getByRole('heading', { name: step.title }));
    expect(screen.queryByText(term.explanation)).not.toBeInTheDocument();
  });

  it('closes from its close control and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderPrompt(BREAKPOINTS.mobile);
    await user.click(stepTrigger());
    await user.click(screen.getByRole('button', { name: questionHelpContent.closeLabel }));
    expect(screen.queryByText(stepHelp.text)).not.toBeInTheDocument();
    expect(stepTrigger()).toHaveFocus();
  });

  it('opens and closes with the keyboard', async () => {
    const user = userEvent.setup();
    renderPrompt();
    await user.tab();
    expect(stepTrigger()).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByText(stepHelp.text)).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByText(stepHelp.text)).not.toBeInTheDocument();

    await user.tab();
    expect(termTrigger()).toHaveFocus();
    await user.keyboard(' ');
    expect(screen.getByText(term.explanation)).toBeInTheDocument();
    await user.keyboard(' ');
    expect(screen.queryByText(term.explanation)).not.toBeInTheDocument();
  });

  it('announces the explanation to screen readers through a live region the triggers point at', async () => {
    const user = userEvent.setup();
    renderPrompt();
    const region = document.getElementById(termTrigger().getAttribute('aria-controls')!)!;
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(stepTrigger()).toHaveAttribute('aria-controls', region.id);
    await user.click(termTrigger());
    expect(region).toHaveTextContent(term.explanation);
  });

  it('shows the explanation in the flow below the question on small screens, so it covers nothing', async () => {
    const user = userEvent.setup();
    const { container } = renderPrompt(BREAKPOINTS.xs);
    await user.click(stepTrigger());
    const region = document.getElementById(stepTrigger().getAttribute('aria-controls')!)!;
    const description = termTrigger().closest('p')!;
    expect(description.compareDocumentPosition(region) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    for (const node of [region, ...region.querySelectorAll('*')]) {
      const classes = (node.getAttribute('class') ?? '').split(/\s+/);
      expect(classes).not.toContain('fixed');
      if (node.parentElement === region) expect(classes).not.toContain('absolute');
    }
    expectImagesAreFluid(container);
    expectResponsiveBaseline(container);
  });

  it('only marks a term the question actually contains', () => {
    renderResponsive(<QuestionPrompt stepId={step.id} title={step.title} description="Something else entirely" />, BREAKPOINTS.md);
    expect(screen.queryByRole('button', { name: termLabel })).not.toBeInTheDocument();
    expect(screen.getByText('Something else entirely')).toBeInTheDocument();
  });

  it('leaves questions without help as plain text', () => {
    renderResponsive(<QuestionPrompt stepId="message" title="Share anything" description="Write anything" />, BREAKPOINTS.md);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('question help content', () => {
  afterEach(() => window.localStorage.clear());

  it.each<Language>(['en', 'es'])('turns every %s term into a trigger inside its question', (language) => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    for (const item of defaultConfig[language].wizardSteps) {
      const { unmount } = renderResponsive(
        <QuestionPrompt stepId={item.id} title={item.title} description={item.description} />,
        BREAKPOINTS.md,
      );
      // The info icon by the title plus the one term in each question; the free-text step has neither.
      expect(screen.queryAllByRole('button', { expanded: false }), item.id).toHaveLength(item.id === 'message' ? 0 : 2);
      unmount();
    }
  });
});
