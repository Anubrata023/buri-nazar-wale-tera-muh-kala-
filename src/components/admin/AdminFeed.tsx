import { useState, useEffect } from 'react';
import { listenToAdminFeed, postAdminFeedUpdate } from '../../firebase';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Megaphone, MapPin, Tag, Calendar, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function AdminFeed() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [ward, setWard] = useState('');
  const [category, setCategory] = useState('Roads');
  const [type, setType] = useState<'update' | 'resolved' | 'alert' | 'fund'>('update');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const unsubscribe = listenToAdminFeed((data) => {
      setPosts(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setPosting(true);
    try {
      await postAdminFeedUpdate({
        message,
        ward: ward.trim() || undefined,
        category,
        type,
        adminName: 'MP Office Lucknow',
      });
      setMessage('');
      setWard('');
    } catch (err) {
      console.error('Failed to post update:', err);
    } finally {
      setPosting(false);
    }
  };

  const badgeStyles: Record<'update' | 'resolved' | 'alert' | 'fund', string> = {
    update: 'bg-blue-900/40 text-blue-300 border-blue-800',
    resolved: 'bg-emerald-900/40 text-emerald-300 border-emerald-800',
    alert: 'bg-red-900/40 text-red-300 border-red-800',
    fund: 'bg-purple-900/40 text-purple-300 border-purple-800',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Post Section */}
      <div className="lg:col-span-1 bg-[#141b2b] border border-white/5 rounded-3xl p-6 shadow-lg space-y-4">
        <h3 className="text-sm font-black uppercase text-zinc-300 tracking-wider flex items-center gap-2">
          <Megaphone className="w-4.5 h-4.5 text-jan-coral" /> {t('post_update')}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-2">{t('update_msg')}</label>
            <textarea
              required
              rows={4}
              placeholder="..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-jan-coral text-white placeholder-zinc-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-2">{t('category_label')}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-jan-coral text-white font-bold cursor-pointer"
              >
                {['Sanitation', 'Water', 'Roads', 'Electricity', 'Education', 'Health', 'Other'].map(cat => (
                  <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-2">{t('update_type')}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-jan-coral text-white font-bold cursor-pointer"
              >
                <option value="update" className="bg-slate-900">🔔 Status Update</option>
                <option value="resolved" className="bg-slate-900">✅ Issue Resolved</option>
                <option value="fund" className="bg-slate-900">💰 Budget/Fund</option>
                <option value="alert" className="bg-slate-900">⚠️ Public Alert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-2">{t('ward_optional')}</label>
            <input
              type="text"
              placeholder="e.g. Chinhat"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-jan-coral text-white placeholder-zinc-500 font-bold"
            />
          </div>

          <Button
            type="submit"
            disabled={posting}
            className="w-full bg-jan-coral hover:bg-red-500 text-white font-black py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-xs"
          >
            {posting ? 'Posting Update...' : t('publish_update')}
          </Button>
        </form>
      </div>

      {/* Feed List Section */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-black uppercase text-zinc-300 tracking-wider">{t('live_feed')}</h3>
          <span className="text-[10px] font-black text-zinc-500">{posts.length} posts published</span>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {posts.length === 0 ? (
            <div className="bg-[#141b2b] border border-white/5 rounded-3xl p-12 text-center text-zinc-500">
              <Megaphone className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="font-bold">{t('no_updates')}</p>
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="bg-[#141b2b] border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-jan-coral/10 border border-jan-coral/20 flex items-center justify-center font-bold text-xs text-jan-coral">
                        <User className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white flex items-center gap-1.5">
                          {post.adminName || 'MP Office'}
                          <span className="bg-jan-coral/10 text-jan-coral text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase">{t('official_tag')}</span>
                        </div>
                        <div className="text-[9px] font-semibold text-zinc-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${badgeStyles[post.type as 'update' | 'resolved' | 'alert' | 'fund'] || badgeStyles.update}`}>
                      {post.type}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 font-semibold leading-relaxed whitespace-pre-line text-left">
                    {post.message}
                  </p>

                  <div className="flex gap-4 pt-3 border-t border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-wider">
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
    </div>
  );
}
export default AdminFeed;
