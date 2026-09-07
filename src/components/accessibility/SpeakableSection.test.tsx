import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AccessibilityProvider } from '../../context/AccessibilityContext';
import { useAccessibility } from '../../context/accessibility';
import { SpeakableSection } from './SpeakableSection';

function SectionList() {
  const { sections } = useAccessibility();
  return (
    <ul>
      {sections.map((section) => (
        <li key={section.id}>{section.label}</li>
      ))}
    </ul>
  );
}

describe('SpeakableSection', () => {
  it('derives its label from the first heading rendered inside', () => {
    render(
      <AccessibilityProvider>
        <SpeakableSection id="s1">
          <h2>My Heading</h2>
          <p>Body text.</p>
        </SpeakableSection>
        <SectionList />
      </AccessibilityProvider>,
    );
    expect(screen.getByRole('heading', { name: 'My Heading' })).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveTextContent('My Heading');
  });

  it('falls back to a humanized id when no heading is present', () => {
    render(
      <AccessibilityProvider>
        <SpeakableSection id="plan-details">
          <p>Just a paragraph, no heading.</p>
        </SpeakableSection>
        <SectionList />
      </AccessibilityProvider>,
    );
    expect(screen.getByText('Plan Details')).toBeInTheDocument();
  });

  it('uses an explicit label override when provided', () => {
    render(
      <AccessibilityProvider>
        <SpeakableSection id="s2" label="Custom label">
          <h2>Ignored heading</h2>
        </SpeakableSection>
        <SectionList />
      </AccessibilityProvider>,
    );
    expect(screen.getByText('Custom label')).toBeInTheDocument();
    expect(screen.queryByText('Ignored heading')).toBeInTheDocument(); // still rendered, just not used as the label
  });

  it('unregisters itself on unmount', () => {
    function Wrapper({ show }: { show: boolean }) {
      return (
        <AccessibilityProvider>
          {show && (
            <SpeakableSection id="s3">
              <h2>Temporary</h2>
            </SpeakableSection>
          )}
          <SectionList />
        </AccessibilityProvider>
      );
    }
    const { rerender } = render(<Wrapper show={true} />);
    expect(screen.getByRole('listitem')).toHaveTextContent('Temporary');

    rerender(<Wrapper show={false} />);
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('renders with display: contents by default so it never affects layout', () => {
    render(
      <AccessibilityProvider>
        <SpeakableSection id="s4">
          <p data-testid="child">content</p>
        </SpeakableSection>
      </AccessibilityProvider>,
    );
    const child = screen.getByTestId('child');
    expect(child.parentElement).toHaveClass('contents');
  });
});
