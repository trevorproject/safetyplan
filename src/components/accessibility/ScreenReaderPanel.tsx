import { useAccessibility } from '../../context/accessibility';
import { useAccessibilityContent } from '../../data/accessibilityContent';
import { PauseIcon, PlayIcon, StopIcon } from './icons';

export function ScreenReaderPanel() {
  const { sections, speakSection, speakAll, pauseSpeech, resumeSpeech, stopSpeech, speakingId, isPaused, speechSupported } =
    useAccessibility();
  const content = useAccessibilityContent().reader;

  if (!speechSupported) {
    return <p className="text-sm text-black/70">{content.unsupported}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-medium text-black">{content.heading}</h3>
        <p className="mt-1 text-sm text-black/70">{content.body}</p>
      </div>

      <button
        type="button"
        onClick={speakAll}
        disabled={sections.length === 0}
        className="flex items-center justify-center gap-2 rounded-full bg-brand-purple px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <PlayIcon className="h-4 w-4" />
        {content.readAllLabel}
      </button>

      {sections.length === 0 ? (
        <p className="text-sm text-black/60">{content.emptyState}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sections.map((section) => {
            const isActive = speakingId === section.id;
            return (
              <li
                key={section.id}
                className="flex items-center justify-between gap-2 rounded-2xl border border-black/20 p-3"
              >
                <span className={`text-sm ${isActive ? 'font-medium text-brand-purple' : 'text-black'}`}>
                  {section.label}
                </span>
                <button
                  type="button"
                  onClick={() => speakSection(section.id)}
                  aria-label={`${content.readSectionLabel}: ${section.label}`}
                  className="flex items-center justify-center rounded-full border border-black p-2 text-black transition hover:bg-black/5"
                >
                  <PlayIcon className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {speakingId && (
        <div className="flex items-center justify-center gap-3 border-t border-black/10 pt-4">
          {isPaused ? (
            <button
              type="button"
              onClick={resumeSpeech}
              className="flex items-center gap-2 rounded-full border-2 border-black px-4 py-2 text-sm font-medium text-black transition hover:bg-black/5"
            >
              <PlayIcon className="h-4 w-4" />
              {content.resumeLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={pauseSpeech}
              className="flex items-center gap-2 rounded-full border-2 border-black px-4 py-2 text-sm font-medium text-black transition hover:bg-black/5"
            >
              <PauseIcon className="h-4 w-4" />
              {content.pauseLabel}
            </button>
          )}
          <button
            type="button"
            onClick={stopSpeech}
            className="flex items-center gap-2 rounded-full border-2 border-black px-4 py-2 text-sm font-medium text-black transition hover:bg-black/5"
          >
            <StopIcon className="h-4 w-4" />
            {content.stopLabel}
          </button>
        </div>
      )}
    </div>
  );
}
