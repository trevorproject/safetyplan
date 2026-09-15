import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './AppShell';
import {
  BREAKPOINT_LIST,
  setViewport,
  getClassSet,
  expectAdaptsAt,
  expectResponsiveBaseline,
  expectHasMaxWidthContainer,
  BREAKPOINTS,
} from '../../test/responsive';

function renderShell(width: number) {
  setViewport(width);
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/admin" element={<p>admin outlet</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('AppShell responsiveness', () => {
  it('renders the header nav, outlet content and footer at every screen width', () => {
    for (const { name, width } of BREAKPOINT_LIST) {
      const { unmount } = renderShell(width);
      expect(screen.getByRole('navigation', { name: 'Primary' }), `nav missing at ${name}`).toBeInTheDocument();
      expect(screen.getByText('admin outlet')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Resources' })).toBeInTheDocument();
      unmount();
    }
  });

  it('scales its gutters up across sm and lg and centers content in a max-width container', () => {
    const { container } = renderShell(BREAKPOINTS.lg);
    const classes = getClassSet(container);
    expect(classes.has('px-4')).toBe(true);
    expect(classes.has('sm:px-6')).toBe(true);
    expect(classes.has('lg:px-8')).toBe(true);
    expectAdaptsAt(container, ['sm', 'lg']);
    expectHasMaxWidthContainer(container);
    expectResponsiveBaseline(container);
  });
});
