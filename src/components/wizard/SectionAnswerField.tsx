import { useEffect, useId, useRef } from 'react';
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
 * offered underneath as optional suggestions they can tap to add.
 */
export function SectionAnswerField({ values, onChange, placeholder, addLabel, suggestions, selected, onToggle }: SectionAnswerFieldProps) {
  const { buildPlanContent } = useWizardContent();
  const answersId = useId();
  const suggestionsId = useId();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  // Which input should take focus after the list changes (a new one, or the one before a removed one).
  const pendingFocus = useRef<number | null>(null);

  const rows = values.length ? values : [''];
  const fieldLabel = placeholder ?? buildPlanContent.answerLabel;

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

  // Picks saved before suggestions were translated, or typed through the old
  // "Other..." field, still show up so the user can see and remove them.
  const chips = [...suggestions, ...selected.filter((item) => !suggestions.includes(item))];

  return (
    <div className="flex w-full flex-col gap-6">
      <div role="group" aria-labelledby={answersId} className="flex flex-col gap-3">
        <p id={answersId} className="text-base font-medium text-black dark:text-white">
          {buildPlanContent.answerLabel}
        </p>
        {rows.map((row, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              ref={(node) => {
                inputRefs.current[index] = node;
              }}
              value={row}
              onChange={(event) => updateRow(index, event.target.value)}
              placeholder={placeholder}
              aria-label={`${fieldLabel} ${index + 1}`}
              className="min-w-0 flex-1 rounded-2xl border-2 border-black px-4 py-3 text-base text-black dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
            />
            {rows.length > 1 && (
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
