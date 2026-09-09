import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useAccessibility } from '../../context/accessibility';

function humanizeId(id: string): string {
  return id
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

interface SpeakableSectionProps {
  /** Stable identifier for this section. Change it to force a fresh label lookup (e.g. per wizard step). */
  id: string;
  /** Optional explicit label. When omitted, the first heading rendered inside is used, falling back to a humanized id. */
  label?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Marks a block of page content as readable by the accessibility panel's
 * screen-reader tab. Renders as `display: contents` so it never affects
 * layout — it only exists to register a ref + label with AccessibilityContext.
 */
export function SpeakableSection({ id, label, className = 'contents', children }: SpeakableSectionProps) {
  const { registerSection, unregisterSection } = useAccessibility();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const derivedLabel = label ?? node?.querySelector('h1,h2,h3,h4')?.textContent?.trim() ?? humanizeId(id);
    registerSection({ id, label: derivedLabel, getNode: () => ref.current });
    return () => unregisterSection(id);
  }, [id, label, registerSection, unregisterSection]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
