import type { SafetyPlanData } from '../types/app';

const STORAGE_KEY = 'safety-plan-data';
const STEP_STORAGE_KEY = 'safety-plan-step';

export function loadPlan(): SafetyPlanData | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as SafetyPlanData) : null;
}

export function savePlan(plan: SafetyPlanData) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

/** The wizard section the user was last on, so a reload resumes there instead of at the start. */
export function loadStep(): number {
  if (typeof window === 'undefined') return 0;
  const step = Number(window.sessionStorage.getItem(STEP_STORAGE_KEY));
  return Number.isInteger(step) && step > 0 ? step : 0;
}

export function saveStep(step: number) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(STEP_STORAGE_KEY, String(step));
}

export function clearPlan() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(STEP_STORAGE_KEY);
}
