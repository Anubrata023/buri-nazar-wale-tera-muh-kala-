import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { LandingPage } from './pages/LandingPage';
import { CitizenPortal } from './pages/CitizenPortal';
import { AdminPortal } from './pages/AdminPortal';
import { PublicPortal } from './pages/PublicPortal';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-jan-canvas text-jan-slate">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/citizen" element={<CitizenPortal />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/public" element={<PublicPortal />} />
            {/* Redirect fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}