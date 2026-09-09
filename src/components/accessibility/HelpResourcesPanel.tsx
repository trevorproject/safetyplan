import { SmartLink } from '../welcome/SmartLink';
import { ChevronRightIcon } from '../welcome/icons';
import { accessibilityWidgetContent } from '../../data/accessibilityContent';
import { lifelineCard, trevorCard } from '../../data/resourcesContent';

const CARDS = [trevorCard, lifelineCard];

export function HelpResourcesPanel() {
  const content = accessibilityWidgetContent.help;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-medium text-black dark:text-white">{content.heading}</h3>
        <p className="mt-1 text-sm text-black/70 dark:text-white/70">{content.body}</p>
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
        className="inline-flex items-center justify-center gap-1 rounded-full border-2 border-black px-4 py-3 text-sm font-medium text-black transition hover:bg-black/5 dark:border-white dark:text-white dark:hover:bg-white/10"
      >
        {content.viewAllLabel}
        <ChevronRightIcon className="h-4 w-4" />
      </SmartLink>
    </div>
  );
}
