import { PillButton } from './PillButton';
import { ImagePlaceholderIcon } from './icons';
import { introContent } from '../../data/welcomeContent';

export function IntroSection() {
  return (
    <section className="flex flex-col items-center gap-20 bg-brand-gray px-6 py-16 lg:px-16 lg:py-28">
      <div className="flex w-full max-w-[1280px] flex-col items-center gap-20">
        <div className="flex w-full max-w-[768px] flex-col items-center gap-8 text-center">
          <h1 className="text-3xl font-medium leading-[120%] tracking-[0.01em] text-black sm:text-4xl lg:text-[52px]">
            {introContent.heading}
          </h1>
          <p className="text-lg leading-[160%] text-black lg:text-2xl">{introContent.body}</p>
          <PillButton to={introContent.cta.to} label={introContent.cta.label} variant="script" />
        </div>

        <div className="flex h-[300px] w-full max-w-[1280px] items-center justify-center rounded-[24px] bg-[#d9d9d9] lg:h-[580px]">
          <ImagePlaceholderIcon className="h-16 w-16 lg:h-24 lg:w-24" />
        </div>
      </div>
    </section>
  );
}
