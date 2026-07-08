// src/pages/CitizenPortal.tsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ComplaintForm } from '../components/citizen/ComplaintForm';
import { CommunityFeed } from '../components/citizen/CommunityFeed';
import { ComplaintMap } from '../components/shared/Map';

export function CitizenPortal() {
  const { language, setLanguage, t } = useLanguage();

  const dummyComplaints = [
    { id: '1', priority_score: 88, raw_text: 'Deep pothole causing accidents near the main market crossing.', ward: 'Ward 14' },
    { id: '2', priority_score: 55, raw_text: 'Streetlights have been out for three consecutive nights.', ward: 'Ward 08' },
    { id: '3', priority_score: 32, raw_text: 'Public park benches need repainting before the festival.', ward: 'Ward 02' }
  ];

  return (
    <div className="w-full min-h-screen bg-jan-canvas py-12 px-4 flex flex-col justify-start">
      <header className="text-center mb-4 relative max-w-xl w-full mx-auto">
        <div className="absolute right-0 top-0">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="text-xs font-bold bg-white border border-zinc-200 px-3 py-1 rounded-full shadow-sm text-jan-slate hover:bg-zinc-50 transition-colors"
          >
            {language === 'en' ? '🌐 हिंदी' : '🌐 English'}
          </button>
        </div>
        <h1 className="text-4xl font-black text-jan-slate tracking-tight">JanSaath</h1>
        <p className="text-zinc-500 text-sm font-medium mt-1">{t('tagline')}</p>
      </header>
      
      <ComplaintForm />
      <CommunityFeed />
      
      <div className="max-w-xl mx-auto w-full">
        <ComplaintMap complaints={dummyComplaints} />
      </div>
    </div>
  );
}