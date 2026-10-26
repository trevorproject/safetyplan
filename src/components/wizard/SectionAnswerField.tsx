import { useEffect, useId, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { useWizardContent } from '../../data/wizardContent';

interface SectionAnswerFieldProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  suggestions: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

/**
 * A wizard section's answer: one input per thing the user wants to write in
 * their own words (they can add and remove inputs), with the preset options
 * offered underneath as optional suggestions they can tap to add. With more
 * than one input the user can rank their answers: drag a row by its handle
 * (mouse, touch or pen) or use its up / down buttons, and screen readers hear
 * the new position.
 */
export function SectionAnswerField({ values, onChange, placeholder, addLabel, suggestions, selected, onToggle }: SectionAnswerFieldProps) {
  const { buildPlanContent } = useWizardContent();
  const answersId = useId();
  const suggestionsId = useId();
  const hintId = useId();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const moveUpRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const moveDownRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  // Which input should take focus after the list changes (a new one, or the one before a removed one).
  const pendingFocus = useRef<number | null>(null);
  // The row being dragged and the order so far, kept in a ref so quick pointer
  // moves never reorder from a list that hasn't re-rendered yet.
  const drag = useRef<{ index: number; rows: string[] } | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const rows = values.length ? values : [''];
  const fieldLabel = placeholder ?? buildPlanContent.answerLabel;
  const canReorder = rows.length > 1;

  useEffect(() => {
    if (pendingFocus.current === null) return;
    const target = inputRefs.current[pendingFocus.current];
    pendingFocus.current = null;
    (target ?? addButtonRef.current)?.focus();
  }, [rows.length]);

  const updateRow = (index: number, value: string) => onChange(rows.map((row, i) => (i === index ? value : row)));

  const addRow = () => {
    pendingFocus.current = rows.length;
    onChange([...rows, '']);
  };

  const removeRow = (index: number) => {
    pendingFocus.current = Math.max(index - 1, 0);
    onChange(rows.filter((_, i) => i !== index));
  };

  const moveRow = (list: string[], from: number, to: number) => {
    const next = [...list];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
    return next;
  };

  const announceMove = (answer: string, index: number, total: number) =>
    setAnnouncement(
      buildPlanContent.movedAnnouncement
        .replace('{answer}', answer.trim() || fieldLabel)
        .replace('{position}', String(index + 1))
        .replace('{total}', String(total)),
    );

  const moveWithButton = (index: number, to: number) => {
    moveRow(rows, index, to);
    announceMove(rows[index], to, rows.length);
    // Rows are keyed by position, so follow the answer to its new row; at either
    // end the button just used is disabled, so focus the opposite one.
    const movingUp = to < index;
    const atEnd = movingUp ? to === 0 : to === rows.length - 1;
    const refs = movingUp !== atEnd ? moveUpRefs : moveDownRefs;
    refs.current[to]?.focus();
  };

  const startDrag = (index: number, event: PointerEvent<HTMLSpanElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drag.current = { index, rows };
    setDragIndex(index);
  };

  // The dragged answer takes the place of every other row whose middle the pointer has passed.
  const dragTo = (event: PointerEvent<HTMLSpanElement>) => {
    const current = drag.current;
    if (!current) return;
    const target = rowRefs.current.slice(0, current.rows.length).reduce((count, row, i) => {
      if (i === current.index || !row) return count;
      const { top, height } = row.getBoundingClientRect();
      return event.clientY > top + height / 2 ? count + 1 : count;
    }, 0);
    if (target === current.index) return;
    drag.current = { index: target, rows: moveRow(current.rows, current.index, target) };
    setDragIndex(target);
  };

  const endDrag = () => {
    const current = drag.current;
    if (!current) return;
    drag.current = null;
    setDragIndex(null);
    announceMove(current.rows[current.index], current.index, current.rows.length);
  };

  // Picks saved before suggestions were translated, or typed through the old
  // "Other..." field, still show up so the user can see and remove them.
  const chips = [...suggestions, ...selected.filter((item) => !suggestions.includes(item))];

  return (
    <div className="flex w-full flex-col gap-6">
      <div role="group" aria-labelledby={answersId} aria-describedby={canReorder ? hintId : undefined} className="flex flex-col gap-3">
        <p id={answersId} className="text-base font-medium text-black dark:text-white">
          {buildPlanContent.answerLabel}
        </p>
        {canReorder && (
          <p id={hintId} className="text-sm text-black/70 dark:text-white/70">
            {buildPlanContent.reorderHint}
          </p>
        )}
        {rows.map((row, index) => (
          <div
            key={index}
            ref={(node) => {
              rowRefs.current[index] = node;
            }}
            className="flex items-center gap-2"
          >
            {canReorder && (
              // Pointer-only handle; keyboard and screen-reader users get the up / down buttons.
              <span
                aria-hidden="true"
                data-testid="reorder-handle"
                onPointerDown={(event) => startDrag(index, event)}
                onPointerMove={dragTo}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                className="flex h-10 w-10 shrink-0 cursor-grab touch-none select-none items-center justify-center rounded-full text-xl text-black/60 transition hover:bg-brand-gray hover:text-black active:cursor-grabbing dark:text-white/60 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                ⠿
              </span>
            )}
            <input
              ref={(node) => {
                inputRefs.current[index] = node;
              }}
              value={row}
              onChange={(event) => updateRow(index, event.target.value)}
              placeholder={placeholder}
              aria-label={`${fieldLabel} ${index + 1}`}
              className={`min-w-0 flex-1 rounded-2xl border-2 px-4 py-3 text-base text-black dark:bg-neutral-900 dark:text-white ${
                dragIndex === index ? 'border-brand-purple' : 'border-black dark:border-neutral-600'
              }`}
            />
            {canReorder && (
              <>
                <button
                  ref={(node) => {
                    moveUpRefs.current[index] = node;
                  }}
                  type="button"
                  onClick={() => moveWithButton(index, index - 1)}
                  disabled={index === 0}
                  aria-label={`${buildPlanContent.moveUpLabel} ${fieldLabel.toLowerCase()} ${index + 1}`}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-black/60 transition hover:bg-brand-gray hover:text-black disabled:cursor-not-allowed disabled:opacity-30 dark:text-white/60 dark:hover:bg-neutral-800 dark:hover:text-white"
                >
                  <span aria-hidden="true">↑</span>
                </button>
                <button
                  ref={(node) => {
                    moveDownRefs.current[index] = node;
                  }}
                  type="button"
                  onClick={() => moveWithButton(index, index + 1)}
                  disabled={index === rows.length - 1}
                  aria-label={`${buildPlanContent.moveDownLabel} ${fieldLabel.toLowerCase()} ${index + 1}`}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-black/60 transition hover:bg-brand-gray hover:text-black disabled:cursor-not-allowed disabled:opacity-30 dark:text-white/60 dark:hover:bg-neutral-800 dark:hover:text-white"
                >
                  <span aria-hidden="true">↓</span>
                </button>
              </>
            )}
            {canReorder && (
              <button
                type="button"
                onClick={() => removeRow(index)}
                aria-label={`${buildPlanContent.removeAnswerLabel} ${fieldLabel.toLowerCase()} ${index + 1}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-black/60 transition hover:bg-brand-gray hover:text-black dark:text-white/60 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                <span aria-hidden="true">×</span>
              </button>
            )}
          </div>
        ))}
        <button
          ref={addButtonRef}
          type="button"
          onClick={addRow}
          className="flex items-center gap-2 self-start text-sm font-medium uppercase tracking-[0.02em] text-brand-purple transition hover:opacity-70 dark:text-brand-purple-light"
        >
          <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-current leading-none">
            +
          </span>
          {addLabel ?? buildPlanContent.addAnswerLabel}
        </button>
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </div>

      {chips.length > 0 && (
        <div role="group" aria-labelledby={suggestionsId} className="flex flex-col gap-3">
          <p id={suggestionsId} className="text-sm text-black/70 dark:text-white/70">
            {buildPlanContent.suggestionsLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {chips.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onToggle(option)}
                  className={`flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-medium transition ${
                    isSelected
                      ? 'border-brand-purple bg-brand-purple text-white'
                      : 'border-black bg-white text-black hover:opacity-70 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white'
                  }`}
                >
                  <span aria-hidden="true">{isSelected ? '✓' : '+'}</span>
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
