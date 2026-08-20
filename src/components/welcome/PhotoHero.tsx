import laptopIllustration from '../../assets/TTP_BrandIllustrations_SharedResources_Horizontal.png';
import { PillButton } from './PillButton';
import { heroContent } from '../../data/welcomeContent';

export function PhotoHero() {
  return (
    <section
      className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-brand-purple px-6 py-20 lg:min-h-[816px] lg:px-16"
      style={{ backgroundImage: `url(${laptopIllustration})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="relative z-10 flex w-full max-w-[768px] flex-col items-center gap-8 text-center">
        <h2 className="text-4xl font-medium leading-[120%] tracking-[0.01em] text-white sm:text-5xl lg:text-[72px]">
          {heroContent.heading}
        </h2>
        <p className="text-lg leading-[160%] text-white lg:text-2xl">{heroContent.body}</p>
        <PillButton to={heroContent.cta.to} label={heroContent.cta.label} variant="muted" className="px-8 py-3" />
      </div>
    </section>
  );
}
