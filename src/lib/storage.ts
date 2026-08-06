import type { SafetyPlanData } from '../types/app';

const STORAGE_KEY = 'safety-plan-data';

export function loadPlan(): SafetyPlanData | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as SafetyPlanData) : null;
}

export function savePlan(plan: SafetyPlanData) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

export function clearPlan() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}
