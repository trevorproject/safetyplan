import reachForStarsIllustration from '../../assets/TTP_BrandIllustrations_ReachForTheStars_Horizontal.png';
import { wizardHeroContent } from '../../data/wizardContent';

export function WizardHero() {
  return (
    <section
      className="flex flex-col items-center gap-20 px-6 py-16 lg:px-16 lg:py-36"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${reachForStarsIllustration})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex w-full max-w-[1280px] flex-col items-center gap-20">
        <div className="flex w-full max-w-[768px] flex-col items-center gap-10 text-center">
          <h1 className="text-4xl font-medium leading-[120%] tracking-[0.01em] text-white sm:text-5xl lg:text-[72px]">
            {wizardHeroContent.heading}
          </h1>
          <p className="text-lg leading-[160%] text-white lg:text-2xl">{wizardHeroContent.body}</p>
        </div>
      </div>
    </section>
  );
}
