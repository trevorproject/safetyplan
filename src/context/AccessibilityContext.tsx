import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AccessibilityContext,
  type AccessibilityContextValue,
  type AccessibilityTab,
  type ColorVisionMode,
  type SpeakableSectionEntry,
} from './accessibility';

const COLOR_VISION_STORAGE_KEY = 'safety-plan-color-vision';
const COLOR_VISION_MODES: ColorVisionMode[] = ['none', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'];
const ALL_SECTIONS_ID = '__all__';

const COLOR_VISION_FILTERS: Record<ColorVisionMode, string> = {
  none: '',
  protanopia: 'url(#a11y-protanopia)',
  deuteranopia: 'url(#a11y-deuteranopia)',
  tritanopia: 'url(#a11y-tritanopia)',
  achromatopsia: 'grayscale(1)',
};

function loadStoredColorVisionMode(): ColorVisionMode {
  if (typeof window === 'undefined') return 'none';
  const raw = window.localStorage.getItem(COLOR_VISION_STORAGE_KEY);
  return (COLOR_VISION_MODES as string[]).includes(raw ?? '') ? (raw as ColorVisionMode) : 'none';
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AccessibilityTab>('reader');
  const [colorVisionMode, setColorVisionMode] = useState<ColorVisionMode>(loadStoredColorVisionMode);
  const [sectionsMap, setSectionsMap] = useState<Map<string, SpeakableSectionEntry>>(() => new Map());
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.filter = COLOR_VISION_FILTERS[colorVisionMode];
  }, [colorVisionMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(COLOR_VISION_STORAGE_KEY, colorVisionMode);
  }, [colorVisionMode]);

  const registerSection = useCallback((entry: SpeakableSectionEntry) => {
    setSectionsMap((prev) => {
      const next = new Map(prev);
      next.set(entry.id, entry);
      return next;
    });
  }, []);

  const unregisterSection = useCallback((id: string) => {
    setSectionsMap((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    setSpeakingId((current) => (current === id ? null : current));
  }, []);

  const sections = useMemo(
    () => Array.from(sectionsMap.values()).map(({ id, label }) => ({ id, label })),
    [sectionsMap],
  );

  const stopSpeech = useCallback(() => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    setSpeakingId(null);
    setIsPaused(false);
  }, [speechSupported]);

  const speakText = useCallback(
    (id: string, text: string, node: HTMLElement | null) => {
      if (!speechSupported || !text.trim()) return;
      window.speechSynthesis.cancel();
      node?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setSpeakingId((current) => (current === id ? null : current));
      utterance.onerror = () => setSpeakingId((current) => (current === id ? null : current));
      setSpeakingId(id);
      setIsPaused(false);
      window.speechSynthesis.speak(utterance);
    },
    [speechSupported],
  );

  const speakSection = useCallback(
    (id: string) => {
      const entry = sectionsMap.get(id);
      const node = entry?.getNode() ?? null;
      speakText(id, node?.textContent ?? '', node);
    },
    [sectionsMap, speakText],
  );

  const speakAll = useCallback(() => {
    const text = Array.from(sectionsMap.values())
      .map((entry) => entry.getNode()?.textContent ?? '')
      .filter(Boolean)
      .join('. ');
    speakText(ALL_SECTIONS_ID, text, null);
  }, [sectionsMap, speakText]);

  const pauseSpeech = useCallback(() => {
    if (!speechSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [speechSupported]);

  const resumeSpeech = useCallback(() => {
    if (!speechSupported) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [speechSupported]);

  useEffect(() => () => stopSpeech(), [stopSpeech]);

  const openPanel = useCallback((tab?: AccessibilityTab) => {
    setPanelOpen(true);
    if (tab) setActiveTab(tab);
  }, []);

  const closePanel = useCallback(() => setPanelOpen(false), []);

  const value: AccessibilityContextValue = {
    panelOpen,
    activeTab,
    openPanel,
    closePanel,
    setActiveTab,
    colorVisionMode,
    setColorVisionMode,
    sections,
    registerSection,
    unregisterSection,
    speakingId,
    isPaused,
    speechSupported,
    speakSection,
    speakAll,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
  };

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}
