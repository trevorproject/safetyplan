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
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route element={<AppShell />}>
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/wizard" element={<WizardPage />} />
          <Route path="/plan" element={<CompletedPlanPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
