import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminPage } from './AdminPage';
import { defaultConfig } from '../data/defaultConfig';
import {
  atEachBreakpoint,
  renderResponsive,
  getClassSet,
  expectAdaptsAt,
  expectHasMaxWidthContainer,
  expectResponsiveBaseline,
  BREAKPOINTS,
} from '../test/responsive';

beforeEach(() => {
  window.localStorage.clear();
});

async function unlock() {
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText('Password'), defaultConfig.adminPassword);
  await user.click(screen.getByRole('button', { name: 'Unlock editor' }));
  return user;
}

describe('AdminPage responsiveness', () => {
  it('renders the password gate, centered and overflow-safe, at every screen width', () => {
    atEachBreakpoint(<AdminPage />, ({ container, width }) => {
      expect(screen.getByPlaceholderText('Password'), `gate missing at ${width}px`).toBeInTheDocument();
      expectHasMaxWidthContainer(container);
      expectResponsiveBaseline(container);
    });
  });

  it('lays the editor out in one column on mobile and two from lg once unlocked', async () => {
    const { container } = renderResponsive(<AdminPage />, BREAKPOINTS.lg);
    await unlock();
    expect(screen.getByRole('heading', { name: 'General content' })).toBeInTheDocument();
    const classes = getClassSet(container);
    expect(classes.has('lg:grid-cols-2')).toBe(true);
    expect(classes.has('sm:flex-row')).toBe(true);
    expectAdaptsAt(container, ['sm', 'lg']);
  });

  it('keeps the unlocked editor overflow-safe on the narrowest phone', async () => {
    const { container } = renderResponsive(<AdminPage />, BREAKPOINTS.xs);
    await unlock();
    expectResponsiveBaseline(container);
  });
});
