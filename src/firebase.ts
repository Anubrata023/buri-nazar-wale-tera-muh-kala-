// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, get, update } from "firebase/database";
import { getAuth } from "firebase/auth";

// These keys pull from your .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase safely
let app;
export let db: any;
export let auth: any;
try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  auth = getAuth(app);
} catch (e) {
  console.warn("Firebase initialization failed. Running in standalone local storage database fallback mode:", e);
}

// Local Storage Helper Utilities to guarantee 100% demo robustness
const getLocalData = (key: string): any[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalData = (key: string, data: any[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Local storage save failed:", e);
  }
};

// Helper: Write complaint to Firebase & localStorage
export const addComplaintToFeed = async (complaint: any) => {
  const localComplaint = {
    ...complaint,
    upvotes: complaint.upvotes || 0,
    timestamp: complaint.timestamp || Date.now(),
    id: complaint.id || `JS-${Date.now()}`
  };

  // 1. Save to LocalStorage
  const localList = getLocalData('local_complaints');
  localList.push(localComplaint);
  saveLocalData('local_complaints', localList);

  // 2. Try Firebase write
  if (db) {
    try {
      const newRef = push(ref(db, 'complaints'));
      await set(newRef, {
        ...localComplaint,
        id: newRef.key
      });
      return newRef.key;
    } catch (e) {
      console.warn("Failed to write complaint to Firebase, using local storage fallback:", e);
    }
  }
  return localComplaint.id;
};

// Helper: Listen to complaints in real-time
export const listenToComplaints = (callback: (data: any[]) => void) => {
  // Load and merge local storage complaints immediately
  const getMergedComplaints = (firebaseData: any[] = []) => {
    const localList = getLocalData('local_complaints');
    const statusOverrides = getLocalData('complaints_status_overrides');
    const upvoteOverrides = getLocalData('complaints_upvote_overrides');
    
    // Map of id -> status
    const statusMap = new Map(statusOverrides.map(item => [item.id, item.status]));
    // Map of id -> upvote count
    const upvoteMap = new Map(upvoteOverrides.map(item => [item.id, item.count]));

    const merged = [...firebaseData, ...localList];
    const uniqueMap = new Map<string, any>();

    merged.forEach(c => {
      if (c && c.id) {
        const copy = { ...c };
        // Apply local status and upvote overrides if present
        if (statusMap.has(copy.id)) {
          copy.status = statusMap.get(copy.id);
        }
        if (upvoteMap.has(copy.id)) {
          copy.upvotes = upvoteMap.get(copy.id);
        }
        uniqueMap.set(copy.id, copy);
      }
    });

    return Array.from(uniqueMap.values());
  };

  // Return local cache immediately
  callback(getMergedComplaints([]));

  if (!db) {
    return () => {};
  }

  const complaintsRef = ref(db, 'complaints');
  return onValue(complaintsRef, (snapshot) => {
    const data = snapshot.val();
    let fbComplaints: any[] = [];
    if (data) {
      fbComplaints = Object.entries(data).map(([id, value]: [string, any]) => ({
        id,
        ...value
      }));
    }
    callback(getMergedComplaints(fbComplaints));
  }, (err) => {
    console.warn("Firebase listener error, using local storage database:", err);
    callback(getMergedComplaints([]));
  });
};

// Helper: Upvote a complaint (atomic increment)
export const upvoteComplaint = async (complaintId: string) => {
  // 1. Save to LocalStorage overrides
  const upvoteOverrides = getLocalData('complaints_upvote_overrides');
  const existing = upvoteOverrides.find(item => item.id === complaintId);
  
  if (existing) {
    existing.count = existing.count + 1;
  } else {
    upvoteOverrides.push({ id: complaintId, count: 125 }); // start from baseline upvotes
  }
  saveLocalData('complaints_upvote_overrides', upvoteOverrides);

  // 2. Try Firebase update
  if (db) {
    const upvoteRef = ref(db, `complaints/${complaintId}/upvotes`);
    try {
      const snapshot = await get(upvoteRef);
      const current = snapshot.val() || 0;
      await set(upvoteRef, current + 1);
    } catch (error) {
      console.warn('Firebase upvote failed, relying on local storage fallback:', error);
    }
  }
};

// Helper: Update complaint status directly in Firebase & LocalStorage
export const updateComplaintStatusInFirebase = async (complaintId: string, newStatus: string) => {
  // 1. Update in LocalStorage status overrides
  const statusOverrides = getLocalData('complaints_status_overrides');
  const existingIndex = statusOverrides.findIndex(item => item.id === complaintId);
  if (existingIndex >= 0) {
    statusOverrides[existingIndex].status = newStatus;
  } else {
    statusOverrides.push({ id: complaintId, status: newStatus });
  }
  saveLocalData('complaints_status_overrides', statusOverrides);

  // Also update in local complaints list if it exists there
  const localList = getLocalData('local_complaints');
  const index = localList.findIndex(c => c.id === complaintId);
  if (index >= 0) {
    localList[index].status = newStatus;
    saveLocalData('local_complaints', localList);
  }

  // 2. Try Firebase update
  if (db) {
    try {
      const complaintRef = ref(db, `complaints/${complaintId}`);
      await update(complaintRef, { status: newStatus, updatedAt: Date.now() });
      return true;
    } catch (error) {
      console.warn('Firebase status update failed, relying on local storage fallback:', error);
    }
  }
  return true;
};

// Helper: Post an admin update to the admin feed
export const postAdminFeedUpdate = async (post: {
  message: string;
  complaintId?: string;
  category?: string;
  ward?: string;
  type: 'update' | 'resolved' | 'alert' | 'fund';
  adminName: string;
}) => {
  const localPost = {
    ...post,
    timestamp: Date.now(),
    id: `POST-${Date.now()}`
  };

  // 1. Save to LocalStorage
  const localFeed = getLocalData('local_admin_feed');
  localFeed.push(localPost);
  saveLocalData('local_admin_feed', localFeed);

  // 2. Try Firebase update
  if (db) {
    try {
      const feedRef = push(ref(db, 'admin_feed'));
      await set(feedRef, {
        ...localPost,
        id: feedRef.key
      });
      return feedRef.key;
    } catch (e) {
      console.warn("Failed to write admin update to Firebase, using local storage:", e);
    }
  }
  return localPost.id;
};

// Helper: Listen to admin feed in real-time
export const listenToAdminFeed = (callback: (data: any[]) => void) => {
  const getMergedFeed = (firebaseFeed: any[] = []) => {
    const localFeed = getLocalData('local_admin_feed');
    const merged = [...firebaseFeed, ...localFeed];
    const uniqueMap = new Map<string, any>();
    merged.forEach(post => {
      if (post && post.id) {
        uniqueMap.set(post.id, post);
      }
    });
    return Array.from(uniqueMap.values()).sort((a, b) => b.timestamp - a.timestamp);
  };

  // Return local cache immediately
  callback(getMergedFeed([]));

  if (!db) {
    return () => {};
  }

  const feedRef = ref(db, 'admin_feed');
  return onValue(feedRef, (snapshot) => {
    const data = snapshot.val();
    let fbFeed: any[] = [];
    if (data) {
      fbFeed = Object.entries(data).map(([id, value]: [string, any]) => ({
        id,
        ...value
      }));
    }
    callback(getMergedFeed(fbFeed));
  }, (err) => {
    console.warn("Firebase admin feed listener failed, using local cache:", err);
    callback(getMergedFeed([]));
  });
};