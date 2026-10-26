import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { fireEvent, screen } from '@testing-library/react';
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

  it('offers the reorder handle, up / down buttons and hint only when there is more than one answer', () => {
    renderResponsive(<Harness initial={['Only one']} />, BREAKPOINTS.mobile);
    expect(screen.queryByTestId('reorder-handle')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: new RegExp(buildPlanContent.moveUpLabel) })).not.toBeInTheDocument();
    expect(screen.queryByText(buildPlanContent.reorderHint)).not.toBeInTheDocument();
  });

  it('moves an answer with the up / down buttons, disabling them at either end', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderResponsive(<Harness initial={['First', 'Second', 'Third']} onChange={onChange} />, BREAKPOINTS.mobile);
    expect(screen.getAllByTestId('reorder-handle')).toHaveLength(3);
    expect(screen.getByRole('group', { name: buildPlanContent.answerLabel })).toHaveAccessibleDescription(buildPlanContent.reorderHint);
    expect(screen.getByRole('button', { name: `${buildPlanContent.moveUpLabel} warning sign 1` })).toBeDisabled();
    expect(screen.getByRole('button', { name: `${buildPlanContent.moveDownLabel} warning sign 3` })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: `${buildPlanContent.moveUpLabel} warning sign 3` }));
    expect(onChange).toHaveBeenLastCalledWith(['First', 'Third', 'Second']);
    await user.click(screen.getByRole('button', { name: `${buildPlanContent.moveDownLabel} warning sign 1` }));
    expect(onChange).toHaveBeenLastCalledWith(['Third', 'First', 'Second']);
    expect(inputs().map((input) => (input as HTMLInputElement).value)).toEqual(['Third', 'First', 'Second']);
  });

  it('keeps focus on the moved answer, switching to the other button when it reaches an end', async () => {
    const user = userEvent.setup();
    renderResponsive(<Harness initial={['First', 'Second', 'Third']} />, BREAKPOINTS.mobile);
    await user.click(screen.getByRole('button', { name: `${buildPlanContent.moveUpLabel} warning sign 3` }));
    expect(screen.getByRole('button', { name: `${buildPlanContent.moveUpLabel} warning sign 2` })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: `${buildPlanContent.moveDownLabel} warning sign 1` })).toHaveFocus();
    expect(inputs().map((input) => (input as HTMLInputElement).value)).toEqual(['Third', 'First', 'Second']);
  });

  it('announces the new position to screen readers', async () => {
    const user = userEvent.setup();
    renderResponsive(<Harness initial={['First', '', 'Third']} />, BREAKPOINTS.mobile);
    await user.click(screen.getByRole('button', { name: `${buildPlanContent.moveDownLabel} warning sign 1` }));
    expect(screen.getByText('First moved to position 2 of 3')).toBeInTheDocument();
    // A blank answer is named after its field instead.
    await user.click(screen.getByRole('button', { name: `${buildPlanContent.moveUpLabel} warning sign 2` }));
    expect(screen.getByText('First moved to position 1 of 3')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: `${buildPlanContent.moveUpLabel} warning sign 2` }));
    expect(screen.getByText(`${PLACEHOLDER} moved to position 1 of 3`)).toHaveAttribute('aria-live', 'polite');
  });

  describe('dragging', () => {
    const ROW_HEIGHT = 50;
    // jsdom has no layout, so give each row a 50px slot stacked from the top.
    const layOutRows = () => {
      inputs().forEach((input, index) => {
        vi.spyOn(input.parentElement!, 'getBoundingClientRect').mockReturnValue({ top: index * ROW_HEIGHT, height: ROW_HEIGHT } as DOMRect);
      });
    };

    it('reorders the list in real time while dragging a handle, with mouse or touch', () => {
      for (const pointerType of ['mouse', 'touch']) {
        const onChange = vi.fn();
        const { unmount } = renderResponsive(<Harness initial={['First', 'Second', 'Third']} onChange={onChange} />, BREAKPOINTS.mobile);
        layOutRows();
        const handle = screen.getAllByTestId('reorder-handle')[0];
        fireEvent.pointerDown(handle, { button: 0, pointerId: 1, pointerType, clientY: 25 });
        expect(inputs()[0]).toHaveClass('border-brand-purple');

        fireEvent.pointerMove(handle, { pointerId: 1, pointerType, clientY: 80 });
        expect(onChange).toHaveBeenLastCalledWith(['Second', 'First', 'Third']);
        expect(inputs()[1]).toHaveClass('border-brand-purple');

        fireEvent.pointerMove(handle, { pointerId: 1, pointerType, clientY: 140 });
        expect(onChange).toHaveBeenLastCalledWith(['Second', 'Third', 'First']);

        fireEvent.pointerUp(handle, { pointerId: 1, pointerType, clientY: 140 });
        expect(inputs().map((input) => (input as HTMLInputElement).value)).toEqual(['Second', 'Third', 'First']);
        expect(inputs()[2]).not.toHaveClass('border-brand-purple');
        expect(screen.getByText('First moved to position 3 of 3')).toBeInTheDocument();
        unmount();
      }
    });

    it('can drag an answer back up, and ignores moves that do not cross a row', () => {
      const onChange = vi.fn();
      renderResponsive(<Harness initial={['First', 'Second', 'Third']} onChange={onChange} />, BREAKPOINTS.mobile);
      layOutRows();
      const handle = screen.getAllByTestId('reorder-handle')[2];
      fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientY: 125 });
      fireEvent.pointerMove(handle, { pointerId: 1, clientY: 110 });
      expect(onChange).not.toHaveBeenCalled();
      fireEvent.pointerMove(handle, { pointerId: 1, clientY: 10 });
      expect(onChange).toHaveBeenLastCalledWith(['Third', 'First', 'Second']);
      fireEvent.pointerCancel(handle, { pointerId: 1 });
      expect(inputs()[0]).not.toHaveClass('border-brand-purple');
    });

    it('does nothing for pointer moves without a drag, or for a non-primary button', () => {
      const onChange = vi.fn();
      renderResponsive(<Harness initial={['First', 'Second']} onChange={onChange} />, BREAKPOINTS.mobile);
      layOutRows();
      const handle = screen.getAllByTestId('reorder-handle')[0];
      fireEvent.pointerMove(handle, { pointerId: 1, clientY: 80 });
      fireEvent.pointerDown(handle, { button: 2, pointerId: 1, clientY: 25 });
      fireEvent.pointerMove(handle, { pointerId: 1, clientY: 80 });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('keeps the page from scrolling under a touch drag', () => {
      renderResponsive(<Harness initial={['First', 'Second']} />, BREAKPOINTS.mobile);
      for (const handle of screen.getAllByTestId('reorder-handle')) {
        expect(handle).toHaveClass('touch-none');
        expect(handle).toHaveAttribute('aria-hidden', 'true');
      }
    });
  });

  it('never forces a fixed width on the narrowest phone', () => {
    const { container } = renderResponsive(<Harness />, BREAKPOINTS.xs);
    expectResponsiveBaseline(container);
  });
});
