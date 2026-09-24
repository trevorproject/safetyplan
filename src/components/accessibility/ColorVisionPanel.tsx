import { useAccessibility } from '../../context/accessibility';
import type { ColorVisionMode } from '../../context/accessibility';
import { useAccessibilityContent } from '../../data/accessibilityContent';

const MODES: ColorVisionMode[] = ['none', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'];

export function ColorVisionPanel() {
  const { colorVisionMode, setColorVisionMode } = useAccessibility();
  const content = useAccessibilityContent().vision;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-medium text-black">{content.heading}</h3>
        <p className="mt-1 text-sm text-black/70">{content.body}</p>
      </div>

      <div role="radiogroup" aria-label={content.heading} className="flex flex-col gap-2">
        {MODES.map((mode) => (
          <label
            key={mode}
            className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 text-sm transition ${
              colorVisionMode === mode ? 'border-brand-purple bg-brand-purple/10 font-medium text-black' : 'border-black/20 text-black'
            }`}
          >
            <input
              type="radio"
              name="color-vision-mode"
              checked={colorVisionMode === mode}
              onChange={() => setColorVisionMode(mode)}
              className="h-5 w-5 accent-brand-purple"
            />
            {content.options[mode]}
          </label>
        ))}
      </div>
    </div>
  );
}
