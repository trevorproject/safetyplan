import { useEffect, useRef } from 'react';
import { WelcomeNavbar } from '../components/welcome/WelcomeNavbar';
import { WelcomeFooter } from '../components/welcome/WelcomeFooter';
import { SmartLink } from '../components/welcome/SmartLink';
import { ChevronRightIcon } from '../components/welcome/icons';
import callIcon from '../assets/TTP_IconsLibrary_White_Call Alt.png';
import { loadPlan } from '../lib/storage';
import { completedPlanHeroContent, reminderCardContent, finishedPlanContent } from '../data/completedPlanContent';
import type { SafetyPlanData } from '../types/app';

function buildShareText(plan: SafetyPlanData | null) {
  if (!plan) return '';
  const lines = [finishedPlanContent.shareSubject, ''];
  for (const section of finishedPlanContent.sections) {
    const items = plan[section.field];
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
  const plan = loadPlan();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Once the plan is built the user lands here from the wizard; move focus (and
  // the viewport) to the top of the page so keyboard and screen-reader users
  // start at the plan heading rather than wherever the wizard button left them.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, []);

  const handlePrint = () => window.print();

  const handleShare = async () => {
    const text = buildShareText(plan);
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

      <section className="flex flex-col items-center gap-16 bg-brand-gray px-6 py-16 lg:px-16 lg:py-24">
        <div className="flex w-full max-w-[1280px] flex-col items-center gap-16">
          <div className="flex w-full max-w-[768px] flex-col items-center gap-4 text-center">
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-3xl font-medium leading-[120%] tracking-[0.01em] text-black outline-none sm:text-4xl lg:text-[52px]"
            >
              {completedPlanHeroContent.headingLead}
              <span className="font-script">{completedPlanHeroContent.headingScript}</span>
              {completedPlanHeroContent.headingTail}
            </h1>
            <p className="text-lg leading-[160%] text-black lg:text-2xl">{completedPlanHeroContent.body}</p>
          </div>

          <div className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-3xl border-2 border-black bg-brand-purple-light p-8">
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
        </div>
      </section>

      <section className="flex flex-col items-center gap-16 bg-brand-gray px-6 pb-16 lg:px-16 lg:pb-24">
        <div className="flex w-full max-w-[1280px] flex-col items-center gap-16">
          <div className="flex w-full max-w-[768px] flex-col items-center gap-4 text-center">
            <p className="text-lg leading-[160%] text-black lg:text-2xl">{finishedPlanContent.body}</p>
          </div>

          <div className="flex w-full max-w-2xl flex-col items-start gap-8">
            {finishedPlanContent.sections.map((section) => {
              const items = plan?.[section.field] ?? [];
              if (!items.length) return null;
              return (
                <div key={section.field} className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium text-black">{section.label}</h3>
                  <ul className="list-disc space-y-1 pl-5 text-base text-black">
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {plan?.message.trim() && (
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium text-black">{finishedPlanContent.notesLabel}</h3>
                <ul className="list-disc space-y-1 pl-5 text-base text-black">
                  <li>{plan.message}</li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex w-full flex-col items-center gap-3 print:hidden">
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
          </div>
        </div>
      </section>

      <WelcomeFooter />
    </div>
  );
}
