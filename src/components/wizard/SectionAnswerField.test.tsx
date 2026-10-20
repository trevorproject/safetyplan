import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SectionAnswerField } from './SectionAnswerField';
import { buildPlanContent } from '../../data/wizardContent';
import { atEachBreakpoint, renderResponsive, expectResponsiveBaseline, BREAKPOINTS } from '../../test/responsive';

const OPTIONS = ['Crying', 'Self Harm', 'Isolation', 'Shaking'];

function setup(props: Partial<Parameters<typeof SectionAnswerField>[0]> = {}) {
  const onChange = vi.fn();
  const onToggle = vi.fn();
  const view = renderResponsive(
    <SectionAnswerField value="" onChange={onChange} suggestions={OPTIONS} selected={[]} onToggle={onToggle} {...props} />,
    BREAKPOINTS.mobile,
  );
  return { ...view, onChange, onToggle };
}

describe('SectionAnswerField', () => {
  it('offers a labelled free-text answer and every suggestion at all supported screen widths', () => {
    atEachBreakpoint(
      <SectionAnswerField value="" onChange={vi.fn()} suggestions={OPTIONS} selected={[]} onToggle={vi.fn()} />,
      ({ width }) => {
        expect(screen.getByRole('textbox', { name: buildPlanContent.answerLabel }), `textarea missing at ${width}px`).toBeInTheDocument();
        for (const option of OPTIONS) {
          expect(screen.getByRole('button', { name: option }), `"${option}" missing at ${width}px`).toBeInTheDocument();
        }
      },
    );
  });

  it('accepts multi-line paragraphs in the answer', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();
    const field = screen.getByRole('textbox', { name: buildPlanContent.answerLabel });
    expect(field.tagName).toBe('TEXTAREA');
    await user.type(field, 'a{Enter}b');
    expect(onChange).toHaveBeenLastCalledWith('b');
    expect(onChange).toHaveBeenCalledWith('\n');
  });

  it('shows the saved answer text', () => {
    setup({ value: 'First paragraph\n\nSecond paragraph' });
    expect(screen.getByRole('textbox', { name: buildPlanContent.answerLabel })).toHaveValue('First paragraph\n\nSecond paragraph');
  });

  it('treats suggestions as optional toggles that report pressed state', async () => {
    const user = userEvent.setup();
    const { onToggle } = setup({ selected: ['Crying'] });
    expect(screen.getByRole('button', { name: 'Crying' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Isolation' })).toHaveAttribute('aria-pressed', 'false');
    await user.click(screen.getByRole('button', { name: 'Isolation' }));
    expect(onToggle).toHaveBeenCalledWith('Isolation');
  });

  it('keeps earlier custom picks visible so they can be removed', () => {
    setup({ selected: ['My own sign'] });
    expect(screen.getByRole('button', { name: 'My own sign' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('wraps suggestions without forcing a fixed width on the narrowest phone', () => {
    const { container } = renderResponsive(
      <SectionAnswerField value="" onChange={vi.fn()} suggestions={OPTIONS} selected={[]} onToggle={vi.fn()} />,
      BREAKPOINTS.xs,
    );
    expectResponsiveBaseline(container);
  });
});
