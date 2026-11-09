import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WelcomeNavbar } from '../components/welcome/WelcomeNavbar';
import { WelcomeFooter } from '../components/welcome/WelcomeFooter';
import { SmartLink } from '../components/welcome/SmartLink';
import { ChevronRightIcon } from '../components/welcome/icons';
import { SpeakableSection } from '../components/accessibility/SpeakableSection';
import { InfoTooltip } from '../components/common/InfoTooltip';
import callIcon from '../assets/TTP_IconsLibrary_White_Call Alt.webp';
import trevorLogo from '../assets/ttp_logo_oneline_black.png';
import { clearPlan, loadPlan } from '../lib/storage';
import { useCompletedPlanContent } from '../data/completedPlanContent';
import { localizePlan } from '../data/defaultConfig';
import { useLanguage } from '../context/language';
import { buildPlanText, downloadPlan, planSectionsFor, type DownloadFormat } from '../lib/planExport';

type DownloadState = { status: 'idle' } | { status: 'pending' | 'error'; format: DownloadFormat };

const DOWNLOAD_FORMATS: DownloadFormat[] = ['pdf', 'txt'];

/** Sharing is switched off for now; flip this to bring the Share button back. */
const SHARE_ENABLED = false;

export function CompletedPlanPage() {
  const { language } = useLanguage();
  const storedPlan = loadPlan();
  const plan = storedPlan && localizePlan(storedPlan, language);
  const content = useCompletedPlanContent();
  const { completedPlanHeroContent, reminderCardContent, finishedPlanContent } = content;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const planTitleId = useId();
  const formatsId = useId();
  // What the user wrote comes first in each section, then the suggestions they picked.
  const planSections = planSectionsFor(plan, finishedPlanContent.sections);
  const notes = plan?.message.trim();
  const hasPlan = planSections.length > 0 || Boolean(notes);
  const [formatsOpen, setFormatsOpen] = useState(false);
  const [download, setDownload] = useState<DownloadState>({ status: 'idle' });
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

  // A failed download never fails silently: the error stays on screen with a retry for the same format.
  const handleDownload = async (format: DownloadFormat) => {
    if (!plan) return;
    setDownload({ status: 'pending', format });
    try {
      await downloadPlan(format, plan, content, language);
      setDownload({ status: 'idle' });
      setFormatsOpen(false);
    } catch {
      setDownload({ status: 'error', format });
    }
  };

  const handleShare = async () => {
    const text = buildPlanText(plan, finishedPlanContent);
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

      {/* Printed pages replace the navbar with the black logo the downloaded PDF also starts with. */}
      <div className="hidden justify-center print:flex">
        <img src={trevorLogo} alt="The Trevor Project" className="h-9 w-auto" />
      </div>

      <SpeakableSection id="plan-summary">
      <section className="flex flex-col items-center bg-brand-gray px-6 pb-12 pt-16 dark:bg-neutral-900 lg:px-16 lg:pb-16 lg:pt-24 print:bg-white print:px-0 print:pb-6 print:pt-8">
        <div className="relative flex w-full max-w-[768px] flex-col items-center gap-4 text-center">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-3xl font-medium leading-[120%] tracking-[0.01em] text-black outline-none dark:text-white sm:text-4xl lg:text-[52px] print:text-4xl"
          >
            {completedPlanHeroContent.headingLead}
            <span className="font-script">{completedPlanHeroContent.headingScript}</span>
            {completedPlanHeroContent.headingTail}
          </h1>
          <p className="text-lg leading-[160%] text-black dark:text-white/80 lg:text-2xl print:text-base">
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
      <section className="flex flex-col items-center bg-brand-gray px-6 pb-16 dark:bg-neutral-900 lg:px-16 lg:pb-24 print:bg-white print:px-0 print:pb-0">
        <div className="grid w-full max-w-[1280px] gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-16 print:grid-cols-1 print:gap-6">
          <SpeakableSection id="plan-details">
          <div className="flex w-full flex-col items-center gap-12 lg:col-start-2 lg:row-start-1 lg:items-start print:col-start-auto print:row-start-auto print:items-center">
            {hasPlan && (
              <article
                aria-labelledby={planTitleId}
                className="flex w-full max-w-2xl flex-col gap-6 rounded-3xl border-2 border-black bg-white p-6 shadow-sm dark:border-neutral-600 dark:bg-neutral-800 sm:p-10 print:shadow-none"
              >
                <h2 id={planTitleId} className="text-2xl font-medium text-black dark:text-white">
                  {finishedPlanContent.shareSubject}
                </h2>
                <div className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
                  {planSections.map(({ field, label, items }) => (
                    <div key={field} className="flex flex-col gap-2 py-5 first:pt-0 last:pb-0">
                      <h3 className="text-lg font-medium text-black break-after-avoid dark:text-white">{label}</h3>
                      <ul className="list-disc space-y-1 pl-5 text-base text-black marker:text-brand-purple dark:text-white/80 dark:marker:text-brand-purple-light print:marker:text-[#6b6b6b]">
                        {items.map((item, index) => (
                          <li key={`${index}-${item}`} className="break-words break-inside-avoid">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {notes && (
                    <div className="flex flex-col gap-2 py-5 first:pt-0 last:pb-0">
                      <h3 className="text-lg font-medium text-black dark:text-white">{finishedPlanContent.notesLabel}</h3>
                      <p className="whitespace-pre-line break-words text-base leading-[160%] text-black dark:text-white/80">{notes}</p>
                    </div>
                  )}
                </div>
              </article>
            )}

            <div className="flex w-full flex-col items-center gap-3 print:hidden lg:items-start">
              {hasPlan && (
                <>
                  <button
                    type="button"
                    aria-expanded={formatsOpen}
                    aria-controls={formatsId}
                    onClick={() => setFormatsOpen((open) => !open)}
                    className="w-56 rounded-full bg-brand-purple px-8 py-3 text-center text-base font-medium text-white transition hover:opacity-90"
                  >
                    {finishedPlanContent.download.label}
                  </button>
                  {formatsOpen && (
                    <div
                      id={formatsId}
                      role="group"
                      aria-label={finishedPlanContent.download.formatsLabel}
                      className="flex w-56 flex-col gap-2 rounded-3xl border-2 border-black bg-white p-3 dark:border-neutral-600 dark:bg-neutral-800"
                    >
                      <p className="px-2 text-sm text-black/70 dark:text-white/70">{finishedPlanContent.download.formatsLabel}</p>
                      {DOWNLOAD_FORMATS.map((format) => (
                        <button
                          key={format}
                          type="button"
                          onClick={() => handleDownload(format)}
                          disabled={download.status === 'pending'}
                          className="rounded-full border-2 border-brand-purple px-4 py-2 text-center text-sm font-medium text-black transition hover:bg-brand-purple hover:text-white disabled:opacity-50 dark:text-white"
                        >
                          {finishedPlanContent.download.formats[format]}
                        </button>
                      ))}
                    </div>
                  )}
                  <p aria-live="polite" className="w-56 text-center text-sm text-black/70 empty:hidden dark:text-white/70 lg:text-left">
                    {download.status === 'pending' ? finishedPlanContent.download.pending : ''}
                  </p>
                  {download.status === 'error' && (
                    <div
                      role="alert"
                      className="flex w-full max-w-sm flex-col items-center gap-2 rounded-2xl border-2 border-brand-orange bg-white p-4 text-center dark:bg-neutral-800 lg:items-start lg:text-left"
                    >
                      <p className="text-sm text-black dark:text-white">{finishedPlanContent.download.error}</p>
                      <button
                        type="button"
                        onClick={() => handleDownload(download.format)}
                        className="rounded-full border-2 border-black px-5 py-1.5 text-sm font-medium text-black transition hover:opacity-70 dark:border-neutral-500 dark:text-white"
                      >
                        {finishedPlanContent.download.retryLabel}
                      </button>
                    </div>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={handlePrint}
                className="w-56 rounded-full bg-brand-purple px-8 py-3 text-center text-base font-medium text-white transition hover:opacity-90"
              >
                {finishedPlanContent.printLabel}
              </button>
              {SHARE_ENABLED && (
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-56 rounded-full bg-brand-purple px-8 py-3 text-center text-base font-medium text-white transition hover:opacity-90"
                >
                  {finishedPlanContent.shareLabel}
                </button>
              )}
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
          {/* On paper the reminder is a quieter black-and-white note, as in the downloaded PDF. */}
          <div className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-3xl border-2 border-black bg-brand-purple-light p-8 break-inside-avoid lg:col-start-1 lg:row-start-1 lg:mx-0 lg:max-w-none print:col-start-auto print:row-start-auto print:mx-auto print:max-w-2xl print:gap-0 print:rounded-2xl print:border print:bg-white print:px-5 print:py-4">
            <img src={callIcon} alt="" className="mx-auto h-14 w-14 object-contain print:hidden" />
            <div className="flex flex-col items-start gap-3 print:gap-1">
              <h2 className="text-2xl font-medium text-white print:text-base print:text-black">{reminderCardContent.heading}</h2>
              <p className="text-base leading-[160%] text-white print:text-sm print:text-black">{reminderCardContent.body}</p>
              <SmartLink
                to={reminderCardContent.action.to}
                className="inline-flex items-center gap-1 text-base font-medium text-white transition hover:opacity-80 print:hidden"
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
