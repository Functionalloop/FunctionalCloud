import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface UseFirestoreCollectionResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  /** Re-fetch manually (e.g. after a write) */
  refresh: () => void;
}

/**
 * Fetches all documents from a Firestore collection.
 * Each document is returned as `{ id, ...data }`.
 * Automatically maps the Firestore document snapshot to a typed array.
 */
export function useFirestoreCollection<T extends { id?: string }>(
  collectionName: string
): UseFirestoreCollectionResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDocs(collection(db, collectionName))
      .then(snap => {
        if (!cancelled)
          setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as T)));
      })
      .catch(e => { if (!cancelled) setError(e as Error); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [collectionName, tick]);

  const refresh = () => setTick(t => t + 1);

  return { data, loading, error, refresh };
}
