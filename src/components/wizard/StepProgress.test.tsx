import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { StepProgress } from './StepProgress';
import { atEachBreakpoint, renderResponsive, getClassSet, expectResponsiveBaseline, BREAKPOINTS } from '../../test/responsive';

describe('StepProgress responsiveness', () => {
  it('renders the same number of segments and progress state at every screen width', () => {
    atEachBreakpoint(<StepProgress total={5} current={2} />, ({ width }) => {
      const bar = screen.getByRole('progressbar');
      expect(bar, `missing at ${width}px`).toHaveAttribute('aria-valuenow', '3');
      expect(bar).toHaveAttribute('aria-valuemax', '5');
      expect(bar.children).toHaveLength(5);
    });
  });

  it('is fluid: fills its column but is capped so it never overflows narrow screens', () => {
    const { container } = renderResponsive(<StepProgress total={6} current={0} />, BREAKPOINTS.xs);
    const bar = screen.getByRole('progressbar');
    expect(bar.className).toMatch(/w-full/);
    expect(bar.className).toMatch(/max-w-/);
    // Each segment flexes rather than taking a fixed width.
    getClassSet(container).forEach((c) => expect(c).not.toMatch(/^w-\[\d+px\]$/));
    expectResponsiveBaseline(container);
  });
});
