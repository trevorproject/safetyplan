import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccessibilityProvider } from '../../context/AccessibilityContext';
import { ScreenReaderPanel } from './ScreenReaderPanel';
import { SpeakableSection } from './SpeakableSection';
import { accessibilityWidgetContent } from '../../data/accessibilityContent';

afterEach(() => {
  window.speechSynthesis.speak = () => {};
});

describe('ScreenReaderPanel', () => {
  it('shows an empty state when no sections are registered', () => {
    render(
      <AccessibilityProvider>
        <ScreenReaderPanel />
      </AccessibilityProvider>,
    );
    expect(screen.getByText(accessibilityWidgetContent.reader.emptyState)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: accessibilityWidgetContent.reader.readAllLabel })).toBeDisabled();
  });

  it('lists a registered section and reads it aloud, then offers pause/stop controls', async () => {
    const user = userEvent.setup();
    const speak = vi.fn();
    window.speechSynthesis.speak = speak;

    render(
      <AccessibilityProvider>
        <SpeakableSection id="s1">
          <h2>A section heading</h2>
          <p>Body copy.</p>
        </SpeakableSection>
        <ScreenReaderPanel />
      </AccessibilityProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Read section: A section heading' }));
    expect(speak).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: accessibilityWidgetContent.reader.pauseLabel })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: accessibilityWidgetContent.reader.stopLabel })).toBeInTheDocument();
  });

  it('shows an unsupported message when the browser has no speech synthesis', () => {
    const original = window.speechSynthesis;
    // @ts-expect-error simulating an unsupported browser for this test only
    delete window.speechSynthesis;

    render(
      <AccessibilityProvider>
        <ScreenReaderPanel />
      </AccessibilityProvider>,
    );
    expect(screen.getByText(accessibilityWidgetContent.reader.unsupported)).toBeInTheDocument();

    window.speechSynthesis = original;
  });
});
