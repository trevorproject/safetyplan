import type { ReactNode } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AccessibilityProvider } from '../../context/AccessibilityContext';
import { AccessibilityWidget } from './AccessibilityWidget';
import { SpeakableSection } from './SpeakableSection';
import { accessibilityWidgetContent } from '../../data/accessibilityContent';

function renderWidget(children: ReactNode = null) {
  return render(
    <MemoryRouter>
      <AccessibilityProvider>
        {children}
        <AccessibilityWidget />
      </AccessibilityProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.style.filter = '';
});

describe('AccessibilityWidget', () => {
  it('is closed by default and opens the panel from the fixed trigger', async () => {
    const user = userEvent.setup();
    renderWidget();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: accessibilityWidgetContent.triggerLabel }));
    expect(screen.getByRole('dialog', { name: accessibilityWidgetContent.heading })).toBeInTheDocument();
  });

  it('closes on the close button and on Escape, returning focus to the trigger', async () => {
    const user = userEvent.setup();
    renderWidget();
    const trigger = screen.getByRole('button', { name: accessibilityWidgetContent.triggerLabel });

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: accessibilityWidgetContent.closeLabel }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('switches between the reader, color vision and help tabs', async () => {
    const user = userEvent.setup();
    renderWidget();
    await user.click(screen.getByRole('button', { name: accessibilityWidgetContent.triggerLabel }));

    await user.click(screen.getByRole('tab', { name: accessibilityWidgetContent.tabs.vision }));
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: accessibilityWidgetContent.tabs.help }));
    expect(screen.getByText(accessibilityWidgetContent.help.heading)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: accessibilityWidgetContent.tabs.reader }));
    expect(screen.getByText(accessibilityWidgetContent.reader.emptyState)).toBeInTheDocument();
  });

  it('lists registered speakable sections and reads a chosen one aloud', async () => {
    const user = userEvent.setup();
    const speak = vi.fn();
    window.speechSynthesis.speak = speak;

    renderWidget(
      <SpeakableSection id="test-section">
        <h2>Test heading</h2>
        <p>Some body text.</p>
      </SpeakableSection>,
    );

    await user.click(screen.getByRole('button', { name: accessibilityWidgetContent.triggerLabel }));
    expect(screen.getByRole('heading', { name: 'Test heading' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Read section: Test heading' }));
    expect(speak).toHaveBeenCalledTimes(1);
  });

  it('persists the selected color vision mode and applies it as a page filter', async () => {
    const user = userEvent.setup();
    renderWidget();
    await user.click(screen.getByRole('button', { name: accessibilityWidgetContent.triggerLabel }));
    await user.click(screen.getByRole('tab', { name: accessibilityWidgetContent.tabs.vision }));
    await user.click(screen.getByLabelText(accessibilityWidgetContent.vision.options.deuteranopia));

    expect(window.localStorage.getItem('safety-plan-color-vision')).toBe('deuteranopia');
    expect(document.documentElement.style.filter).toContain('a11y-deuteranopia');
  });
});
