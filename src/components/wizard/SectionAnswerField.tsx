import { useId } from 'react';
import { useWizardContent } from '../../data/wizardContent';

interface SectionAnswerFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

/**
 * A wizard section's answer: a free-text area for the user's own words, with the
 * preset options offered underneath as optional suggestions they can tap to add.
 */
export function SectionAnswerField({ value, onChange, placeholder, suggestions, selected, onToggle }: SectionAnswerFieldProps) {
  const { buildPlanContent } = useWizardContent();
  const fieldId = useId();
  const suggestionsId = useId();

  // Picks saved before suggestions were translated, or typed through the old
  // "Other..." field, still show up so the user can see and remove them.
  const chips = [...suggestions, ...selected.filter((item) => !suggestions.includes(item))];

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor={fieldId} className="text-base font-medium text-black dark:text-white">
          {buildPlanContent.answerLabel}
        </label>
        <textarea
          id={fieldId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-h-40 w-full rounded-3xl border-2 border-black p-4 text-base text-black dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
        />
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
