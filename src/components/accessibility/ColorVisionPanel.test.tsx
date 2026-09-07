import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccessibilityProvider } from '../../context/AccessibilityContext';
import { ColorVisionPanel } from './ColorVisionPanel';
import { accessibilityWidgetContent } from '../../data/accessibilityContent';

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.style.filter = '';
});

describe('ColorVisionPanel', () => {
  it('renders every color vision option with "Off" selected by default', () => {
    render(
      <AccessibilityProvider>
        <ColorVisionPanel />
      </AccessibilityProvider>,
    );
    Object.values(accessibilityWidgetContent.vision.options).forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
    expect(screen.getByLabelText(accessibilityWidgetContent.vision.options.none)).toBeChecked();
  });

  it('selects a mode and applies its filter to the document root', async () => {
    const user = userEvent.setup();
    render(
      <AccessibilityProvider>
        <ColorVisionPanel />
      </AccessibilityProvider>,
    );

    await user.click(screen.getByLabelText(accessibilityWidgetContent.vision.options.tritanopia));
    expect(screen.getByLabelText(accessibilityWidgetContent.vision.options.tritanopia)).toBeChecked();
    expect(document.documentElement.style.filter).toContain('a11y-tritanopia');
  });

  it('applies full grayscale for the achromatopsia option', async () => {
    const user = userEvent.setup();
    render(
      <AccessibilityProvider>
        <ColorVisionPanel />
      </AccessibilityProvider>,
    );

    await user.click(screen.getByLabelText(accessibilityWidgetContent.vision.options.achromatopsia));
    expect(document.documentElement.style.filter).toBe('grayscale(1)');
  });
});
