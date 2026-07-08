// src/components/admin/KanbanBoard.tsx
import React, { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';

const COLUMNS = [
  { id: 'new', title: '🆕 New', color: 'bg-blue-200' },
  { id: 'under_review', title: '🔍 Under Review', color: 'bg-yellow-200' },
  { id: 'funds_allocated', title: '💰 Funds Allocated', color: 'bg-purple-200' },
  { id: 'resolved', title: '✅ Resolved', color: 'bg-emerald-200' },
];

export function KanbanBoard({ onComplaintClick }: { onComplaintClick: (c: any) => void }) {
  const [items, setItems] = useState([
    { id: '101', status: 'new', priority_score: 88, raw_text: 'Deep pothole causing accidents near the main market crossing.', ward: 'Ward 14' },
    { id: '102', status: 'under_review', priority_score: 55, raw_text: 'Streetlights have been out for three consecutive nights.', ward: 'Ward 08' },
    { id: '103', status: 'new', priority_score: 92, raw_text: 'Water pipe burst flooding the residential lane.', ward: 'Ward 12' },
    { id: '104', status: 'funds_allocated', priority_score: 45, raw_text: 'Public park benches need repainting.', ward: 'Ward 02' },
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const complaintId = active.id as string;
    let newStatus = over.id as string;
    
    const overItem = items.find(i => i.id === over.id);
    if (overItem) {
      newStatus = overItem.status;
    }

    if (['new', 'under_review', 'funds_allocated', 'resolved'].includes(newStatus)) {
      setItems(prev => prev.map(c => c.id === complaintId ? { ...c, status: newStatus } : c));
    }
  };

  const getComplaintsByStatus = (status: string) => items.filter(c => c.status === status);

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
        {COLUMNS.map(col => (
          <KanbanColumn 
            key={col.id} 
            id={col.id} 
            title={col.title} 
            color={col.color} 
            complaints={getComplaintsByStatus(col.id)} 
            onComplaintClick={onComplaintClick} 
          />
        ))}
      </div>
    </DndContext>
  );
}