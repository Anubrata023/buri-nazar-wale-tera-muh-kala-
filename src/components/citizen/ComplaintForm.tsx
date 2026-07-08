import { useState, useRef } from 'react';
import { Loader2, Camera, X } from 'lucide-react';
import { submitTextComplaint, submitPhotoComplaint } from '../../lib/api';
import { addComplaintToFeed } from '../../firebase';
import { useLanguage } from '../../context/LanguageContext';

export function ComplaintForm({ type: initialType, onSubmitted, onClose }: { type?: 'text' | 'photo', onSubmitted?: () => void, onClose?: () => void }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'text' | 'photo' | 'voice' | 'whatsapp'>(initialType || 'text');
  const [ward, setWard] = useState('');
  const [category, setCategory] = useState('Sanitation');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Sanitation', 'Water', 'Roads', 'Electricity', 'Education', 'Health', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (activeTab === 'photo' && photo) {
        response = await submitPhotoComplaint(photo, ward);
      } else {
        response = await submitTextComplaint({ text: description, ward });
      }

      // Add to Firebase feed (real-time)
      await addComplaintToFeed({
        ...response.analysis,
        ward,
        status: 'new',
        raw_text: description || (activeTab === 'photo' ? 'Geotagged Photo complaint' : 'Civic complaint'),
        category: category,
        timestamp: Date.now(),
        is_duplicate: response.is_duplicate || false,
        cluster_size: response.is_duplicate ? 4 : 1,
        upvotes: 0,
        days_open: 1,
        created_at: new Date().toISOString()
      });

      setSuccessResult(response);
      if (onSubmitted) onSubmitted();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  if (successResult) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-zinc-100 max-w-xl mx-auto mt-6 text-center animate-fade-in">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-green-600">✅</span>
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">{t('submitted')}</h3>
        <p className="text-zinc-500 text-xs leading-relaxed mb-6">
          Your issue has been successfully logged. The computational agent graph has initiated automated prioritization.
        </p>
        <div className="bg-zinc-50 rounded-2xl p-4 text-left text-xs mb-6 space-y-2 border border-zinc-150">
          <p className="font-bold text-slate-700">Triage Summary:</p>
          <p><span className="text-zinc-400 font-semibold">Category:</span> <span className="font-bold text-slate-800">{successResult.analysis.category}</span></p>
          <p><span className="text-zinc-400 font-semibold">Severity:</span> <span className="font-bold text-slate-800">{successResult.analysis.severity}/10</span></p>
          <p><span className="text-zinc-400 font-semibold">Priority:</span> <span className="font-bold text-jan-coral">{successResult.analysis.priority_score || 50}/100</span></p>
        </div>
        <button 
          onClick={() => {
            setSuccessResult(null);
            setDescription('');
            setWard('');
            setPhoto(null);
          }}
          className="w-full bg-slate-800 text-white font-bold py-3.5 rounded-xl hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
        >
          File Another Report
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 space-y-6">
      {/* 4 Soft Tabs exactly matching Image 3 layout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* CALL US */}
        <div 
          onClick={() => setActiveTab('voice')}
          className={`p-5 rounded-2xl text-center cursor-pointer transition-all flex flex-col justify-center items-center select-none ${
            activeTab === 'voice' 
              ? 'bg-red-100 ring-2 ring-red-500 shadow-sm' 
              : 'bg-red-50/50 hover:bg-red-50 border border-red-100/50'
          }`}
        >
          <span className="text-2xl mb-2">📞</span>
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Call Us</span>
        </div>

        {/* WHATSAPP */}
        <div 
          onClick={() => setActiveTab('whatsapp')}
          className={`p-5 rounded-2xl text-center cursor-pointer transition-all flex flex-col justify-center items-center select-none ${
            activeTab === 'whatsapp' 
              ? 'bg-green-100 ring-2 ring-green-500 shadow-sm' 
              : 'bg-green-50/50 hover:bg-green-50 border border-green-100/50'
          }`}
        >
          <span className="text-2xl mb-2">💬</span>
          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">WhatsApp</span>
        </div>

        {/* UPLOAD PHOTO */}
        <div 
          onClick={() => {
            setActiveTab('photo');
            fileInputRef.current?.click();
          }}
          className={`p-5 rounded-2xl text-center cursor-pointer transition-all flex flex-col justify-center items-center select-none ${
            activeTab === 'photo' 
              ? 'bg-blue-100 ring-2 ring-blue-500 shadow-sm' 
              : 'bg-blue-50/50 hover:bg-blue-50 border border-blue-100/50'
          }`}
        >
          <span className="text-2xl mb-2">📷</span>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Upload Photo</span>
        </div>

        {/* TEXT COMPLAINT */}
        <div 
          onClick={() => setActiveTab('text')}
          className={`p-5 rounded-2xl text-center cursor-pointer transition-all flex flex-col justify-center items-center select-none ${
            activeTab === 'text' 
              ? 'bg-orange-100 ring-2 ring-orange-500 shadow-sm' 
              : 'bg-orange-50/50 hover:bg-orange-50 border border-orange-100/50'
          }`}
        >
          <span className="text-2xl mb-2">✍️</span>
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Text Complaint</span>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Conditional Information Box for IVR & WhatsApp */}
      {activeTab === 'voice' && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl text-center max-w-xl mx-auto animate-fade-in shadow-sm">
          <p className="text-sm font-bold text-red-800">☎️ Conversational IVR Hotline</p>
          <p className="text-xs text-red-600 mt-2">Dial <strong className="text-red-700">1800-JAN-SAATH</strong> from any basic feature phone. Speak your issue in Hindi, Bengali, or English. The AI graph will translate, map, and log it instantly.</p>
        </div>
      )}

      {activeTab === 'whatsapp' && (
        <div className="bg-green-50 border border-green-200 p-6 rounded-3xl text-center max-w-xl mx-auto animate-fade-in shadow-sm">
          <p className="text-sm font-bold text-green-800">💬 AI WhatsApp Support</p>
          <p className="text-xs text-green-600 mt-2">Send a message or a photo to <strong className="text-green-700">+91 98000 00000</strong>. You will receive an instant complaint confirmation and periodic status updates.</p>
        </div>
      )}

      {/* Main Share Concern Form (Image 3 style) */}
      {(activeTab === 'text' || activeTab === 'photo') && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Share Your Concern</h3>
            <div className="flex items-center gap-2">
              {photo && (
                <span className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" />
                  {photo.name.length > 20 ? photo.name.substring(0, 17) + '...' : photo.name}
                </span>
              )}
              {onClose && (
                <button 
                  type="button"
                  onClick={onClose} 
                  className="text-zinc-400 hover:text-slate-800 p-1 rounded-full hover:bg-zinc-100 transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          </div>


          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 tracking-wider mb-2">Ward / Area Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ward 14, Civil Lines"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-150 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-jan-coral focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 tracking-wider mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-150 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-jan-coral focus:bg-white transition-all font-medium text-slate-800 appearance-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-zinc-400 tracking-wider mb-2">Detailed Description</label>
              <textarea
                required
                rows={5}
                placeholder="Describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-150 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-jan-coral focus:bg-white transition-all font-medium text-slate-800 resize-none leading-relaxed"
              />
            </div>

            {error && <p className="text-red-500 text-xs font-bold">⚠️ {error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-jan-coral hover:bg-red-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-lg shadow-jan-coral/20 cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Report / 𝍢𝍢𝍢𝍢𝍢</span>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}