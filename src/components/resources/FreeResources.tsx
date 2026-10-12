import lifelineImage from '../../assets/988.png';
import learnTogetherIllustration from '../../assets/TTP_BrandIllustrations_LearnTogether_Horizontal.png';
import { SmartLink } from '../welcome/SmartLink';
import { ChevronRightIcon } from '../welcome/icons';
import { useResourcesContent } from '../../data/resourcesContent';

export function FreeResources() {
  const { freeResourcesContent, lifelineCard, trevorCard } = useResourcesContent();

  return (
    <section className="flex flex-col items-center gap-20 bg-brand-purple px-6 pb-16 pt-[24px] lg:px-16 lg:pb-28">
      <div className="flex w-full max-w-[1280px] flex-col items-start gap-20">
        <div className="flex w-full max-w-[768px] flex-col items-start gap-4">
          <div className="flex flex-col items-start gap-12">
            <h2 className="text-3xl font-medium leading-[120%] tracking-[0.01em] text-black sm:text-4xl lg:text-[52px]">
              {freeResourcesContent.heading}
            </h2>
            <p className="text-lg leading-[160%] text-black lg:text-2xl">
              {freeResourcesContent.textLead}{' '}
              <span className="font-script text-lg lg:text-2xl">{freeResourcesContent.textScript}</span>
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-16 lg:flex-row">
          <div className="flex w-full max-w-[608px] flex-1 flex-col items-center gap-8">
            <img
              src={learnTogetherIllustration}
              alt={freeResourcesContent.learnTogetherImageAlt}
              className="h-[405px] w-full rounded-[40px] object-cover"
            />
            <div className="flex w-full flex-col items-start gap-6">
              <div className="flex flex-col items-start gap-4">
                <h3 className="text-2xl font-medium leading-[140%] tracking-[0.01em] text-black lg:text-[36px]">
                  {trevorCard.heading}
                </h3>
                <p className="text-xl leading-[160%] text-black">
                  <span className="font-script">{trevorCard.textScript}</span> {trevorCard.textRest}
                </p>
              </div>
              <SmartLink
                to={trevorCard.action.to}
                className="inline-flex items-center gap-2 text-lg leading-[160%] text-black transition hover:opacity-80"
              >
                {trevorCard.action.label}
                <ChevronRightIcon className="h-6 w-6" />
              </SmartLink>
            </div>
          </div>

          <div className="flex w-full max-w-[608px] flex-1 flex-col items-center gap-0.5">
            <img
              src={lifelineImage}
              alt={lifelineCard.imageAlt}
              className="h-[189px] w-full rounded-[40px] object-cover"
            />
            <div className="flex w-full flex-col items-start gap-6 pt-6">
              <div className="flex flex-col items-start gap-4">
                <h3 className="text-2xl font-medium leading-[140%] tracking-[0.01em] text-black lg:text-[36px]">
                  {lifelineCard.heading}
                </h3>
                <p className="text-lg leading-[160%] text-black">{lifelineCard.text}</p>
              </div>
              <SmartLink
                to={lifelineCard.action.to}
                className="inline-flex items-center gap-2 text-lg leading-[160%] text-black transition hover:opacity-80"
              >
                {lifelineCard.action.label}
                <ChevronRightIcon className="h-6 w-6" />
              </SmartLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
