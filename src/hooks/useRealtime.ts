// src/hooks/useRealtime.ts
import { useState, useEffect } from 'react';
import { listenToComplaints } from '../firebase';

export function useRealtimeComplaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This runs the moment the component loads
    const unsubscribe = listenToComplaints((data) => {
      setComplaints(data);
      setLoading(false);
    });
    
    // This stops listening if the user leaves the page, saving memory
    return () => unsubscribe();
  }, []);

  return { complaints, loading };
}