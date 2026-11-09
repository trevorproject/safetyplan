import { jsPDF } from 'jspdf';
import manropeRegularUrl from '../assets/fonts/Manrope-Regular.ttf?url';
import manropeMediumUrl from '../assets/fonts/Manrope-Medium.ttf?url';
import caveatUrl from '../assets/fonts/Caveat-Regular.ttf?url';
import { planSectionsFor, type CompletedPlanContent } from './planExport';
import type { SafetyPlanData } from '../types/app';

// The PDF mirrors the completed plan page: the "Here is your plan" heading,
// the plan inside a rounded black-bordered card with purple bullets, and the
// purple reminder card. Sizes are in points on a US Letter page.
const PAGE = { width: 612, height: 792, margin: 54 };
const CARD = { padding: 28, radius: 18, border: 2 };
const COLORS = {
  ink: '#191919',
  purple: '#7155ff',
  purpleLight: '#9b88ff',
  divider: '#e0e0e0',
  muted: '#6b6b6b',
};
const LINE_HEIGHT = 1.5;

const FONTS = [
  { url: manropeRegularUrl, file: 'Manrope-Regular.ttf', family: 'Manrope', style: 'normal' },
  { url: manropeMediumUrl, file: 'Manrope-Medium.ttf', family: 'Manrope', style: 'medium' },
  { url: caveatUrl, file: 'Caveat-Regular.ttf', family: 'Caveat', style: 'normal' },
];

let fontCache: Promise<string[]> | null = null;

function toBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

