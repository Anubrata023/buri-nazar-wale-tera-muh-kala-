import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mic, Map, TrendingUp, Languages, User, ShieldAlert, Lock, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
      // Citizen login allows any numeric or mock phone format, or username 'citizen' with pass 'user123'
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

  const toggleLanguage = (lang: 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr') => {
    setLanguage(lang);
  };

  const capabilities = [
    {
      icon: <Mic className="w-6 h-6 text-red-600" />,
      title: 'Voice-First Intake',
      titleHi: 'आवाज-प्रथम इनटेक',
      description: 'Removing literacy barriers by transcribing local dialects and speech instantly via multilingual AI, ensuring every voice is captured accurately.',
      descriptionHi: 'बहुभाषी एआई के माध्यम से स्थानीय बोलियों और भाषणों को तुरंत ट्रांसक्राइब करके साक्षरता बाधाओं को दूर करना, यह सुनिश्चित करना कि हर आवाज सही ढंग से दर्ज हो।',
      linkText: 'Learn More →',
      linkTextHi: 'और जानें →',
      color: 'bg-red-50 border-red-100',
      iconBg: 'bg-red-100'
    },
    {
      icon: <Map className="w-6 h-6 text-amber-600" />,
      title: 'Geospatial Verification',
      titleHi: 'जियोस्पेशियल सत्यापन',
      description: 'Mapping regional needs using precision satellite and open-source data to verify development milestones and infrastructure requirements.',
      descriptionHi: 'विकास के मील के पत्थर और बुनियादी ढांचे की आवश्यकताओं को सत्यापित करने के लिए सटीक उपग्रह और ओपन-सोर्स डेटा का उपयोग करके क्षेत्रीय आवश्यकताओं का मानचित्रण करना।',
      linkText: 'View Map Demo →',
      linkTextHi: 'मानचित्र डेमो देखें →',
      color: 'bg-amber-50 border-amber-100',
      iconBg: 'bg-amber-100'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      title: 'Predictive Governance',
      titleHi: 'पूर्वानुमानित शासन',
      description: 'Forecasting future infrastructure needs and resource allocation automatically using deep-learning models trained on community feedback.',
      descriptionHi: 'सामुदायिक प्रतिक्रिया पर प्रशिक्षित डीप-लर्निंग... और संसाधन आवंटन का स्वचालित रूप से पूर्वानुमान लगाना।',
      linkText: 'Explore AI Insights →',
      linkTextHi: 'एआई अंतर्दृष्टि का अन्वेषण करें →',
      color: 'bg-emerald-50 border-emerald-100',
      iconBg: 'bg-emerald-100'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between font-sans relative">
      {/* Hero Section Banner */}
      <div 
        className="relative w-full h-[600px] bg-cover bg-center flex flex-col justify-between p-6 md:p-12 overflow-hidden shadow-lg"
        style={{ 
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/landing_hero.jpg')" 
        }}
      >
        {/* Transparent Header */}
        <header className="flex justify-between items-center w-full max-w-7xl mx-auto z-10">
          <div className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/25 flex items-center justify-center cursor-pointer" onClick={() => navigate('/public')}>
            <span className="text-xl font-black text-white tracking-tight">JanSaath</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Expanded Language Selector (6 Languages) */}
            <div className="relative group bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-1.5 cursor-pointer text-white">
              <Languages className="w-4 h-4 text-jan-coral" />
              <select 
                value={language}
                onChange={(e) => toggleLanguage(e.target.value as any)}
                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer border-none text-white appearance-none"
                style={{ WebkitAppearance: 'none' }}
              >
                <option value="en" className="text-slate-800 font-bold">English</option>
                <option value="hi" className="text-slate-800 font-bold">हिंदी (Hindi)</option>
                <option value="bn" className="text-slate-800 font-bold">বাংলা (Bengali)</option>
                <option value="ta" className="text-slate-800 font-bold">தமிழ் (Tamil)</option>
                <option value="te" className="text-slate-800 font-bold">తెలుగు (Telugu)</option>
                <option value="mr" className="text-slate-800 font-bold">मराठी (Marathi)</option>
              </select>
            </div>

            <button 
              onClick={() => {
                setLoginRole('citizen');
                setShowLoginModal(true);
              }}
              className="bg-jan-coral hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Citizen Login
            </button>
            <button 
              onClick={() => {
                setLoginRole('admin');
                setShowLoginModal(true);
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-2.5 border border-white/30 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Admin Login
            </button>
          </div>
        </header>

        {/* Hero Body */}
        <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center items-start text-white z-10 mt-8">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none max-w-3xl">
            Raise Your Voice. Track Progress.
          </h1>
          <div className="flex gap-4 mt-8 flex-wrap">
            <button 
              onClick={() => {
                setLoginRole('citizen');
                setShowLoginModal(true);
              }}
              className="bg-jan-coral hover:bg-red-500 text-white font-black text-sm px-8 py-4 rounded-full flex items-center gap-2 shadow-xl shadow-jan-coral/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Citizen Portal ▷</span>
            </button>
            <button 
              onClick={() => {
                setLoginRole('admin');
                setShowLoginModal(true);
              }}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black text-sm px-8 py-4 rounded-full flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Admin Center 🛡️</span>
            </button>
          </div>
        </div>

        {/* Capabilities Subtitle overlay */}
        <div className="w-full max-w-7xl mx-auto z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">OUR CAPABILITIES</span>
            <h2 className="text-xl md:text-3xl font-black text-white mt-1">
              The Intelligence Layer for Your Constituency
            </h2>
          </div>
          <p className="text-zinc-200 text-sm max-w-md font-medium leading-relaxed">
            Utilizing state-of-the-art AI to transform raw local feedback into actionable development insights.
          </p>
        </div>
      </div>

      {/* Capabilities Section Cards */}
      <div className="w-full max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {capabilities.map((cap, i) => (
          <div 
            key={i} 
            className={`p-8 rounded-3xl border ${cap.color} bg-white shadow-sm flex flex-col justify-between items-start h-[280px] transition-all hover:shadow-md hover:scale-[1.01]`}
          >
            <div className="space-y-4">
              <div className={`p-3 rounded-2xl ${cap.iconBg} inline-flex`}>
                {cap.icon}
              </div>
              <h3 className="text-xl font-black text-slate-800">
                {language === 'hi' ? cap.titleHi : cap.title}
              </h3>
              <p className="text-zinc-600 text-xs font-medium leading-relaxed line-clamp-4">
                {language === 'hi' ? cap.descriptionHi : cap.description}
              </p>
            </div>
            <button 
              onClick={() => {
                setLoginRole('citizen');
                setShowLoginModal(true);
              }}
              className="text-xs font-black text-jan-coral hover:underline mt-4 flex items-center cursor-pointer"
            >
              {language === 'hi' ? cap.linkTextHi : cap.linkText}
            </button>
          </div>
        ))}
      </div>

      {/* Basic Footer */}
      <footer className="bg-zinc-900 py-6 text-center text-xs text-zinc-500 font-bold border-t border-zinc-800">
        © 2026 JanSaath Framework • Built with Google AI Studio & Firebase Spark
      </footer>

      {/* GLASSMORPHIC AUTH LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#0f1422] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl text-white relative">
            <button 
              onClick={() => {
                setShowLoginModal(false);
                setAuthError(null);
              }}
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
                  placeholder={loginRole === 'admin' ? 'e.g. admin' : 'e.g. citizen or +91 98000 00000'}
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
                <span>Enter any name/phone to simulate citizen reporting.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default LandingPage;
