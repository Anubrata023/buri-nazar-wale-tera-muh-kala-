import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { LandingPage } from './pages/LandingPage';
import { CitizenPortal } from './pages/CitizenPortal';
import { AdminPortal } from './pages/AdminPortal';
import { PublicPortal } from './pages/PublicPortal';

// Role Guard for Citizen
function CitizenRoute({ children }: { children: ReactNode }) {
  const role = localStorage.getItem('userRole');
  if (role !== 'citizen') {
    return <Navigate to="/?error=citizen_auth" replace />;
  }
  return <>{children}</>;
}

// Role Guard for Admin
function AdminRoute({ children }: { children: ReactNode }) {
  const role = localStorage.getItem('userRole');
  if (role !== 'admin') {
    return <Navigate to="/?error=admin_auth" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-jan-canvas text-jan-slate">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* Protected Citizen Route */}
            <Route 
              path="/citizen" 
              element={
                <CitizenRoute>
                  <CitizenPortal />
                </CitizenRoute>
              } 
            />
            
            {/* Protected Admin Route */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminPortal />
                </AdminRoute>
              } 
            />
            
            {/* Public Transparency Route */}
            <Route path="/public" element={<PublicPortal />} />
            
            {/* Redirect fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}