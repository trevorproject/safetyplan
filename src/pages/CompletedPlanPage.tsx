import { Link, useNavigate } from 'react-router-dom';
import { clearPlan, loadPlan } from '../lib/storage';

export function CompletedPlanPage() {
  const navigate = useNavigate();
  const plan = loadPlan();

  const restart = () => {
    clearPlan();
    navigate('/wizard');
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Your finished plan</h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-700">
          You can print this page, save it as a PDF, or share it with someone you trust when you feel ready.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Plan summary</h2>
          <div className="flex gap-3">
            <button type="button" onClick={() => window.print()} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              Print
            </button>
            <button type="button" onClick={restart} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
              Restart
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-slate-900">Warning signs</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
              {(plan?.warningSigns ?? []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-slate-900">Coping strategies</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
              {(plan?.copingStrategies ?? []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-slate-900">Support people</h3>
            <ul className="mt-2 space-y-2 text-slate-700">
              {(plan?.supportPeople ?? []).filter((person) => person.name || person.contact).map((person, index) => (
                <li key={index} className="rounded-2xl border border-slate-200 p-3">
                  <p className="font-medium">{person.name || 'Trusted person'}</p>
                  <p className="text-sm">{person.contact || 'No contact provided yet'}</p>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-slate-900">Professionals</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
              {(plan?.professionals ?? []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-slate-900">Environment changes</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
              {(plan?.environment ?? []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-slate-900">Reason for living</h3>
            <p className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700">{plan?.reason || 'No reason written yet.'}</p>
          </section>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
        <h3 className="text-xl font-semibold">A gentle reminder</h3>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
          If you are in immediate danger or feel unsafe, contact emergency support or a crisis hotline right away.
        </p>
        <Link to="/resources" className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
          Open crisis resources
        </Link>
      </div>
    </section>
  );
}
