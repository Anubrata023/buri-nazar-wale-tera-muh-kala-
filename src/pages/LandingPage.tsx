import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Languages, User, ShieldAlert, Lock, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { HeroSection } from '../components/citizen/HeroSection';

export function LandingPage() {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Authentication states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginRole, setLoginRole] = useState<'citizen' | 'admin'>('citizen');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Parse redirect query indicators
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'citizen_auth') {
      setLoginRole('citizen');
      setShowLoginModal(true);
      setAuthError('Please log in as a Citizen to access the portal.');
    } else if (errorParam === 'admin_auth') {
      setLoginRole('admin');
      setShowLoginModal(true);
      setAuthError('Please log in as an Admin to access the dashboard.');
    }
  }, [searchParams]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (loginRole === 'admin') {
      if (username.trim().toLowerCase() === 'admin' && password === 'admin123') {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('username', 'Admin Command');
        setShowLoginModal(false);
        navigate('/admin');
      } else {
        setAuthError('Invalid Admin credentials. Use: admin / admin123');
      }
    } else {
      if (username.trim() !== '') {
        localStorage.setItem('userRole', 'citizen');
        localStorage.setItem('username', username);
        setShowLoginModal(false);
        navigate('/citizen');
      } else {
        setAuthError('Please enter a username or phone number.');
      }
    }
  };

  return (
    <div className="min-h-screen font-sans relative">
      {/* Floating top header bar */}
      <header className="fixed top-0 left-0 right-0 z-[60] bg-[#06080f]/90 backdrop-blur-md border-b border-white/5 px-6 py-3 flex justify-between items-center">
        <span className="text-xl font-black text-white tracking-tight cursor-pointer" onClick={() => navigate('/')}>
          Jan<span className="text-jan-coral">Saath</span>
        </span>
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-jan-coral" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-[10px] font-bold focus:outline-none cursor-pointer border-none text-white appearance-none"
              style={{ WebkitAppearance: 'none' }}
            >
              <option value="en" className="text-slate-800">English</option>
              <option value="hi" className="text-slate-800">हिंदी</option>
              <option value="bn" className="text-slate-800">বাংলা</option>
              <option value="ta" className="text-slate-800">தமிழ்</option>
              <option value="te" className="text-slate-800">తెలుగు</option>
              <option value="mr" className="text-slate-800">मराठी</option>
            </select>
          </div>

          <button
            onClick={() => { setLoginRole('citizen'); setShowLoginModal(true); }}
            className="bg-jan-coral hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-full transition-all cursor-pointer shadow-lg shadow-jan-coral/20"
          >
            Citizen Login
          </button>
          <button
            onClick={() => { setLoginRole('admin'); setShowLoginModal(true); }}
            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs px-4 py-2 rounded-full transition-all cursor-pointer"
          >
            Admin Login 🛡️
          </button>
        </div>
      </header>

      {/* Main content with HeroSection */}
      <div className="pt-14">
        <HeroSection />
      </div>

      {/* Footer */}
      <footer className="bg-[#06080f] border-t border-white/5 py-8 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-xl font-black text-white mb-2">Jan<span className="text-jan-coral">Saath</span></div>
          <p className="text-xs text-zinc-600 font-medium mb-4">
            Built for the Google AI India Hackathon · Track 1: People's Priorities
          </p>
          <div className="flex justify-center gap-6 text-xs text-zinc-600 font-bold">
            <button onClick={() => navigate('/public')} className="hover:text-zinc-400 transition-colors cursor-pointer">Public Feed</button>
            <button onClick={() => { setLoginRole('citizen'); setShowLoginModal(true); }} className="hover:text-zinc-400 transition-colors cursor-pointer">Citizen Portal</button>
            <button onClick={() => { setLoginRole('admin'); setShowLoginModal(true); }} className="hover:text-zinc-400 transition-colors cursor-pointer">Admin Dashboard</button>
          </div>
          <p className="text-[10px] text-zinc-700 mt-6">© 2026 JanSaath · Powered by Gemini AI &amp; Firebase</p>
        </div>
      </footer>

      {/* GLASSMORPHIC AUTH LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#0f1422] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl text-white relative">
            <button
              onClick={() => { setShowLoginModal(false); setAuthError(null); }}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 bg-jan-coral/10 rounded-2xl flex items-center justify-center mb-3">
                {loginRole === 'admin' ? (
                  <ShieldAlert className="w-6 h-6 text-jan-coral" />
                ) : (
                  <User className="w-6 h-6 text-jan-coral" />
                )}
              </div>
              <h3 className="text-lg font-black tracking-tight text-white capitalize">
                {loginRole} Authentication
              </h3>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1 font-bold">
                JanSaath Identity Security
              </p>
            </div>

            {authError && (
              <div className="mb-4 bg-red-950/40 border border-red-800/40 text-red-400 p-3 rounded-xl text-xs font-bold animate-fade-in flex items-center gap-2">
                <span>⚠️</span>
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-2">
                  {loginRole === 'admin' ? 'Admin Username' : 'Citizen Name / Phone'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={loginRole === 'admin' ? 'e.g. admin' : 'e.g. Ramesh Kumar or +91 98000 00000'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-jan-coral focus:bg-white/10 transition-all text-white placeholder-zinc-500 font-bold"
                />
              </div>

              {loginRole === 'admin' && (
                <div>
                  <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-2">
                    Security Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="e.g. admin123"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-jan-coral focus:bg-white/10 transition-all text-white placeholder-zinc-500 font-bold"
                    />
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-jan-coral hover:bg-red-500 text-white font-black py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-jan-coral/20 cursor-pointer text-xs uppercase tracking-wider"
              >
                Authenticate Role
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/5 text-center text-[10px] text-zinc-500 font-bold">
              {loginRole === 'admin' ? (
                <span>Mock Credentials: <strong className="text-zinc-400">admin</strong> / <strong className="text-zinc-400">admin123</strong></span>
              ) : (
                <span>Enter any name or phone number to sign in as a citizen.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default LandingPage;
