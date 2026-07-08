import { useState, useEffect } from 'react';
import { listenToAdminFeed } from '../../firebase';
import { Card, CardContent } from '../ui/card';
import { Megaphone, MapPin, Tag, Calendar, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function AdminUpdatesFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = listenToAdminFeed((data) => {
      setPosts(data);
    });
    return () => unsubscribe();
  }, []);

  const badgeStyles: Record<'update' | 'resolved' | 'alert' | 'fund', string> = {
    update: 'bg-blue-50 text-blue-700 border-blue-200',
    resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    alert: 'bg-red-50 text-red-700 border-red-200',
    fund: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className="w-full mt-6">
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="text-left">
          <h2 className="text-xl font-black text-jan-slate tracking-tight">{t('admin_updates')}</h2>
          <p className="text-xs text-gray-500 mt-1">Official announcements and progress updates from the MP Office</p>
        </div>
        <span className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-white border border-emerald-200 px-3 py-1.5 rounded-full shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          LIVE FEED
        </span>
      </div>

      <div className="space-y-4 w-full text-left">
        {posts.length === 0 ? (
          <div className="bg-white border border-zinc-150 rounded-2xl p-12 text-center text-zinc-500 shadow-sm">
            <Megaphone className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <p className="font-bold text-slate-800">{t('no_updates')}</p>
          </div>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-all duration-200 border border-zinc-200 bg-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-zinc-200 flex items-center justify-center font-bold text-xs text-slate-700">
                      <ShieldCheck className="w-4.5 h-4.5 text-jan-coral" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        {post.adminName || 'MP Office'}
                        <span className="bg-jan-coral/10 text-jan-coral text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase">{t('official_tag')}</span>
                      </div>
                      <div className="text-[9px] font-semibold text-zinc-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${badgeStyles[post.type as 'update' | 'resolved' | 'alert' | 'fund'] || badgeStyles.update}`}>
                    {post.type}
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-semibold leading-relaxed whitespace-pre-line">
                  {post.message}
                </p>

                <div className="flex gap-4 pt-3 border-t border-zinc-100 text-[9px] font-black text-zinc-400 uppercase tracking-wider">
                  {post.category && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-jan-coral" />
                      {post.category}
                    </span>
                  )}
                  {post.ward && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-jan-coral" />
                      {post.ward} Ward
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
export default AdminUpdatesFeed;
