// src/components/citizen/CommunityFeed.tsx
import React from 'react';
import { ComplaintCard } from './ComplaintCard';
import { useLanguage } from '../../context/LanguageContext';

export function CommunityFeed() {
  const { t } = useLanguage();
  
  // We will generate some dummy data so you can see the design while Firebase is offline
  const mockComplaints = [
    { id: '1', priority_score: 88, raw_text: 'Deep pothole causing accidents near the main market crossing.', ward: 'Ward 14' },
    { id: '2', priority_score: 55, raw_text: 'Streetlights have been out for three consecutive nights.', ward: 'Ward 08' },
    { id: '3', priority_score: 32, raw_text: 'Public park benches need repainting before the festival.', ward: 'Ward 02' }
  ];

  return (
    <div className="max-w-xl mx-auto mt-12 w-full">
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-xl font-black text-jan-slate tracking-tight">Community Feed</h2>
        <span className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-white border border-emerald-200 px-3 py-1.5 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Reports
        </span>
      </div>
      
      <div className="space-y-4">
        {mockComplaints.map((complaint) => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))}
      </div>
    </div>
  );
}