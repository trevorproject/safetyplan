import { useState } from 'react';
import { SmartLink } from './SmartLink';
import { PillButton } from './PillButton';
import { ChevronDownIcon } from './icons';
import trevorLogo from '../../assets/ttp_logo_oneline_ko.png';
import { navLinks, navActions } from '../../data/welcomeContent';

const NAV_LINK_CLASS = 'text-sm leading-[160%] text-black transition hover:opacity-70';

export function WelcomeNavbar() {
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="flex items-center justify-center bg-brand-orange px-6 py-4 lg:px-16">
      <div className="flex w-full max-w-[1312px] items-center justify-between gap-8">
        <SmartLink to="/">
          <img src={trevorLogo} alt="The Trevor Project" className="h-8 w-hug" />
        </SmartLink>

        <div className="hidden items-center gap-8 rounded-full border border-black px-8 py-3 lg:flex">
          <nav aria-label="Primary" className="flex items-center gap-8">
            {navLinks.map((link) => (
              <SmartLink key={link.label} to={link.to} className={NAV_LINK_CLASS}>
                {link.label}
              </SmartLink>
            ))}

            <div className="relative" onMouseLeave={() => setLangOpen(false)}>
              <button
                type="button"
                onClick={() => setLangOpen((open) => !open)}
                className={`flex items-center gap-1 ${NAV_LINK_CLASS}`}
                aria-expanded={langOpen}
              >
                Language
                <ChevronDownIcon className={`h-4 w-4 transition ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute left-0 top-8 flex w-36 flex-col gap-4 rounded-3xl border-2 border-black bg-brand-orange p-6">
                  <span className="text-sm leading-[160%] text-white">English</span>
                </div>
              )}
            </div>
          </nav>

          <PillButton to={navActions.primary.to} label={navActions.primary.label} variant="solid" />
          <PillButton to={navActions.secondary.to} label={navActions.secondary.label} variant="outline" />
        </div>

        <div className="lg:hidden">
          <PillButton to={navActions.primary.to} label={navActions.primary.label} variant="solid" />
        </div>
      </div>
    </header>
  );
}
