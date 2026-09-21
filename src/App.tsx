import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { WelcomePage } from './pages/WelcomePage';
import { ResourcesPage } from './pages/ResourcesPage';
import { WizardPage } from './pages/WizardPage';
import { CompletedPlanPage } from './pages/CompletedPlanPage';
import { AdminPage } from './pages/AdminPage';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AccessibilityWidget } from './components/accessibility/AccessibilityWidget';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AccessibilityProvider>
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
            <AccessibilityWidget />
          </AccessibilityProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