/** Embedding the app's own fonts keeps the look and covers accents that the built-in PDF fonts can't. */
function loadFonts() {
  fontCache ??= Promise.all(
    FONTS.map(async ({ url }) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Could not load font ${url}`);
      return toBase64(await response.arrayBuffer());
    }),
  ).catch((error) => {
    fontCache = null; // let a retry fetch again
    throw error;
  });
  return fontCache;
}

export async function buildPlanPdf(plan: SafetyPlanData, content: CompletedPlanContent, language: string): Promise<Blob> {
  const { completedPlanHeroContent: hero, finishedPlanContent, reminderCardContent: reminder } = content;
  const fonts = await loadFonts();

  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  FONTS.forEach(({ file, family, style }, index) => {
    doc.addFileToVFS(file, fonts[index]);
    doc.addFont(file, family, style);
  });
  // Only a title: no author, subject or keywords, so nothing about the user ends up in the file's metadata.
  doc.setDocumentProperties({ title: finishedPlanContent.shareSubject });
  // The creation date keeps the day but not the time or the device's time zone.
  doc.setCreationDate(`D:${new Date().toISOString().slice(0, 10).replaceAll('-', '')}000000+00'00'`);
  doc.setLanguage(language === 'es' ? 'es-MX' : 'en-US');

  const contentWidth = PAGE.width - PAGE.margin * 2;
  const bottom = PAGE.height - PAGE.margin;
  let y = PAGE.margin;

  const setText = (family: string, style: string, size: number, color = COLORS.ink) => {
    doc.setFont(family, style);
    doc.setFontSize(size);
    doc.setTextColor(color);
  };
  const lineHeight = (size: number) => size * LINE_HEIGHT;

  // Heading, with the script word in Caveat like on the page.
  const headingParts = [
    { text: hero.headingLead, family: 'Manrope', style: 'medium', size: 28 },
    { text: hero.headingScript, family: 'Caveat', style: 'normal', size: 34 },
    { text: hero.headingTail, family: 'Manrope', style: 'medium', size: 28 },
  ];
  const widths = headingParts.map(({ text, family, style, size }) => {
    setText(family, style, size);
    return doc.getTextWidth(text);
  });
  let x = (PAGE.width - widths.reduce((sum, width) => sum + width, 0)) / 2;
  y += 28;
  headingParts.forEach(({ text, family, style, size }, index) => {
    setText(family, style, size);
    doc.text(text, x, y);
    x += widths[index];
  });

  setText('Manrope', 'normal', 13);
  y += 14;
  for (const line of doc.splitTextToSize(hero.body, contentWidth) as string[]) {
    y += lineHeight(13);
    doc.text(line, PAGE.width / 2, y, { align: 'center' });
  }
  y += 28;

  // The plan card. It can run over several pages, so its border is drawn
  // afterwards, once per page, around the part of the card on that page.
  const cardSegments: { page: number; top: number; bottom: number }[] = [];
  let segmentTop = y;
  const innerX = PAGE.margin + CARD.padding;
  const innerWidth = contentWidth - CARD.padding * 2;
  y += CARD.padding;

  const ensureCardSpace = (height: number) => {
    if (y + height <= bottom - CARD.padding) return;
    cardSegments.push({ page: doc.getCurrentPageInfo().pageNumber, top: segmentTop, bottom: y + CARD.padding / 2 });
    doc.addPage();
    segmentTop = PAGE.margin;
    y = PAGE.margin + CARD.padding;
  };

  setText('Manrope', 'medium', 20);
  y += 20;
  doc.text(finishedPlanContent.shareSubject, innerX, y);
  y += 22;

  const blocks: { heading: string; paragraphs: string[]; bullets: boolean }[] = planSectionsFor(plan, finishedPlanContent.sections).map(
    ({ label, items }) => ({ heading: label, paragraphs: items, bullets: true }),
  );
  const notes = plan.message.trim();
  if (notes) blocks.push({ heading: finishedPlanContent.notesLabel, paragraphs: notes.split('\n'), bullets: false });

  const bulletIndent = 16;
  blocks.forEach(({ heading, paragraphs, bullets }, index) => {
    const textX = bullets ? innerX + bulletIndent : innerX;
    const textWidth = bullets ? innerWidth - bulletIndent : innerWidth;
    setText('Manrope', 'normal', 11);
    const wrapped = paragraphs.map((paragraph) => doc.splitTextToSize(paragraph, textWidth) as string[]);

    // Keep each heading together with the first line under it.
    ensureCardSpace(18 + lineHeight(14) + lineHeight(11));
    if (index > 0) {
      doc.setDrawColor(COLORS.divider);
      doc.setLineWidth(1);
      doc.line(innerX, y, innerX + innerWidth, y);
      y += 18;
    }
    setText('Manrope', 'medium', 14);
    y += 14;
    doc.text(heading, innerX, y);
    y += 8;

    setText('Manrope', 'normal', 11);
    for (const lines of wrapped) {
      lines.forEach((line, lineIndex) => {
        ensureCardSpace(lineHeight(11));
        y += lineHeight(11);
        if (bullets && lineIndex === 0) {
          doc.setFillColor(COLORS.purple);
          doc.circle(innerX + 5, y - 3.5, 2.2, 'F');
        }
        setText('Manrope', 'normal', 11);
        doc.text(line, textX, y);
      });
    }
    y += 18;
  });

  cardSegments.push({ page: doc.getCurrentPageInfo().pageNumber, top: segmentTop, bottom: y + CARD.padding - 18 });
  const lastPage = doc.getCurrentPageInfo().pageNumber;
  for (const segment of cardSegments) {
    doc.setPage(segment.page);
    // Line style belongs to each page's drawing state, so set it after switching pages.
    doc.setDrawColor(COLORS.ink);
    doc.setLineWidth(CARD.border);
    doc.roundedRect(PAGE.margin, segment.top, contentWidth, segment.bottom - segment.top, CARD.radius, CARD.radius, 'S');
  }
  doc.setPage(lastPage);
  y = cardSegments[cardSegments.length - 1].bottom + 24;

  // The reminder card stays in one piece; it moves to a new page if it doesn't fit.
  const reminderPadding = 24;
  const reminderWidth = contentWidth - reminderPadding * 2;
  setText('Manrope', 'normal', 11);
  const reminderLines = doc.splitTextToSize(reminder.body, reminderWidth) as string[];
  const reminderHeight = reminderPadding * 2 + 18 + 10 + reminderLines.length * lineHeight(11);
  if (y + reminderHeight > bottom) {
    doc.addPage();
    y = PAGE.margin;
  }
  doc.setFillColor(COLORS.purpleLight);
  doc.setDrawColor(COLORS.ink);
  doc.setLineWidth(CARD.border);
  doc.roundedRect(PAGE.margin, y, contentWidth, reminderHeight, CARD.radius, CARD.radius, 'FD');
  let reminderY = y + reminderPadding + 16;
  setText('Manrope', 'medium', 16, '#ffffff');
  doc.text(reminder.heading, PAGE.margin + reminderPadding, reminderY);
  reminderY += 10;
  setText('Manrope', 'normal', 11, '#ffffff');
  for (const line of reminderLines) {
    reminderY += lineHeight(11);
    doc.text(line, PAGE.margin + reminderPadding, reminderY);
  }

  const pageCount = doc.getNumberOfPages();
  if (pageCount > 1) {
    for (let page = 1; page <= pageCount; page++) {
      doc.setPage(page);
      setText('Manrope', 'normal', 9, COLORS.muted);
      doc.text(`${page} / ${pageCount}`, PAGE.width / 2, PAGE.height - PAGE.margin / 2, { align: 'center' });
    }
  }

  return doc.output('blob');
}
