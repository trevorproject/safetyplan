import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { WelcomePage } from './pages/WelcomePage';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AccessibilityWidget } from './components/accessibility/AccessibilityWidget';
import { ThemeProvider } from './context/ThemeContext';

// Only the "/" route (the first thing anyone loads) ships in the main bundle.
// Every other route is code-split so its JS is fetched on navigation instead
// of blocking the initial page render.
const ResourcesPage = lazy(() => import('./pages/ResourcesPage').then((m) => ({ default: m.ResourcesPage })));
const WizardPage = lazy(() => import('./pages/WizardPage').then((m) => ({ default: m.WizardPage })));
const CompletedPlanPage = lazy(() =>
  import('./pages/CompletedPlanPage').then((m) => ({ default: m.CompletedPlanPage })),
);
const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })));

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AccessibilityProvider>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/wizard" element={<WizardPage />} />
              <Route path="/plan" element={<CompletedPlanPage />} />
              <Route element={<AppShell />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <AccessibilityWidget />
        </AccessibilityProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
