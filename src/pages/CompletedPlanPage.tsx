import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { WelcomeNavbar } from '../components/welcome/WelcomeNavbar';
import { WelcomeFooter } from '../components/welcome/WelcomeFooter';
import { SmartLink } from '../components/welcome/SmartLink';
import { ChevronRightIcon } from '../components/welcome/icons';
import { SpeakableSection } from '../components/accessibility/SpeakableSection';
import { InfoTooltip } from '../components/common/InfoTooltip';
import callIcon from '../assets/TTP_IconsLibrary_White_Call Alt.webp';
import { clearPlan, loadPlan } from '../lib/storage';
import { useCompletedPlanContent } from '../data/completedPlanContent';
import { localizePlan, writtenAnswers } from '../data/defaultConfig';
import { useLanguage } from '../context/language';
import type { SafetyPlanData } from '../types/app';

type FinishedPlanContent = ReturnType<typeof useCompletedPlanContent>['finishedPlanContent'];

function buildShareText(plan: SafetyPlanData | null, finishedPlanContent: FinishedPlanContent) {
  if (!plan) return '';
  const lines = [finishedPlanContent.shareSubject, ''];
  for (const section of finishedPlanContent.sections) {
    const items = [...writtenAnswers(plan, section.field), ...plan[section.field]];
    if (items.length) {
      lines.push(`${section.label}:`, ...items.map((item) => `- ${item}`), '');
    }
  }
  if (plan.message.trim()) {
    lines.push(`${finishedPlanContent.notesLabel}:`, plan.message.trim());
  }
  return lines.join('\n');
}

export function CompletedPlanPage() {
  const { language } = useLanguage();
  const storedPlan = loadPlan();
  const plan = storedPlan && localizePlan(storedPlan, language);
  const { completedPlanHeroContent, reminderCardContent, finishedPlanContent } = useCompletedPlanContent();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();

  // Once the plan is built the user lands here from the wizard; move focus (and
  // the viewport) to the top of the page so keyboard and screen-reader users
  // start at the plan heading rather than wherever the wizard button left them.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, []);

  const handlePrint = () => window.print();

  // Erasing the plan can't be undone, so ask first; then reopen the wizard at the first section.
  const handleNewPlan = () => {
    if (!window.confirm(finishedPlanContent.newPlanConfirm)) return;
    clearPlan();
    navigate('/wizard#build-plan');
  };

  const handleShare = async () => {
    const text = buildShareText(plan, finishedPlanContent);
    if (navigator.share) {
      try {
        await navigator.share({ title: finishedPlanContent.shareSubject, text });
      } catch {
        // user cancelled the native share sheet — nothing to do
      }
      return;
    }
    const subject = encodeURIComponent(finishedPlanContent.shareSubject);
    const body = encodeURIComponent(text);
    window.location.assign(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="font-body">
      <WelcomeNavbar />
      <main>

      <SpeakableSection id="plan-summary">
      <section className="flex flex-col items-center bg-brand-gray px-6 pb-12 pt-16 dark:bg-neutral-900 lg:px-16 lg:pb-16 lg:pt-24">
        <div className="relative flex w-full max-w-[768px] flex-col items-center gap-4 text-center">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-3xl font-medium leading-[120%] tracking-[0.01em] text-black outline-none dark:text-white sm:text-4xl lg:text-[52px]"
          >
            {completedPlanHeroContent.headingLead}
            <span className="font-script">{completedPlanHeroContent.headingScript}</span>
            {completedPlanHeroContent.headingTail}
          </h1>
          <p className="text-lg leading-[160%] text-black dark:text-white/80 lg:text-2xl">
            {completedPlanHeroContent.body}
            <InfoTooltip label={completedPlanHeroContent.tipLabel} className="-my-2 ml-1">
              {completedPlanHeroContent.tip}
            </InfoTooltip>
          </p>
        </div>
      </section>
      </SpeakableSection>

      {/* On wide screens the reminder sits to the left of the plan; on smaller
          screens it comes after the plan, so it is placed after it in the DOM
          and moved into the first column only at lg. */}
      <section className="flex flex-col items-center bg-brand-gray px-6 pb-16 dark:bg-neutral-900 lg:px-16 lg:pb-24">
        <div className="grid w-full max-w-[1280px] gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-16">
          <SpeakableSection id="plan-details">
          <div className="flex w-full flex-col items-center gap-12 lg:col-start-2 lg:row-start-1 lg:items-start">
            <div className="flex w-full max-w-2xl flex-col items-start gap-8">
              {finishedPlanContent.sections.map((section) => {
                // What the user wrote comes first, then the suggestions they picked.
                const items = plan ? [...writtenAnswers(plan, section.field), ...plan[section.field]] : [];
                if (!items.length) return null;
                return (
                  <div key={section.field} className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium text-black dark:text-white">{section.label}</h3>
                    <ul className="list-disc space-y-1 pl-5 text-base text-black dark:text-white/80">
                      {items.map((item, index) => (
                        <li key={`${index}-${item}`} className="break-words">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              {plan?.message.trim() && (
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium text-black dark:text-white">{finishedPlanContent.notesLabel}</h3>
                  <p className="whitespace-pre-line break-words text-base leading-[160%] text-black dark:text-white/80">{plan.message.trim()}</p>
                </div>
              )}
            </div>

            <div className="flex w-full flex-col items-center gap-3 print:hidden lg:items-start">
              <button
                type="button"
                onClick={handlePrint}
                className="w-56 rounded-full bg-brand-purple px-8 py-3 text-center text-base font-medium text-white transition hover:opacity-90"
              >
                {finishedPlanContent.printLabel}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="w-56 rounded-full bg-brand-purple px-8 py-3 text-center text-base font-medium text-white transition hover:opacity-90"
              >
                {finishedPlanContent.shareLabel}
              </button>
              <button
                type="button"
                onClick={handleNewPlan}
                className="w-56 rounded-full border-2 border-black px-8 py-3 text-center text-base font-medium text-black transition hover:opacity-70 dark:border-neutral-500 dark:text-white"
              >
                {finishedPlanContent.newPlanLabel}
              </button>
            </div>
          </div>
          </SpeakableSection>

          <SpeakableSection id="plan-reminder">
          <div className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-3xl border-2 border-black bg-brand-purple-light p-8 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:max-w-none">
            <img src={callIcon} alt="" className="mx-auto h-14 w-14 object-contain" />
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-2xl font-medium text-white">{reminderCardContent.heading}</h2>
              <p className="text-base leading-[160%] text-white">{reminderCardContent.body}</p>
              <SmartLink
                to={reminderCardContent.action.to}
                className="inline-flex items-center gap-1 text-base font-medium text-white transition hover:opacity-80"
              >
                {reminderCardContent.action.label}
                <ChevronRightIcon className="h-5 w-5" />
              </SmartLink>
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
