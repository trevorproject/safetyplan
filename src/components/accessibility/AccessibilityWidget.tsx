import { useEffect, useRef } from 'react';
import { useAccessibility } from '../../context/accessibility';
import type { AccessibilityTab } from '../../context/accessibility';
import { accessibilityWidgetContent } from '../../data/accessibilityContent';
import { AccessibilityIcon, CloseIcon } from './icons';
import { ColorVisionFilterDefs } from './colorVisionFilters';
import { ScreenReaderPanel } from './ScreenReaderPanel';
import { ColorVisionPanel } from './ColorVisionPanel';
import { HelpResourcesPanel } from './HelpResourcesPanel';

const TABS: { id: AccessibilityTab; label: string }[] = [
  { id: 'reader', label: accessibilityWidgetContent.tabs.reader },
  { id: 'vision', label: accessibilityWidgetContent.tabs.vision },
  { id: 'help', label: accessibilityWidgetContent.tabs.help },
];

export function AccessibilityWidget() {
  const { panelOpen, activeTab, setActiveTab, openPanel, closePanel } = useAccessibility();
  const panelHeadingRef = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (panelOpen) panelHeadingRef.current?.focus();
  }, [panelOpen]);

  useEffect(() => {
    if (!panelOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel();
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panelOpen, closePanel]);

  return (
    <>
      <ColorVisionFilterDefs />

      <button
        ref={triggerRef}
        type="button"
        onClick={() => (panelOpen ? closePanel() : openPanel())}
        aria-expanded={panelOpen}
        aria-controls="accessibility-panel"
        aria-label={accessibilityWidgetContent.triggerLabel}
        className="fixed right-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-2 rounded-l-2xl border-2 border-r-0 border-black bg-brand-purple px-3 py-4 text-white shadow-lg transition hover:opacity-90 print:hidden"
      >
        <AccessibilityIcon className="h-6 w-6" />
      </button>

      {panelOpen && (
        <div
          id="accessibility-panel"
          role="dialog"
          aria-label={accessibilityWidgetContent.heading}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col gap-6 overflow-y-auto border-l-2 border-black bg-white p-6 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 print:hidden"
        >
          <div className="flex items-center justify-between">
            <h2 ref={panelHeadingRef} tabIndex={-1} className="text-xl font-medium text-black outline-none dark:text-white">
              {accessibilityWidgetContent.heading}
            </h2>
            <button
              type="button"
              onClick={() => {
                closePanel();
                triggerRef.current?.focus();
              }}
              aria-label={accessibilityWidgetContent.closeLabel}
              className="rounded-full p-2 text-black transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div role="tablist" aria-label={accessibilityWidgetContent.heading} className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-full border-2 border-black px-3 py-2 text-sm font-medium transition dark:border-neutral-600 ${
                  activeTab === tab.id
                    ? 'bg-brand-purple text-white'
                    : 'bg-white text-black hover:bg-black/5 dark:bg-neutral-900 dark:text-white dark:hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div role="tabpanel">
            {activeTab === 'reader' && <ScreenReaderPanel />}
            {activeTab === 'vision' && <ColorVisionPanel />}
            {activeTab === 'help' && <HelpResourcesPanel />}
          </div>
        </div>
      )}
    </>
  );
}
