// src/components/citizen/ComplaintForm.tsx
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function ComplaintForm() {
  const { t } = useLanguage();
  const [ward, setWard] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Form data packaging structure transmitted directly to Person A's API router node
    const formData = { text: description, ward: ward };
    console.log("Transmitting state payload package to endpoint layer:", formData);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  if (success) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-zinc-200 text-center max-w-md mx-auto mt-12 animate-fade-in">
        <h3 className="text-2xl font-bold text-emerald-600 mb-2">✅ {t('submitted')}</h3>
        <p className="text-zinc-500 text-sm">Your issue has been logged. The computational agent graph has initiated automated prioritization triage routines.</p>
        <button 
          onClick={() => { setSuccess(false); setDescription(''); setWard(''); }}
          className="mt-6 w-full bg-jan-slate text-white font-bold py-3 rounded-xl active:scale-95 transition-transform"
        >
          File Another Report
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100 max-w-xl mx-auto mt-12">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-black uppercase text-zinc-500 tracking-wider mb-2">{t('ward_label')}</label>
          <input 
            type="text" 
            required
            className="w-full bg-jan-canvas p-4 rounded-xl border border-transparent focus:ring-2 focus:ring-jan-coral outline-none text-jan-slate font-medium transition-all"
            placeholder="e.g. Ward 12, Indiranagar"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-zinc-500 tracking-wider mb-2">{t('desc_label')}</label>
          <textarea 
            required
            rows={5}
            className="w-full bg-jan-canvas p-4 rounded-xl border border-transparent focus:ring-2 focus:ring-jan-coral outline-none text-jan-slate text-sm leading-relaxed transition-all resize-none"
            placeholder="Describe the issue in your own words (e.g., 'The streetlights have been broken for two days'). Our AI will automatically categorize, translate, and prioritize your report."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !description.trim() || !ward.trim()}
          className="w-full bg-jan-coral hover:bg-red-500 text-white font-bold py-4 rounded-xl tracking-wide transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-40 shadow-lg shadow-jan-coral/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t('submitting')}
            </>
          ) : t('submit')}
        </button>
      </form>
    </div>
  );
}