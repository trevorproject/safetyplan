// Copy for the accessibility panel. Centralized here so component files stay free of literal strings.

export const accessibilityWidgetContent = {
  triggerLabel: 'Accessibility options',
  heading: 'Accessibility',
  closeLabel: 'Close accessibility panel',
  tabs: {
    reader: 'Screen reader',
    vision: 'Color vision',
    help: 'Get help',
  },
  reader: {
    heading: 'Read this page aloud',
    body: 'Choose a section below to hear it read aloud, or read the whole page at once.',
    readAllLabel: 'Read full page',
    pauseLabel: 'Pause',
    resumeLabel: 'Resume',
    stopLabel: 'Stop',
    readSectionLabel: 'Read section',
    emptyState: 'No readable sections were found on this page yet.',
    unsupported: "This browser doesn't support built-in reading aloud.",
  },
  vision: {
    heading: 'Color vision filters',
    body: 'Adjust the colors on this site to make them easier to tell apart.',
    options: {
      none: 'Off',
      protanopia: 'Protanopia (red-green)',
      deuteranopia: 'Deuteranopia (red-green)',
      tritanopia: 'Tritanopia (blue-yellow)',
      achromatopsia: 'Grayscale',
    },
  },
  help: {
    heading: 'Get help now',
    body: 'These resources are available anytime, from any page.',
    viewAllLabel: 'See all resources',
    viewAllTo: '/resources',
  },
};
