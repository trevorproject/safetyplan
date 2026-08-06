import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { WelcomePage } from './pages/WelcomePage';
import { ResourcesPage } from './pages/ResourcesPage';
import { WizardPage } from './pages/WizardPage';
import { CompletedPlanPage } from './pages/CompletedPlanPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/wizard" element={<WizardPage />} />
          <Route path="/plan" element={<CompletedPlanPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
