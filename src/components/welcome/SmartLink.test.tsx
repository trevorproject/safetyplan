import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { SmartLink } from './SmartLink';
import { atEachBreakpoint, renderResponsive, BREAKPOINTS } from '../../test/responsive';

describe('SmartLink responsiveness', () => {
  it('renders an internal router link at every screen width', () => {
    atEachBreakpoint(
      <SmartLink to="/resources" className="text-sm lg:text-base">
        Resources
      </SmartLink>,
      ({ width }) => {
        const link = screen.getByRole('link', { name: 'Resources' });
        expect(link, `missing at ${width}px`).toHaveAttribute('href', '/resources');
      },
    );
  });

  it('renders an external link that opens safely in a new tab at every width', () => {
    atEachBreakpoint(
      <SmartLink to="https://www.thetrevorproject.org" className="underline">
        Trevor Project
      </SmartLink>,
      () => {
        const link = screen.getByRole('link', { name: 'Trevor Project' });
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noreferrer');
      },
    );
  });

  it('forwards responsive utility classes untouched', () => {
    const { container } = renderResponsive(
      <SmartLink to="/" className="text-sm leading-[160%] lg:text-base">
        Home
      </SmartLink>,
      BREAKPOINTS.lg,
    );
    const link = container.querySelector('a')!;
    expect(link.className).toContain('lg:text-base');
  });
});
