import { useRealtimeComplaints } from '../../hooks/useRealtime';
import { ComplaintCard } from './ComplaintCard';
import { useLanguage } from '../../context/LanguageContext';

export function CommunityFeed() {
  const { complaints, loading } = useRealtimeComplaints();
  const { t } = useLanguage();

  // Sort by priority (highest first)
  const sorted = [...complaints].sort((a, b) => 
    (b.priority_score || 0) - (a.priority_score || 0)
  );

  if (loading) {
    return (
      <div className="w-full text-center py-12 text-slate-500 font-medium">
        <span className="inline-block animate-spin mr-2">🔄</span> {t('loading')}...
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-xl font-black text-jan-slate tracking-tight">{t('community_feed')}</h2>
        <span className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-white border border-emerald-200 px-3 py-1.5 rounded-full shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          {t('status')}
        </span>
      </div>
      
      <p className="text-xs text-gray-500 mb-4 px-2">{t('feed_description')}</p>

      <div className="space-y-4 w-full">
        {sorted.length === 0 ? (
          <p className="text-gray-500 text-center py-8 bg-white border border-zinc-150 rounded-2xl shadow-sm">{t('no_complaints')}</p>
        ) : (
          sorted.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))
        )}
      </div>
    </div>
  );
}