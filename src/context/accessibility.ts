import { createContext, useContext } from 'react';

export type ColorVisionMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
export type AccessibilityTab = 'reader' | 'vision' | 'help';

export interface SpeakableSectionEntry {
  id: string;
  label: string;
  getNode: () => HTMLElement | null;
}

export interface AccessibilitySection {
  id: string;
  label: string;
}

export interface AccessibilityContextValue {
  panelOpen: boolean;
  activeTab: AccessibilityTab;
  openPanel: (tab?: AccessibilityTab) => void;
  closePanel: () => void;
  setActiveTab: (tab: AccessibilityTab) => void;
  colorVisionMode: ColorVisionMode;
  setColorVisionMode: (mode: ColorVisionMode) => void;
  sections: AccessibilitySection[];
  registerSection: (entry: SpeakableSectionEntry) => void;
  unregisterSection: (id: string) => void;
  speakingId: string | null;
  isPaused: boolean;
  speechSupported: boolean;
  speakSection: (id: string) => void;
  speakAll: () => void;
  pauseSpeech: () => void;
  resumeSpeech: () => void;
  stopSpeech: () => void;
}

export const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within an AccessibilityProvider');
  return ctx;
}
