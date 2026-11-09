import { useEffect, useId, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { InfoIcon } from '../welcome/icons';

/** Delay before a hover-opened tip closes, so the pointer can move onto it. */
const HOVER_CLOSE_DELAY_MS = 200;

interface InfoTooltipProps {
  /** Accessible name of the info button. */
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * An info icon that shows a short tip below it. The tip opens on hover with a
 * mouse, and on tap, click, Enter or Space; it closes with Escape, another
 * click on the icon, or a tap anywhere else. The tip lives in a polite live
 * region so screen readers announce it when it opens. It is positioned against
 * the nearest `relative` ancestor, so the parent decides where it lines up.
 * Everything renders as inline elements so it can sit inside a paragraph.
 */
export function InfoTooltip({ label, children, className = '' }: InfoTooltipProps) {
  // `pinned` is false while the tip is only shown because the mouse is over the icon.
  const [open, setOpen] = useState<{ pinned: boolean } | null>(null);
  const tipId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (tipRef.current?.contains(document.activeElement)) buttonRef.current?.focus();
      setOpen(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!buttonRef.current?.contains(target) && !tipRef.current?.contains(target)) setOpen(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const hoverProps = (opens: boolean) => ({
    onPointerEnter: (event: ReactPointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      window.clearTimeout(hoverTimer.current);
      if (opens) setOpen((current) => current ?? { pinned: false });
    },
    onPointerLeave: (event: ReactPointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = window.setTimeout(
        () => setOpen((current) => (current?.pinned ? current : null)),
        HOVER_CLOSE_DELAY_MS,
      );
    },
  });

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={Boolean(open)}
        aria-controls={tipId}
        onClick={() => setOpen((current) => (current?.pinned ? null : { pinned: true }))}
        {...hoverProps(true)}
        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full align-middle text-brand-purple transition hover:bg-black/5 dark:text-brand-purple-light dark:hover:bg-white/10 print:hidden ${className}`}
      >
        <InfoIcon className="h-6 w-6" />
      </button>
      <span id={tipId} aria-live="polite" className="print:hidden">
        {open && (
          <span
            ref={tipRef}
            {...hoverProps(false)}
            className="absolute left-1/2 block top-full z-20 mt-2 w-full max-w-md -translate-x-1/2 rounded-2xl border border-black bg-white p-5 text-center text-base leading-[160%] text-black shadow-lg dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
          >
            {children}
          </span>
        )}
      </span>
    </>
  );
}
