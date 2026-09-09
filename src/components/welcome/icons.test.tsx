import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ChevronDownIcon, ChevronRightIcon, GlobeIcon, ImagePlaceholderIcon } from './icons';
import { BREAKPOINT_LIST } from '../../test/responsive';

const ICONS = [
  ['ChevronDownIcon', ChevronDownIcon],
  ['ChevronRightIcon', ChevronRightIcon],
  ['GlobeIcon', GlobeIcon],
  ['ImagePlaceholderIcon', ImagePlaceholderIcon],
] as const;

describe('icon responsiveness', () => {
  it.each(ICONS)('%s applies caller-provided responsive sizing classes', (_name, Icon) => {
    const { container } = render(<Icon className="h-4 w-4 lg:h-6 lg:w-6" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toBeInTheDocument();
    expect(svg.getAttribute('class')).toBe('h-4 w-4 lg:h-6 lg:w-6');
  });

  it.each(ICONS)('%s stays a decorative, scalable vector (viewBox + aria-hidden)', (_name, Icon) => {
    const { container } = render(<Icon className="h-6 w-6" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('viewBox');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    // No intrinsic pixel width/height that would stop it scaling with its box.
    expect(svg.getAttribute('style') ?? '').not.toMatch(/\d+px/);
  });

  it('renders identically regardless of simulated screen width', () => {
    for (const { width } of BREAKPOINT_LIST) {
      const { container, unmount } = render(<ChevronRightIcon className="h-6 w-6" />);
      expect(container.querySelector('svg'), `missing at ${width}px`).toBeInTheDocument();
      unmount();
    }
  });
});
