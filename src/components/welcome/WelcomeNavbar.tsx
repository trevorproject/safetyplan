import { useEffect, useRef, useState } from 'react';
import { SmartLink } from './SmartLink';
import { PillButton } from './PillButton';
import { ChevronDownIcon } from './icons';
import { ThemeToggle } from '../common/ThemeToggle';
import trevorLogo from '../../assets/ttp_logo_primary_ko.png';
import trevorAvatar from '../../assets/ttp_logo_avatar_ko.png';
import { useWelcomeContent } from '../../data/welcomeContent';
import { LANGUAGE_OPTIONS, useLanguage } from '../../context/language';
import { useRegion } from '../../context/region';

const NAV_LINK_CLASS = 'text-sm leading-[160%] text-white transition hover:opacity-70';

export function WelcomeNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    navLinks,
    navActions,
    navLanguageLabel,
    navRegionLabel,
    regionOptions,
    primaryNavAriaLabel,
    toggleMenuAriaLabel,
  } = useWelcomeContent();
  const { language, setLanguage } = useLanguage();
  const { region, setRegion } = useRegion();
  const menuRef = useRef<HTMLDivElement>(null);

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

          <NavDropdown label={navLanguageLabel} options={LANGUAGE_OPTIONS} value={language} onSelect={setLanguage} />
          <NavDropdown label={navRegionLabel} options={regionOptions} value={region} onSelect={setRegion} />
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
                <MobileOptionGroup
                  label={navLanguageLabel}
                  options={LANGUAGE_OPTIONS}
                  value={language}
                  onSelect={setLanguage}
                />
                <MobileOptionGroup label={navRegionLabel} options={regionOptions} value={region} onSelect={setRegion} />
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

interface OptionGroupProps<T extends string> {
  label: string;
  options: { code: T; label: string }[];
  value: T;
  onSelect: (code: T) => void;
}

function optionClass(selected: boolean) {
  return `text-left text-sm leading-[160%] text-white transition hover:opacity-70 ${
    selected ? 'font-semibold underline' : ''
  }`;
}

/** Desktop navbar dropdown (language, region). */
function NavDropdown<T extends string>({ label, options, value, onSelect }: OptionGroupProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        className={`flex items-center gap-1 ${NAV_LINK_CLASS}`}
        aria-expanded={open}
      >
        {label}
        <ChevronDownIcon className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full w-36 -translate-x-1/2 pt-2">
          <div className="flex flex-col gap-4 rounded-3xl bg-brand-orange p-6 shadow-lg">
            {options.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => {
                  onSelect(option.code);
                  setOpen(false);
                }}
                aria-pressed={value === option.code}
                className={optionClass(value === option.code)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** The same choices listed inline in the mobile menu. */
function MobileOptionGroup<T extends string>({ label, options, value, onSelect }: OptionGroupProps<T>) {
  return (
    <>
      <span className="text-sm leading-[160%] text-white/70">{label}</span>
      {options.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => onSelect(option.code)}
          aria-pressed={value === option.code}
          className={optionClass(value === option.code)}
        >
          {option.label}
        </button>
      ))}
    </>
  );
}
