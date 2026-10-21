import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SectionAnswerField } from './SectionAnswerField';
import { buildPlanContent } from '../../data/wizardContent';
import { atEachBreakpoint, renderResponsive, expectResponsiveBaseline, BREAKPOINTS } from '../../test/responsive';

const OPTIONS = ['Crying', 'Self Harm', 'Isolation', 'Shaking'];
const PLACEHOLDER = 'Warning sign';
const ADD_LABEL = 'Add another warning sign';

/** Holds the answers in state, like WizardPage does, so add / remove / type can be exercised end to end. */
function Harness({ initial = ['', '', ''], onChange = vi.fn() }: { initial?: string[]; onChange?: (values: string[]) => void }) {
  const [values, setValues] = useState(initial);
  return (
    <SectionAnswerField
      values={values}
      onChange={(next) => {
        setValues(next);
        onChange(next);
      }}
      placeholder={PLACEHOLDER}
      addLabel={ADD_LABEL}
      suggestions={OPTIONS}
      selected={[]}
      onToggle={vi.fn()}
    />
  );
}

const inputs = () => screen.getAllByRole('textbox');

describe('SectionAnswerField', () => {
  it('shows the answer inputs, the add button and every suggestion at all supported screen widths', () => {
    atEachBreakpoint(<Harness />, ({ width }) => {
      expect(inputs(), `inputs missing at ${width}px`).toHaveLength(3);
      expect(screen.getByRole('textbox', { name: `${PLACEHOLDER} 1` })).toHaveAttribute('placeholder', PLACEHOLDER);
      expect(screen.getByRole('button', { name: ADD_LABEL })).toBeInTheDocument();
      for (const option of OPTIONS) {
        expect(screen.getByRole('button', { name: option }), `"${option}" missing at ${width}px`).toBeInTheDocument();
      }
    });
  });

  it('adds another input and moves focus to it', async () => {
    const user = userEvent.setup();
    renderResponsive(<Harness />, BREAKPOINTS.mobile);
    await user.click(screen.getByRole('button', { name: ADD_LABEL }));
    expect(inputs()).toHaveLength(4);
    expect(screen.getByRole('textbox', { name: `${PLACEHOLDER} 4` })).toHaveFocus();
  });

  it('removes the chosen input and keeps the others as typed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderResponsive(<Harness initial={['First', 'Second', 'Third']} onChange={onChange} />, BREAKPOINTS.mobile);
    await user.click(screen.getByRole('button', { name: `${buildPlanContent.removeAnswerLabel} warning sign 2` }));
    expect(onChange).toHaveBeenLastCalledWith(['First', 'Third']);
    expect(inputs().map((input) => (input as HTMLInputElement).value)).toEqual(['First', 'Third']);
  });

  it('always keeps at least one input, without a remove button on it', async () => {
    const user = userEvent.setup();
    renderResponsive(<Harness initial={['Only one', 'Two']} />, BREAKPOINTS.mobile);
    await user.click(screen.getByRole('button', { name: `${buildPlanContent.removeAnswerLabel} warning sign 2` }));
    expect(inputs()).toHaveLength(1);
    expect(screen.queryByRole('button', { name: new RegExp(buildPlanContent.removeAnswerLabel) })).not.toBeInTheDocument();
  });

  it('reports what the user types in each input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderResponsive(<Harness onChange={onChange} />, BREAKPOINTS.mobile);
    await user.type(screen.getByRole('textbox', { name: `${PLACEHOLDER} 2` }), 'Shaky');
    expect(onChange).toHaveBeenLastCalledWith(['', 'Shaky', '']);
  });

  it('treats suggestions as optional toggles that report pressed state', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    renderResponsive(
      <SectionAnswerField values={['']} onChange={vi.fn()} suggestions={OPTIONS} selected={['Crying']} onToggle={onToggle} />,
      BREAKPOINTS.mobile,
    );
    expect(screen.getByRole('button', { name: 'Crying' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Isolation' })).toHaveAttribute('aria-pressed', 'false');
    await user.click(screen.getByRole('button', { name: 'Isolation' }));
    expect(onToggle).toHaveBeenCalledWith('Isolation');
  });

  it('keeps earlier custom picks visible so they can be removed', () => {
    renderResponsive(
      <SectionAnswerField values={['']} onChange={vi.fn()} suggestions={OPTIONS} selected={['My own sign']} onToggle={vi.fn()} />,
      BREAKPOINTS.mobile,
    );
    expect(screen.getByRole('button', { name: 'My own sign' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('falls back to the generic labels when the step has no placeholder or add label', () => {
    renderResponsive(
      <SectionAnswerField values={['']} onChange={vi.fn()} suggestions={[]} selected={[]} onToggle={vi.fn()} />,
      BREAKPOINTS.mobile,
    );
    expect(screen.getByRole('textbox', { name: `${buildPlanContent.answerLabel} 1` })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: buildPlanContent.addAnswerLabel })).toBeInTheDocument();
  });

  it('never forces a fixed width on the narrowest phone', () => {
    const { container } = renderResponsive(<Harness />, BREAKPOINTS.xs);
    expectResponsiveBaseline(container);
  });
});
