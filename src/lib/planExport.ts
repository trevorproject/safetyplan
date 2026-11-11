import { writtenAnswers } from '../data/defaultConfig';
import type { useCompletedPlanContent } from '../data/completedPlanContent';
import type { PlanListField, SafetyPlanData } from '../types/app';

export type CompletedPlanContent = ReturnType<typeof useCompletedPlanContent>;
export type FinishedPlanContent = CompletedPlanContent['finishedPlanContent'];

export interface PlanSection {
  field: PlanListField;
  label: string;
  items: string[];
}

export type DownloadFormat = 'pdf' | 'txt';

/** What the user wrote comes first in each section, then the suggestions they picked; empty sections are left out. */
export function planSectionsFor(plan: SafetyPlanData | null, sections: FinishedPlanContent['sections']): PlanSection[] {
  if (!plan) return [];
  return sections
    .map((section) => ({ ...section, items: [...writtenAnswers(plan, section.field), ...plan[section.field]] }))
    .filter((section) => section.items.length > 0);
}

/** The plan as plain text: the body of the share message and of the .txt download. */
export function buildPlanText(plan: SafetyPlanData | null, finishedPlanContent: FinishedPlanContent) {
  if (!plan) return '';
  const lines = [finishedPlanContent.shareSubject, ''];
  for (const { label, items } of planSectionsFor(plan, finishedPlanContent.sections)) {
    lines.push(`${label}:`, ...items.map((item) => `- ${item}`), '');
  }
  if (plan.message.trim()) {
    lines.push(`${finishedPlanContent.notesLabel}:`, plan.message.trim());
  }
  return lines.join('\n');
}

/**
 * The .txt download: the plan plus the crisis reminder from the plan page.
 * Starts with a byte-order mark so Notepad and phone viewers read accents correctly.
 */
export function buildPlanTextFile(plan: SafetyPlanData, content: CompletedPlanContent) {
  const { reminderCardContent } = content;
  const text = [buildPlanText(plan, content.finishedPlanContent).trimEnd(), '', reminderCardContent.heading, reminderCardContent.body, ''].join('\n');
  return new Blob(['﻿', text], { type: 'text/plain;charset=utf-8' });
}

/** Hands a generated file to the browser so it lands in the device's usual downloads location. */
export function saveFile(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Some mobile browsers read the blob after click() returns, so keep it alive for a while.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/**
 * Builds the file in the chosen format and saves it. The PDF renderer (jsPDF and
 * the embedded fonts) is only loaded the first time someone asks for a PDF.
 * Throws if anything goes wrong so the page can offer a retry.
 */
export async function downloadPlan(format: DownloadFormat, plan: SafetyPlanData, content: CompletedPlanContent, language: string) {
  const { fileName } = content.finishedPlanContent.download;
  if (format === 'pdf') {
    const { buildPlanPdf } = await import('./planPdf');
    saveFile(await buildPlanPdf(plan, content, language), `${fileName}.pdf`);
  } else {
    saveFile(buildPlanTextFile(plan, content), `${fileName}.txt`);
  }
}
