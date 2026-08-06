import { Link, NavLink } from 'react-router-dom';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
            Safety Plan
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-2 text-sm font-medium">
            <NavLink to="/" className={({ isActive }) => `rounded-full px-3 py-2 ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
              Welcome
            </NavLink>
            <NavLink to="/resources" className={({ isActive }) => `rounded-full px-3 py-2 ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
              Resources
            </NavLink>
            <NavLink to="/wizard" className={({ isActive }) => `rounded-full px-3 py-2 ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
              Plan
            </NavLink>
            <NavLink to="/admin" className={({ isActive }) => `rounded-full px-3 py-2 ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
              Admin
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white/80">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600 sm:px-6 lg:px-8">
          A private, supportive tool for building a safety plan.
        </div>
      </footer>
    </div>
  );
}
