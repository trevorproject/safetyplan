import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { PillButton } from './PillButton';
import { atEachBreakpoint, renderResponsive, expectResponsiveBaseline, BREAKPOINTS } from '../../test/responsive';

describe('PillButton responsiveness', () => {
  it('renders its label and link target at every supported screen width', () => {
    atEachBreakpoint(<PillButton to="/wizard" label="Build your plan" />, ({ width }) => {
      const link = screen.getByRole('link', { name: 'Build your plan' });
      expect(link, `missing at ${width}px`).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/wizard');
    });
  });

  it.each(['solid', 'outline', 'muted', 'script'] as const)(
    'keeps the "%s" variant within layout bounds on the narrowest phone',
    (variant) => {
      const { container } = renderResponsive(
        <PillButton to="/wizard" label="Get Help" variant={variant} />,
        BREAKPOINTS.xs,
      );
      expectResponsiveBaseline(container);
      expect(screen.getByRole('link', { name: /Get Help/ })).toBeInTheDocument();
    },
  );

  it('exposes a tap-friendly hit area via padding utilities (non-script variants)', () => {
    const { container } = renderResponsive(<PillButton to="/x" label="Tap me" variant="solid" />, BREAKPOINTS.mobile);
    const link = container.querySelector('a')!;
    expect(link.className).toMatch(/px-\d/);
    expect(link.className).toMatch(/py-\d/);
  });
});
