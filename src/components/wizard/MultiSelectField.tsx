import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '../welcome/icons';
import { useWizardContent } from '../../data/wizardContent';

interface MultiSelectFieldProps {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  onAddCustom: (value: string) => void;
}

export function MultiSelectField({ options, selected, onToggle, onAddCustom }: MultiSelectFieldProps) {
  const { buildPlanContent } = useWizardContent();
  const [open, setOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const [otherValue, setOtherValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setOtherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const submitOther = () => {
    const value = otherValue.trim();
    if (value) {
      onAddCustom(value);
      setOtherValue('');
    }
    setOtherOpen(false);
  };

  const customSelections = selected.filter((item) => !options.includes(item));

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-full border-2 border-black bg-white px-5 py-3 text-left text-base text-black"
      >
        <span className={selected.length ? 'text-black' : 'text-black/50'}>
          {selected.length ? selected.join(', ') : buildPlanContent.selectPlaceholder}
        </span>
        <ChevronDownIcon className={`h-5 w-5 shrink-0 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 flex w-full flex-col gap-3 rounded-3xl border-2 border-black bg-white p-5">
          {options.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-3 text-base text-black">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
                className="h-5 w-5 shrink-0 rounded border-2 border-black accent-brand-purple"
              />
              {option}
            </label>
          ))}

          {customSelections.map((custom) => (
            <label key={custom} className="flex cursor-pointer items-center gap-3 text-base text-black">
              <input
                type="checkbox"
                checked
                onChange={() => onToggle(custom)}
                className="h-5 w-5 shrink-0 rounded border-2 border-black accent-brand-purple"
              />
              {custom}
            </label>
          ))}

          {otherOpen ? (
            <input
              autoFocus
              value={otherValue}
              onChange={(event) => setOtherValue(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && submitOther()}
              onBlur={submitOther}
              placeholder={buildPlanContent.otherLabel}
              className="w-full rounded-full border-2 border-black px-4 py-2 text-base text-black"
            />
          ) : (
            <button type="button" onClick={() => setOtherOpen(true)} className="flex items-center gap-3 text-left text-base text-black">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-black">+</span>
              {buildPlanContent.otherLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
