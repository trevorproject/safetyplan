import { useState } from 'react';
import { buildPlanContent } from '../../data/wizardContent';

interface CheckboxGridProps {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  onAddCustom: (value: string) => void;
}

export function CheckboxGrid({ options, selected, onToggle, onAddCustom }: CheckboxGridProps) {
  const [otherOpen, setOtherOpen] = useState(false);
  const [otherValue, setOtherValue] = useState('');

  const submitOther = () => {
    const value = otherValue.trim();
    if (value) {
      onAddCustom(value);
      setOtherValue('');
    }
    setOtherOpen(false);
  };

  return (
    <div className="grid w-full grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-center gap-3 text-base text-black dark:text-white">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
            className="h-5 w-5 shrink-0 rounded border-2 border-black accent-brand-purple dark:border-neutral-500"
          />
          {option}
        </label>
      ))}

      <div className="flex flex-col gap-3">
        {otherOpen ? (
          <input
            autoFocus
            value={otherValue}
            onChange={(event) => setOtherValue(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && submitOther()}
            onBlur={submitOther}
            placeholder={buildPlanContent.otherLabel}
            className="w-full rounded-full border-2 border-black px-4 py-2 text-base text-black dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
          />
        ) : (
          <button type="button" onClick={() => setOtherOpen(true)} className="flex items-center gap-3 text-left text-base text-black dark:text-white">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-black dark:border-neutral-500">+</span>
            {buildPlanContent.otherLabel}
          </button>
        )}
      </div>

      {selected.filter((item) => !options.includes(item)).map((custom) => (
        <label key={custom} className="flex cursor-pointer items-center gap-3 text-base text-black dark:text-white">
          <input
            type="checkbox"
            checked
            onChange={() => onToggle(custom)}
            className="h-5 w-5 shrink-0 rounded border-2 border-black accent-brand-purple dark:border-neutral-500"
          />
          {custom}
        </label>
      ))}
    </div>
  );
}
