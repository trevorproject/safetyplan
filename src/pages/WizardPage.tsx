import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { defaultConfig } from '../data/defaultConfig';
import { clearPlan, loadPlan, savePlan } from '../lib/storage';
import type { SafetyPlanData } from '../types/app';

const initialPlan: SafetyPlanData = {
  warningSigns: [],
  copingStrategies: [],
  supportPeople: [{ name: '', contact: '' }],
  professionals: [],
  environment: [],
  reason: '',
};

export function WizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<SafetyPlanData>(() => loadPlan() ?? initialPlan);

  const steps = defaultConfig.wizardSteps;

  useEffect(() => {
    savePlan(plan);
  }, [plan]);

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const handleToggleChip = (field: keyof Pick<SafetyPlanData, 'warningSigns' | 'copingStrategies' | 'professionals' | 'environment'>, value: string) => {
    setPlan((prev) => {
      const current = prev[field] ?? [];
      return {
        ...prev,
        [field]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
      };
    });
  };

  const handleSupportPersonChange = (index: number, field: 'name' | 'contact', value: string) => {
    setPlan((prev) => {
      const updated = [...prev.supportPeople];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, supportPeople: updated };
    });
  };

  const isStepValid = useMemo(() => {
    switch (step) {
      case 0:
        return plan.warningSigns.length > 0 || plan.reason.length > 0;
      case 1:
        return plan.copingStrategies.length > 0;
      case 2:
        return plan.supportPeople.some((person) => person.name.trim() || person.contact.trim());
      case 3:
        return plan.professionals.length > 0;
      case 4:
        return plan.environment.length > 0;
      case 5:
        return plan.reason.trim().length > 0;
      default:
        return true;
    }
  }, [plan, step]);

  const next = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    navigate('/plan');
  };

  const back = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const restart = () => {
    clearPlan();
    setPlan(initialPlan);
    setStep(0);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Step {step + 1} of {steps.length}</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{currentStep.title}</h1>
            <p className="mt-2 max-w-2xl text-base text-slate-700">{currentStep.description}</p>
          </div>
          <button type="button" onClick={restart} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Restart
          </button>
        </div>
        <div className="mt-6 h-2 rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-slate-900" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {step === 0 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Choose or add warning signs</label>
            <div className="flex flex-wrap gap-2">
              {currentStep.options?.map((option) => (
                <button key={option} type="button" onClick={() => handleToggleChip('warningSigns', option)} className={`rounded-full px-3 py-2 text-sm ${plan.warningSigns.includes(option) ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {option}
                </button>
              ))}
            </div>
            <textarea value={plan.warningSigns.join(', ')} onChange={(event) => setPlan((prev) => ({ ...prev, warningSigns: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) }))} className="min-h-24 w-full rounded-2xl border border-slate-300 p-3" placeholder={currentStep.placeholder} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Choose or add coping strategies</label>
            <div className="flex flex-wrap gap-2">
              {currentStep.options?.map((option) => (
                <button key={option} type="button" onClick={() => handleToggleChip('copingStrategies', option)} className={`rounded-full px-3 py-2 text-sm ${plan.copingStrategies.includes(option) ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {option}
                </button>
              ))}
            </div>
            <textarea value={plan.copingStrategies.join(', ')} onChange={(event) => setPlan((prev) => ({ ...prev, copingStrategies: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) }))} className="min-h-24 w-full rounded-2xl border border-slate-300 p-3" placeholder={currentStep.placeholder} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Add trusted people</label>
            {plan.supportPeople.map((person, index) => (
              <div key={index} className="grid gap-3 rounded-2xl border border-slate-200 p-4 sm:grid-cols-2">
                <input value={person.name} onChange={(event) => handleSupportPersonChange(index, 'name', event.target.value)} className="rounded-2xl border border-slate-300 p-3" placeholder="Name" />
                <input value={person.contact} onChange={(event) => handleSupportPersonChange(index, 'contact', event.target.value)} className="rounded-2xl border border-slate-300 p-3" placeholder="Contact" />
              </div>
            ))}
            <button type="button" onClick={() => setPlan((prev) => ({ ...prev, supportPeople: [...prev.supportPeople, { name: '', contact: '' }] }))} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              Add another person
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Choose or add professional supports</label>
            <div className="flex flex-wrap gap-2">
              {currentStep.options?.map((option) => (
                <button key={option} type="button" onClick={() => handleToggleChip('professionals', option)} className={`rounded-full px-3 py-2 text-sm ${plan.professionals.includes(option) ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {option}
                </button>
              ))}
            </div>
            <textarea value={plan.professionals.join(', ')} onChange={(event) => setPlan((prev) => ({ ...prev, professionals: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) }))} className="min-h-24 w-full rounded-2xl border border-slate-300 p-3" placeholder={currentStep.placeholder} />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Choose or add environment changes</label>
            <div className="flex flex-wrap gap-2">
              {currentStep.options?.map((option) => (
                <button key={option} type="button" onClick={() => handleToggleChip('environment', option)} className={`rounded-full px-3 py-2 text-sm ${plan.environment.includes(option) ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {option}
                </button>
              ))}
            </div>
            <textarea value={plan.environment.join(', ')} onChange={(event) => setPlan((prev) => ({ ...prev, environment: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) }))} className="min-h-24 w-full rounded-2xl border border-slate-300 p-3" placeholder={currentStep.placeholder} />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Reason for living</label>
            <textarea value={plan.reason} onChange={(event) => setPlan((prev) => ({ ...prev, reason: event.target.value }))} className="min-h-40 w-full rounded-2xl border border-slate-300 p-3" placeholder={currentStep.placeholder} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={back} disabled={step === 0} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
          Back
        </button>
        <button type="button" onClick={next} disabled={!isStepValid} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400">
          {step < steps.length - 1 ? 'Continue' : 'Finish plan'}
        </button>
      </div>
    </section>
  );
}
