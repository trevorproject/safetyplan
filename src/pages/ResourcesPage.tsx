import { defaultConfig } from '../data/defaultConfig';

export function ResourcesPage() {
  const crisis = defaultConfig.resources.filter((item) => item.category === 'crisis');
  const support = defaultConfig.resources.filter((item) => item.category === 'support');

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Support and resources</h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-700">
          If you need immediate support, reach out to a trusted person or one of the resources below.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Crisis support</h2>
          <div className="mt-4 space-y-3">
            {crisis.map((item) => (
              <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="block rounded-2xl border border-rose-100 bg-white p-4 transition hover:border-rose-300 hover:bg-rose-100">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-700">{item.description}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Support and grounding</h2>
          <div className="mt-4 space-y-3">
            {support.map((item) => (
              <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-100">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-700">{item.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
