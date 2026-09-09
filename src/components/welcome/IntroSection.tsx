import { PillButton } from './PillButton';
import { ImagePlaceholderIcon } from './icons';
import { introContent } from '../../data/welcomeContent';

export function IntroSection() {
  const [headingBefore, headingAfter] = introContent.heading.split(introContent.headingEmphasis);

  return (
    <section className="flex flex-col items-center gap-20 bg-brand-gray px-6 py-16 dark:bg-neutral-900 lg:px-16 lg:py-28">
      <div className="flex w-full max-w-[1280px] flex-col items-center gap-20">
        <div className="flex w-full max-w-[768px] flex-col items-center gap-8 text-center">
          <h1 className="text-3xl font-medium leading-[120%] tracking-[0.01em] text-black dark:text-white sm:text-4xl lg:text-[52px]">
            {headingBefore}
            <span className="font-script text-[60px] font-normal leading-none">{introContent.headingEmphasis}</span>
            {headingAfter}
          </h1>
          <p className="text-lg leading-[160%] text-black dark:text-white/80 lg:text-2xl">{introContent.body}</p>
          <PillButton to={introContent.cta.to} label={introContent.cta.label} variant="script" />
        </div>

        <div className="flex h-[300px] w-full max-w-[1280px] items-center justify-center rounded-[24px] bg-[#d9d9d9] dark:bg-neutral-800 lg:h-[580px]">
          <ImagePlaceholderIcon className="h-16 w-16 lg:h-24 lg:w-24" />
        </div>
      </div>
    </section>
  );
}
