import { SmartLink } from './SmartLink';
import trevorLogo from '../../assets/ttp_logo_oneline_ko.png';
import trevorAvatar from '../../assets/ttp_logo_avatar_ko.png';
import { footerNavLinks, footerLegalLinks, footerCredit } from '../../data/welcomeContent';

export function WelcomeFooter() {
  return (
    <footer className="flex flex-col bg-brand-gray">
      <div className="hidden items-center justify-center bg-brand-orange px-6 py-4 lg:flex lg:px-16">
        <img src={trevorLogo} alt="The Trevor Project" className="h-8 w-auto" />
      </div>

      <div className="flex flex-col items-center gap-16 px-6 py-16 lg:px-16">
        <div className="flex w-full max-w-[1280px] flex-col gap-16">
          <div className="flex flex-col gap-8">
            <nav aria-label="Footer" className="flex flex-col gap-6 lg:flex-row lg:flex-wrap lg:gap-8">
              {footerNavLinks.map((link) => (
                <SmartLink
                  key={link.label}
                  to={link.to}
                  className="text-base font-semibold leading-[160%] text-black hover:opacity-70 lg:text-sm"
                >
                  {link.label}
                </SmartLink>
              ))}
            </nav>
          </div>

          <div className="hidden flex-col gap-8 lg:flex">
            <hr className="border-t-2 border-[#4c4c4c]" />
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-6">
                {footerLegalLinks.map((link) => (
                  <SmartLink key={link.label} to={link.to} className="text-sm leading-[160%] text-black underline hover:opacity-70 dark:text-white">
                    {link.label}
                  </SmartLink>
                ))}
              </div>
              <SmartLink to={footerCredit.to} className="text-sm leading-[160%] text-black underline hover:opacity-70 dark:text-white">
                {footerCredit.label}
              </SmartLink>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 bg-brand-orange px-6 py-8 lg:hidden">
        {footerLegalLinks.map((link) => (
          <SmartLink key={link.label} to={link.to} className="text-sm leading-[160%] text-white underline hover:opacity-70">
            {link.label}
          </SmartLink>
        ))}
        <SmartLink to={footerCredit.to} className="text-sm leading-[160%] text-white underline hover:opacity-70">
          {footerCredit.label}
        </SmartLink>
        <img src={trevorAvatar} alt="The Trevor Project" className="mt-2 h-12 w-12" />
      </div>
    </footer>
  );
}
