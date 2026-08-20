import { SmartLink } from './SmartLink';
import { ChevronRightIcon } from './icons';

type PillVariant = 'solid' | 'outline' | 'muted' | 'script';

const VARIANT_CLASSES: Record<PillVariant, string> = {
  solid: 'border border-black bg-white text-black hover:bg-white/90',
  outline: 'border border-black text-black hover:bg-black/5',
  muted: 'bg-brand-gray-button border border-brand-ink text-black hover:brightness-95',
  script: 'font-script text-2xl text-inherit gap-2 px-0 py-0',
};

interface PillButtonProps {
  to: string;
  label: string;
  variant?: PillVariant;
  className?: string;
}

export function PillButton({ to, label, variant = 'solid', className = '' }: PillButtonProps) {
  if (variant === 'script') {
    return (
      <SmartLink
        to={to}
        className={`inline-flex items-center gap-2 font-script text-2xl transition hover:opacity-80 ${className}`}
      >
        {label}
        <ChevronRightIcon className="h-6 w-6" />
      </SmartLink>
    );
  }

  return (
    <SmartLink
      to={to}
      className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-normal leading-[160%] transition ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {label}
    </SmartLink>
  );
}
