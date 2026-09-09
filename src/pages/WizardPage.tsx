import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WelcomeNavbar } from '../components/welcome/WelcomeNavbar';
import { WelcomeFooter } from '../components/welcome/WelcomeFooter';
import { WizardHero } from '../components/wizard/WizardHero';
import { HowItWorks } from '../components/wizard/HowItWorks';
import { StepProgress } from '../components/wizard/StepProgress';
import { MultiSelectField } from '../components/wizard/MultiSelectField';
import { CheckboxGrid } from '../components/wizard/CheckboxGrid';
import { SpeakableSection } from '../components/accessibility/SpeakableSection';
import { defaultConfig } from '../data/defaultConfig';
import { buildPlanContent } from '../data/wizardContent';
import { clearPlan, loadPlan, savePlan } from '../lib/storage';
import type { SafetyPlanData } from '../types/app';

const initialPlan: SafetyPlanData = {
  warningSigns: [],
  copingStrategies: [],
  supports: [],
  environment: [],
  message: '',
};

export function WizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<SafetyPlanData>(() => ({ ...initialPlan, ...loadPlan() }));
  const [consent, setConsent] = useState(false);

  const steps = defaultConfig.wizardSteps;

  useEffect(() => {
    savePlan(plan);
  }, [plan]);

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleToggle = (field: keyof Pick<SafetyPlanData, 'warningSigns' | 'copingStrategies' | 'supports' | 'environment'>, value: string) => {
    setPlan((prev) => {
      const current = prev[field] ?? [];
      return {
        ...prev,
        [field]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
      };
    });
  };

  const handleAddCustom = (field: keyof Pick<SafetyPlanData, 'warningSigns' | 'copingStrategies' | 'supports' | 'environment'>, value: string) => {
    setPlan((prev) => {
      const current = prev[field] ?? [];
      return current.includes(value) ? prev : { ...prev, [field]: [...current, value] };
    });
  };

  const isStepValid = useMemo(() => {
    switch (step) {
      case 0:
        return plan.warningSigns.length > 0;
      case 1:
        return plan.copingStrategies.length > 0;
      case 2:
        return plan.supports.length > 0;
      case 3:
        return plan.environment.length > 0;
      case 4:
        return plan.message.trim().length > 0 && consent;
      default:
        return true;
    }
  }, [plan, step, consent]);

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
    setConsent(false);
    setStep(0);
  };

  return (
    <div className="font-body">
      <WelcomeNavbar />
      <main>
      <SpeakableSection id="wizard-hero">
        <WizardHero />
      </SpeakableSection>
      <SpeakableSection id="wizard-how-it-works">
        <HowItWorks />
      </SpeakableSection>

      <section className="flex flex-col items-center gap-16 bg-white px-6 py-16 dark:bg-black lg:px-16 lg:py-24">
        <div className="flex w-full max-w-[1280px] flex-col items-center gap-16">
          <div className="flex w-full max-w-[768px] flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-medium leading-[120%] tracking-[0.01em] text-black dark:text-white sm:text-4xl lg:text-[52px]">
              {buildPlanContent.heading}
            </h2>
            <p className="text-lg leading-[160%] text-black dark:text-white/80 lg:text-2xl">{buildPlanContent.body}</p>
          </div>

          <SpeakableSection id={`wizard-step-${currentStep.id}`}>
          <div id={currentStep.id} className="flex w-full max-w-xl flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-black/60 dark:text-white/60">{step + 1}/{steps.length}</span>
              <button type="button" onClick={restart} className="text-sm font-medium text-black underline hover:opacity-70 dark:text-white">
                {buildPlanContent.restartLabel}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-medium text-black dark:text-white">{currentStep.title}</h3>
              <p className="text-base text-black/70 dark:text-white/70">{currentStep.description}</p>
            </div>

            {step === 0 && (
              <MultiSelectField
                options={currentStep.options ?? []}
                selected={plan.warningSigns}
                onToggle={(value) => handleToggle('warningSigns', value)}
                onAddCustom={(value) => handleAddCustom('warningSigns', value)}
              />
            )}

            {step === 1 && (
              <CheckboxGrid
                options={currentStep.options ?? []}
                selected={plan.copingStrategies}
                onToggle={(value) => handleToggle('copingStrategies', value)}
                onAddCustom={(value) => handleAddCustom('copingStrategies', value)}
              />
            )}

            {step === 2 && (
              <MultiSelectField
                options={currentStep.options ?? []}
                selected={plan.supports}
                onToggle={(value) => handleToggle('supports', value)}
                onAddCustom={(value) => handleAddCustom('supports', value)}
              />
            )}

            {step === 3 && (
              <CheckboxGrid
                options={currentStep.options ?? []}
                selected={plan.environment}
                onToggle={(value) => handleToggle('environment', value)}
                onAddCustom={(value) => handleAddCustom('environment', value)}
              />
            )}

            {step === 4 && (
              <textarea
                value={plan.message}
                onChange={(event) => setPlan((prev) => ({ ...prev, message: event.target.value }))}
                className="min-h-40 w-full rounded-3xl border-2 border-black p-4 text-base text-black dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
                placeholder={currentStep.placeholder}
              />
            )}

            <StepProgress total={steps.length} current={step} />

            {isLastStep && (
              <label className="flex cursor-pointer items-start gap-3 text-sm text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-black accent-brand-purple dark:border-neutral-500"
                />
                {buildPlanContent.consentLabel}
              </label>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="rounded-full border-2 border-black px-6 py-3 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-30 dark:border-neutral-500 dark:text-white"
              >
                {buildPlanContent.backLabel}
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!isStepValid}
                className="rounded-full bg-brand-purple px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLastStep ? buildPlanContent.submitLabel : buildPlanContent.continueLabel}
              </button>
            </div>
          </div>
          </SpeakableSection>
        </div>
      </section>
      </main>

      <WelcomeFooter />
    </div>
  );
}
