import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckboxGrid } from './CheckboxGrid';
import { buildPlanContent } from '../../data/wizardContent';
import {
  atEachBreakpoint,
  renderResponsive,
  getClassSet,
  expectClass,
  expectResponsiveBaseline,
  BREAKPOINTS,
} from '../../test/responsive';

const OPTIONS = ['Crying', 'Self Harm', 'Isolation', 'Shaking'];

function setup(width: number) {
  const onToggle = vi.fn();
  const onAddCustom = vi.fn();
  const view = renderResponsive(
    <CheckboxGrid options={OPTIONS} selected={['Crying']} onToggle={onToggle} onAddCustom={onAddCustom} />,
    width,
  );
  return { ...view, onToggle, onAddCustom };
}

describe('CheckboxGrid responsiveness', () => {
  it('renders every option as a checkbox at all supported screen widths', () => {
    atEachBreakpoint(
      <CheckboxGrid options={OPTIONS} selected={[]} onToggle={vi.fn()} onAddCustom={vi.fn()} />,
      ({ width }) => {
        for (const option of OPTIONS) {
          expect(screen.getByLabelText(option), `"${option}" missing at ${width}px`).toBeInTheDocument();
        }
      },
    );
  });

  it('is one column on mobile and two columns from the sm breakpoint', () => {
    const { container } = setup(BREAKPOINTS.sm);
    expectClass(container, 'grid-cols-1');
    expectClass(container, 'sm:grid-cols-2');
  });

  it('keeps a single column below sm and never forces a fixed pixel width', () => {
    const { container } = setup(BREAKPOINTS.xs);
    expect(getClassSet(container).has('grid')).toBe(true);
    expectResponsiveBaseline(container);
  });

  it('reveals the free-text "Other" field on tap at mobile width', async () => {
    const user = userEvent.setup();
    setup(BREAKPOINTS.mobile);
    await user.click(screen.getByRole('button', { name: new RegExp(buildPlanContent.otherLabel.replace('...', '')) }));
    expect(screen.getByPlaceholderText(buildPlanContent.otherLabel)).toBeInTheDocument();
  });
});
