import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WelcomeNavbar } from '../components/welcome/WelcomeNavbar';
import { WelcomeFooter } from '../components/welcome/WelcomeFooter';
import { WizardHero } from '../components/wizard/WizardHero';
import { QuestionPrompt } from '../components/wizard/QuestionPrompt';
import { StepProgress } from '../components/wizard/StepProgress';
import { SectionAnswerField } from '../components/wizard/SectionAnswerField';
import { SpeakableSection } from '../components/accessibility/SpeakableSection';
import { PLAN_FIELD_STEP_IDS, emptyAnswers, localizePlan, useDefaultConfig, writtenAnswers } from '../data/defaultConfig';
import { useWizardContent } from '../data/wizardContent';
import { useLanguage } from '../context/language';
import { clearPlan, loadPlan, loadStep, savePlan, saveStep } from '../lib/storage';
import type { PlanListField, SafetyPlanData } from '../types/app';

const initialPlan: SafetyPlanData = {
  warningSigns: [],
  copingStrategies: [],
  supports: [],
  environment: [],
  answers: emptyAnswers,
  message: '',
};

const STEP_ID_PLAN_FIELDS = Object.fromEntries(
  Object.entries(PLAN_FIELD_STEP_IDS).map(([field, stepId]) => [stepId, field]),
) as Record<string, PlanListField | undefined>;

/** Links from anywhere but the navbar point here, so the user lands on the form itself. */
export const BUILD_PLAN_SECTION_ID = 'build-plan';

export function WizardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const buildPlanRef = useRef<HTMLElement>(null);
  const buildPlanHeadingRef = useRef<HTMLHeadingElement>(null);
  const { language } = useLanguage();
  const [plan, setPlan] = useState<SafetyPlanData>(() => localizePlan({ ...initialPlan, ...loadPlan() }, language));
  const [planLanguage, setPlanLanguage] = useState(language);
  const [consent, setConsent] = useState(false);
  const { buildPlanContent } = useWizardContent();

  const steps = useDefaultConfig().wizardSteps;
  const [step, setStep] = useState(() => Math.min(loadStep(), steps.length - 1));

  // Keep already-selected options in step with the active language so they stay
  // checked and read correctly after switching languages mid-wizard.
  if (planLanguage !== language) {
    setPlanLanguage(language);
    setPlan((prev) => localizePlan(prev, language));
  }

  useEffect(() => {
    savePlan(plan);
  }, [plan]);

  useEffect(() => {
    saveStep(step);
  }, [step]);

  // `#build-plan` (welcome page and footer links) and `#<step id>` (a deep link
  // to one step) bring the form into view and move focus to its heading, so
  // keyboard and screen-reader users start right at the questions. A step link
  // also opens that step. The navbar link has no hash and lands at the top.
  const hashTarget = decodeURIComponent(location.hash.slice(1));
  const hashStepIndex = steps.findIndex((item) => item.id === hashTarget);
  const focusesForm = hashTarget === BUILD_PLAN_SECTION_ID || hashStepIndex !== -1;
  const [handledLocationKey, setHandledLocationKey] = useState<string | null>(null);
  if (handledLocationKey !== location.key) {
    setHandledLocationKey(location.key);
    if (hashStepIndex !== -1) setStep(hashStepIndex);
  }

  useEffect(() => {
    if (!focusesForm) return;
    buildPlanRef.current?.scrollIntoView({ block: 'start' });
    buildPlanHeadingRef.current?.focus({ preventScroll: true });
  }, [location.key, focusesForm]);

  const currentStep = steps[step];
  const currentField = STEP_ID_PLAN_FIELDS[currentStep.id];
  const isLastStep = step === steps.length - 1;

  const handleToggle = (field: PlanListField, value: string) => {
    setPlan((prev) => {
      const current = prev[field] ?? [];
      return {
        ...prev,
        [field]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
      };
    });
  };

  const handleAnswerChange = (field: PlanListField, values: string[]) => {
    setPlan((prev) => ({ ...prev, answers: { ...prev.answers, [field]: values } }));
  };

  // A section counts as answered when the user wrote something or picked at least one suggestion.
  const isStepValid = useMemo(() => {
    const answered = currentField
      ? writtenAnswers(plan, currentField).length > 0 || plan[currentField].length > 0
      : plan.message.trim().length > 0;
    return answered && (!isLastStep || consent);
  }, [plan, currentField, isLastStep, consent]);

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

      <section
        ref={buildPlanRef}
        id={BUILD_PLAN_SECTION_ID}
        className="flex scroll-mt-4 flex-col items-center gap-16 bg-white px-6 py-16 dark:bg-black lg:px-16 lg:py-24"
      >
        <div className="flex w-full max-w-[1280px] flex-col items-center gap-16">
          <div className="flex w-full max-w-[768px] flex-col items-center gap-4 text-center">
            <h2 ref={buildPlanHeadingRef} tabIndex={-1} className="outline-none text-3xl font-medium leading-[120%] tracking-[0.01em] text-black dark:text-white sm:text-4xl lg:text-[52px]">
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

            <QuestionPrompt
              key={`question-${currentStep.id}`}
              stepId={currentStep.id}
              title={currentStep.title}
              description={currentStep.description}
            />

            {currentField ? (
              <SectionAnswerField
                key={currentField}
                values={plan.answers[currentField]}
                onChange={(values) => handleAnswerChange(currentField, values)}
                placeholder={currentStep.placeholder}
                addLabel={currentStep.addLabel}
                suggestions={currentStep.options ?? []}
                selected={plan[currentField]}
                onToggle={(value) => handleToggle(currentField, value)}
              />
            ) : (
              <textarea
                value={plan.message}
                onChange={(event) => setPlan((prev) => ({ ...prev, message: event.target.value }))}
                aria-label={currentStep.title}
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
