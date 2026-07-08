import { useState } from 'react';
import { Bell } from 'lucide-react';
import { ComplaintForm } from '../components/citizen/ComplaintForm';
import { CommunityFeed } from '../components/citizen/CommunityFeed';
import { ComplaintMap } from '../components/shared/Map';
import { useRealtimeComplaints } from '../hooks/useRealtime';

export function CitizenPortal() {
  const [currentTab, setCurrentTab] = useState<'home' | 'reports' | 'community' | 'profile'>('home');
  const { complaints } = useRealtimeComplaints();

  const handleScrollToForm = () => {
    setCurrentTab('home');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="w-full min-h-screen bg-jan-canvas flex flex-col justify-start pb-24 font-sans text-slate-800">
      {/* High-fidelity Header exactly matching Image 3 */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-12">
          <span className="text-2xl font-black text-slate-800 tracking-tight">JanSaath</span>
          <nav className="hidden md:flex gap-6 text-sm font-bold text-zinc-400">
            <button 
              onClick={() => setCurrentTab('home')}
              className={`pb-1 transition-colors cursor-pointer border-b-2 hover:text-slate-800 ${
                currentTab === 'home' ? 'border-jan-coral text-slate-800' : 'border-transparent'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentTab('reports')}
              className={`pb-1 transition-colors cursor-pointer border-b-2 hover:text-slate-800 ${
                currentTab === 'reports' ? 'border-jan-coral text-slate-800' : 'border-transparent'
              }`}
            >
              Reports
            </button>
            <button 
              onClick={() => setCurrentTab('community')}
              className={`pb-1 transition-colors cursor-pointer border-b-2 hover:text-slate-800 ${
                currentTab === 'community' ? 'border-jan-coral text-slate-800' : 'border-transparent'
              }`}
            >
              Community
            </button>
            <button 
              onClick={() => setCurrentTab('profile')}
              className={`pb-1 transition-colors cursor-pointer border-b-2 hover:text-slate-800 ${
                currentTab === 'profile' ? 'border-jan-coral text-slate-800' : 'border-transparent'
              }`}
            >
              Profile
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Dashboard links back to Admin command center and landing page for ease of navigation */}
          <LinkToOtherPortals />
          <button className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500 hover:text-slate-800 transition-colors relative cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-jan-coral rounded-full"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-zinc-200 border-2 border-zinc-300 overflow-hidden flex items-center justify-center font-bold text-xs text-slate-600">
            CP
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">
        {currentTab === 'home' && (
          <div className="space-y-6 animate-fade-in">
            {/* Renders intake options and complaint form */}
            <ComplaintForm />
            
            {/* Live real-time community feed list */}
            <CommunityFeed />
          </div>
        )}

        {currentTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-800 mb-2">📌 Geospatial Verification Map</h2>
              <p className="text-xs text-zinc-500 mb-4">View hot spots and geographic distribution of constituency concerns.</p>
              <div className="rounded-2xl overflow-hidden border border-zinc-100 shadow-inner">
                <ComplaintMap complaints={complaints} />
              </div>
            </div>
          </div>
        )}

        {currentTab === 'community' && (
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-sm mt-12 animate-fade-in">
            <span className="text-4xl block mb-4">👥</span>
            <h3 className="text-lg font-black text-slate-800 mb-2">Community Analytics</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Real-time collaboration area where citizens verify each other's reports. High upvote counts raise the priority score automatically.
            </p>
          </div>
        )}

        {currentTab === 'profile' && (
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 max-w-md mx-auto shadow-sm mt-12 animate-fade-in space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-jan-coral text-white rounded-full flex items-center justify-center mx-auto mb-4 font-black text-2xl shadow-lg shadow-jan-coral/20">
                CP
              </div>
              <h3 className="text-lg font-black text-slate-800">Citizen Profile</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Mobile: +91 98000 00000</p>
            </div>
            <div className="border-t border-zinc-100 pt-4 space-y-3 text-xs text-slate-600 font-bold">
              <div className="flex justify-between"><span>Reports Filed:</span> <span className="text-slate-800">4</span></div>
              <div className="flex justify-between"><span>Upvotes Given:</span> <span className="text-slate-800">12</span></div>
              <div className="flex justify-between"><span>Default Ward:</span> <span className="text-slate-800">Chinhat</span></div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) at Bottom Right (Image 3) */}
      <button 
        onClick={handleScrollToForm}
        className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all z-40 cursor-pointer border border-white/10"
      >
        <span className="text-2xl font-light">+</span>
      </button>
    </div>
  );
}

function LinkToOtherPortals() {
  return (
    <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full shadow-inner">
      <a href="/" className="hover:text-slate-800 transition-colors">Landing</a>
      <span>•</span>
      <a href="/admin" className="hover:text-slate-800 transition-colors">Admin</a>
      <span>•</span>
      <a href="/public" className="hover:text-slate-800 transition-colors">Public</a>
    </div>
  );
}
export default CitizenPortal;