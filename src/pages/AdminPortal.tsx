// src/pages/AdminPortal.tsx
import React from 'react';
// This line imports the board we built earlier!
import { KanbanBoard } from '../components/admin/KanbanBoard';

export function AdminPortal() {
  return (
    <div className="w-full min-h-screen bg-jan-navy text-white p-6 font-sans">
      
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-black text-jan-coral tracking-tight">JanSaath</h1>
          <nav className="hidden md:flex gap-4">
            <span className="text-sm font-bold text-white border-b-2 border-jan-coral pb-1 cursor-pointer">Command Center</span>
            <span className="text-sm font-medium text-zinc-400 hover:text-white cursor-pointer">Geospatial View</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-500"></div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-jan-slate p-5 rounded-2xl border border-white/5 shadow-lg">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Total Issues</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-black text-white">2,842</h2>
            <span className="text-xs font-bold text-jan-coral mb-1">~12%</span>
          </div>
        </div>

        <div className="bg-jan-slate p-5 rounded-2xl border border-white/5 shadow-lg">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Resolved</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-black text-white">1,905</h2>
            <span className="text-xs font-bold text-emerald-400 mb-1">✔ 67%</span>
          </div>
        </div>

        <div className="bg-jan-slate p-5 rounded-2xl border border-white/5 shadow-lg">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Avg Resolution</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-black text-white">4.2d</h2>
            <span className="text-xs font-bold text-zinc-400 mb-1">⏱ -1.5h</span>
          </div>
        </div>

        <div className="bg-jan-slate p-5 rounded-2xl border border-white/5 shadow-lg">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Satisfaction</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-black text-white">88%</h2>
            <span className="text-xs font-bold text-jan-coral mb-1">☺ +4%</span>
          </div>
        </div>
      </div>

      {/* Here is where we mount the actual board instead of the placeholder text! */}
      <KanbanBoard onComplaintClick={(complaint) => alert(`You clicked issue #${complaint.id}`)} />

    </div>
  );
}