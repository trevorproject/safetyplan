import gardenIllustration from '../../assets/TTP_BrandIllustrations_TogetherWeGrow_Horizontal.webp';
import trevorLogo from '../../assets/ttp_logo_primary_tagline_ko.png';
import { featureContent } from '../../data/welcomeContent';

export function FeatureShowcase() {
  return (
    <section className="flex flex-col items-center gap-20 bg-brand-purple px-6 py-16 lg:px-16 lg:py-28">
      <div className="flex w-full max-w-[1280px] flex-col gap-20">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start">
          <div className="flex w-full items-center justify-center rounded-xl bg-brand-purple-light p-8 lg:w-1/2 lg:min-h-[380px]">
            <img src={trevorLogo} alt="The Trevor Project - For Young LGBTQ+ Lives" className="w-full max-w-[360px]" />
          </div>

          <div className="flex w-full flex-col gap-8 lg:w-1/2">
            <p className="text-lg leading-[160%] text-white lg:text-2xl">{featureContent.intro}</p>
            <div className="flex flex-col gap-8 sm:flex-row">
              {featureContent.items.map((item) => (
                <div key={item.heading} className="flex flex-1 flex-col gap-4">
                  <h3 className="font-script text-2xl leading-[160%] text-white">{item.heading}</h3>
                  <p className="text-sm leading-[160%] text-white">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <img
          src={gardenIllustration}
          alt=""
          className="h-auto w-full rounded-[40px] object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}
