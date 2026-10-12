import { Link, NavLink, Outlet } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAppShellContent } from '../../data/appShellContent';

const NAV_LINK_CLASS = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3 py-2 ${
    isActive
      ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
  }`;

export function AppShell() {
  const { brand, primaryNavAriaLabel, nav, footer } = useAppShellContent();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            {brand}
          </Link>
          <nav aria-label={primaryNavAriaLabel} className="flex items-center gap-2 text-sm font-medium">
            <NavLink to="/" className={NAV_LINK_CLASS}>
              {nav.welcome}
            </NavLink>
            <NavLink to="/resources" className={NAV_LINK_CLASS}>
              {nav.resources}
            </NavLink>
            <NavLink to="/wizard" className={NAV_LINK_CLASS}>
              {nav.plan}
            </NavLink>
            <NavLink to="/admin" className={NAV_LINK_CLASS}>
              {nav.admin}
            </NavLink>
            <ThemeToggle className="ml-2" />
          </nav>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white/80 dark:border-neutral-800 dark:bg-black/60">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600 sm:px-6 lg:px-8 dark:text-slate-400">
          {footer}
        </div>
      </footer>
    </div>
  );
}
