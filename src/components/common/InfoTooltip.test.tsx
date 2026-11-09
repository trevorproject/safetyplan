import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InfoTooltip } from './InfoTooltip';

function renderTip() {
  return render(
    <div>
      <p className="relative">
        Keep it close
        <InfoTooltip label="How to keep your plan">Print it or save it as a PDF.</InfoTooltip>
      </p>
      <button type="button">Elsewhere</button>
    </div>,
  );
}

describe('InfoTooltip', () => {
  it('starts closed, with the icon button pointing at the live region', () => {
    renderTip();
    const button = screen.getByRole('button', { name: 'How to keep your plan' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    const region = document.getElementById(button.getAttribute('aria-controls')!);
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(screen.queryByText('Print it or save it as a PDF.')).not.toBeInTheDocument();
  });

  it('opens on click and closes on a second click', async () => {
    const user = userEvent.setup();
    renderTip();
    const button = screen.getByRole('button', { name: 'How to keep your plan' });

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Print it or save it as a PDF.')).toBeInTheDocument();

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Print it or save it as a PDF.')).not.toBeInTheDocument();
  });

  it('opens with the keyboard and closes with Escape', async () => {
    const user = userEvent.setup();
    renderTip();
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Print it or save it as a PDF.')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Print it or save it as a PDF.')).not.toBeInTheDocument();
  });

  it('closes when the user taps anywhere else', async () => {
    const user = userEvent.setup();
    renderTip();
    await user.click(screen.getByRole('button', { name: 'How to keep your plan' }));
    await user.click(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(screen.queryByText('Print it or save it as a PDF.')).not.toBeInTheDocument();
  });

  it('opens while a mouse hovers the icon but ignores touch hovers', () => {
    renderTip();
    const button = screen.getByRole('button', { name: 'How to keep your plan' });

    fireEvent.pointerEnter(button, { pointerType: 'touch' });
    expect(screen.queryByText('Print it or save it as a PDF.')).not.toBeInTheDocument();

    fireEvent.pointerEnter(button, { pointerType: 'mouse' });
    expect(screen.getByText('Print it or save it as a PDF.')).toBeInTheDocument();
  });

  it('is left out of the printed page', () => {
    renderTip();
    expect(screen.getByRole('button', { name: 'How to keep your plan' })).toHaveClass('print:hidden');
  });
});
