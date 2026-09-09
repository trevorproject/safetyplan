import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiSelectField } from './MultiSelectField';
import { buildPlanContent } from '../../data/wizardContent';
import {
  atEachBreakpoint,
  renderResponsive,
  getClassSet,
  expectResponsiveBaseline,
  BREAKPOINTS,
} from '../../test/responsive';

const OPTIONS = ['Friend', 'Therapist', 'Counselor', 'Lifeline'];

function setup(width: number, selected: string[] = []) {
  return renderResponsive(
    <MultiSelectField options={OPTIONS} selected={selected} onToggle={vi.fn()} onAddCustom={vi.fn()} />,
    width,
  );
}

describe('MultiSelectField responsiveness', () => {
  it('renders a full-width trigger showing the placeholder at every screen width', () => {
    atEachBreakpoint(
      <MultiSelectField options={OPTIONS} selected={[]} onToggle={vi.fn()} onAddCustom={vi.fn()} />,
      ({ container, width }) => {
        const trigger = screen.getByRole('button', { name: new RegExp(buildPlanContent.selectPlaceholder.replace('...', '')) });
        expect(trigger, `trigger missing at ${width}px`).toHaveAttribute('aria-expanded', 'false');
        expect(container.firstElementChild?.className).toMatch(/w-full/);
      },
    );
  });

  it('opens a full-width dropdown panel that tracks the field, not a fixed width', async () => {
    const user = userEvent.setup();
    const { container } = setup(BREAKPOINTS.xs);
    await user.click(screen.getByRole('button', { expanded: false }));
    expect(screen.getByLabelText('Friend')).toBeInTheDocument();
    const panel = container.querySelector('.absolute')!;
    expect(panel.className).toMatch(/w-full/);
    getClassSet(container).forEach((c) => expect(c).not.toMatch(/^w-\[\d+px\]$/));
  });

  it('stays overflow-safe at the narrowest supported width', () => {
    const { container } = setup(BREAKPOINTS.xs, ['Friend', 'Therapist']);
    expectResponsiveBaseline(container);
  });
});
