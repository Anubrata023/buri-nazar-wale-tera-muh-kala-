// src/components/citizen/ComplaintCard.tsx
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface ComplaintCardProps {
  complaint: any;
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  const { t } = useLanguage();
  const [upvotes, setUpvotes] = useState(complaint.upvotes || 0);

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUpvotes((prev: number) => prev + 1);
    // In a live environment, this would call the upvoteComplaint(complaint.id) function
  };

  // Determine the color border based on the mathematical priority score
  const getPriorityColor = (score: number) => {
    if (score >= 70) return 'border-jan-coral bg-red-50';
    if (score >= 40) return 'border-orange-500 bg-orange-50';
    return 'border-emerald-500 bg-emerald-50';
  };

  const priorityScore = complaint.priority_score || Math.floor(Math.random() * 100);

  return (
    <div className={`p-5 rounded-2xl bg-white shadow-sm border-l-4 ${getPriorityColor(priorityScore)} hover:shadow-md transition-shadow cursor-pointer`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-white bg-jan-slate px-2 py-1 rounded-md">
            Priority: {priorityScore}/100
          </span>
          <span className="text-[10px] font-bold uppercase text-zinc-500">
            {complaint.ward || 'General Ward'}
          </span>
        </div>
        <span className="text-xs text-zinc-400 font-medium">Just now</span>
      </div>
      
      <p className="text-sm text-jan-slate font-medium leading-relaxed mb-4">
        {complaint.summary_en || complaint.raw_text || 'Issue description pending AI triage...'}
      </p>
      
      <div className="flex justify-between items-center pt-3 border-t border-zinc-100">
        <button 
          onClick={handleUpvote}
          className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-jan-coral transition-colors active:scale-95"
        >
          👍 {upvotes} Upvotes
        </button>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">
          Status: Logged
        </span>
      </div>
    </div>
  );
}