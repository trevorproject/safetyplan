import { useEffect, useRef } from 'react';
import { WelcomeNavbar } from '../components/welcome/WelcomeNavbar';
import { WelcomeFooter } from '../components/welcome/WelcomeFooter';
import { SmartLink } from '../components/welcome/SmartLink';
import { ChevronRightIcon } from '../components/welcome/icons';
import { SpeakableSection } from '../components/accessibility/SpeakableSection';
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
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Your finished plan</h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-700">
          You can print this page, save it as a PDF, or share it with someone you trust when you feel ready.
        </p>
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
      </SpeakableSection>

      </main>
      <WelcomeFooter />
    </div>
  );
}
