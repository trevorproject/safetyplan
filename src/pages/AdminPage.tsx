import { useEffect, useMemo, useState } from 'react';
import { defaultConfig } from '../data/defaultConfig';
import { useAdminContent } from '../data/adminContent';
import { useLanguage } from '../context/language';
import type { Language } from '../context/language';
import type { AppConfig, ResourceItem, WizardStepConfig } from '../types/app';

const LOCAL_CONFIG_KEY = 'safety-plan-config-v2';

const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

function loadConfig(): AppConfig {
  if (typeof window === 'undefined') return defaultConfig;
  const raw = window.localStorage.getItem(LOCAL_CONFIG_KEY);
  return raw ? (JSON.parse(raw) as AppConfig) : defaultConfig;
}

function saveConfig(config: AppConfig) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(config));
}

export function AdminPage() {
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [config, setConfig] = useState<AppConfig>(loadConfig);
  const content = useAdminContent();
  const { language, setLanguage } = useLanguage();
  const localized = config[language];

  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const handleLogin = () => {
    setAuthorized(password === config.adminPassword);
  };

  const updateLocalized = (patch: Partial<AppConfig['en']>) =>
    setConfig((prev) => ({ ...prev, [language]: { ...prev[language], ...patch } }));

  const updateTitle = (title: string) => updateLocalized({ title });
  const updateDescription = (description: string) => updateLocalized({ description });
  const updateIntro = (intro: string) => updateLocalized({ intro });

  const updateResource = (id: string, patch: Partial<ResourceItem>) => {
    updateLocalized({
      resources: localized.resources.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    });
  };

  const updateStep = (id: string, patch: Partial<WizardStepConfig>) => {
    updateLocalized({
      wizardSteps: localized.wizardSteps.map((step) => (step.id === id ? { ...step, ...patch } : step)),
    });
  };

  const addResource = () => {
    updateLocalized({
      resources: [
        ...localized.resources,
        {
          id: `resource-${Date.now()}`,
          title: content.newResourceTitle,
          description: content.newResourceDescription,
          url: content.newResourceUrl,
          category: 'support',
        },
      ],
    });
  };

  const addStep = () => {
    updateLocalized({
      wizardSteps: [
        ...localized.wizardSteps,
        {
          id: `step-${Date.now()}`,
          title: content.newStepTitle,
          description: content.newStepDescription,
          placeholder: content.newStepPlaceholder,
          options: [content.newStepOption],
        },
      ],
    });
  };

  const summary = useMemo(
    () => content.summary(localized.resources.length, localized.wizardSteps.length),
    [content, localized],
  );

  if (!authorized) {
    return (
      <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Admin configuration</h1>
        <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">Enter the shared password to edit the content shown across the app.</p>
        <div className="mt-6 space-y-4">
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="w-full rounded-2xl border border-slate-300 p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white" placeholder="Password" />
          <button type="button" onClick={handleLogin} className="rounded-full bg-slate-900 px-5 py-3 font-medium text-white dark:bg-white dark:text-black">
            Unlock editor
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Admin configuration</h1>
            <p className="mt-2 text-lg text-slate-700 dark:text-slate-300">Adjust the content shown across the app.</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">{summary}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">General content</h2>
          <div className="mt-4 space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              App title
              <input value={config.title} onChange={(event) => updateTitle(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white" />
            </label>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              App description
              <textarea value={config.description} onChange={(event) => updateDescription(event.target.value)} className="mt-2 min-h-24 w-full rounded-2xl border border-slate-300 p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white" />
            </label>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Welcome intro
              <textarea value={config.intro} onChange={(event) => updateIntro(event.target.value)} className="mt-2 min-h-24 w-full rounded-2xl border border-slate-300 p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white" />
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Resources</h2>
            <button type="button" onClick={addResource} className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-neutral-600 dark:text-slate-300 dark:hover:bg-white/10">
              Add resource
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {config.resources.map((resource) => (
              <div key={resource.id} className="rounded-2xl border border-slate-200 p-4 dark:border-neutral-700">
                <input value={resource.title} onChange={(event) => updateResource(resource.id, { title: event.target.value })} className="w-full rounded-2xl border border-slate-300 p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white" />
                <textarea value={resource.description} onChange={(event) => updateResource(resource.id, { description: event.target.value })} className="mt-2 min-h-20 w-full rounded-2xl border border-slate-300 p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white" />
                <input value={resource.url} onChange={(event) => updateResource(resource.id, { url: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white" />
                <select value={resource.category} onChange={(event) => updateResource(resource.id, { category: event.target.value as ResourceItem['category'] })} className="mt-2 w-full rounded-2xl border border-slate-300 p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white">
                  <option value="crisis">Crisis</option>
                  <option value="support">Support</option>
                  <option value="education">Education</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Wizard steps</h2>
          <button type="button" onClick={addStep} className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-neutral-600 dark:text-slate-300 dark:hover:bg-white/10">
            Add step
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {config.wizardSteps.map((step) => (
            <div key={step.id} className="rounded-2xl border border-slate-200 p-4 dark:border-neutral-700">
              <input value={step.title} onChange={(event) => updateStep(step.id, { title: event.target.value })} className="w-full rounded-2xl border border-slate-300 p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white" />
              <textarea value={step.description} onChange={(event) => updateStep(step.id, { description: event.target.value })} className="mt-2 min-h-20 w-full rounded-2xl border border-slate-300 p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white" />
              <input value={step.placeholder ?? ''} onChange={(event) => updateStep(step.id, { placeholder: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
