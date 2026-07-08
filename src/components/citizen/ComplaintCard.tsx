import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { upvoteComplaint } from '../../firebase';
import { MessageSquare, Ban, Send, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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
  const { t } = useLanguage();
  const [upvotes, setUpvotes] = useState(complaint.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<string[]>([
    'Ward representation has been informed.',
    'Urgent repairs are requested for local shops access.'
  ]);
  const [newComment, setNewComment] = useState('');
  const [isAborted, setIsAborted] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasUpvoted) return;
    try {
      await upvoteComplaint(complaint.id);
    } catch (err) {
      console.warn('Firebase upvote simulation fallback');
    }
    setUpvotes((prev: number) => prev + 1);
    setHasUpvoted(true);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      setComments(prev => [...prev, newComment]);
      setNewComment('');
    }
  };

  const handleAbort = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAborted(true);
  };

  if (isAborted) {
    return (
      <div className="bg-red-50/50 border border-dashed border-red-200 p-5 rounded-2xl text-center text-xs font-bold text-red-500 animate-fade-in shadow-sm">
        ⚠️ {t('aborted_notice')} (#JS-{complaint.id})
      </div>
    );
  }

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
      className="overflow-hidden hover:shadow-md transition-all duration-200 border border-zinc-200 bg-white"
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row h-full" onClick={onClick}>
          {/* Left Thumbnail Image */}
          <div className="w-full sm:w-48 h-36 sm:h-auto relative overflow-hidden bg-zinc-100 flex-shrink-0">
            <img 
              src={imageUrl} 
              alt={complaint.category || 'Complaint'} 
              className="w-full h-full object-cover transition-transform duration-300"
            />
          </div>

          {/* Right Info Section */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              {/* Badges Row */}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[9px] font-black uppercase text-white bg-slate-900 px-2 py-0.5 rounded">
                  {t('priority')}: {score}/100
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
                {complaint.category || 'Other'} Incident
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed font-medium line-clamp-2">
                {complaint.summary_en || complaint.raw_text}
              </p>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex justify-between items-center pt-3 border-t border-zinc-100 mt-3 text-xs">
              <div className="flex items-center gap-4 font-bold text-zinc-500">
                {/* UPVOTE */}
                <button 
                  onClick={handleUpvote}
                  className={`flex items-center gap-1 transition-all cursor-pointer ${
                    hasUpvoted ? 'text-jan-coral' : 'hover:text-jan-coral'
                  }`}
                >
                  <span>👍</span>
                  <span>{upvotes} {t('upvotes')}</span>
                </button>

                {/* TOGGLE COMMENTS */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowComments(!showComments);
                  }}
                  className="flex items-center gap-1 hover:text-jan-coral transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{comments.length} {t('comments')}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* ABORT BUTTON */}
                <button
                  onClick={handleAbort}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 font-bold transition-all cursor-pointer border border-red-200 hover:bg-red-50 px-2 py-1 rounded"
                >
                  <Ban className="w-3 h-3" />
                  <span>{t('abort')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* COMMENTS EXPANDABLE BOX */}
        {showComments && (
          <div className="border-t border-zinc-100 bg-zinc-50/50 p-4 space-y-4 animate-fade-in text-xs">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {comments.map((comment, index) => (
                <div key={index} className="flex gap-2.5 items-start p-2.5 bg-white border border-zinc-150 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 flex-shrink-0">
                    <User className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 font-black">{t('anonymous')}</p>
                    <p className="font-semibold text-slate-700 leading-normal mt-0.5">{comment}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                required
                placeholder={t('add_comment')}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-jan-coral"
              />
              <button
                type="submit"
                className="bg-jan-coral hover:bg-red-500 text-white p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default ComplaintCard;