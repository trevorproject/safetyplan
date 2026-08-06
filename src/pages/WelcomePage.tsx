import { Link } from 'react-router-dom';
import { defaultConfig } from '../data/defaultConfig';

export function WelcomePage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Supportive guidance</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Create a safety plan that feels personal and calm.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-700">
          {defaultConfig.intro}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/wizard" className="rounded-full bg-slate-900 px-6 py-3 text-center font-medium text-white transition hover:bg-slate-700">
            Start the plan
          </Link>
          <Link to="/resources" className="rounded-full border border-slate-300 px-6 py-3 text-center font-medium text-slate-700 transition hover:bg-slate-100">
            View resources
          </Link>
        </div>
      </div>
      <aside className="rounded-3xl border border-emerald-100 bg-emerald-50 p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">What this is</h2>
        <p className="mt-3 text-base leading-7 text-slate-700">
          A safety plan is a simple, private guide you can use to notice warning signs, name coping tools, and remember who can help.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-slate-700">
          <li>• You stay in control of what you share.</li>
          <li>• Everything stays in this browser session.</li>
          <li>• You can print or save the finished plan when you are ready.</li>
        </ul>
      </aside>
    </section>
  );
}
