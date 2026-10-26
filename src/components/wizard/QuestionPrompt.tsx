import { useEffect, useId, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { InfoIcon } from '../welcome/icons';
import warningSignsIcon from '../../assets/TTP_IconsLibrary_White_Program - Education + Public Awareness.webp';
import copingIcon from '../../assets/TTP_IconsLibrary_White_Volunteer.webp';
import supportsIcon from '../../assets/TTP_IconsLibrary_White_Program - Crisis Services.webp';
import environmentIcon from '../../assets/TTP_IconsLibrary_White_Work at Trevor.webp';
import { useWizardContent } from '../../data/wizardContent';

const STEP_ICONS: Record<string, string> = {
  'warning-signs': warningSignsIcon,
  coping: copingIcon,
  supports: supportsIcon,
  environment: environmentIcon,
};

/** Delay before a hover-opened explanation closes, so the pointer can wander a little. */
const HOVER_CLOSE_DELAY_MS = 200;

/** The id of the explanation for the question as a whole; terms use their index. */
const STEP_TIP = 'step';

/** Marks each trigger with the id of the explanation it opens. */
const TRIGGER_ATTRIBUTE = 'data-question-tip';

type Term = ReturnType<typeof useWizardContent>['questionHelpContent']['terms'][number];
type Segment = string | { text: string; term: Term; index: number };

/** Splits `text` around the first occurrence of each term, ignoring case. */
function splitOnTerms(text: string, terms: Term[]): Segment[] {
  const lower = text.toLocaleLowerCase();
  const matches = terms
    .map((term, index) => ({ term, index, start: lower.indexOf(term.term.toLocaleLowerCase()) }))
    .filter((match) => match.start !== -1)
    .sort((a, b) => a.start - b.start);

  const segments: Segment[] = [];
  let cursor = 0;
  for (const { term, index, start } of matches) {
    if (start < cursor) continue; // overlaps a term already placed
    if (start > cursor) segments.push(text.slice(cursor, start));
    const end = start + term.term.length;
    segments.push({ text: text.slice(start, end), term, index });
    cursor = end;
  }
  if (cursor < text.length) segments.push(text.slice(cursor));
  return segments;
}

interface QuestionPromptProps {
  stepId: string;
  title: string;
  description: string;
}

/**
 * A wizard question's title and description, with plain-language help next to
 * it: an info icon by the title explains the question as a whole, and unclear
 * phrases in the description are their own triggers. Help opens on hover with
 * a mouse, and on tap, click, Enter or Space; it closes with Escape, the close
 * button, or a tap anywhere else. The explanation appears below the question
 * text (never on top of it or the navigation) inside a polite live region, so
 * screen readers announce it when it opens.
 */
export function QuestionPrompt({ stepId, title, description }: QuestionPromptProps) {
  const { questionHelpContent: help } = useWizardContent();
  const stepHelp = help.steps.find((item) => item.stepId === stepId);
  const terms = help.terms.filter((item) => item.stepId === stepId);
  const segments = splitOnTerms(description, terms);

  // `pinned` is false while the explanation is only shown because the mouse is over its trigger.
  const [open, setOpen] = useState<{ id: string; pinned: boolean } | null>(null);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const findTrigger = (id: string) =>
    containerRef.current?.querySelector<HTMLButtonElement>(`[${TRIGGER_ATTRIBUTE}="${id}"]`);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (panelRef.current?.contains(document.activeElement)) findTrigger(open.id)?.focus();
      setOpen(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element;
      const onTrigger = containerRef.current?.contains(target) && target.closest(`[${TRIGGER_ATTRIBUTE}]`);
      if (!onTrigger && !panelRef.current?.contains(target)) setOpen(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const toggle = (id: string) => setOpen((current) => (current?.id === id && current.pinned ? null : { id, pinned: true }));

  const hoverProps = (id: string | null) => ({
    onPointerEnter: (event: ReactPointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      window.clearTimeout(hoverTimer.current);
      if (id) setOpen((current) => (current?.pinned ? current : { id, pinned: false }));
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

  const triggerProps = (id: string, label: string) => ({
    [TRIGGER_ATTRIBUTE]: id,
    type: 'button' as const,
    'aria-label': label,
    'aria-expanded': open?.id === id,
    'aria-controls': panelId,
    onClick: () => toggle(id),
    ...hoverProps(id),
  });

  const openTerm = open && open.id !== STEP_TIP ? terms[Number(open.id)] : undefined;
  const openStep = open?.id === STEP_TIP ? stepHelp : undefined;

  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-medium text-black dark:text-white">{title}</h3>
          {stepHelp && (
            <button
              {...triggerProps(STEP_TIP, help.stepHelpLabel.replace('{title}', title))}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-brand-purple transition hover:bg-brand-gray dark:text-brand-purple-light dark:hover:bg-neutral-800"
            >
              <InfoIcon className="h-6 w-6" />
            </button>
          )}
        </div>
        <p className="text-base text-black/70 dark:text-white/70">
          {segments.map((segment, index) =>
            typeof segment === 'string' ? (
              segment
            ) : (
              <button
                key={index}
                {...triggerProps(String(segment.index), help.termHelpLabel.replace('{term}', segment.term.term))}
                className="inline font-medium text-black underline decoration-brand-purple decoration-dotted decoration-2 underline-offset-4 transition hover:opacity-70 dark:text-white dark:decoration-brand-purple-light"
              >
                {segment.text}
                <InfoIcon className="ml-0.5 inline h-4 w-4 align-text-top text-brand-purple dark:text-brand-purple-light" />
              </button>
            ),
          )}
        </p>
      </div>

      <div id={panelId} aria-live="polite">
        {(openStep || openTerm) && (
          <div
            ref={panelRef}
            {...hoverProps(null)}
            className="relative flex flex-col gap-4 rounded-3xl border border-black bg-brand-orange p-6 pr-14 text-white sm:flex-row sm:items-center"
          >
            {openStep && (
              <>
                {STEP_ICONS[stepId] && (
                  <img src={STEP_ICONS[stepId]} alt="" className="h-20 w-20 shrink-0 object-contain sm:h-28 sm:w-28" />
                )}
                <p className="text-base leading-[160%]">{openStep.text}</p>
              </>
            )}
            {openTerm && (
              <div className="flex flex-col gap-2">
                <p className="text-base leading-[160%]">{openTerm.explanation}</p>
                <p className="text-base leading-[160%]">
                  <span className="font-medium">{help.exampleLabel}</span> {openTerm.example}
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                if (open) findTrigger(open.id)?.focus();
                setOpen(null);
              }}
              aria-label={help.closeLabel}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none text-white transition hover:bg-white/20"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
