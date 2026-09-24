import { SmartLink } from '../welcome/SmartLink';
import { ChevronRightIcon } from '../welcome/icons';
import { useAccessibilityContent } from '../../data/accessibilityContent';
import { useResourcesContent } from '../../data/resourcesContent';

export function HelpResourcesPanel() {
  const content = useAccessibilityContent().help;
  const { lifelineCard, trevorCard } = useResourcesContent();
  const CARDS = [trevorCard, lifelineCard];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-medium text-black">{content.heading}</h3>
        <p className="mt-1 text-sm text-black/70">{content.body}</p>
      </div>

      <div className="flex flex-col gap-3">
        {CARDS.map((card) => (
          <div key={card.heading} className="flex flex-col gap-2 rounded-2xl border-2 border-black bg-brand-purple-light p-4">
            <h4 className="text-base font-medium text-white">{card.heading}</h4>
            <SmartLink
              to={card.action.to}
              className="inline-flex items-center gap-1 text-sm font-medium text-white transition hover:opacity-80"
            >
              {card.action.label}
              <ChevronRightIcon className="h-4 w-4" />
            </SmartLink>
          </div>
        ))}
      </div>

      <SmartLink
        to={content.viewAllTo}
        className="inline-flex items-center justify-center gap-1 rounded-full border-2 border-black px-4 py-3 text-sm font-medium text-black transition hover:bg-black/5"
      >
        {content.viewAllLabel}
        <ChevronRightIcon className="h-4 w-4" />
      </SmartLink>
    </div>
  );
}
