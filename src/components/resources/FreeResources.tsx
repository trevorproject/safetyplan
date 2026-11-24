import lifelineImage from '../../assets/988.webp';
import learnTogetherIllustration from '../../assets/TTP_BrandIllustrations_LearnTogether_Horizontal.webp';
import { SmartLink } from '../welcome/SmartLink';
import { ChevronRightIcon } from '../welcome/icons';
import { useResourcesContent } from '../../data/resourcesContent';
import { useRegion } from '../../context/region';
import { useLanguage } from '../../context/language';
import { formatPhoneNumber, toTelHref } from '../../lib/locale';
import { pickText, toAppRegion, useResources } from '../../hooks/useResources';

// Light cards on the purple section keep every resource easy to tell apart. Text on
// the cards is brand-ink on white (17.6:1) or white on neutral-900 in dark mode, and
// links are underlined in a purple that passes AA on the card (7.85:1 / 6.28:1).
const CARD_CLASS =
  'flex w-full flex-col overflow-hidden rounded-[32px] bg-white text-brand-ink shadow-lg ring-1 ring-black/5 dark:bg-neutral-900 dark:text-white dark:ring-white/10';
const CARD_BODY_CLASS = 'flex w-full flex-1 flex-col items-start gap-6 p-6 lg:p-8';
const CARD_HEADING_CLASS = 'text-xl font-medium leading-[140%] tracking-[0.01em] sm:text-2xl lg:text-[28px]';
const CARD_TEXT_CLASS = 'text-lg leading-[160%] text-brand-ink/90 dark:text-white/85';
const CARD_LINK_CLASS =
  'mt-auto inline-flex items-center gap-2 rounded text-lg font-semibold leading-[160%] text-brand-purple-dark underline decoration-2 underline-offset-4 transition hover:decoration-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-purple-dark dark:text-brand-purple-light dark:focus-visible:outline-brand-purple-light';

export function FreeResources() {
  const { freeResourcesContent, lifelineCard, trevorCard } = useResourcesContent();
  const { region } = useRegion();
  const { language } = useLanguage();
  const { resources } = useResources(region);

  return (
    <section className="flex flex-col items-center gap-20 bg-brand-purple px-6 pb-16 pt-[24px] lg:px-16 lg:pb-28">
      <div className="flex w-full max-w-[1280px] flex-col items-start gap-12 lg:gap-16">
        <div className="flex w-full max-w-[768px] flex-col items-start gap-4">
          <div className="flex flex-col items-start gap-6 lg:gap-8">
            <h2 className="text-3xl font-medium leading-[120%] tracking-[0.01em] text-white sm:text-4xl lg:text-[52px]">
              {freeResourcesContent.heading}
            </h2>
            <p className="text-lg leading-[160%] text-white lg:text-2xl">
              {freeResourcesContent.textLead}{' '}
              <span className="font-script-inline">{freeResourcesContent.textScript}</span>
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-stretch gap-8 lg:flex-row">
          <div className={`${CARD_CLASS} max-w-[608px] flex-1 lg:max-w-none`}>
            <img
              src={learnTogetherIllustration}
              alt={freeResourcesContent.learnTogetherImageAlt}
              className="h-[240px] w-full object-cover sm:h-[320px] lg:h-[405px]"
              loading="lazy"
            />
            <div className={CARD_BODY_CLASS}>
              <div className="flex flex-col items-start gap-4">
                <h3 className={CARD_HEADING_CLASS}>{trevorCard.heading}</h3>
                <p className={CARD_TEXT_CLASS}>
                  <span className="font-script-inline">{trevorCard.textScript}</span> {trevorCard.textRest}
                </p>
              </div>
              <SmartLink to={trevorCard.action.to} className={CARD_LINK_CLASS}>
                {trevorCard.action.label}
                <ChevronRightIcon className="h-6 w-6" />
              </SmartLink>
            </div>
          </div>

          {/* 988 only works in the United States. */}
          {region === 'us' && (
            <div className={`${CARD_CLASS} max-w-[608px] flex-1 lg:max-w-none`}>
              <img
                src={lifelineImage}
                alt={lifelineCard.imageAlt}
                className="h-[189px] w-full object-cover"
                loading="lazy"
              />
              <div className={CARD_BODY_CLASS}>
                <div className="flex flex-col items-start gap-4">
                  <h3 className={CARD_HEADING_CLASS}>{lifelineCard.heading}</h3>
                  <p className={CARD_TEXT_CLASS}>{lifelineCard.text}</p>
                </div>
                <SmartLink to={lifelineCard.action.to} className={CARD_LINK_CLASS}>
                  {lifelineCard.action.label}
                  <ChevronRightIcon className="h-6 w-6" />
                </SmartLink>
              </div>
            </div>
          )}
        </div>

        {/* The user's region first, then the international fallback (already
            sorted that way by useResources). */}
        {resources.length > 0 && (
          <ul className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => {
              const phoneRegion = toAppRegion(resource.region);
              const name = pickText(resource.name, language);
              const description = pickText(resource.description, language);
              return (
                <li key={resource.id} className={CARD_CLASS}>
                  {resource.imageUrl && (
                    <img
                      src={resource.imageUrl}
                      alt={name}
                      width={608}
                      height={405}
                      className="aspect-[608/405] h-auto w-full object-cover"
                    />
                  )}
                  <div className={CARD_BODY_CLASS}>
                    <div className="flex w-full flex-col items-start gap-4">
                      <h3 className={`w-full text-center ${CARD_HEADING_CLASS}`}>{name}</h3>
                      {description && <p className={CARD_TEXT_CLASS}>{description}</p>}
                    </div>
                    {/* mt-auto keeps the actions at the bottom of every card in a row. */}
                    <div className="mt-auto flex flex-col items-start gap-3">
                      {resource.url && (
                        <SmartLink to={resource.url} className={CARD_LINK_CLASS}>
                          {lifelineCard.action.label}
                          <ChevronRightIcon className="h-6 w-6" />
                        </SmartLink>
                      )}
                      {resource.phone && (
                        <a href={toTelHref(resource.phone, phoneRegion)} className={CARD_LINK_CLASS}>
                          {formatPhoneNumber(resource.phone, phoneRegion)}
                          <ChevronRightIcon className="h-6 w-6" />
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
