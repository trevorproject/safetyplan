import { SmartLink } from '../welcome/SmartLink';
import { ChevronRightIcon } from '../welcome/icons';
import warningSignsIcon from '../../assets/TTP_IconsLibrary_White_Program - Education + Public Awareness.png';
import copingIcon from '../../assets/TTP_IconsLibrary_White_Volunteer.png';
import supportsIcon from '../../assets/TTP_IconsLibrary_White_Program - Crisis Services.png';
import environmentIcon from '../../assets/TTP_IconsLibrary_White_Work at Trevor.png';
import { howItWorksContent } from '../../data/wizardContent';

const CARD_ICONS = [warningSignsIcon, copingIcon, supportsIcon, environmentIcon];

export function HowItWorks() {
  return (
    <section className="flex flex-col items-center gap-16 bg-brand-gray px-6 py-16 lg:px-16 lg:py-24">
      <div className="flex w-full max-w-[1280px] flex-col items-center gap-16">
        <div className="flex w-full max-w-[768px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-medium leading-[120%] tracking-[0.01em] text-black sm:text-4xl lg:text-[52px]">
            {howItWorksContent.heading}
          </h2>
          <p className="text-lg leading-[160%] text-black lg:text-2xl">{howItWorksContent.body}</p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorksContent.cards.map((card, index) => (
            <div
              key={card.stepId}
              className="flex flex-col gap-6 rounded-3xl border border-black bg-brand-orange p-6"
            >
              <img src={CARD_ICONS[index]} alt="" className="h-64 w-64 object-contain brightness-0" />
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-medium leading-[140%] text-black">{card.heading}</h3>
                <p className="text-sm leading-[160%] text-black">{card.text}</p>
              </div>
              <SmartLink
                to={`#${card.stepId}`}
                className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-black transition hover:opacity-70"
              >
                {card.linkLabel}
                <ChevronRightIcon className="h-4 w-4" />
              </SmartLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
