import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { upvoteComplaint } from '../../firebase';
import { MessageSquare } from 'lucide-react';

interface ComplaintCardProps {
  complaint: any;
  onClick?: () => void;
}

const categoryImages: Record<string, string> = {
  Water: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300',
  Sanitation: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=300',
  Roads: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=300',
  Electricity: 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?w=300',
  Education: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=300',
  Health: 'https://images.unsplash.com/photo-1584515901367-f13459c3a3b0?w=300',
  Other: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300'
};

export function ComplaintCard({ complaint, onClick }: ComplaintCardProps) {
  const [upvotes, setUpvotes] = useState(complaint.upvotes || 0);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await upvoteComplaint(complaint.id);
    setUpvotes((prev: number) => prev + 1);
  };

  const score = complaint.priority_score || 50;
  const severityTag = score >= 70 ? 'CRITICAL' : score >= 40 ? 'MEDIUM' : 'LOW';
  const severityColor = score >= 70 ? 'bg-red-100 text-red-700' : score >= 40 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700';

  const statusMap: Record<string, { label: string, color: string }> = {
    new: { label: 'PENDING', color: 'bg-zinc-100 text-zinc-600' },
    under_review: { label: 'IN REVIEW', color: 'bg-blue-100 text-blue-700' },
    funds_allocated: { label: 'ASSIGNED', color: 'bg-purple-100 text-purple-700' },
    resolved: { label: 'RESOLVED', color: 'bg-emerald-100 text-emerald-700' }
  };

  const statusInfo = statusMap[complaint.status || 'new'] || { label: 'PENDING', color: 'bg-zinc-100 text-zinc-600' };
  const imageUrl = categoryImages[complaint.category || 'Other'];

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer border border-zinc-200"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Left Thumbnail Image */}
          <div className="w-full sm:w-48 h-36 sm:h-auto relative overflow-hidden bg-zinc-100 flex-shrink-0">
            <img 
              src={imageUrl} 
              alt={complaint.category || 'Complaint'} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Right Info Section */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              {/* Badges Row */}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[9px] font-black uppercase text-white bg-slate-900 px-2 py-0.5 rounded">
                  Priority: {score}/100
                </span>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${severityColor}`}>
                  {severityTag}
                </span>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
                <span className="text-[10px] font-bold text-zinc-400 ml-auto">
                  📍 {complaint.ward || 'General'}
                </span>
              </div>

              {/* Title & Description */}
              <h4 className="text-sm font-black text-slate-800 leading-tight mb-1">
                {complaint.category || 'Other'} Issue
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed font-medium line-clamp-2">
                {complaint.summary_en || complaint.raw_text}
              </p>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex justify-between items-center pt-3 border-t border-zinc-100 mt-3 text-xs">
              <div className="flex items-center gap-4 font-bold text-zinc-500">
                <button 
                  onClick={handleUpvote}
                  className="flex items-center gap-1 hover:text-jan-coral active:scale-95 transition-all cursor-pointer"
                >
                  <span>👍</span>
                  <span>{upvotes} Upvotes</span>
                </button>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{complaint.cluster_size || 1}</span>
                </div>
              </div>
              <span className="text-zinc-400 font-bold text-[10px]">
                {complaint.is_duplicate ? 'Merged' : 'Logged'} • 2h ago
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default ComplaintCard;