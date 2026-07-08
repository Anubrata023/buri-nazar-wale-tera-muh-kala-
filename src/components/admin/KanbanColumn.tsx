// src/components/admin/KanbanColumn.tsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableComplaintCard({ complaint, onClick }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: complaint.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  
  const priorityColor = complaint.priority_score > 70 ? 'bg-jan-coral' : complaint.priority_score > 40 ? 'bg-orange-500' : 'bg-emerald-500';

  return (
    <div 
      ref={setNodeRef} style={style} {...attributes} {...listeners} 
      onClick={() => onClick(complaint)} 
      className="bg-jan-navy p-4 rounded-xl border border-white/10 shadow-lg cursor-grab active:cursor-grabbing mb-3 hover:border-jan-coral transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded">#{complaint.id}</span>
        <div className={`w-2 h-2 rounded-full ${priorityColor}`}></div>
      </div>
      <p className="text-sm text-zinc-300 font-medium line-clamp-2 leading-relaxed">{complaint.raw_text}</p>
      <div className="mt-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{complaint.ward}</div>
    </div>
  );
}

export function KanbanColumn({ id, title, color, complaints, onComplaintClick }: any) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className={`px-4 py-3 rounded-t-2xl font-bold text-sm ${color} text-jan-navy shadow-sm z-10`}>
        {title} <span className="opacity-60 ml-1">({complaints.length})</span>
      </div>
      
      <div ref={setNodeRef} className="bg-jan-slate/50 flex-1 p-3 rounded-b-2xl border-x border-b border-white/5 overflow-y-auto">
        <SortableContext items={complaints.map((c: any) => c.id)} strategy={verticalListSortingStrategy}>
          {complaints.map((c: any) => (
            <SortableComplaintCard key={c.id} complaint={c} onClick={onComplaintClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}