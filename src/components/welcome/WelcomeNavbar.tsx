import { useEffect, useRef, useState } from 'react';
import { SmartLink } from './SmartLink';
import { PillButton } from './PillButton';
import { ChevronDownIcon } from './icons';
import { ThemeToggle } from '../common/ThemeToggle';
import trevorLogo from '../../assets/ttp_logo_primary_ko.png';
import trevorAvatar from '../../assets/ttp_logo_avatar_ko.png';
import { useWelcomeContent } from '../../data/welcomeContent';
import { useLanguage } from '../../context/language';
import type { Language } from '../../context/language';

const NAV_LINK_CLASS = 'text-sm leading-[160%] text-white transition hover:opacity-70';

// Language option labels are always shown in their own language (not translated
// into whichever language is currently active), matching standard language-switcher UX.
const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

export function WelcomeNavbar() {
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { navLinks, navActions, navLanguageLabel, primaryNavAriaLabel, toggleMenuAriaLabel } = useWelcomeContent();
  const { language, setLanguage } = useLanguage();
  const langRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="relative flex items-center justify-center bg-brand-orange px-6 py-4 lg:px-16">
      <div className="flex w-full max-w-[1312px] items-center justify-between gap-8">
        <SmartLink to="/" className="shrink-0">
          <img src={trevorAvatar} alt="The Trevor Project" className="h-10 w-auto lg:hidden" />
          <img src={trevorLogo} alt="The Trevor Project" className="hidden h-14 w-auto lg:block" />
        </SmartLink>

        <nav
          aria-label={primaryNavAriaLabel}
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
        >
          {navLinks.map((link) => (
            <SmartLink key={link.label} to={link.to} className={NAV_LINK_CLASS}>
              {link.label}
            </SmartLink>
          ))}

          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((open) => !open)}
              className={`flex items-center gap-1 ${NAV_LINK_CLASS}`}
              aria-expanded={langOpen}
            >
              {navLanguageLabel}
              <ChevronDownIcon className={`h-4 w-4 transition ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute left-1/2 top-8 flex w-36 -translate-x-1/2 flex-col gap-4 rounded-3xl bg-brand-orange p-6 shadow-lg">
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => {
                      setLanguage(option.code);
                      setLangOpen(false);
                    }}
                    aria-pressed={language === option.code}
                    className={`text-left text-sm leading-[160%] text-white transition hover:opacity-70 ${
                      language === option.code ? 'font-semibold underline' : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <PillButton to={navActions.primary.to} label={navActions.primary.label} variant="solid" />
          <PillButton to={navActions.secondary.to} label={navActions.secondary.label} variant="outline" />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <PillButton to={navActions.primary.to} label={navActions.primary.label} variant="solid" />
          <PillButton to={navActions.secondary.to} label={navActions.secondary.label} variant="outline" />
          <ThemeToggle />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center justify-center text-white transition hover:opacity-70"
              aria-expanded={menuOpen}
              aria-label={toggleMenuAriaLabel}
            >
              <ChevronDownIcon className={`h-5 w-5 transition ${menuOpen ? 'rotate-180' : ''}`} />
            </button>
            {menuOpen && (
              <nav
                aria-label={primaryNavAriaLabel}
                className="absolute right-0 top-9 z-20 flex w-44 flex-col gap-4 rounded-3xl bg-brand-orange p-6 shadow-lg"
              >
                {navLinks.map((link) => (
                  <SmartLink
                    key={link.label}
                    to={link.to}
                    className="text-sm leading-[160%] text-white transition hover:opacity-70"
                  >
                    {link.label}
                  </SmartLink>
                ))}
                <span className="text-sm leading-[160%] text-white/70">{navLanguageLabel}</span>
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => setLanguage(option.code)}
                    aria-pressed={language === option.code}
                    className={`text-left text-sm leading-[160%] text-white transition hover:opacity-70 ${
                      language === option.code ? 'font-semibold underline' : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
