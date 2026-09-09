import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelpResourcesPanel } from './HelpResourcesPanel';
import { lifelineCard, trevorCard } from '../../data/resourcesContent';
import { accessibilityWidgetContent } from '../../data/accessibilityContent';

describe('HelpResourcesPanel', () => {
  it('shows the Trevor and Lifeline cards with working links', () => {
    render(
      <MemoryRouter>
        <HelpResourcesPanel />
      </MemoryRouter>,
    );

    expect(screen.getByText(trevorCard.heading)).toBeInTheDocument();
    expect(screen.getByText(lifelineCard.heading)).toBeInTheDocument();

    // Both cards happen to share the same action label ("Go to the website"),
    // so assert on the set of hrefs rather than a single named link.
    const actionHrefs = screen
      .getAllByRole('link', { name: new RegExp(trevorCard.action.label) })
      .map((link) => link.getAttribute('href'));
    expect(actionHrefs).toContain(trevorCard.action.to);
    expect(actionHrefs).toContain(lifelineCard.action.to);
  });

  it('links to the full resources page', () => {
    render(
      <MemoryRouter>
        <HelpResourcesPanel />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: new RegExp(accessibilityWidgetContent.help.viewAllLabel) })).toHaveAttribute(
      'href',
      accessibilityWidgetContent.help.viewAllTo,
    );
  });
});
