import { useMemo } from 'react';
import { useRealtimeComplaints } from '../../hooks/useRealtime';
import { TrendingUp, Zap, MapPin, BarChart2, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

// Category emoji map
const categoryEmoji: Record<string, string> = {
  Sanitation: '🗑️', Water: '💧', Roads: '🛣️', Electricity: '⚡',
  Education: '📚', Health: '🏥', Other: '📋',
};

// AI Priority Formula weights
const FORMULA = {
  frequency: 40,
  severity: 35,
  affected: 25,
};

function PriorityBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-[10px] font-black mb-1">
        <span className="text-zinc-400 uppercase tracking-wider">{label}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function AIInsightsPanel() {
  const { complaints, loading } = useRealtimeComplaints();

  const insights = useMemo(() => {
    if (!complaints.length) return null;

    // Category clustering
    const catMap: Record<string, number> = {};
    complaints.forEach(c => {
      const cat = c.category || 'Other';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    const topCategories = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([cat, count]) => ({ cat, count, pct: Math.round((count / complaints.length) * 100) }));

    // Ward clustering
    const wardMap: Record<string, number> = {};
    complaints.forEach(c => {
      if (c.ward) wardMap[c.ward] = (wardMap[c.ward] || 0) + 1;
    });
    const topWards = Object.entries(wardMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([ward, count]) => ({ ward, count }));

    // Avg priority score
    const avgScore = complaints.length > 0
      ? Math.round(complaints.reduce((s, c) => s + (c.priority_score || 60), 0) / complaints.length)
      : 72;

    // High priority complaints (score > 75)
    const highPriority = complaints.filter(c => (c.priority_score || 60) >= 75);

    // Trend: last 7 days bucketed
    const now = Date.now();
    const dayMs = 86400000;
    const days = Array.from({ length: 7 }, (_, i) => {
      const dayStart = now - (6 - i) * dayMs;
      const dayEnd = dayStart + dayMs;
      const count = complaints.filter(c => c.timestamp >= dayStart && c.timestamp < dayEnd).length;
      return { label: new Date(dayStart).toLocaleDateString('en-IN', { weekday: 'short' }), count };
    });

    // Top actionable recommendation
    const topCat = topCategories[0];
    const topWard = topWards[0];
    const recommendation = topCat && topWard
      ? `${topCat.count} ${topCat.cat} complaints detected — highest density in ${topWard.ward} ward (${topWard.count} reports). Recommend immediate LADS allocation review.`
      : 'Monitoring active — no critical clusters detected yet.';

    return { topCategories, topWards, avgScore, highPriority, days, recommendation };
  }, [complaints]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-500">
        <span className="animate-spin mr-2">🔄</span> Analysing complaint data...
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="text-center py-16 text-zinc-500">
        <span className="text-4xl block mb-4">📭</span>
        <p className="font-bold">No data yet — submit some complaints first!</p>
      </div>
    );
  }

  const maxCat = insights.topCategories[0]?.count || 1;
  const maxWard = insights.topWards[0]?.count || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-jan-coral/10 border border-jan-coral/20 rounded-xl flex items-center justify-center">
          <Zap className="w-5 h-5 text-jan-coral" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white">Gemini AI Insights</h2>
          <p className="text-[11px] text-zinc-500 font-semibold">{complaints.length} complaints analysed in real-time</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-[10px] font-black text-emerald-400 bg-emerald-950/30 border border-emerald-800/30 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          LIVE
        </div>
      </div>

      {/* Top Recommendation */}
      <div className="bg-jan-coral/10 border border-jan-coral/25 rounded-3xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-jan-coral flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[10px] font-black text-jan-coral uppercase tracking-widest mb-1">🧠 AI Top Recommendation</div>
            <p className="text-sm text-zinc-200 font-semibold leading-relaxed">{insights.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#141b2b] border border-white/5 rounded-2xl p-4 text-center">
          <div className="text-3xl font-black text-white">{insights.avgScore}</div>
          <div className="text-[9px] font-black text-zinc-500 uppercase tracking-wider mt-1">Avg Priority</div>
        </div>
        <div className="bg-[#141b2b] border border-white/5 rounded-2xl p-4 text-center">
          <div className="text-3xl font-black text-jan-coral">{insights.highPriority.length}</div>
          <div className="text-[9px] font-black text-zinc-500 uppercase tracking-wider mt-1">High Priority</div>
        </div>
        <div className="bg-[#141b2b] border border-white/5 rounded-2xl p-4 text-center">
          <div className="text-3xl font-black text-emerald-400">{insights.topCategories.length}</div>
          <div className="text-[9px] font-black text-zinc-500 uppercase tracking-wider mt-1">Issue Types</div>
        </div>
      </div>

      {/* Priority Formula */}
      <div className="bg-[#141b2b] border border-white/5 rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-4 h-4 text-zinc-400" />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">AI Priority Formula</span>
        </div>
        <div className="bg-black/30 rounded-xl p-3 mb-4 text-center">
          <code className="text-xs text-jan-coral font-bold">
            Score = (Frequency × {FORMULA.frequency}) + (Severity × {FORMULA.severity}) + (Population × {FORMULA.affected})
          </code>
        </div>
        <div className="space-y-3">
          <PriorityBar label="Frequency Weight" value={FORMULA.frequency} max={100} color="bg-blue-500" />
          <PriorityBar label="Severity Weight" value={FORMULA.severity} max={100} color="bg-jan-coral" />
          <PriorityBar label="Population Weight" value={FORMULA.affected} max={100} color="bg-purple-500" />
        </div>
        <p className="text-[10px] text-zinc-600 mt-3 leading-relaxed">
          Score calculated per issue cluster by Gemini AI. Scores ≥75 are flagged for immediate MP attention.
        </p>
      </div>

      {/* Category Clusters */}
      <div className="bg-[#141b2b] border border-white/5 rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-zinc-400" />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Issue Theme Clusters</span>
        </div>
        <div className="space-y-3">
          {insights.topCategories.map(({ cat, count, pct }) => (
            <div key={cat}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  {categoryEmoji[cat] || '📋'} {cat}
                </span>
                <span className="text-[10px] font-black text-zinc-500">{count} · {pct}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-jan-coral rounded-full transition-all duration-1000"
                  style={{ width: `${(count / maxCat) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ward Hotspots */}
      <div className="bg-[#141b2b] border border-white/5 rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-zinc-400" />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ward Hotspot Rankings</span>
        </div>
        {insights.topWards.length > 0 ? (
          <div className="space-y-2">
            {insights.topWards.map(({ ward, count }, i) => (
              <div key={ward} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                  i === 0 ? 'bg-jan-coral text-white' :
                  i === 1 ? 'bg-orange-500 text-white' :
                  i === 2 ? 'bg-amber-500 text-slate-900' :
                  'bg-white/10 text-zinc-400'
                }`}>{i + 1}</div>
                <div className="flex-1">
                  <div className="flex justify-between mb-0.5">
                    <span className="text-xs font-bold text-zinc-300">{ward}</span>
                    <span className="text-[10px] font-black text-zinc-500">{count} complaints</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${i === 0 ? 'bg-jan-coral' : 'bg-zinc-600'}`}
                      style={{ width: `${(count / maxWard) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-600 text-center py-4">No ward data yet — citizens need to include ward in complaints.</p>
        )}
      </div>

      {/* 7-Day Trend */}
      <div className="bg-[#141b2b] border border-white/5 rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-4 h-4 text-zinc-400" />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">7-Day Complaint Trend</span>
        </div>
        <div className="flex items-end gap-1.5 h-24">
          {insights.days.map((d, i) => {
            const maxD = Math.max(...insights.days.map(x => x.count), 1);
            const h = d.count > 0 ? Math.max((d.count / maxD) * 100, 8) : 4;
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full relative group">
                  <div
                    className="w-full bg-jan-coral/70 hover:bg-jan-coral rounded-t transition-all cursor-pointer"
                    style={{ height: `${h}%`, minHeight: '4px' }}
                    title={`${d.count} complaints`}
                  />
                </div>
                <span className="text-[8px] font-bold text-zinc-600">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* High Priority List */}
      {insights.highPriority.length > 0 && (
        <div className="bg-[#141b2b] border border-white/5 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">High Priority Queue (Score ≥ 75)</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {insights.highPriority.slice(0, 8).map((c, i) => (
              <div key={i} className="flex items-center gap-3 bg-black/20 rounded-xl px-3 py-2 border border-white/3">
                <span className="text-xs font-black text-jan-coral w-8 flex-shrink-0">{Math.round(c.priority_score)}</span>
                <span className="text-[10px] font-semibold text-zinc-300 flex-1 truncate">{c.raw_text?.slice(0, 50) || c.category}</span>
                <span className="text-[9px] font-black text-zinc-600 flex-shrink-0">{c.ward || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MP Action Recommendations */}
      <div className="bg-gradient-to-br from-jan-coral/10 to-purple-900/10 border border-jan-coral/15 rounded-3xl p-5">
        <div className="text-[10px] font-black text-jan-coral uppercase tracking-widest mb-4">🎯 MP Action Items This Week</div>
        <div className="space-y-3">
          {[
            { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, text: `Review top ${insights.topCategories[0]?.cat || 'sanitation'} cluster — ${insights.topCategories[0]?.count || 0} reports pending action` },
            { icon: <MapPin className="w-4 h-4 text-jan-coral" />, text: `Ward ${insights.topWards[0]?.ward || 'N/A'} needs urgent site visit — highest complaint density` },
            { icon: <Zap className="w-4 h-4 text-purple-400" />, text: `${insights.highPriority.length} complaints qualify for emergency LADS fund pre-allocation` },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
              <p className="text-xs text-zinc-300 font-semibold leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIInsightsPanel;
