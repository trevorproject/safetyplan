import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface SmartLinkProps {
  to: string;
  className?: string;
  children: ReactNode;
}

/** Renders a router Link for internal paths, or a plain anchor for external URLs. */
export function SmartLink({ to, className, children }: SmartLinkProps) {
  if (to.startsWith('http')) {
    return (
      <a href={to} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}
